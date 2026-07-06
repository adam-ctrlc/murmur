import { useCallback, useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import type { ReadingPosition } from '../types';
import { SAMPLE_PAGE_TEXTS } from '../sample';
import type { Story } from '../stories';

// Bundle the matching worker so its version can never drift from the API.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const WORD_SPLIT = /\s+/;
const RESTART_DELAY_MS = 250;
// Target words per reader page. Content is re-paginated to this size so a
// "page" is a comfortable chunk of text rather than one (often tiny) PDF page.
const WORDS_PER_PAGE = 1000;
// Chrome/Edge silently stop speech after ~15s; nudging pause/resume keeps a
// long (up to 1000-word) utterance from cutting off mid-page.
const KEEP_ALIVE_MS = 12000;

function toWords(text: string): string[] {
  return text.split(WORD_SPLIT).filter((word) => word.length > 0);
}

// Flatten paragraph/page strings into words, then re-chunk into pages of
// roughly WORDS_PER_PAGE words each.
function paginate(paragraphs: readonly string[]): string[][] {
  const words = paragraphs.flatMap(toWords);
  const pages: string[][] = [];
  for (let index = 0; index < words.length; index += WORDS_PER_PAGE) {
    pages.push(words.slice(index, index + WORDS_PER_PAGE));
  }
  return pages;
}

// The onboarding document shown before the reader opens a real file.
const SAMPLE_PAGES: string[][] = paginate(SAMPLE_PAGE_TEXTS);

function dedupeVoices(list: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const seen = new Set<string>();
  const unique: SpeechSynthesisVoice[] = [];
  for (const voice of list) {
    if (!seen.has(voice.voiceURI)) {
      seen.add(voice.voiceURI);
      unique.push(voice);
    }
  }
  return unique;
}

function silence(synth: SpeechSynthesis): void {
  if (synth.speaking) {
    try {
      synth.pause();
    } catch {
      // Some engines throw when pausing an already-ending utterance; ignore.
    }
    synth.cancel();
  }
}

/**
 * Owns everything about a reading session: the extracted PDF text, which page
 * is on screen, and the speech-synthesis playback that tracks position word by
 * word. Components consume this and stay purely presentational.
 */
export function useReader() {
  const [pagesWords, setPagesWords] = useState<string[][]>(SAMPLE_PAGES);
  const [totalPages, setTotalPages] = useState(SAMPLE_PAGES.length);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSample, setIsSample] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [readingPage, setReadingPage] = useState(0);
  const [readingWordIndex, setReadingWordIndex] = useState(-1);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const positionRef = useRef<ReadingPosition>({ page: 0, wordIndex: -1 });
  const keepAliveRef = useRef<number | null>(null);

  // Latest-value ref so utterance callbacks never read stale settings/text.
  const dataRef = useRef({
    pagesWords,
    totalPages,
    voices,
    selectedVoiceURI,
    rate,
    pitch,
  });
  dataRef.current = {
    pagesWords,
    totalPages,
    voices,
    selectedVoiceURI,
    rate,
    pitch,
  };

  // Stable indirection so an utterance's onend can restart the next page
  // without capturing a stale copy of the function.
  const speakRef = useRef<(page: number, wordIndex: number) => void>(() => {});

  const clearKeepAlive = useCallback(() => {
    if (keepAliveRef.current !== null) {
      window.clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    silence(synthRef.current);
    clearKeepAlive();
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, [clearKeepAlive]);

  const speakFromPosition = useCallback((page: number, wordIndex: number) => {
    const synth = synthRef.current;
    const data = dataRef.current;

    silence(synth);
    clearKeepAlive();
    utteranceRef.current = null;

    const words = data.pagesWords[page];
    if (!words || wordIndex < 0 || wordIndex >= words.length) {
      setIsSpeaking(false);
      return;
    }

    positionRef.current = { page, wordIndex };
    setCurrentPageIndex(page);
    setReadingPage(page);
    setReadingWordIndex(wordIndex);

    const text = words.slice(wordIndex).join(' ');
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = data.voices.find((v) => v.voiceURI === data.selectedVoiceURI);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = data.rate;
    utterance.pitch = data.pitch;

    utterance.onstart = () => setIsSpeaking(true);

    utterance.onboundary = (event) => {
      if (event.name !== 'word') {
        return;
      }
      const spokenCount = toWords(text.substring(0, event.charIndex)).length;
      const absolute = wordIndex + spokenCount;
      const pageWords = dataRef.current.pagesWords[positionRef.current.page];
      if (pageWords && absolute < pageWords.length) {
        positionRef.current.wordIndex = absolute;
        setReadingWordIndex(absolute);
      }
    };

    utterance.onend = () => {
      // Ignore the end event fired by a cancel/replace.
      if (utteranceRef.current !== utterance) {
        return;
      }
      const nextPage = positionRef.current.page + 1;
      if (nextPage < dataRef.current.totalPages) {
        speakRef.current(nextPage, 0);
        return;
      }
      setIsSpeaking(false);
      positionRef.current = { page: 0, wordIndex: -1 };
      setReadingWordIndex(-1);
      utteranceRef.current = null;
      clearKeepAlive();
    };

    utterance.onerror = (event) => {
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        setError(`Speech synthesis failed: ${event.error}`);
      }
      clearKeepAlive();
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
    // Keep long utterances from being silently cut off by the browser.
    keepAliveRef.current = window.setInterval(() => {
      const active = synthRef.current;
      if (active.speaking && !active.paused) {
        active.pause();
        active.resume();
      }
    }, KEEP_ALIVE_MS);
  }, [clearKeepAlive]);
  speakRef.current = speakFromPosition;

  const speakPage = useCallback(
    (page: number) => {
      const words = dataRef.current.pagesWords[page];
      if (words && words.length > 0) {
        speakFromPosition(page, 0);
      }
    },
    [speakFromPosition]
  );

  const setPage = useCallback((page: number) => {
    setCurrentPageIndex(page);
  }, []);

  const restoreSample = useCallback(() => {
    setPagesWords(SAMPLE_PAGES);
    setTotalPages(SAMPLE_PAGES.length);
    setIsSample(true);
    setFileName(null);
    setCurrentPageIndex(0);
    setReadingPage(0);
    setReadingWordIndex(-1);
    positionRef.current = { page: 0, wordIndex: -1 };
  }, []);

  const reset = useCallback(() => {
    stop();
    setError(null);
    restoreSample();
  }, [stop, restoreSample]);

  const loadStory = useCallback(
    (story: Story) => {
      const pages = paginate(story.paragraphs);
      stop();
      setError(null);
      setPagesWords(pages);
      setTotalPages(pages.length);
      setFileName(story.title);
      setIsSample(false);
      setCurrentPageIndex(0);
      setReadingPage(0);
      setReadingWordIndex(-1);
      positionRef.current = { page: 0, wordIndex: -1 };
    },
    [stop]
  );

  const loadFile = useCallback(
    async (file: File) => {
      if (file.type !== 'application/pdf') {
        setError('That does not look like a PDF. Please choose a .pdf file.');
        return;
      }

      stop();
      setIsLoading(true);
      setError(null);
      setCurrentPageIndex(0);
      setReadingPage(0);
      setReadingWordIndex(-1);
      positionRef.current = { page: 0, wordIndex: -1 };

      try {
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({
          data: new Uint8Array(buffer),
        }).promise;

        // Extract every page in parallel (Promise.all keeps them in order)
        // rather than awaiting each page before starting the next.
        const pageNumbers = Array.from(
          { length: pdf.numPages },
          (_, index) => index + 1
        );
        const pageTexts = await Promise.all(
          pageNumbers.map(async (pageNumber) => {
            const page = await pdf.getPage(pageNumber);
            const content = await page.getTextContent();
            return content.items
              .map((item) => ('str' in item ? item.str : ''))
              .join(' ')
              .trim();
          })
        );
        // Merge all page text, then re-paginate into ~1000-word reader pages.
        const pages = paginate(pageTexts);

        if (pages.length === 0) {
          setError(
            'No selectable text found. This PDF may be a scan of images.'
          );
          restoreSample();
          return;
        }

        setPagesWords(pages);
        setTotalPages(pages.length);
        setFileName(file.name);
        setIsSample(false);
      } catch (err) {
        const detail = err instanceof Error ? ` ${err.message}` : '';
        setError(`Could not read that PDF.${detail}`);
        restoreSample();
      } finally {
        setIsLoading(false);
      }
    },
    [stop, restoreSample]
  );

  // Populate and track the system voice list.
  useEffect(() => {
    const synth = synthRef.current;
    const populate = () => {
      const list = dedupeVoices(synth.getVoices());
      if (list.length === 0) {
        return;
      }
      setVoices(list);
      setSelectedVoiceURI((current) => {
        if (current && list.some((v) => v.voiceURI === current)) {
          return current;
        }
        const preferred =
          list.find((v) => v.default && !v.localService) ??
          list.find((v) => !v.localService) ??
          list[0];
        return preferred ? preferred.voiceURI : null;
      });
    };

    populate();
    synth.addEventListener('voiceschanged', populate);
    return () => {
      synth.removeEventListener('voiceschanged', populate);
      silence(synth);
      if (keepAliveRef.current !== null) {
        window.clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
    };
  }, []);

  // When voice/rate/pitch change mid-read, restart from the current word.
  useEffect(() => {
    if (!isSpeaking) {
      return;
    }
    const { page, wordIndex } = positionRef.current;
    const resumeIndex = wordIndex >= 0 ? wordIndex : 0;
    stop();
    const timer = window.setTimeout(() => {
      const words = dataRef.current.pagesWords[page];
      if (words && resumeIndex < words.length) {
        speakFromPosition(page, resumeIndex);
      }
    }, RESTART_DELAY_MS);
    return () => window.clearTimeout(timer);
    // Intentionally excludes isSpeaking: this should only fire on setting changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVoiceURI, rate, pitch, stop, speakFromPosition]);

  const displayedPage = isSpeaking ? readingPage : currentPageIndex;

  return {
    pagesWords,
    totalPages,
    fileName,
    isSample,
    isLoading,
    error,
    hasDocument: totalPages > 0,
    currentPageIndex,
    displayedPage,
    isSpeaking,
    readingPage,
    readingWordIndex,
    voices,
    selectedVoiceURI,
    rate,
    pitch,
    setPage,
    setSelectedVoiceURI,
    setRate,
    setPitch,
    loadFile,
    loadStory,
    reset,
    speakFromPosition,
    speakPage,
    stop,
  };
}

export type ReaderApi = ReturnType<typeof useReader>;

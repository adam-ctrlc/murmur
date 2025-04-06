import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import {
  Button,
  Card,
  Label,
  RangeSlider,
  Pagination,
  Spinner,
  Alert,
  ThemeConfig,
  Radio,
  FileInput,
  HelperText,
} from 'flowbite-react';
import { Play, Pause, Volume2, Settings, Upload, BookOpen } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

export default function App() {
  const [extractedText, setExtractedText] = useState('');
  const [pageTexts, setPageTexts] = useState([]);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Word arrays for each page
  const [pagesWords, setPagesWords] = useState([]);

  // Track the actual reading position (page and word index)
  const readingPositionRef = useRef({ page: 0, wordIndex: -1 });

  const speechSynthesisRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  // Process text page by page
  const processPageTexts = useCallback((texts) => {
    if (!texts || !texts.length) return [];
    return texts.map((text) =>
      text.split(/\s+/).filter((word) => word.trim() !== '')
    );
  }, []);

  // Update words when page changes
  useEffect(() => {
    if (pagesWords.length > currentPageIndex) {
      // Only update current word index if not speaking
      if (!isSpeaking) {
        setCurrentWordIndex(-1);
      }
    }
  }, [currentPageIndex, pagesWords, isSpeaking]);

  // Function to populate voices
  const populateVoiceList = useCallback(() => {
    const voices = speechSynthesisRef.current.getVoices();
    if (voices.length > 0) {
      setAvailableVoices(voices);
      if (
        !selectedVoiceURI ||
        !voices.find((voice) => voice.voiceURI === selectedVoiceURI)
      ) {
        const defaultVoice =
          voices.find((voice) => voice.default && !voice.localService) ||
          voices.find((voice) => !voice.localService) ||
          voices[0];
        if (defaultVoice) {
          setSelectedVoiceURI(defaultVoice.voiceURI);
        }
      }
    }
  }, [selectedVoiceURI]);

  // Fetch voices on mount
  useEffect(() => {
    populateVoiceList();
    if (speechSynthesisRef.current.onvoiceschanged !== undefined) {
      speechSynthesisRef.current.onvoiceschanged = populateVoiceList;
    }

    return () => {
      if (speechSynthesisRef.current.speaking) {
        speechSynthesisRef.current.cancel();
      }
      if (speechSynthesisRef.current.onvoiceschanged !== undefined) {
        speechSynthesisRef.current.onvoiceschanged = null;
      }
      setIsSpeaking(false);
    };
  }, [populateVoiceList]);

  // Handle voice, rate, or pitch change during speaking
  useEffect(() => {
    if (isSpeaking) {
      // Remember current position precisely using the ref
      const currentPosition = {
        page: readingPositionRef.current.page,
        wordIndex: readingPositionRef.current.wordIndex,
      };

      // Stop current speech
      handleStopSpeaking();

      // Wait a moment before restarting to ensure cleanup
      setTimeout(() => {
        // If we have a valid position, restart from there
        if (currentPosition.wordIndex >= 0) {
          handleSpeakFromPosition(
            currentPosition.page,
            currentPosition.wordIndex
          );
        }
      }, 150);
    }
  }, [selectedVoiceURI, speechRate, speechPitch]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      return;
    }

    // Reset state
    handleStopSpeaking();
    setIsLoading(true);
    setError('');
    setExtractedText('');
    setPageTexts([]);
    setPagesWords([]);
    setCurrentPageIndex(0);
    setTotalPages(0);
    readingPositionRef.current = { page: 0, wordIndex: -1 };

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          const loadingTask = pdfjsLib.getDocument({ data: typedArray });
          const pdf = await loadingTask.promise;
          setTotalPages(pdf.numPages);

          // Extract text from each page separately
          const extractedPageTexts = [];

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            let pageText = '';

            textContent.items.forEach((item) => {
              pageText += item.str + ' ';
            });

            extractedPageTexts.push(pageText.trim());
          }

          setPageTexts(extractedPageTexts);
          // Process words for each page
          const wordsPerPage = processPageTexts(extractedPageTexts);
          setPagesWords(wordsPerPage);

          // Set full text too
          setExtractedText(extractedPageTexts.join('\n\n'));

          setIsLoading(false);
        } catch (err) {
          console.error('Error processing PDF:', err);
          setError('Failed to process PDF. ' + err.message);
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Error reading file.');
        setIsLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('Error handling PDF:', err);
      setError('Failed to read PDF file. ' + err.message);
      setIsLoading(false);
    }
  };

  const createUtterance = (text, startPage, startWordIndex) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = availableVoices.find(
      (voice) => voice.voiceURI === selectedVoiceURI
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    // Set starting position in our refs for tracking
    readingPositionRef.current = {
      page: startPage,
      wordIndex: startWordIndex,
    };

    // Update UI for initial position
    setCurrentPageIndex(startPage);
    setCurrentWordIndex(startWordIndex);

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      // Check if speech ended naturally and not because it was cancelled
      if (
        speechSynthesisRef.current &&
        !speechSynthesisRef.current.speaking &&
        utteranceRef.current === utterance
      ) {
        const nextPage = readingPositionRef.current.page + 1;
        // Check if there is a next page
        if (nextPage < totalPages) {
          // Automatically start speaking the next page
          handleSpeakFromPosition(nextPage, 0);
        } else {
          // Reached the end of the document
          setIsSpeaking(false);
          readingPositionRef.current = { page: 0, wordIndex: -1 }; // Reset position
          setCurrentWordIndex(-1);
          utteranceRef.current = null; // Clear utterance ref
        }
      } else {
        // Speech was likely cancelled or an error occurred, ensure state is reset
        setIsSpeaking(false);
        // Don't reset readingPositionRef here, handleStopSpeaking does that or restart logic needs it.
        setCurrentWordIndex(-1);
        utteranceRef.current = null;
      }
    };

    utterance.onerror = (event) => {
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error('Speech synthesis error:', event);
        setError(`Speech synthesis error: ${event.error || 'Unknown error'}`);
      }
      setIsSpeaking(false);
    };

    // Track word boundaries to highlight current word
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        try {
          const upToIndex = event.charIndex + event.charLength;
          const textUpToCharIndex = text.substring(0, upToIndex);
          const wordCount = textUpToCharIndex.split(/\s+/).length - 1;

          // Update our reading position with new word index
          readingPositionRef.current.wordIndex = startWordIndex + wordCount;

          // Check if we need to flip pages
          if (pagesWords.length > startPage) {
            const currentPageWordCount = pagesWords[startPage].length;

            if (startWordIndex + wordCount >= currentPageWordCount) {
              // We've moved to the next page
              const nextPage = startPage + 1;
              if (nextPage < pagesWords.length) {
                readingPositionRef.current.page = nextPage;
                readingPositionRef.current.wordIndex =
                  startWordIndex + wordCount - currentPageWordCount;
                setCurrentPageIndex(nextPage);
                setCurrentWordIndex(readingPositionRef.current.wordIndex);
              }
            } else {
              // Still on same page, just update word index
              setCurrentWordIndex(startWordIndex + wordCount);
            }
          } else {
            // Fallback if page data isn't loaded yet
            setCurrentWordIndex(startWordIndex + wordCount);
          }
        } catch (e) {
          console.error('Error in boundary event:', e);
        }
      }
    };

    return utterance;
  };

  // Start speaking from the beginning or from specified page
  const handleSpeak = (pageIndex = 0) => {
    if (!('speechSynthesis' in window)) {
      setError('Sorry, your browser does not support text-to-speech.');
      return;
    }

    if (pageTexts.length === 0 || isSpeaking) {
      return;
    }

    // Start from the first word of the specified page
    handleSpeakFromPosition(pageIndex, 0);
  };

  // Speak from a specific page and position
  const handleSpeakFromPosition = (pageIndex, wordIndex) => {
    handleStopSpeaking();

    // Ensure valid page index
    if (pageIndex < 0 || pageIndex >= pagesWords.length) {
      return;
    }

    // Get words for current page
    const pageWords = pagesWords[pageIndex];

    // Ensure valid word index
    if (wordIndex < 0 || wordIndex >= pageWords.length) {
      return;
    }

    // Calculate text to speak from this position
    // We'll speak just the current page first, then handle page transitions
    const textToSpeak = pageWords.slice(wordIndex).join(' ');

    // Create and start utterance
    utteranceRef.current = createUtterance(textToSpeak, pageIndex, wordIndex);
    speechSynthesisRef.current.speak(utteranceRef.current);

    // Update UI
    setCurrentPageIndex(pageIndex);
  };

  const handleStopSpeaking = () => {
    if (speechSynthesisRef.current.speaking) {
      try {
        speechSynthesisRef.current.pause();
      } catch (e) {
        // Ignore errors during pause
      }
      speechSynthesisRef.current.cancel();
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
  };

  const handlePageChange = (page) => {
    if (isSpeaking) {
      handleStopSpeaking();
    }
    setCurrentPageIndex(page - 1);
    setCurrentWordIndex(-1);
  };

  // Rendering functions for clarity
  const renderHeader = () => (
    <div className='border border-gray-200 rounded-t-lg p-4 flex items-center bg-violet-700'>
      <BookOpen className='h-6 w-6 text-white mr-2' />
      <h1 className='text-2xl font-bold text-white'>
        PDF Text Extractor & Reader
      </h1>
    </div>
  );

  const renderFileUpload = () => (
    <div className='mb-6'>
      <Label
        htmlFor='pdfUploader'
        value='Upload PDF File'
        className='mb-2 block font-medium text-gray-700'
      />
      <FileInput
        id='pdfUploader'
        accept='application/pdf'
        onChange={handleFileChange}
      />
      <HelperText className='mt-1 text-sm text-gray-500'>
        Click to upload or drag and drop. PDF files only.
      </HelperText>
    </div>
  );

  const renderVoiceControls = () =>
    availableVoices.length > 0 && (
      <Card className='mb-6 border-0 shadow-none bg-transparent'>
        <div className='flex items-center mb-3'>
          <Settings className='w-5 h-5 mr-2 text-gray-700' />
          <h2 className='text-lg font-medium'>Speech Settings</h2>
        </div>

        <div className='mb-4'>
          <div className='mb-2 block'>
            <Label
              id='voiceSelectionGroupLabel'
              className='text-gray-700 font-medium'
            >
              Voice:
            </Label>
          </div>
          <div
            id='voiceSelectionGroup'
            className='flex flex-wrap gap-2'
            role='radiogroup'
            aria-labelledby='voiceSelectionGroupLabel'
          >
            {availableVoices.map((voice, index) => (
              <Label
                key={`${voice.voiceURI}-${index}`}
                htmlFor={`voice-${index}`}
                className={`inline-flex items-center justify-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg cursor-pointer text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-violet-500 ${
                  selectedVoiceURI === voice.voiceURI
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <Radio
                  id={`voice-${index}`}
                  name='voiceSelection'
                  value={voice.voiceURI}
                  checked={selectedVoiceURI === voice.voiceURI}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  className='sr-only'
                />
                {voice.name} ({voice.lang})
              </Label>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4'>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='rateRange' className='text-gray-700 font-medium'>
                Speed: {speechRate.toFixed(1)}x
              </Label>
            </div>
            <RangeSlider
              id='rateRange'
              min={0.5}
              max={2}
              step={0.1}
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <div className='mb-2 block'>
              <Label htmlFor='pitchRange' className='text-gray-700 font-medium'>
                Pitch: {speechPitch.toFixed(1)}
              </Label>
            </div>
            <RangeSlider
              id='pitchRange'
              min={0.5}
              max={1.5}
              step={0.1}
              value={speechPitch}
              onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </Card>
    );

  const renderError = () =>
    error && (
      <Alert color='failure' className='mb-6'>
        <span className='font-medium mr-1'>Error:</span> {error}
      </Alert>
    );

  const renderTextDisplay = () => {
    if (isLoading) {
      return (
        <div className='flex flex-col items-center justify-center p-8'>
          <Spinner size='xl' color='purple' />
          <p className='mt-4 text-gray-700'>Processing PDF...</p>
        </div>
      );
    }

    // Show placeholder if no PDF is loaded yet
    if (!pageTexts.length) {
      return (
        <Card className='mt-6 border shadow-none'>
          <div className='text-center p-8 text-gray-500'>
            <BookOpen className='mx-auto h-12 w-12 text-gray-400 mb-4' />
            <p>Upload a PDF file using the button above to start reading.</p>
          </div>
        </Card>
      );
    }

    // Handle potentially invalid page index (shouldn't happen with pagination but good practice)
    if (currentPageIndex >= pageTexts.length) {
      return (
        <Card className='mt-6 border shadow-none'>
          <div className='text-center p-8 text-gray-500'>Invalid Page</div>
        </Card>
      );
    }

    const currentPageWords = pagesWords[currentPageIndex] || [];

    return (
      <Card className='mt-6 border shadow-none'>
        {/* Header with Page Number and Play/Pause Button */}
        <div className='flex justify-between items-center mb-3'>
          <div className='flex items-center'>
            <Volume2 className='w-5 h-5 mr-2 text-gray-700' />
            <h2 className='text-lg font-medium'>
              Page {currentPageIndex + 1} of {totalPages}
            </h2>
          </div>
          {/* Only show play button if there are words on the page */}
          {currentPageWords.length > 0 && (
            <Button
              color={isSpeaking ? 'failure' : 'purple'}
              onClick={
                isSpeaking
                  ? handleStopSpeaking
                  : () => handleSpeak(currentPageIndex)
              }
              disabled={!pageTexts.length} // Keep disabled check for safety
              size='sm'
            >
              {isSpeaking ? (
                <>
                  <Pause className='mr-2 h-4 w-4' />
                  Pause
                </>
              ) : (
                <>
                  <Play className='mr-2 h-4 w-4' />
                  Play
                </>
              )}
            </Button>
          )}
        </div>

        {/* Text Content Area */}
        <div className='border border-gray-300 rounded p-4 bg-gray-50 min-h-[150px] overflow-y-auto flex items-center justify-center'>
          {currentPageWords.length > 0 ? (
            <div className='text-sm leading-relaxed w-full'>
              {' '}
              {/* Ensure text takes full width */}
              {currentPageWords.map((word, index) => (
                <span
                  key={`word-${index}-page-${currentPageIndex}`}
                  onClick={() =>
                    handleSpeakFromPosition(currentPageIndex, index)
                  }
                  className={`inline-block mr-1 cursor-pointer rounded px-0.5 ${
                    index === currentWordIndex
                      ? 'bg-violet-300 text-violet-900 font-medium'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          ) : (
            // Placeholder for empty pages within a loaded PDF
            <p className='text-gray-500 italic'>
              This page contains no text content.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center mt-4'>
            <Pagination
              currentPage={currentPageIndex + 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showIcons
            />
          </div>
        )}
      </Card>
    );
  };

  return (
    <>
      <ThemeConfig dark={false} />
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-4xl mx-auto'>
          <Card className='mb-6 overflow-hidden p-0 shadow-none border-0'>
            {renderHeader()}
            <div>
              {renderFileUpload()}
              {renderVoiceControls()}
              {renderError()}
              {renderTextDisplay()}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

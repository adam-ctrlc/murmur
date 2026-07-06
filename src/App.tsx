import { useCallback, useRef, useState, type DragEvent } from 'react';
import { WarningCircle, FileArrowDown } from '@phosphor-icons/react';
import { useReader } from './hooks/useReader';
import { useTheme } from './hooks/useTheme';
import { SAMPLE_TITLE } from './sample';
import { STORIES, type Story } from './stories';
import { TopBar } from './components/TopBar';
import { ReadingPane } from './components/ReadingPane';
import { ReadingSkeleton } from './components/ReadingSkeleton';
import { ControlBar } from './components/ControlBar';
import { SettingsSheet } from './components/SettingsSheet';

const RATE_STEPS: readonly number[] = [0.8, 1, 1.25, 1.5, 1.75, 2];

function DragOverlay() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-canvas/80 p-6 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-accent bg-surface px-10 py-12 text-center">
        <FileArrowDown className="size-10 text-accent" aria-hidden="true" />
        <p className="font-medium text-ink">Drop your PDF to open it</p>
      </div>
    </div>
  );
}

export default function App() {
  const reader = useReader();
  const { theme, setTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  const { speakFromPosition, loadStory, displayedPage } = reader;
  const displayedWords = reader.pagesWords[displayedPage] ?? [];
  const activeWordIndex =
    reader.isSpeaking && reader.readingPage === displayedPage
      ? reader.readingWordIndex
      : -1;
  const title = reader.isSample
    ? SAMPLE_TITLE
    : (reader.fileName ?? 'Untitled document');

  // Stable within a page so ReadingPane's memoized word spans are not all
  // re-rendered on every word-boundary highlight update.
  const handleWordSelect = useCallback(
    (index: number) => speakFromPosition(displayedPage, index),
    [speakFromPosition, displayedPage]
  );
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const handleSelectStory = useCallback(
    (story: Story) => {
      loadStory(story);
      setSettingsOpen(false);
    },
    [loadStory]
  );

  const openFilePicker = () => fileInputRef.current?.click();

  const goToPage = (page: number) => {
    const clamped = Math.max(0, Math.min(reader.totalPages - 1, page));
    if (reader.isSpeaking) {
      reader.speakPage(clamped);
    } else {
      reader.setPage(clamped);
    }
  };

  const handleTogglePlay = () => {
    if (reader.isSpeaking) {
      reader.stop();
    } else {
      reader.speakPage(reader.displayedPage);
    }
  };

  const cycleRate = () => {
    const next =
      RATE_STEPS.find((step) => step > reader.rate + 0.001) ?? RATE_STEPS[0];
    reader.setRate(next);
  };

  const isFileDrag = (event: DragEvent<HTMLDivElement>) =>
    Array.from(event.dataTransfer.types).includes('Files');

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (!isFileDrag(event)) {
      return;
    }
    event.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (isFileDrag(event)) {
      event.preventDefault();
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!isFileDrag(event)) {
      return;
    }
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      reader.loadFile(file);
    }
  };

  return (
    <div
      className="flex min-h-dvh flex-col"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <TopBar
        theme={theme}
        onSelectTheme={setTheme}
        isSample={reader.isSample}
        fileName={reader.fileName}
        onOpenFile={openFilePicker}
        onClose={reader.reset}
      />

      <main className="flex-1">
        {reader.isLoading ? (
          <ReadingSkeleton />
        ) : (
          <>
            {reader.error ? (
              <div className="mx-auto mt-4 flex max-w-2xl items-center gap-2 rounded-xl border border-faint bg-surface px-4 py-3 text-sm text-ink">
                <WarningCircle
                  className="size-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                {reader.error}
              </div>
            ) : null}
            <ReadingPane
              words={displayedWords}
              title={title}
              pageNumber={displayedPage + 1}
              totalPages={reader.totalPages}
              activeWordIndex={activeWordIndex}
              onWordSelect={handleWordSelect}
            />
          </>
        )}
      </main>

      <ControlBar
        isSpeaking={reader.isSpeaking}
        onTogglePlay={handleTogglePlay}
        pageNumber={reader.displayedPage + 1}
        totalPages={reader.totalPages}
        onPrev={() => goToPage(reader.displayedPage - 1)}
        onNext={() => goToPage(reader.displayedPage + 1)}
        rate={reader.rate}
        onCycleRate={cycleRate}
        onOpenSettings={openSettings}
      />

      <SettingsSheet
        open={settingsOpen}
        onClose={closeSettings}
        stories={STORIES}
        onSelectStory={handleSelectStory}
        voices={reader.voices}
        selectedVoiceURI={reader.selectedVoiceURI}
        onSelectVoice={reader.setSelectedVoiceURI}
        rate={reader.rate}
        onRateChange={reader.setRate}
        pitch={reader.pitch}
        onPitchChange={reader.setPitch}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            reader.loadFile(file);
          }
          event.target.value = '';
        }}
      />

      {isDragging ? <DragOverlay /> : null}
    </div>
  );
}

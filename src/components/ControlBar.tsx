import {
  Play,
  Pause,
  CaretLeft,
  CaretRight,
  Gauge,
  SlidersHorizontal,
} from '@phosphor-icons/react';

interface ControlBarProps {
  isSpeaking: boolean;
  onTogglePlay: () => void;
  pageNumber: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  rate: number;
  onCycleRate: () => void;
  onOpenSettings: () => void;
}

export function ControlBar({
  isSpeaking,
  onTogglePlay,
  pageNumber,
  totalPages,
  onPrev,
  onNext,
  rate,
  onCycleRate,
  onOpenSettings,
}: ControlBarProps) {
  const progress = totalPages > 0 ? (pageNumber / totalPages) * 100 : 0;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border border-faint bg-surface/95 shadow-lg shadow-black/5 backdrop-blur-md">
        <div className="h-1 w-full bg-faint">
          <div
            className="h-full bg-accent transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-2.5">
          <button
            type="button"
            onClick={onCycleRate}
            title="Reading speed"
            aria-label={`Reading speed ${rate.toFixed(2)} times. Tap to change.`}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Gauge className="size-4" weight="fill" aria-hidden="true" />
            <span className="tabular-nums">{rate.toFixed(2)}x</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onPrev}
              disabled={pageNumber <= 1}
              title="Previous page"
              aria-label="Previous page"
              className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-mark/40 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <CaretLeft className="size-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              title={isSpeaking ? 'Pause' : 'Read aloud'}
              aria-label={isSpeaking ? 'Pause reading' : 'Read aloud'}
              className="inline-flex size-12 items-center justify-center rounded-full bg-accent text-accent-ink shadow-sm transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {isSpeaking ? (
                <Pause className="size-5" weight="fill" aria-hidden="true" />
              ) : (
                <Play
                  className="size-5 translate-x-px"
                  weight="fill"
                  aria-hidden="true"
                />
              )}
            </button>

            <button
              type="button"
              onClick={onNext}
              disabled={pageNumber >= totalPages}
              title="Next page"
              aria-label="Next page"
              className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-mark/40 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <CaretRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenSettings}
            title="Stories & settings"
            aria-label="Open stories and settings"
            className="inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <SlidersHorizontal className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

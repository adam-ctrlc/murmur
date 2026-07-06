import { BookOpen, FolderOpen, X } from '@phosphor-icons/react';
import type { ReaderTheme } from '../types';
import { ThemePicker } from './ThemePicker';

interface TopBarProps {
  theme: ReaderTheme;
  onSelectTheme: (theme: ReaderTheme) => void;
  isSample: boolean;
  fileName: string | null;
  onOpenFile: () => void;
  onClose: () => void;
}

export function TopBar({
  theme,
  onSelectTheme,
  isSample,
  fileName,
  onOpenFile,
  onClose,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-faint bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
        <span className="flex items-center gap-2 font-semibold tracking-tight text-ink">
          <BookOpen className="size-5 text-accent" aria-hidden="true" />
          Murmur
        </span>

        {!isSample && fileName ? (
          <span
            className="ml-1 hidden min-w-0 flex-1 truncate text-sm text-muted sm:block"
            title={fileName}
          >
            {fileName}
          </span>
        ) : (
          <span className="flex-1" />
        )}

        <ThemePicker theme={theme} onChange={onSelectTheme} />

        <button
          type="button"
          onClick={onOpenFile}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-ink transition-transform hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <FolderOpen className="size-4" weight="fill" aria-hidden="true" />
          <span className="hidden sm:inline">Open PDF</span>
        </button>

        {!isSample ? (
          <button
            type="button"
            onClick={onClose}
            title="Close document"
            aria-label="Close document"
            className="inline-flex size-9 items-center justify-center rounded-full border border-faint bg-surface text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </header>
  );
}

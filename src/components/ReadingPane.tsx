import { memo } from 'react';

interface ReadingWordProps {
  word: string;
  index: number;
  active: boolean;
  onSelect: (index: number) => void;
}

const ReadingWord = memo(function ReadingWord({
  word,
  index,
  active,
  onSelect,
}: ReadingWordProps) {
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => onSelect(index)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(index);
        }
      }}
      className={`cursor-pointer rounded px-0.5 transition-colors ${
        active
          ? 'bg-mark text-mark-ink'
          : 'hover:bg-mark/40 focus-visible:bg-mark/40'
      } focus-visible:outline-none`}
    >
      {word}{' '}
    </span>
  );
});

interface ReadingPaneProps {
  words: string[];
  title: string;
  pageNumber: number;
  totalPages: number;
  activeWordIndex: number;
  onWordSelect: (index: number) => void;
}

export const ReadingPane = memo(function ReadingPane({
  words,
  title,
  pageNumber,
  totalPages,
  activeWordIndex,
  onWordSelect,
}: ReadingPaneProps) {
  return (
    <article className="mx-auto w-full max-w-2xl px-6 pb-40 pt-10">
      <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-faint pb-4">
        <h1 className="truncate font-serif text-xl text-ink" title={title}>
          {title}
        </h1>
        <span className="shrink-0 text-sm tabular-nums text-muted">
          Page {pageNumber} / {totalPages}
        </span>
      </div>

      <div className="prose-reader text-ink">
        {words.map((word, index) => (
          <ReadingWord
            key={index}
            word={word}
            index={index}
            active={index === activeWordIndex}
            onSelect={onWordSelect}
          />
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted">
        Tap any word to start reading aloud from there.
      </p>
    </article>
  );
});

// Placeholder line widths (in %) shaped like paragraphs of prose, so the
// skeleton reads as text settling into the same column as the real content.
const PARAGRAPHS: readonly (readonly number[])[] = [
  [100, 97, 99, 94, 62],
  [100, 96, 98, 91, 99, 73],
  [95, 100, 88, 96, 45],
];

export function ReadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 pb-40 pt-10">
      <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-faint pb-4">
        <div className="skeleton h-6 w-1/2" aria-hidden="true" />
        <div className="skeleton h-4 w-16" aria-hidden="true" />
      </div>

      <div className="space-y-7" aria-hidden="true">
        {PARAGRAPHS.map((widths, paragraphIndex) => (
          <div key={paragraphIndex} className="space-y-3.5">
            {widths.map((width, lineIndex) => (
              <div
                key={lineIndex}
                className="skeleton h-4"
                style={{ width: `${width}%` }}
              />
            ))}
          </div>
        ))}
      </div>

      <span role="status" className="sr-only">
        Loading your document…
      </span>
    </div>
  );
}

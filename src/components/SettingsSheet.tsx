import { memo } from 'react';
import { X, Check } from '@phosphor-icons/react';
import type { Story } from '../stories';

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
  stories: readonly Story[];
  onSelectStory: (story: Story) => void;
  voices: SpeechSynthesisVoice[];
  selectedVoiceURI: string | null;
  onSelectVoice: (voiceURI: string) => void;
  rate: number;
  onRateChange: (rate: number) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
}

interface SliderRowProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
}

function SliderRow({
  id,
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: SliderRowProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        <span className="text-sm tabular-nums text-muted">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[var(--accent)]"
      />
    </div>
  );
}

export const SettingsSheet = memo(function SettingsSheet({
  open,
  onClose,
  stories,
  onSelectStory,
  voices,
  selectedVoiceURI,
  onSelectVoice,
  rate,
  onRateChange,
  pitch,
  onPitchChange,
}: SettingsSheetProps) {
  return (
    <div
      className={`fixed inset-0 z-30 ${open ? '' : 'pointer-events-none'}`}
      inert={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        aria-label="Close settings"
        className={`absolute inset-0 bg-black/30 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Stories and voice settings"
        className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-faint bg-surface shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-faint px-5 py-4">
          <h2 className="font-serif text-lg text-ink">Stories &amp; voice</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <div className="space-y-4">
            <SliderRow
              id="rate-slider"
              label="Speed"
              value={rate}
              min={0.5}
              max={2}
              step={0.05}
              format={(value) => `${value.toFixed(2)}x`}
              onChange={onRateChange}
            />
            <SliderRow
              id="pitch-slider"
              label="Pitch"
              value={pitch}
              min={0.5}
              max={1.5}
              step={0.05}
              format={(value) => value.toFixed(2)}
              onChange={onPitchChange}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-ink">
              Voice
              {voices.length > 0 ? (
                <span className="ml-1 font-normal text-muted">
                  ({voices.length})
                </span>
              ) : null}
            </p>
            {voices.length === 0 ? (
              <p className="rounded-xl border border-faint px-4 py-3 text-sm text-muted">
                No speech voices are available in this browser.
              </p>
            ) : (
              <ul className="space-y-1">
                {voices.map((voice) => {
                  const selected = voice.voiceURI === selectedVoiceURI;
                  return (
                    <li key={voice.voiceURI}>
                      <button
                        type="button"
                        onClick={() => onSelectVoice(voice.voiceURI)}
                        aria-pressed={selected}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                          selected
                            ? 'bg-accent/12 text-ink'
                            : 'text-muted hover:bg-mark/30 hover:text-ink'
                        } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-ink">
                            {voice.name}
                          </span>
                          <span className="block truncate text-xs text-muted">
                            {voice.lang}
                            {voice.localService ? ' · on device' : ' · online'}
                          </span>
                        </span>
                        {selected ? (
                          <Check
                            className="size-4 shrink-0 text-accent"
                            aria-hidden="true"
                          />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="border-t border-faint pt-6">
            <p className="text-sm font-medium text-ink">Try a story</p>
            <p className="mb-3 text-xs text-muted">
              Short Taglish reads. Tap one, then press play to hear it.
            </p>
            <ul className="space-y-2">
              {stories.map((story) => (
                <li key={story.id}>
                  <button
                    type="button"
                    onClick={() => onSelectStory(story)}
                    className="flex w-full flex-col gap-1 rounded-xl border border-faint px-3.5 py-3 text-left transition-colors hover:border-accent/60 hover:bg-mark/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-serif text-base text-ink">
                        {story.title}
                      </span>
                      <span className="shrink-0 rounded-full bg-accent/12 px-2 py-0.5 text-[11px] font-medium text-accent">
                        {story.tag}
                      </span>
                    </span>
                    <span className="text-xs leading-relaxed text-muted">
                      {story.blurb}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
});

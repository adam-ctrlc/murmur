import { Sun, Coffee, Moon, type Icon } from '@phosphor-icons/react';
import type { ReaderTheme } from '../types';

interface ThemeOption {
  value: ReaderTheme;
  label: string;
  Icon: Icon;
}

const OPTIONS: readonly ThemeOption[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'sepia', label: 'Sepia', Icon: Coffee },
  { value: 'dark', label: 'Dark', Icon: Moon },
];

interface ThemePickerProps {
  theme: ReaderTheme;
  onChange: (theme: ReaderTheme) => void;
}

export function ThemePicker({ theme, onChange }: ThemePickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Reading theme"
      className="inline-flex items-center gap-0.5 rounded-full border border-faint bg-surface p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const selected = value === theme;
        return (
          <label
            key={value}
            title={label}
            className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
              selected
                ? 'bg-accent text-accent-ink'
                : 'text-muted hover:text-ink'
            }`}
          >
            <input
              type="radio"
              name="reader-theme"
              value={value}
              checked={selected}
              onChange={() => onChange(value)}
              className="sr-only"
            />
            <Icon
              className="size-4"
              weight={selected ? 'fill' : 'regular'}
              aria-hidden="true"
            />
            <span className="sr-only">{label} theme</span>
          </label>
        );
      })}
    </div>
  );
}

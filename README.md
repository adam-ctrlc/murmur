# Murmur

A calm reading room for your PDFs. Open a document and read it in a
comfortable, distraction-free column, or press play and let the browser read it
aloud, tracking each word as it goes. Everything runs client-side: nothing is
uploaded.

## Features

- Reading-focused design with a serif reading column and light / sepia / dark themes.
- Text-to-speech via the Web Speech API, with word-level highlighting.
- Click any word to start reading aloud from there.
- Adjustable voice, speed, and pitch.
- Fully typed React 19 + Vite 6 + Tailwind CSS 4.

## Requirements

- Node 20+ and [pnpm](https://pnpm.io) (see `packageManager` in `package.json`).

## Development

```bash
pnpm install
pnpm dev        # start the dev server
pnpm typecheck  # type-check the project (tsc)
pnpm lint       # run ESLint
pnpm build      # type-check then build for production
```

## Project layout

```
src/
  hooks/
    useReader.ts   PDF text extraction + speech playback state
    useTheme.ts    light / sepia / dark theme, persisted
  components/       presentational UI (top bar, dropzone, reading pane, controls)
  App.tsx          composition
  types.ts         shared types
```

Text extraction uses `pdfjs-dist`; the worker is bundled through Vite so its
version can never drift from the API.

## License

Licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file
for the full text.

Copyright 2026 Adam.

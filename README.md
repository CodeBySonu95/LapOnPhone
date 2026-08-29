# Typing Yatra — Laptop Simulator

Typing Yatra is a professional, browser-based computer practice environment for beginners. It uses a chapter-based Windows-style simulator so learners can practice the actions they will use on a real laptop: opening the Start menu, navigating with arrow keys, writing in Notepad, managing files, searching in a browser, and using multi-key shortcuts.

## Features

The simulator includes a desktop workspace, simulated Windows apps, a full clickable laptop keyboard, modifier-key hold state for shortcuts, a trackpad surface with click feedback, chapter missions, next-key coaching, completion progress, and local browser persistence.

Keyboard chords are practiced by holding a modifier first and then pressing the action key. For example, click **Ctrl**, then click **C** to practice **Ctrl+C**. The same missions also listen to a physical keyboard when the browser window is focused.

## Run locally

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite. For a production check:

```bash
pnpm check
pnpm build
```

The configured Vite entry is `client/index.html`; the repository also includes a root `index.html` entry for simple static inspection and tooling.

## Project structure

- `client/src/pages/Home.tsx` — simulator shell, chapters, apps, keyboard, touchpad, and mission logic.
- `client/src/index.css` — warm editorial learning shell and laptop UI styling.
- `client/src/main.tsx` — React mount entry.
- `client/index.html` — configured Vite document shell.
- `index.html` — root-level repository entry reference.

## License

This repository retains the GPL-3.0 license from the original project.

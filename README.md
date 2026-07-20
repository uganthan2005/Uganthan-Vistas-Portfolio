# Portfolio 1

A retro Windows-inspired portfolio built with Next.js, React, TypeScript, and Zustand. The site opens like a desktop OS and lets visitors explore an interactive login screen, boot sequence, movable windows, a command prompt, a resume viewer, a gallery, a browser mockup, and mini apps like Minesweeper and Paint.

## Features

- Desktop-style portfolio shell with login and boot flow.
- Floating app windows for About Me, Resume, Command Prompt, Browser, Gallery, Media Player, Minesweeper, and Paint.
- Terminal commands for contact links, project highlights, resume download, and system-style interactions.
- Responsive, custom-built UI with bundled icons, sounds, wallpaper, and local assets.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Zustand
- React RND
- Tailwind CSS 4

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - start the local development server
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run lint` - run ESLint

## Project Structure

- `src/app` - app router entry points, layout, and global styles
- `src/components` - desktop shell, taskbar, windows, and shared UI
- `src/apps` - individual portfolio apps and content panels
- `src/gadgets` - smaller desktop widgets
- `src/store` - shared desktop state
- `public` - wallpaper, icons, sounds, and downloadable assets

## Notes

- The portfolio uses locally hosted assets, so keep files in `public/` in sync with the components that reference them.
- The resume viewer expects `public/resume.pdf` to exist.

## Deployment

This app can be deployed to any platform that supports Next.js. For Vercel, connect the repository and use the default build command (`npm run build`).

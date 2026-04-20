# HireHub Onboarding Portal — Deployment Guide

## Overview

This project is a React 18+ single-page application (SPA) built with Vite. It produces a static `dist/` directory that can be deployed to any static hosting provider. This guide covers deployment to **Vercel**.

---

## Prerequisites

- Node.js 18+ installed locally
- npm 9+ installed locally
- A [Vercel](https://vercel.com) account

---

## Build

Run the production build:

```bash
npm install
npm run build
```

This outputs optimized static assets to the **`dist/`** directory.

To preview the production build locally:

```bash
npm run preview
```

---

## Vercel Deployment

### Option A: Deploy via Vercel Dashboard

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Vercel auto-detects Vite. Confirm the following settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**.

### Option B: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts. Vercel will detect the Vite framework and apply the correct defaults.

For subsequent deployments to production:

```bash
vercel --prod
```

---

## SPA Rewrite Configuration

Single-page applications require all routes to be rewritten to `index.html` so that client-side routing works correctly. Create a **`vercel.json`** file in the project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures that navigating directly to a route like `/dashboard` or `/onboarding/step-2` serves `index.html` instead of returning a 404.

---

## Environment Variables

**No environment variables are required** for this application. The app runs entirely on the client side with no external API dependencies.

If environment variables are added in the future, follow these rules:

- All client-side variables **must** be prefixed with `VITE_` (e.g., `VITE_API_URL`).
- Access them via `import.meta.env.VITE_API_URL` — never use `process.env`.
- In Vercel, add them under **Project Settings → Environment Variables**.
- After changing environment variables on Vercel, you must **redeploy** for changes to take effect (they are embedded at build time).

---

## Troubleshooting

### Routes return 404 on page refresh

**Cause:** The hosting provider is looking for a file matching the URL path (e.g., `/onboarding/step-1`) instead of serving `index.html`.

**Fix:** Ensure `vercel.json` contains the SPA rewrite rule shown above. Redeploy after adding or modifying the file.

### Blank page after deployment

**Cause:** The `base` path in `vite.config.js` does not match the deployment URL.

**Fix:** Ensure `vite.config.js` uses the default base (`/`):

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // base defaults to '/' — only change if deploying to a subdirectory
});
```

### Assets not loading (404 on JS/CSS files)

**Cause:** The output directory is misconfigured or the build was not run before deployment.

**Fix:**
1. Run `npm run build` and verify the `dist/` directory contains `index.html` and an `assets/` folder.
2. Confirm the Vercel output directory is set to `dist`.

### Old version still showing after deployment

**Cause:** Browser or CDN caching.

**Fix:**
- Hard-refresh the browser (`Ctrl+Shift+R` / `Cmd+Shift+R`).
- Vite uses content-hashed filenames for assets, so cache-busting is automatic for JS and CSS. Ensure `index.html` is served with appropriate cache headers (Vercel handles this by default).

### Build fails on Vercel

**Cause:** Node.js version mismatch or missing dependencies.

**Fix:**
- Specify the Node.js version in Vercel project settings (use 18 or 20).
- Ensure `package-lock.json` is committed to the repository.
- Check the Vercel build logs for the specific error message.

---

## Project Structure Reference

```
├── public/              # Static assets (copied as-is to dist/)
├── src/
│   ├── main.jsx         # Entry point — renders <App />
│   ├── App.jsx          # Root component with routing
│   └── ...
├── dist/                # Production build output (git-ignored)
├── vercel.json          # Vercel SPA rewrite configuration
├── vite.config.js       # Vite build configuration
├── package.json         # Dependencies and scripts
└── DEPLOYMENT.md        # This file
```
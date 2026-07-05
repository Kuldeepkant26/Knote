---
name: verify
description: Build, launch, and drive the KNOTE app (Express+Mongo backend, React/Vite frontend) to verify changes end-to-end with Playwright.
---

# Verifying KNOTE changes

## Launch

Backend (port 5001, uses `knote_backend/.env`, connects to the shared Atlas DB — create throwaway test data, clean up after):

```bash
cd knote_backend && CLIENT_URL=http://localhost:<FRONTEND_PORT> npm run dev
```

Frontend (port 5173 is often taken by the user's own dev server — pick another and pass it to CLIENT_URL above; `--strictPort` avoids silent fallback):

```bash
cd knote_frontend && VITE_API_URL=http://localhost:5001/api npx vite --port 5199 --strictPort
```

Health check: `curl http://localhost:5001/api/health`.

## Drive (Playwright)

Playwright 1.61.x + chromium are cached on this machine but not in the repo — `npm i playwright` in a scratch dir, don't add to the project. Login form: `input[type="email"]`, `input[type="password"]`, `button[type="submit"]` at `/login`.

Useful API shortcuts (Bearer token from `POST /api/auth/login`):
- Create notebook: `POST /api/notebooks {title}` → add section: `POST /api/notebooks/:id/sections {title}` → create page: `POST /api/pages {notebook, sectionId, title}`.
- Cleanup: `DELETE /api/notebooks/:id` cascades pages.

To catch skeleton/loading states, delay an API route via `page.route()` before navigating.

## Gotchas

- New page background keys must exist in `knote_backend/src/models/page.model.js` `BACKGROUNDS` (Mongoose enum + validator import) or PATCH 400s.
- Refresh cookie is `SameSite=None; Secure` only when `NODE_ENV=production`; local dev uses Lax on localhost — fine cross-port.
- Theme toggle is the Sun/Moon/Monitor button in the Topbar (`aria-label^="Theme"`); preference persists in `localStorage["knote-theme"]`, `.dark` class on `<html>`.

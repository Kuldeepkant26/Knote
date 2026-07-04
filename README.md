# Knote

A notebook app for organizing notes by skill or subject — create notebooks, sections, and pages with a rich handwriting-style editor (custom text styling, diagrams, tables), plus dashboard tabs for finance, tasks, calendar, and bookmarks.

## Structure

- `knote_backend/` — Express + MongoDB API (auth, notebooks, pages)
- `knote_frontend/` — React + Vite frontend

## Getting started

Each app has its own `.env.example` — copy to `.env` and fill in your values, then:

```bash
# Backend
cd knote_backend
npm install
npm run dev

# Frontend
cd knote_frontend
npm install
npm run dev
```

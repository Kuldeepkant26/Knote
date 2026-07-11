// Dummy data for the static dashboard. Structure mirrors the real
// Notebook -> Section -> Page model so the UI reflects the app's concepts,
// even though nothing here is wired to the backend yet.

export const notebooks = [
  {
    id: "nb-react",
    title: "React Mastery",
    subject: "Frontend Engineering",
    tint: "accent",
    updatedAt: "2 hours ago",
    sections: [
      {
        id: "sec-hooks",
        title: "Hooks",
        pages: [
          { id: "p1", title: "useEffect deep dive", snippet: "Cleanup functions, dependency arrays, and race conditions.", tag: "Core", updatedAt: "2h ago" },
          { id: "p2", title: "Custom hooks patterns", snippet: "Extracting reusable stateful logic without prop drilling.", tag: "Patterns", updatedAt: "1d ago" },
          { id: "p3", title: "useMemo vs useCallback", snippet: "When memoization actually helps — and when it hurts.", tag: "Perf", updatedAt: "3d ago" },
        ],
      },
      {
        id: "sec-state",
        title: "State Management",
        pages: [
          { id: "p4", title: "Zustand basics", snippet: "Stores, selectors, and avoiding needless re-renders.", tag: "Library", updatedAt: "5h ago" },
          { id: "p5", title: "Context vs stores", snippet: "Choosing the right tool for shared state.", tag: "Concepts", updatedAt: "2d ago" },
        ],
      },
      {
        id: "sec-perf",
        title: "Performance",
        pages: [
          { id: "p6", title: "Code splitting", snippet: "Lazy routes and dynamic imports with Vite.", tag: "Build", updatedAt: "4d ago" },
        ],
      },
    ],
  },
  {
    id: "nb-system",
    title: "System Design",
    subject: "Architecture",
    tint: "mauve",
    updatedAt: "yesterday",
    sections: [
      {
        id: "sec-scaling",
        title: "Scaling",
        pages: [
          { id: "p7", title: "Horizontal vs vertical", snippet: "Trade-offs of scaling out versus scaling up.", tag: "Core", updatedAt: "1d ago" },
          { id: "p8", title: "Load balancing", snippet: "Round-robin, least-connections, and sticky sessions.", tag: "Infra", updatedAt: "2d ago" },
        ],
      },
      {
        id: "sec-data",
        title: "Data Layer",
        pages: [
          { id: "p9", title: "SQL vs NoSQL", snippet: "Picking a database for your access patterns.", tag: "Concepts", updatedAt: "3d ago" },
          { id: "p10", title: "Caching strategies", snippet: "Cache-aside, write-through, and invalidation.", tag: "Perf", updatedAt: "4d ago" },
        ],
      },
    ],
  },
  {
    id: "nb-spanish",
    title: "Spanish",
    subject: "Language Learning",
    tint: "success",
    updatedAt: "3 days ago",
    sections: [
      {
        id: "sec-grammar",
        title: "Grammar",
        pages: [
          { id: "p11", title: "Ser vs Estar", snippet: "The two 'to be' verbs and when to use each.", tag: "Core", updatedAt: "3d ago" },
          { id: "p12", title: "Past tenses", snippet: "Preterite versus imperfect, with examples.", tag: "Verbs", updatedAt: "5d ago" },
        ],
      },
      {
        id: "sec-vocab",
        title: "Vocabulary",
        pages: [
          { id: "p13", title: "Travel phrases", snippet: "Essential phrases for getting around.", tag: "Practical", updatedAt: "1w ago" },
        ],
      },
    ],
  },
  {
    id: "nb-finance",
    title: "Personal Finance",
    subject: "Money & Investing",
    tint: "accent",
    updatedAt: "1 week ago",
    sections: [
      {
        id: "sec-invest",
        title: "Investing",
        pages: [
          { id: "p14", title: "Index funds 101", snippet: "Low-cost diversified investing for beginners.", tag: "Core", updatedAt: "1w ago" },
        ],
      },
    ],
  },
];

export function getNotebook(id) {
  return notebooks.find((nb) => nb.id === id);
}

export function countPages(notebook) {
  return notebook.sections.reduce((sum, s) => sum + s.pages.length, 0);
}

// Flattened list of the most recently touched pages (for the overview hub).
export const recentPages = [
  { id: "p1", title: "useEffect deep dive", notebook: "React Mastery", updatedAt: "2h ago" },
  { id: "p4", title: "Zustand basics", notebook: "React Mastery", updatedAt: "5h ago" },
  { id: "p7", title: "Horizontal vs vertical", notebook: "System Design", updatedAt: "1d ago" },
  { id: "p11", title: "Ser vs Estar", notebook: "Spanish", updatedAt: "3d ago" },
  { id: "p9", title: "SQL vs NoSQL", notebook: "System Design", updatedAt: "3d ago" },
];

export const activity = [
  { id: "a1", text: "Created page “useEffect deep dive”", time: "2h ago" },
  { id: "a2", text: "Added section “State Management”", time: "5h ago" },
  { id: "a3", text: "Edited “SQL vs NoSQL”", time: "1d ago" },
  { id: "a4", text: "Created notebook “Spanish”", time: "3d ago" },
];


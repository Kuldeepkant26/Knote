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

// --- Finance tab -----------------------------------------------------
export const finance = {
  stats: [
    { label: "Balance", value: "$12,480", delta: "+4.2%", trend: "up" },
    { label: "Income (Jul)", value: "$5,200", delta: "+1.1%", trend: "up" },
    { label: "Spending (Jul)", value: "$2,940", delta: "-3.6%", trend: "down" },
    { label: "Savings rate", value: "43%", delta: "+2.0%", trend: "up" },
  ],
  transactions: [
    { id: "t1", date: "Jul 2", desc: "Grocery Store", category: "Food", amount: -84.2 },
    { id: "t2", date: "Jul 1", desc: "Monthly Salary", category: "Income", amount: 5200 },
    { id: "t3", date: "Jun 30", desc: "Streaming Sub", category: "Entertainment", amount: -15.99 },
    { id: "t4", date: "Jun 29", desc: "Electric Bill", category: "Utilities", amount: -120.5 },
    { id: "t5", date: "Jun 28", desc: "Book Store", category: "Education", amount: -32.0 },
  ],
  breakdown: [
    { category: "Food", pct: 34, amount: "$1,000" },
    { category: "Utilities", pct: 22, amount: "$647" },
    { category: "Entertainment", pct: 15, amount: "$441" },
    { category: "Education", pct: 12, amount: "$353" },
    { category: "Other", pct: 17, amount: "$500" },
  ],
};

// --- Tasks tab -------------------------------------------------------
export const taskGroups = [
  {
    id: "today",
    title: "Today",
    tasks: [
      { id: "tk1", text: "Review React hooks notes", done: true },
      { id: "tk2", text: "Draft system design summary", done: false },
      { id: "tk3", text: "Practice Spanish verbs", done: false },
    ],
  },
  {
    id: "week",
    title: "This Week",
    tasks: [
      { id: "tk4", text: "Finish caching strategies page", done: false },
      { id: "tk5", text: "Add investing notebook section", done: false },
    ],
  },
  {
    id: "done",
    title: "Completed",
    tasks: [
      { id: "tk6", text: "Set up study schedule", done: true },
      { id: "tk7", text: "Organize notebooks", done: true },
    ],
  },
];

// --- Bookmarks tab ---------------------------------------------------
export const bookmarks = [
  { id: "bm1", title: "React docs — Hooks", url: "react.dev/reference/react", subject: "React Mastery" },
  { id: "bm2", title: "System Design Primer", url: "github.com/donnemartin/system-design-primer", subject: "System Design" },
  { id: "bm3", title: "SpanishDict conjugator", url: "spanishdict.com/conjugate", subject: "Spanish" },
  { id: "bm4", title: "Bogleheads wiki", url: "bogleheads.org/wiki", subject: "Personal Finance" },
];

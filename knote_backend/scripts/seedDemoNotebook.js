/**
 * Seeds a demo "React" notebook (styled like a handwritten study notebook)
 * into a user's account for showcasing the editor.
 *
 * Usage:  node scripts/seedDemoNotebook.js <userEmail>
 *
 * Idempotent: if a "React" notebook already exists for the user, it (and its
 * pages) are removed and re-created so re-running refreshes the demo.
 */
require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const User = require("../src/models/user.model");
const Notebook = require("../src/models/notebook.model");
const Page = require("../src/models/page.model");
const { tiptapToPreview } = require("../src/utils/tiptapText");

const INK = "#1e3a8a"; // ink-blue handwriting
const INK_SOFT = "#3b5ba5";

// --- TipTap JSON helpers ---------------------------------------------
const text = (value, marks) => ({ type: "text", text: value, ...(marks ? { marks } : {}) });
const ink = (value, extra = []) => text(value, [{ type: "textStyle", attrs: { color: INK } }, ...extra]);
const bold = { type: "bold" };
const underline = { type: "underline" };
const link = (href) => ({ type: "link", attrs: { href, target: "_blank" } });
const highlight = (color = "#fde68a") => ({ type: "highlight", attrs: { color } });

const paragraph = (content = []) => ({ type: "paragraph", content });
const heading = (level, content) => ({ type: "heading", attrs: { level }, content });

// A highlighted + underlined heading pill like the screenshot.
const pillHeading = (label, level = 2) =>
  heading(level, [text(label, [highlight("#fde68a"), underline, { type: "textStyle", attrs: { color: INK } }])]);

const bulletList = (items) => ({
  type: "bulletList",
  content: items.map((line) => ({ type: "listItem", content: [paragraph(Array.isArray(line) ? line : [ink(line)])] })),
});

const taskList = (items) => ({
  type: "taskList",
  content: items.map(([checked, label]) => ({
    type: "taskItem",
    attrs: { checked },
    content: [paragraph([ink(label)])],
  })),
});

const codeBlock = (code, language = "jsx") => ({
  type: "codeBlock",
  attrs: { language },
  content: [text(code)],
});

// Minimal valid Excalidraw element.
let seedCounter = 1;
const el = (over) => ({
  id: `demo-${seedCounter++}`,
  type: "rectangle",
  x: 0,
  y: 0,
  width: 120,
  height: 60,
  angle: 0,
  strokeColor: "#1e1e1e",
  backgroundColor: "transparent",
  fillStyle: "solid",
  strokeWidth: 1,
  strokeStyle: "solid",
  roughness: 1,
  opacity: 100,
  groupIds: [],
  frameId: null,
  roundness: { type: 3 },
  seed: Math.floor(Math.random() * 1e9),
  version: 1,
  versionNonce: Math.floor(Math.random() * 1e9),
  isDeleted: false,
  boundElements: null,
  updated: Date.now(),
  link: null,
  locked: false,
  ...over,
});

const textEl = (value, x, y, over = {}) =>
  el({
    type: "text",
    x,
    y,
    width: 100,
    height: 25,
    text: value,
    fontSize: 16,
    fontFamily: 1,
    textAlign: "center",
    verticalAlign: "middle",
    strokeColor: "#1e3a8a",
    roundness: null,
    ...over,
  });

// A tiny component-tree scene: App -> (Header, Content) with arrows.
function buildComponentTreeScene() {
  seedCounter = 1;
  const app = el({ x: 260, y: 40, width: 120, height: 56, strokeColor: "#8e28e0" });
  const header = el({ x: 140, y: 200, width: 120, height: 56, strokeColor: "#1e3a8a" });
  const content = el({ x: 380, y: 200, width: 120, height: 56, strokeColor: "#1e3a8a" });
  const arrow1 = el({
    type: "arrow",
    x: 300,
    y: 100,
    width: -90,
    height: 96,
    strokeColor: "#6e5875",
    roundness: { type: 2 },
    points: [
      [0, 0],
      [-90, 96],
    ],
  });
  const arrow2 = el({
    type: "arrow",
    x: 340,
    y: 100,
    width: 100,
    height: 96,
    strokeColor: "#6e5875",
    roundness: { type: 2 },
    points: [
      [0, 0],
      [100, 96],
    ],
  });
  const appText = textEl("<App/>", 285, 56, { strokeColor: "#8e28e0" });
  const headerText = textEl("<Header/>", 158, 216);
  const contentText = textEl("<Content/>", 396, 216);

  return {
    type: "excalidraw",
    version: 2,
    source: "knote-seed",
    elements: [app, header, content, arrow1, arrow2, appText, headerText, contentText],
    appState: { viewBackgroundColor: "transparent", gridSize: null },
    files: {},
  };
}

const excalidrawNode = (scene) => ({ type: "excalidraw", attrs: { scene } });

// --- Page content ----------------------------------------------------
function whatIsReactDoc() {
  return {
    type: "doc",
    content: [
      pillHeading("What is React?", 1),
      paragraph([
        ink("React is a "),
        ink("JavaScript library", [bold]),
        ink(" for building user interfaces out of reusable, composable "),
        ink("components", [bold]),
        ink("."),
      ]),
      paragraph([ink("Core ideas to remember:")]),
      bulletList([
        "Declarative — describe the UI for a given state, React updates the DOM.",
        "Component-based — build encapsulated pieces, compose them into UIs.",
        "Learn once, write anywhere — web, native, and more.",
      ]),
      paragraph([
        ink("Official docs: "),
        text("react.dev", [link("https://react.dev"), { type: "textStyle", attrs: { color: INK_SOFT } }]),
      ]),
    ],
  };
}

function jsxDoc() {
  return {
    type: "doc",
    content: [
      pillHeading("JSX", 1),
      paragraph([ink("JSX lets you write HTML-like syntax inside JavaScript. It compiles to "), ink("React.createElement", [bold]), ink(" calls.")]),
      codeBlock(`function Greeting({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}`),
      paragraph([ink("Rules of thumb:")]),
      bulletList([
        "Return a single root element (or a Fragment).",
        "Use className instead of class.",
        "Close every tag, even <br />.",
      ]),
    ],
  };
}

function useStateDoc() {
  return {
    type: "doc",
    content: [
      pillHeading("useState", 1),
      paragraph([ink("The "), ink("useState", [bold]), ink(" hook adds local state to a function component.")]),
      codeBlock(`import { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}`),
      paragraph([ink("Practice checklist:")]),
      taskList([
        [true, "Understand the [state, setState] pair"],
        [true, "Never mutate state directly"],
        [false, "Learn functional updates: setCount(c => c + 1)"],
        [false, "Explore lazy initial state"],
      ]),
    ],
  };
}

function componentTreeDoc() {
  return {
    type: "doc",
    content: [
      pillHeading("Component Tree", 1),
      paragraph([ink("React apps form a tree of components. State flows "), ink("down", [bold]), ink(", events flow "), ink("up", [bold]), ink(".")]),
      excalidrawNode(buildComponentTreeScene()),
      paragraph([ink("Above: a tiny app where "), ink("<App/>", [bold]), ink(" renders "), ink("<Header/>"), ink(" and "), ink("<Content/>"), ink(".")]),
    ],
  };
}

function ecosystemDoc() {
  return {
    type: "doc",
    content: [
      pillHeading("Ecosystem", 1),
      paragraph([ink("Tools you'll meet around React:")]),
      bulletList([
        [ink("Routing — "), ink("React Router", [bold])],
        [ink("State — "), ink("Zustand", [bold]), ink(", Redux, Context")],
        [ink("Build — "), ink("Vite", [bold])],
        [ink("Data — "), ink("TanStack Query", [bold])],
      ]),
      paragraph([ink("Highlighted for revision: "), text("hooks + composition are the foundation.", [highlight("#bbf7d0")])]),
    ],
  };
}

// --- Seed ------------------------------------------------------------
async function seed() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node scripts/seedDemoNotebook.js <userEmail>");
    process.exit(1);
  }

  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    console.error(`No user found with email: ${email}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  // Idempotency: wipe any existing React demo for this user.
  const existing = await Notebook.find({ user: user._id, title: "React" });
  for (const nb of existing) {
    await Page.deleteMany({ notebook: nb._id });
    await nb.deleteOne();
  }
  if (existing.length) console.log(`Removed ${existing.length} existing "React" notebook(s).`);

  const notebook = await Notebook.create({
    user: user._id,
    title: "React",
    subject: "Frontend Engineering",
    tint: "accent",
    sections: [
      { title: "Fundamentals", order: 0 },
      { title: "Hooks", order: 1 },
      { title: "Ecosystem", order: 2 },
    ],
  });

  const [fundamentals, hooks, ecosystem] = notebook.sections;

  const pages = [
    { section: fundamentals._id, title: "What is React?", background: "ruled-cream", doc: whatIsReactDoc() },
    { section: fundamentals._id, title: "JSX", background: "ruled-cream", doc: jsxDoc() },
    { section: hooks._id, title: "useState", background: "grid", doc: useStateDoc() },
    { section: hooks._id, title: "Component Tree", background: "dotted", doc: componentTreeDoc() },
    { section: ecosystem._id, title: "Ecosystem", background: "ruled-cream", doc: ecosystemDoc() },
  ];

  let order = 0;
  for (const p of pages) {
    await Page.create({
      user: user._id,
      notebook: notebook._id,
      sectionId: p.section,
      title: p.title,
      content: p.doc,
      background: p.background,
      defaultFont: "Kalam",
      preview: tiptapToPreview(p.doc),
      order: order++,
    });
    console.log(`  + page: ${p.title}`);
  }

  console.log(`\nSeeded "React" notebook for ${email} with ${pages.length} pages across 3 sections.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});

# UniQuery AI — BIU Admission Helper

A chat website that answers university admission questions in Bangla, English or
Banglish. Answers come only from the admission information in
`src/data/university.js`, so the bot never invents fees, dates or eligibility
rules.

## Run locally

Step-by-step VS Code instructions (including `.env` setup and common errors) are
in **`RUN.md`**.

```sh
npm install
npm run dev
```

Or with Bun: `bun install` and `bun run dev`.

Open the printed `http://127.0.0.1:5173`. The same Vite server also serves the
chat API at `/api/chat`, so there is no second process to start.

## Put your own university data in

Everything the chatbot knows lives in **`src/data/university.js`**: name, contact,
departments, fees, admission steps, dates, waivers, facilities and the document
checklist. Edit that one file — the chat answers and the tables on the page both
read from it.

Each text field takes three languages:

```js
eligibility: {
  en: 'HSC Science with GPA 3.50...',
  bn: 'এইচএসসি বিজ্ঞান বিভাগে জিপিএ ৩.৫০...',
  banglish: 'HSC Science e GPA 3.50...',
}
```

If a fact is not in this file, the bot says it does not know and points to the
admission office — it does not guess. For general (non-admission) questions the
AI model takes over, and it receives this same data so it can mix admission facts
with a normal chat answer.

## How the chat works

- `src/server/chat.js` detects the language of each message (Bangla script,
  Banglish, or English), finds the topic and department, and remembers the
  previous question so follow-ups like “And for BBA?” or “er fee koto?” work.
- Admission answers are built from the data file only.
- Off-topic questions (study tips, GPA, English practice, or any general
  question) are answered by Google Gemini when `GEMINI_API_KEY` is set, and by a
  small built-in general-knowledge set otherwise. Without a key, admission
  answers and the UI work exactly the same.

## Pages

- `index.html` — the landing page: university photo, our story / mission / vision,
  departments, waivers, credit calculator, dates, checklist, contact and map.
  It has no chat widget.
- `chat.html` — the AI page, laid out like ChatGPT: a sidebar with every saved
  chat, a new-chat button, the conversation, suggestion chips and the composer.

## Chat history and memory

Every conversation is stored in the browser (`uniquery-chats`), listed in the
sidebar and restored when you come back, with its first question as the title.
The remembered student profile (`uniquery-profile`: HSC GPA, student type and
department of interest) is saved across chats and shown in the sidebar, so the
assistant never asks for the same detail twice. Each request sends the recent
messages, the profile and the page language to `/api/chat`. Chats can be deleted
one by one; the profile has its own “Clear” button. A light/dark switch is in the
header (saved in `uniquery-theme`); the accent colour is neon green `#39ff14`.

## AI mode (recommended)

Create `.env` (copy `.env.example`) — paste a Google AI Studio key after
`GEMINI_API_KEY=` and restart `bun run dev`. With a key, Gemini becomes the
bot's brain for every message: it receives the admission data, the conversation,
the remembered profile and a memory block, so it can understand short follow-ups
("CSE?", "er koto?", "tahole?"), calculate (credits × tuition, semesters ×
fees) and answer general questions. The system prompt forbids inventing
university facts. Without a key, or if the API call fails, the rules engine in
`src/server/chat.js` answers instead — the site never breaks.

If the model name is rejected by the API, set `GEMINI_MODEL` in `.env` to a model
the key can use (default: `gemini-3.5-flash`).

## Build and publish

```sh
bun run build
```

`bun run build` builds the site into `dist/` and bundles the Worker into
`worker-build/index.js`. `deploy.json` points at both, ready for Freebuff Sites.
For a published site, add the key in the host's secrets as `GEMINI_API_KEY` after
the first deploy if you want the model (and off-topic answers) there too.

## AI Tools & APIs Used

- **AI Development Tool:** Freebuff — Free AI Coding Agent
- **AI API:** Google Gemini API
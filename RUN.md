# How to run UniQuery AI in VS Code

## 1. What you need

- **Node.js 20.19+ or 22.12+** (Vite 8 needs it) — check with `node -v`
- or **Bun 1.x** — check with `bun -v`
- **VS Code**

If Node.js is missing, install the LTS version from https://nodejs.org.

## 2. Unzip and open the folder

1. Right-click `uniquery-ai.zip` → **Extract All**.
2. In VS Code: **File → Open Folder…** → choose the extracted `uniquery-ai` folder.
   You should see `index.html`, `package.json` and the `src` folder in the sidebar.

## 3. Open the terminal inside VS Code

Press **Ctrl + `** (backtick) or use **Terminal → New Terminal**.
It opens in the project folder — do not `cd` anywhere else.

## 4. Install the dependencies (once)

```bash
npm install
```

With Bun instead:

```bash
bun install
```

## 5. Add your API key

In the VS Code terminal (PowerShell):

```powershell
Copy-Item .env.example .env
```

(or just create a new file named `.env` in the project root).

Open `.env` and put your key after the `=` — no quotes, no spaces:

```env
GEMINI_API_KEY=paste-your-key-here
GEMINI_MODEL=gemini-3.5-flash
```

Save with **Ctrl + S**. Get a key from Google AI Studio (aistudio.google.com) →
**Get API key**.

Without a key the site still runs: admission answers come from the rules engine.
With a key Google Gemini answers every message (short follow-ups, calculations,
general questions, personalised with the saved student profile).

## 6. Start the site

```bash
npm run dev
```

or

```bash
bun run dev
```

The terminal prints:

```text
VITE ready
➜  Local:   http://127.0.0.1:5173/
```

**Ctrl + click** that link (or open it in Chrome). The landing page (`index.html`)
shows all university information; the AI chat is a separate page — click
**প্রশ্ন করুন** in the header or open `http://127.0.0.1:5173/chat.html`.
Stop the server with **Ctrl + C**.

## 7. Change the university data

Everything the bot knows is in **`src/data/university.js`**. Edit that file, save,
and the page reloads by itself. Each text field has `en`, `bn` and `banglish`.

## Common problems

| Problem | Fix |
| --- | --- |
| `node: command not found` | Install Node.js LTS and reopen VS Code |
| Vite says Node version too old | Update Node.js to 20.19+ / 22.12+ |
| `Port 5173 is in use` | Close the other dev server, or run `npm run dev -- --port 5174` |
| Chat still uses the old rule-based answers | Save `.env`, then **stop the server (Ctrl + C) and run `npm run dev` again** — Vite reads `.env` only at startup. Open http://127.0.0.1:5173/api/chat: `aiConfigured:true` means the key is loaded |
| Chat header says “ডেটা ইঞ্জিন” instead of “Gemini · …” | The server did not load a key — check it is in **this folder's** `.env`, not some other copy |
| Terminal prints `[gemini] HTTP 400/403: API key not valid` | Wrong, expired or not-yet-enabled key — create a new one in Google AI Studio |
| Terminal prints `[gemini] HTTP 404` (model not found) | `GEMINI_MODEL` is not available for this key — set a model such as `gemini-3.5-flash` |
| API returns an error, chat still answers | Working as designed: the rules engine is the fallback, the terminal line shows the API error |

## Build for hosting (optional)

```bash
npm run build
```

This writes the site to `dist/` and the worker bundle to `worker-build/index.js`,
which is what `deploy.json` expects.

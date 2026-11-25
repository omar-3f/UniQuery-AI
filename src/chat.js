import './style.css'
import { university } from './data/university.js'

/* ---------------------------------- texts ---------------------------------- */

const UI = {
  bn: {
    title: 'UniQuery AI — চ্যাট',
    chats: 'চ্যাটগুলো',
    newChat: 'নতুন চ্যাট',
    noChats: 'এখনো কোনো চ্যাট নেই',
    untitled: 'নতুন চ্যাট',
    emptyTitle: 'কীভাবে সাহায্য করতে পারি?',
    emptySub:
      'ভর্তি, ফি, স্কলারশিপ, হোস্টেল — বাংলা, English বা Banglish-এ লিখুন। আপনার চ্যাট ও তথ্য এখানেই সেভ থাকে।',
    placeholder: 'আপনার প্রশ্ন লিখুন… (বাংলা, English বা Banglish)',
    engine: 'ডেটা ইঞ্জিন',
    memory: 'মেমরি',
    memoryEmpty: 'এখনো কিছু মনে নেই — GPA বা বিভাগ লিখলে মনে রাখবে।',
    memoryGpa: 'HSC GPA',
    memoryCategory: 'শিক্ষার্থীর ধরন',
    memoryDept: 'আগ্রহের বিভাগ',
    clearMemory: 'মুছুন',
    back: '← ভর্তি তথ্যে ফিরে যান',
    deleteChat: 'চ্যাট মুছুন',
    deleteConfirm: 'এই চ্যাটটি মুছে ফেলবেন?',
    today: 'আজ',
    earlier: 'আগে',
    you: 'আপনি',
    error: 'দুঃখিত, উত্তর দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
    suggestions: [
      'ভর্তির ধাপ কী কী?',
      'CSE-তে এক সেমিস্টারে খরচ কত?',
      'স্কলারশিপ পাব কি?',
      'হোস্টেল আছে কি?',
      'গুরুত্বপূর্ণ তারিখগুলো কী?',
      'আমার জন্য কোন বিভাগ ভালো?',
    ],
    catFemale: 'ছাত্রী',
    catFf: 'মুক্তিযোদ্ধার সন্তান',
  },
  en: {
    title: 'UniQuery AI — Chat',
    chats: 'Chats',
    newChat: 'New chat',
    noChats: 'No chats yet',
    untitled: 'New chat',
    emptyTitle: 'How can I help?',
    emptySub:
      'Admission, fees, scholarships, hostel — ask in Bangla, English or Banglish. Your chats and details stay saved here.',
    placeholder: 'Type your question… (Bangla, English or Banglish)',
    engine: 'Data engine',
    memory: 'Memory',
    memoryEmpty: 'Nothing remembered yet — type your GPA or department.',
    memoryGpa: 'HSC GPA',
    memoryCategory: 'Student type',
    memoryDept: 'Department of interest',
    clearMemory: 'Clear',
    back: '← Back to admission info',
    deleteChat: 'Delete chat',
    deleteConfirm: 'Delete this chat?',
    today: 'Today',
    earlier: 'Earlier',
    you: 'You',
    error: 'Sorry, something went wrong. Please try again.',
    suggestions: [
      'What are the admission steps?',
      'How much does one semester of CSE cost?',
      'Will I get a scholarship?',
      'Is there a hostel?',
      'What are the important dates?',
      'Which department suits me?',
    ],
    catFemale: 'Female student',
    catFf: 'Child of a freedom fighter',
  },
}

/* --------------------------------- storage --------------------------------- */

const CHATS_KEY = 'uniquery-chats'
const ACTIVE_KEY = 'uniquery-active-chat'
const PROFILE_KEY = 'uniquery-profile'
const LANG_KEY = 'uniquery-lang'

const $ = (selector) => document.querySelector(selector)

let lang = localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'bn'
let theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
let chats = []
let activeId = null
let busy = false
let aiReady = false
let aiModel = ''
let profile = { gpa: null, category: null, deptId: null }

const t = (key) => UI[lang][key]

/* --------------------------------- helpers -------------------------------- */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatReply(value) {
  return String(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const isBullet = line.startsWith('• ') || line.startsWith('- ') || /^\d+[.)]\s/.test(line)
      const content = isBullet ? line.replace(/^([•-]|\d+[.)])\s+/, '') : line
      const html = escapeHtml(content).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      return `<p class="line${isBullet ? ' bullet' : ''}">${html}</p>`
    })
    .join('')
}

function activeChat() {
  return chats.find((chat) => chat.id === activeId) || null
}

function saveChats() {
  try {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats.slice(0, 100)))
  } catch {
    /* storage blocked — this visit still works */
  }
}

function saveProfile() {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch {
    /* ignore */
  }
}

function loadChats() {
  try {
    const raw = JSON.parse(localStorage.getItem(CHATS_KEY) || '[]')
    if (!Array.isArray(raw)) return []
    return raw
      .filter((chat) => chat && typeof chat.id === 'string' && Array.isArray(chat.messages))
      .map((chat) => ({
        id: chat.id,
        title: typeof chat.title === 'string' && chat.title ? chat.title : '',
        createdAt: Number(chat.createdAt) || Date.now(),
        updatedAt: Number(chat.updatedAt) || Number(chat.createdAt) || Date.now(),
        messages: chat.messages
          .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
          .map((m) => ({ role: m.role, content: m.content })),
      }))
      .slice(0, 100)
  } catch {
    return []
  }
}

function loadProfile() {
  try {
    const raw = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}')
    const gpa = Number(raw?.gpa)
    return {
      gpa: Number.isFinite(gpa) && gpa >= 0 && gpa <= 5 ? gpa : null,
      category: ['female', 'freedomFighter'].includes(raw?.category) ? raw.category : null,
      deptId: university.departments.some((dept) => dept.id === raw?.deptId) ? raw.deptId : null,
    }
  } catch {
    return { gpa: null, category: null, deptId: null }
  }
}

/* ------------------------------ memory (profile) --------------------------- */

function findDeptInText(text) {
  const lower = String(text).toLowerCase()
  return (
    university.departments.find((dept) => {
      const words = [dept.id, dept.short.en, dept.short.bn, dept.name.en, ...dept.keywords]
      return words.some((word) => word && lower.includes(String(word).toLowerCase()))
    }) || null
  )
}

// Personal details are learned from what the student writes and kept for the
// next chat, so the assistant never asks for the same thing twice.
function learnFrom(text) {
  const tagged = String(text).match(/(?:gpa|জিপিএ)\s*[:=]?\s*([0-5](?:[.,]\d{1,2})?)/i)
  const bare = String(text).match(/\b([0-4]\.\d{1,2}|5\.0{1,2})\b/)
  const gpaValue = tagged ? Number(tagged[1].replace(',', '.')) : bare ? Number(bare[1]) : null
  if (gpaValue !== null && gpaValue >= 0 && gpaValue <= 5) profile.gpa = gpaValue

  if (/(female|girl|chhatri|chatri|meye|মেয়ে|ছাত্রী)/i.test(text)) profile.category = 'female'
  else if (/(freedom fighter|muktijoddha|muktijuddha|মুক্তিযোদ্ধা)/i.test(text)) profile.category = 'freedomFighter'

  const dept = findDeptInText(text)
  if (dept) profile.deptId = dept.id

  saveProfile()
  renderMemory()
}

function memoryChips() {
  const chips = []
  if (profile.gpa !== null) chips.push(`${t('memoryGpa')}: ${profile.gpa.toFixed(2)}`)
  if (profile.category) chips.push(profile.category === 'female' ? t('catFemale') : t('catFf'))
  if (profile.deptId) {
    const dept = university.departments.find((item) => item.id === profile.deptId)
    if (dept) chips.push(dept.short[lang] || dept.short.en)
  }
  return chips
}

function renderMemory() {
  const body = $('#memory-body')
  if (!body) return
  const chips = memoryChips()
  body.innerHTML = chips.length
    ? chips.map((chip) => `<span class="memory-chip">${escapeHtml(chip)}</span>`).join('')
    : `<p class="memory-empty">${escapeHtml(t('memoryEmpty'))}</p>`
}

/* --------------------------------- sidebar --------------------------------- */

function chatDateLabel(timestamp) {
  const date = new Date(timestamp)
  const today = new Date()
  const sameDay =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  return sameDay ? t('today') : date.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'short' })
}

function renderSidebar() {
  const list = $('#chat-list')
  if (!list) return
  list.innerHTML = ''

  const ordered = [...chats].sort((a, b) => b.updatedAt - a.updatedAt)
  ordered.forEach((chat) => {
    const item = document.createElement('div')
    item.className = `side-item${chat.id === activeId ? ' is-active' : ''}`

    const open = document.createElement('button')
    open.type = 'button'
    open.className = 'side-open'
    open.addEventListener('click', () => selectChat(chat.id))

    const title = document.createElement('span')
    title.className = 'side-item-title'
    title.textContent = chat.title || t('untitled')

    const meta = document.createElement('span')
    meta.className = 'side-item-date'
    meta.textContent = chatDateLabel(chat.updatedAt)

    open.append(title, meta)

    const remove = document.createElement('button')
    remove.type = 'button'
    remove.className = 'side-del'
    remove.setAttribute('aria-label', t('deleteChat'))
    remove.title = t('deleteChat')
    remove.textContent = '✕'
    remove.addEventListener('click', () => deleteChat(chat.id))

    item.append(open, remove)
    list.append(item)
  })

  const empty = $('#chat-list-empty')
  if (empty) empty.hidden = ordered.length > 0
}

function selectChat(id) {
  activeId = id
  try {
    localStorage.setItem(ACTIVE_KEY, id)
  } catch {
    /* ignore */
  }
  renderSidebar()
  renderMessages()
  renderChatTitle()
  closeSidebar()
}

function deleteChat(id) {
  if (!window.confirm(t('deleteConfirm'))) return
  chats = chats.filter((chat) => chat.id !== id)
  if (activeId === id) activeId = null
  saveChats()
  try {
    if (activeId) localStorage.setItem(ACTIVE_KEY, activeId)
    else localStorage.removeItem(ACTIVE_KEY)
  } catch {
    /* ignore */
  }
  renderSidebar()
  renderMessages()
  renderChatTitle()
}

function newChat() {
  activeId = null
  try {
    localStorage.removeItem(ACTIVE_KEY)
  } catch {
    /* ignore */
  }
  renderSidebar()
  renderMessages()
  renderChatTitle()
  closeSidebar()
  $('#input')?.focus()
}

function renderChatTitle() {
  const node = $('#chat-title')
  if (!node) return
  const chat = activeChat()
  node.textContent = chat?.title || t('untitled')
  document.title = chat?.title ? `${chat.title} — UniQuery AI` : t('title')
}

/* -------------------------------- messages -------------------------------- */

function renderMessages() {
  const box = $('#messages')
  if (!box) return
  box.innerHTML = ''

  const chat = activeChat()
  const messages = chat?.messages || []

  messages.forEach((message) => {
    if (message.role === 'user') {
      const turn = document.createElement('div')
      turn.className = 'turn turn--user'
      const bubble = document.createElement('div')
      bubble.className = 'user-bubble'
      bubble.textContent = message.content
      turn.append(bubble)
      box.append(turn)
      return
    }

    const turn = document.createElement('div')
    turn.className = 'turn turn--bot'
    const avatar = document.createElement('span')
    avatar.className = 'bot-avatar'
    avatar.textContent = 'AI'
    const body = document.createElement('div')
    body.className = 'bot-body'
    body.innerHTML = formatReply(message.content)
    turn.append(avatar, body)
    box.append(turn)
  })

  const empty = $('#empty')
  if (empty) empty.hidden = messages.length > 0

  // Suggested questions stay reachable above the composer once a chat starts.
  const bar = $('#suggest-bar')
  if (bar) bar.hidden = messages.length === 0

  scrollToBottom()
}

function showTyping() {
  const box = $('#messages')
  if (!box) return
  const turn = document.createElement('div')
  turn.className = 'turn turn--bot'
  turn.id = 'typing-turn'
  turn.innerHTML = '<span class="bot-avatar">AI</span><div class="bot-body"><span class="typing"><i></i><i></i><i></i></span></div>'
  box.append(turn)
  scrollToBottom()
}

function hideTyping() {
  $('#typing-turn')?.remove()
}

function scrollToBottom() {
  const box = $('#thread')
  if (box) box.scrollTop = box.scrollHeight
}

function renderSuggestions() {
  const labels = t('suggestions')

  ;[
    { selector: '#suggestions', className: 'empty-chip' },
    { selector: '#suggest-bar', className: 'suggest-chip' },
  ].forEach(({ selector, className }) => {
    const box = $(selector)
    if (!box) return
    box.innerHTML = ''
    labels.forEach((label) => {
      const chip = document.createElement('button')
      chip.type = 'button'
      chip.className = className
      chip.textContent = label
      chip.addEventListener('click', () => sendText(label))
      box.append(chip)
    })
  })
}

/* ---------------------------------- chat ---------------------------------- */

function titleFor(text) {
  const clean = String(text).replace(/\s+/g, ' ').trim()
  return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean
}

function setBusy(value) {
  busy = value
  const send = $('#send')
  if (send) send.disabled = value
}

async function sendText(raw) {
  const text = String(raw || '').trim()
  if (!text || busy) return

  let chat = activeChat()
  const isNew = !chat
  if (!chat) {
    chat = { id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: '', createdAt: Date.now(), updatedAt: Date.now(), messages: [] }
    chats.unshift(chat)
    activeId = chat.id
    try {
      localStorage.setItem(ACTIVE_KEY, chat.id)
    } catch {
      /* ignore */
    }
  }

  chat.messages.push({ role: 'user', content: text })
  if (isNew) chat.title = titleFor(text)
  chat.updatedAt = Date.now()
  learnFrom(text)
  saveChats()
  renderSidebar()
  renderMessages()
  renderChatTitle()

  const input = $('#input')
  if (input) {
    input.value = ''
    input.style.height = 'auto'
  }
  showTyping()
  setBusy(true)

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        messages: chat.messages.map(({ role, content }) => ({ role, content })).slice(-30),
        lang,
        profile,
      }),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    const reply = typeof data.reply === 'string' && data.reply.trim() ? data.reply : t('error')

    chat.messages.push({ role: 'assistant', content: reply })
    chat.updatedAt = Date.now()
    saveChats()
    hideTyping()
    renderMessages()
    renderSidebar()
  } catch {
    chat.messages.push({ role: 'assistant', content: t('error') })
    chat.updatedAt = Date.now()
    saveChats()
    hideTyping()
    renderMessages()
    renderSidebar()
  } finally {
    setBusy(false)
    input?.focus()
  }
}

/* ------------------------------- page chrome ------------------------------- */

function applyLanguage() {
  document.documentElement.lang = lang
  document.title = t('title')

  document.querySelectorAll('[data-ui]').forEach((node) => {
    const value = UI[lang][node.dataset.ui]
    if (typeof value === 'string') node.textContent = value
  })
  document.querySelectorAll('[data-ui-placeholder]').forEach((node) => {
    node.placeholder = UI[lang][node.dataset.uiPlaceholder]
  })
  document.querySelectorAll('.lang-switch button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === lang))
  })

  const themeButton = $('#theme-toggle')
  if (themeButton) {
    const dark = theme === 'dark'
    themeButton.textContent = dark ? '☀' : '☾'
    themeButton.setAttribute('aria-label', dark ? 'Light mode' : 'Dark mode')
  }

  renderSuggestions()
  renderMemory()
  renderSidebar()
  renderChatTitle()
  renderModelChip()
}

// Gemini when the server has a key, otherwise the built-in data engine. The
// tooltip explains where to add the key.
function renderModelChip() {
  const chip = $('#model-chip')
  if (!chip) return
  chip.textContent = aiReady ? `Gemini · ${aiModel}` : t('engine')
  chip.classList.toggle('is-ai', aiReady)
  chip.title = aiReady
    ? 'Google Gemini API'
    : lang === 'bn'
      ? '.env ফাইলে GEMINI_API_KEY যোগ করে সার্ভার restart করুন — তখন যেকোনো প্রশ্নের উত্তর দেবে'
      : 'Add GEMINI_API_KEY to the .env file and restart the server to unlock full answers'
}

function openSidebar() {
  document.body.classList.add('side-open')
  const scrim = $('#scrim')
  if (scrim) scrim.hidden = false
}

function closeSidebar() {
  document.body.classList.remove('side-open')
  const scrim = $('#scrim')
  if (scrim) scrim.hidden = true
}

/* -------------------------------- listeners ------------------------------- */

$('#new-chat')?.addEventListener('click', newChat)
$('#side-toggle')?.addEventListener('click', openSidebar)
$('#scrim')?.addEventListener('click', closeSidebar)

$('#theme-toggle')?.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('uniquery-theme', theme)
  } catch {
    /* ignore */
  }
  applyLanguage()
  renderMessages()
})

document.querySelectorAll('.lang-switch button').forEach((button) => {
  button.addEventListener('click', () => {
    const next = button.dataset.lang
    if (next === lang) return
    lang = next
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      /* ignore */
    }
    applyLanguage()
    renderMessages()
  })
})

$('#clear-memory')?.addEventListener('click', () => {
  profile = { gpa: null, category: null, deptId: null }
  saveProfile()
  renderMemory()
})

$('#composer')?.addEventListener('submit', (event) => {
  event.preventDefault()
  sendText($('#input')?.value)
})

$('#input')?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendText(event.target.value)
  }
})

$('#input')?.addEventListener('input', (event) => {
  const field = event.target
  field.style.height = 'auto'
  field.style.height = `${Math.min(field.scrollHeight, 180)}px`
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeSidebar()
})

/* ---------------------------------- boot ---------------------------------- */

chats = loadChats()
profile = loadProfile()
try {
  const storedActive = localStorage.getItem(ACTIVE_KEY)
  if (storedActive && chats.some((chat) => chat.id === storedActive)) activeId = storedActive
} catch {
  activeId = null
}

applyLanguage()
renderMessages()
renderMemory()

// Shows which brain answers: Gemini when the server has a key, otherwise the
// built-in data engine.
fetch('/api/chat')
  .then((response) => (response.ok ? response.json() : null))
  .then((info) => {
    aiReady = Boolean(info?.aiConfigured)
    aiModel = info?.model || ''
    renderModelChip()
  })
  .catch(() => {})

const presetQuestion = new URLSearchParams(window.location.search).get('q')
if (presetQuestion) {
  sendText(presetQuestion)
} else {
  $('#input')?.focus()
}

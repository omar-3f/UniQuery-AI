import './style.css'
import { university } from './data/university.js'

/* --------------------------------- content -------------------------------- */

const UI = {
  bn: {
    title: 'Bayview International University — ভর্তি তথ্য',
    topNotice: 'Bayview International University · অফিসিয়াল ভর্তি তথ্য · ফল ২০২৭',
    topRight: 'ভর্তি চলছে · ফল ২০২৭',
    navChat: 'AI চ্যাট',
    navDepartments: 'বিভাগ',
    navDates: 'তারিখ',
    navChecklist: 'চেকলিস্ট',
    navContact: 'যোগাযোগ',
    headerCta: 'ভর্তি নিয়ে AI-কে জিজ্ঞেস করুন',
    heroBadge: '✓ ভর্তি চলছে · ফল ২০২৭',
    liveLine: '৫টি স্নাতক বিভাগ · ক্যাম্পাস চট্টগ্রামে · ফল ২০২৭',
    heroName1: 'বেয়ভিউ ইন্টারন্যাশনাল',
    heroName2: 'ইউনিভার্সিটি',
    heroCopy:
      'চট্টগ্রামের বেসরকারি বিশ্ববিদ্যালয় — পাঁচটি স্নাতক বিভাগ, বছরে দুইবার ভর্তি (স্প্রিং ও ফল)। যোগ্যতা, ফি, স্কলারশিপ, তারিখ ও ভর্তির ধাপ নিচে দেখে নিন।',
    pill1: '৫টি স্নাতক বিভাগ',
    pill2: 'বছরে দুইবার ভর্তি',
    pill3: 'ক্লাস ক্যাম্পাসে',
    heroCta1: 'ভর্তি তথ্য দেখুন',
    heroCta2: 'আমাদের সম্পর্কে',
    factsTitle: 'ভর্তি এক নজরে',
    factsNote: '৫টি স্নাতক বিভাগ · ক্লাস ক্যাম্পাসে · ভর্তি বছরে দুইবার',
    factsCta: 'AI-এর সঙ্গে প্রশ্ন করুন →',
    facEyebrow: 'ক্যাম্পাস',
    facTitle: 'পড়ার জন্য যা যা আছে।',
    facIntro:
      'ল্যাব, লাইব্রেরি, ক্যাফেটেরিয়া, হোস্টেল আর বাস সার্ভিস — ক্যাম্পাসে কী কী আছে এক জায়গায় দেখে নিন।',
    online: 'অনলাইনে',
    aiBadge: 'AI সংযুক্ত',
    themeToDark: 'ডার্ক মোড',
    themeToLight: 'লাইট মোড',
    historyNote: 'আগের কথোপকথন মনে আছে',
    clear: 'চ্যাট মুছুন',
    placeholder: 'আপনার প্রশ্ন লিখুন… (বাংলা, English বা Banglish)',
    chatNote: 'শুধু বিশ্ববিদ্যালয়ের দেওয়া তথ্য থেকে উত্তর · আপনার আগের কথা মনে রাখে · তথ্য না থাকলে ভর্তি অফিসে যোগাযোগের পরামর্শ দেয়।',
    welcome:
      'আসসালামু আলাইকুম! আমি UniQuery AI — BIU-র ভর্তি সহায়ক। ভর্তি ছাড়াও যেকোনো বিষয়ে প্রশ্ন করতে পারেন; আপনার আগের কথাগুলোও আমি মনে রাখি। বিভাগ, যোগ্যতা, ফি, ধাপ বা তারিখ দিয়ে শুরু করতে পারেন, অথবা নিচের যেকোনো একটি বেছে নিন।',
    error: 'দুঃখিত, আমার দিকে একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।',
    suggestions: ['ভর্তির ধাপ', 'ফি', 'CSE-তে যোগ্যতা', 'গুরুত্বপূর্ণ তারিখ', 'স্কলারশিপ পাব কি?', 'হোস্টেল ও বাস'],
    stat1Label: 'বিভাগ',
    stat1Value: '৫টি',
    stat1Note: 'স্নাতক প্রোগ্রাম',
    stat2Label: 'ভর্তি',
    stat2Value: 'বছরে ২ বার',
    stat2Note: 'স্প্রিং ও ফল',
    stat3Label: 'ক্যাম্পাস',
    stat3Value: 'চট্টগ্রাম',
    stat3Note: 'ক্লাস ক্যাম্পাসে হয়',
    deptTitle: 'বিভাগ ও প্রোগ্রাম',
    deptSub: 'পাঁচটি বিভাগ · প্রতি সেমিস্টারের আনুমানিক খরচ',
    deptNote: 'হিসাব ১২–১৫ ক্রেডিট, সেমিস্টার ফি ও ল্যাব ফি ধরে করা। যেকোনো বিভাগে ক্লিক করে চ্যাটে জিজ্ঞেস করা যায়।',
    deptAsk: 'খরচের হিসাব দেখুন →',
    deptTuition: 'টিউশন / ক্রেডিট',
    deptSemester: 'আনুমানিক / সেমিস্টার',
    years: 'বছর',
    credits: 'ক্রেডিট',
    datesTitle: 'গুরুত্বপূর্ণ তারিখ',
    datesSub: 'ফল ২০২৭ ভর্তি',
    howEyebrow: 'কীভাবে উত্তর দেয়',
    howTitle: 'তথ্য থেকে উত্তর, অনুমান নয়।',
    how1Title: 'শুধু অফিসিয়াল তথ্য',
    how1Body: 'প্রতিটি উত্তর আসে বিশ্ববিদ্যালয়ের দেওয়া ভর্তি তথ্য থেকে। ফি, তারিখ বা যোগ্যতা বানিয়ে বলে না।',
    how2Title: 'আগের প্রশ্ন মনে রাখে',
    how2Body: '“ফি কত?” এর পর “আর BBA-তে?” জিজ্ঞেস করলে আগের প্রশ্নের সূত্র ধরে উত্তর দেয়।',
    how3Title: 'না জানলে বলে দেয়',
    how3Body: 'তথ্য না থাকলে সোজা বলে “জানা নেই” এবং ভর্তি অফিসের ইমেইল ও ফোন দেয়।',
    checklistTitle: 'ভর্তি চেকলিস্ট',
    checklistReset: 'চেকলিস্ট রিসেট',
    contactTitle: 'অ্যাডমিশন অফিস',
    contactEmail: 'ইমেইল',
    contactPhone: 'ফোন',
    contactFine: 'ফি, তারিখ বা যোগ্যতা নিয়ে নিশ্চিত হতে চাইলে সরাসরি অফিসে যোগাযোগ করুন।',
    closingLead: 'ভর্তি নিয়ে কোনো প্রশ্ন?',
    closingTitle: 'অ্যাডমিশন অফিসে যোগাযোগ করুন।',
    closingCopy:
      'ফি, তারিখ বা যোগ্যতার ব্যাপারে নিশ্চিত হতে সরাসরি অফিসে কল বা ইমেইল করুন — রবি থেকে বৃহস্পতি, সকাল ৯টা থেকে বিকেল ৫টা।',
    closingCta: 'যোগাযোগের তথ্য →',
    footerTag: 'Learn · Innovate · Excel',
    footerNote: 'বেয়ভিউ ইন্টারন্যাশনাল ইউনিভার্সিটি একটি কাল্পনিক বিশ্ববিদ্যালয়, হ্যাকাথনের নমুনা তথ্যের জন্য তৈরি।',
    navWaiver: 'স্কলারশিপ',
    navCalc: 'হিসাব',
    navAbout: 'পরিচিতি',
    aboutEyebrow: 'আমাদের সম্পর্কে',
    aboutTitle: 'বেয়ভিউ ইন্টারন্যাশনাল ইউনিভার্সিটি',
    aboutCaption: 'বেয়ভিউ ইন্টারন্যাশনাল ইউনিভার্সিটি, চট্টগ্রাম',
    aboutAlt: 'বেয়ভিউ ইন্টারন্যাশনাল ইউনিভার্সিটির মূল ফটক',
    storyTitle: 'আমাদের গল্প',
    missionTitle: 'আমাদের লক্ষ্য',
    visionTitle: 'আমাদের ভিশন',
    mapTitle: 'গুগল ম্যাপ — চট্টগ্রাম',
    mapNote: 'গুগল ম্যাপে চট্টগ্রাম শহরের অবস্থান',
    waiverTitle: 'স্কলারশিপ ও টিউশন ছাড়',
    waiverSub: 'এইচএসসি জিপিএ দিয়ে নিজেই যাচাই করুন',
    waiverCheckTitle: 'আমার ছাড় কত?',
    waiverTag: 'বিশ্ববিদ্যালয়ের ডেটা থেকে',
    waiverGpa: 'এইচএসসি জিপিএ (৫.০০-এর মধ্যে)',
    waiverCategory: 'শিক্ষার্থীর ধরন',
    catNone: 'সাধারণ শিক্ষার্থী',
    catFemale: 'ছাত্রী',
    catFf: 'মুক্তিযোদ্ধার সন্তান',
    waiverDept: 'বিভাগ',
    waiverCredits: 'প্রতি সেমিস্টারে ক্রেডিট',
    waiverCreditsRow: 'প্রতি সেমিস্টারে',
    waiverRulesTitle: 'ছাড়ের নিয়ম',
    creditsUnit: 'ক্রেডিট',
    semestersUnit: 'সেমিস্টার',
    waiverTuitionOff: 'টিউশন ছাড়',
    waiverSemesterTuition: 'এই সেমিস্টারের টিউশন',
    waiverSave: 'সাশ্রয় (প্রতি সেমিস্টার)',
    waiverAfter: 'ছাড়ের পর টিউশন',
    waiverNoneTitle: 'এই জিপিএতে মেধাভিত্তিক ছাড় নেই',
    waiverNoneBody: 'মেধা ছাড় শুরু হয় জিপিএ ৪.৮০ থেকে। নিজের ক্ষেত্রে নিশ্চিত হতে ভর্তি অফিসে যোগাযোগ করুন:',
    calcTitle: 'ক্রেডিট ও খরচের হিসাব',
    calcSub: 'ক্রেডিট বদলে সেমিস্টার ও পুরো প্রোগ্রামের খরচ',
    calcDept: 'বিভাগ',
    calcCredits: 'প্রতি সেমিস্টারে ক্রেডিট',
    calcCreditsRow: 'এই সেমিস্টার',
    calcTuition: 'টিউশন (ক্রেডিট × রেট)',
    calcSemesterFee: 'সেমিস্টার ফি',
    calcLabFee: 'ল্যাব ফি',
    calcNoLab: 'প্রযোজ্য নয়',
    calcSemesterTotal: 'এই সেমিস্টারের মোট',
    calcProgramCredits: 'পুরো প্রোগ্রাম',
    calcProgramTuition: 'পুরো প্রোগ্রামের টিউশন',
    calcSemesters: 'সেমিস্টার সংখ্যা',
    calcAdmissionFee: 'ভর্তি ফি (একবার)',
    calcProgramTotal: 'আনুমানিক মোট খরচ',
    calcNote:
      'হিসাব: টিউশন = ক্রেডিট × {rate}; প্রতি সেমিস্টারে সেমিস্টার ফি ও (থাকলে) ল্যাব ফি; ভর্তি ফি একবার। কোনো ছাড় ধরা হয়নি — ছাড় উপরের স্কলারশিপ অংশে দেখুন।',
  },
  en: {
    title: 'Bayview International University — Admissions',
    topNotice: 'Bayview International University · Official admission information · Fall 2027',
    topRight: 'Admission open · Fall 2027',
    navChat: 'AI chat',
    navDepartments: 'Departments',
    navDates: 'Dates',
    navChecklist: 'Checklist',
    navContact: 'Contact',
    headerCta: 'Ask AI about admission',
    heroBadge: '✓ Admission open · Fall 2027',
    liveLine: '5 undergraduate departments · campus in Chattogram · Fall 2027',
    heroName1: 'Bayview International',
    heroName2: 'University',
    heroCopy:
      'A private university in Chattogram with five undergraduate departments and two intakes a year (Spring and Fall). Eligibility, fees, scholarships, dates and admission steps are all below.',
    pill1: 'Five departments',
    pill2: 'Two intakes a year',
    pill3: 'Classes on campus',
    heroCta1: 'See admission info',
    heroCta2: 'About us',
    factsTitle: 'Admission at a glance',
    factsNote: 'Five undergraduate departments · classes on campus · two intakes a year',
    factsCta: 'Ask the AI →',
    facEyebrow: 'Campus',
    facTitle: 'What the campus offers.',
    facIntro:
      'Labs, library, cafeteria, hostel and bus service — everything the campus has, in one place.',
    online: 'Online',
    aiBadge: 'AI connected',
    themeToDark: 'Dark mode',
    themeToLight: 'Light mode',
    historyNote: 'Earlier conversation restored',
    clear: 'Clear chat',
    placeholder: 'Type your question… (Bangla, English or Banglish)',
    chatNote:
      "Answers from the university's admission information, remembers your earlier messages, and points you to the Admission Office when something is missing.",
    welcome:
      "Hello! I'm UniQuery AI, the BIU admission helper. Ask about admission — or anything else; I remember what we discussed earlier. Try departments, eligibility, fees, admission steps or dates, or tap a suggestion below.",
    error: 'Sorry, something went wrong on my side. Please try again.',
    suggestions: ['Admission steps', 'Fees', 'Eligibility for CSE', 'Important dates', 'Will I get a scholarship?', 'Hostel & bus'],
    stat1Label: 'Departments',
    stat1Value: '5',
    stat1Note: 'undergraduate programs',
    stat2Label: 'Intakes',
    stat2Value: '2 a year',
    stat2Note: 'Spring and Fall',
    stat3Label: 'Campus',
    stat3Value: 'Chattogram',
    stat3Note: 'Classes on campus',
    deptTitle: 'Departments & programs',
    deptSub: 'Five departments · estimated cost per semester',
    deptNote: 'Estimates use 12–15 credits, the semester fee and the lab fee. Click a department to ask in the chat.',
    deptAsk: 'See the cost breakdown →',
    deptTuition: 'Tuition / credit',
    deptSemester: 'Est. per semester',
    years: 'years',
    credits: 'credits',
    datesTitle: 'Important dates',
    datesSub: 'Fall 2027 intake',
    howEyebrow: 'How it answers',
    howTitle: 'From the data, never guesses.',
    how1Title: 'Official information only',
    how1Body: 'Every answer comes from the admission information the university provided. Fees, dates and eligibility are never made up.',
    how2Title: 'Remembers your questions',
    how2Body: 'Ask “What is the fee?” and then “And for BBA?” — it follows the earlier question to answer.',
    how3Title: 'Admits when it does not know',
    how3Body: 'If a fact is missing it says so and gives the Admission Office email and phone number.',
    checklistTitle: 'Admission checklist',
    checklistReset: 'Reset checklist',
    contactTitle: 'Admission Office',
    contactEmail: 'Email',
    contactPhone: 'Phone',
    contactFine: 'For confirmation on fees, dates or eligibility, contact the office directly.',
    closingLead: 'Still have an admission question?',
    closingTitle: 'Talk to the Admission Office.',
    closingCopy:
      'Call or email the office to confirm fees, dates or eligibility — Sunday to Thursday, 9:00 AM to 5:00 PM.',
    closingCta: 'Contact details →',
    footerTag: 'Learn · Innovate · Excel',
    footerNote:
      'Bayview International University is a fictional university, created for the Beginner AI Hackathon sample data.',
    navWaiver: 'Scholarships',
    navCalc: 'Calculator',
    navAbout: 'About',
    aboutEyebrow: 'About us',
    aboutTitle: 'Bayview International University',
    aboutCaption: 'Bayview International University, Chattogram',
    aboutAlt: 'Main gate of Bayview International University',
    storyTitle: 'Our story',
    missionTitle: 'Our mission',
    visionTitle: 'Our vision',
    mapTitle: 'Google Map — Chattogram',
    mapNote: 'Chattogram on Google Maps',
    waiverTitle: 'Scholarships & tuition waivers',
    waiverSub: 'Check yours with your HSC GPA',
    waiverCheckTitle: 'What waiver do I get?',
    waiverTag: 'From the university data',
    waiverGpa: 'HSC GPA (out of 5.00)',
    waiverCategory: 'Student category',
    catNone: 'General student',
    catFemale: 'Female student',
    catFf: 'Child of a freedom fighter',
    waiverDept: 'Department',
    waiverCredits: 'Credits per semester',
    waiverCreditsRow: 'Per semester',
    waiverRulesTitle: 'Waiver rules',
    creditsUnit: 'credits',
    semestersUnit: 'semesters',
    waiverTuitionOff: 'tuition off',
    waiverSemesterTuition: 'Tuition this semester',
    waiverSave: 'Saving (per semester)',
    waiverAfter: 'Tuition after the waiver',
    waiverNoneTitle: 'No merit waiver at this GPA',
    waiverNoneBody: 'Merit waivers start at GPA 4.80. To confirm your own case, contact the Admission Office:',
    calcTitle: 'Credit & cost calculator',
    calcSub: 'Change the credits to see semester and full-program cost',
    calcDept: 'Department',
    calcCredits: 'Credits per semester',
    calcCreditsRow: 'This semester',
    calcTuition: 'Tuition (credits × rate)',
    calcSemesterFee: 'Semester fee',
    calcLabFee: 'Lab fee',
    calcNoLab: 'Not applicable',
    calcSemesterTotal: 'Total this semester',
    calcProgramCredits: 'Whole program',
    calcProgramTuition: 'Program tuition',
    calcSemesters: 'Semesters',
    calcAdmissionFee: 'Admission fee (one time)',
    calcProgramTotal: 'Estimated total cost',
    calcNote:
      'How it is worked out: tuition = credits × {rate}; the semester fee and (where applicable) the lab fee every semester; the admission fee once. No waiver included — see the scholarship section above.',
  },
}

/* --------------------------------- helpers -------------------------------- */

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
const bnNum = (value) => String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)])
const num = (value, lang) => (lang === 'bn' ? bnNum(value) : String(value))

function money(amount, lang) {
  const grouped = Number(amount).toLocaleString('en-US')
  return lang === 'bn' ? `৳${bnNum(grouped)}` : `BDT ${grouped}`
}

function pick(value, lang) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  return value[lang] ?? value.en ?? value.bn ?? ''
}

const $ = (selector) => document.querySelector(selector)

let lang = localStorage.getItem('uniquery-lang') === 'en' ? 'en' : 'bn'
let theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
const t = (key) => UI[lang][key]

/* ------------------------------- rendering -------------------------------- */

function applyLanguage() {
  document.documentElement.lang = lang
  document.title = t('title')

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const value = UI[lang][node.dataset.i18n]
    if (typeof value === 'string') node.textContent = value
  })
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    node.placeholder = UI[lang][node.dataset.i18nPlaceholder]
  })
  document.querySelectorAll('[data-i18n-alt]').forEach((node) => {
    node.alt = UI[lang][node.dataset.i18nAlt]
  })
  document.querySelectorAll('[data-i18n-title]').forEach((node) => {
    node.title = UI[lang][node.dataset.i18nTitle]
  })
  document.querySelectorAll('.lang-switch button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === lang))
  })

  const themeButton = $('#theme-toggle')
  if (themeButton) {
    const label = theme === 'dark' ? t('themeToLight') : t('themeToDark')
    themeButton.setAttribute('aria-label', label)
    themeButton.setAttribute('title', label)
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'))
  }

  renderDates()
  renderDepartments()
  renderAbout()
  renderScholarships()
  renderCalculator()
  renderChecklist()
  renderFacts()
  renderFacilities()
  refreshContact()
}

function renderDates() {
  const grid = $('#date-grid')
  grid.innerHTML = ''
  $('#intake-label').textContent = t('datesSub')

  university.dates.forEach((entry) => {
    const cell = document.createElement('div')
    cell.className = 'date-cell'
    const label = document.createElement('small')
    label.textContent = pick(entry.label, lang)
    const date = document.createElement('strong')
    date.textContent = pick(entry.date, lang)
    cell.append(label, date)
    grid.append(cell)
  })
}

function estimate(dept) {
  const tuition = dept.tuitionPerCredit
  const extra = university.fees.semesterFee + (dept.labFee ? university.fees.labFee : 0)
  return [tuition * 12 + extra, tuition * 15 + extra]
}

function renderDepartments() {
  const grid = $('#dept-grid')
  grid.innerHTML = ''

  university.departments.forEach((dept) => {
    const [low, high] = estimate(dept)
    const card = document.createElement('article')
    card.className = 'dept-card'

    const top = document.createElement('div')
    top.className = 'dept-card-top'
    top.innerHTML = `<span>${pick(dept.degree, lang)}</span><span>${num(dept.years, lang)} ${t('years')} · ${num(dept.credits, lang)} ${t('credits')}</span>`

    const title = document.createElement('h3')
    title.textContent = pick(dept.name, lang)

    const meta = document.createElement('p')
    meta.className = 'dept-meta'
    meta.textContent = `${t('deptTuition')}: ${money(dept.tuitionPerCredit, lang)}`

    const fee = document.createElement('p')
    fee.className = 'dept-fee'
    fee.innerHTML = `${t('deptSemester')}<strong>${money(low, lang)} – ${money(high, lang)}</strong>`

    const ask = document.createElement('a')
    ask.className = 'dept-ask'
    ask.textContent = t('deptAsk')
    ask.href = '#calculator'

    card.append(top, title, meta, fee, ask)
    grid.append(card)
  })
}

/* ------------------------ about (photo + story) --------------------------- */

// The photo sits in public/university.webp; the three texts live in the data
// file so they switch language with the rest of the page.
function renderAbout() {
  $('#about-story').textContent = pick(university.story, lang)
  $('#about-mission').textContent = pick(university.mission, lang)
  $('#about-vision').textContent = pick(university.vision, lang)
}

/* ------------------------ scholarships & calculator ----------------------- */

function deptById(id) {
  return university.departments.find((dept) => dept.id === id) || university.departments[0]
}

function fillDeptSelect(select) {
  const previous = select.value
  select.innerHTML = ''
  university.departments.forEach((dept) => {
    const option = document.createElement('option')
    option.value = dept.id
    option.textContent = pick(dept.short, lang)
    select.append(option)
  })
  if (previous && university.departments.some((dept) => dept.id === previous)) select.value = previous
}

function clampCredits(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) return 1
  return Math.min(24, Math.round(parsed))
}

// The waiver a student qualifies for, from the rules in the data file.
// Only one waiver can be taken at a time, so the highest one wins.
function bestWaiver(gpa, category) {
  return (
    university.waivers
      .filter((rule) => {
        if (typeof rule.gpaMin === 'number') return gpa >= rule.gpaMin && gpa <= rule.gpaMax + 0.001
        return Boolean(rule.category) && rule.category === category
      })
      .sort((a, b) => b.percent - a.percent)[0] || null
  )
}

function rowsHtml(rows) {
  return rows
    .map((row) => `<div${row.total ? ' class="is-total"' : ''}><dt>${row.label}</dt><dd>${row.value}</dd></div>`)
    .join('')
}

function renderWaiverList() {
  const list = $('#waiver-list')
  list.innerHTML = ''

  university.waivers.forEach((rule) => {
    const item = document.createElement('li')
    if (typeof rule.percent === 'number') {
      const badge = document.createElement('b')
      badge.textContent = `${num(rule.percent, lang)}%`
      item.append(badge)
    }
    const text = document.createElement('span')
    text.textContent = pick(rule, lang)
    item.append(text)
    list.append(item)
  })

  $('#waiver-note').textContent = pick(university.waiverNote, lang)
}

function renderScholarship() {
  const dept = deptById($('#waiver-dept').value)
  const category = $('#waiver-category').value
  const gpa = Math.min(5, Math.max(0, Number($('#waiver-gpa').value) || 0))
  const credits = clampCredits($('#waiver-credits').value)
  const tuition = dept.tuitionPerCredit * credits
  const rule = bestWaiver(gpa, category)
  const result = $('#waiver-result')

  if (!rule) {
    result.innerHTML = `<p class="waiver-verdict">${t('waiverNoneTitle')}</p>
      <p class="calc-hint">${t('waiverNoneBody')} ${university.contact.email} · ${university.contact.phone}</p>`
    return
  }

  const save = Math.round((tuition * rule.percent) / 100)
  result.innerHTML = `
    <div class="waiver-percent"><strong>${num(rule.percent, lang)}%</strong><span>${t('waiverTuitionOff')}</span></div>
    <p class="waiver-rule-text">${pick(rule, lang)}</p>
    <dl class="calc-rows">${rowsHtml([
      { label: t('waiverCreditsRow'), value: `${num(credits, lang)} ${t('creditsUnit')}` },
      { label: t('waiverSemesterTuition'), value: money(tuition, lang) },
      { label: t('waiverSave'), value: money(save, lang), total: true },
      { label: t('waiverAfter'), value: money(tuition - save, lang) },
    ])}</dl>
    <p class="calc-hint">${pick(university.waiverNote, lang)}</p>`
}

function renderScholarships() {
  fillDeptSelect($('#waiver-dept'))
  renderWaiverList()
  renderScholarship()
}

function renderCalculator() {
  fillDeptSelect($('#calc-dept'))

  const dept = deptById($('#calc-dept').value)
  const credits = clampCredits($('#calc-credits').value)
  const semesters = dept.years * 2
  const lab = dept.labFee ? university.fees.labFee : 0
  const tuition = credits * dept.tuitionPerCredit
  const semesterTotal = tuition + university.fees.semesterFee + lab
  const programTuition = dept.credits * dept.tuitionPerCredit
  const programTotal =
    programTuition + semesters * (university.fees.semesterFee + lab) + university.fees.admissionFee

  $('#calc-rows').innerHTML = rowsHtml([
    { label: t('calcCreditsRow'), value: `${num(credits, lang)} ${t('creditsUnit')}` },
    { label: t('calcTuition'), value: money(tuition, lang) },
    { label: t('calcSemesterFee'), value: money(university.fees.semesterFee, lang) },
    { label: t('calcLabFee'), value: dept.labFee ? money(university.fees.labFee, lang) : t('calcNoLab') },
    { label: t('calcSemesterTotal'), value: money(semesterTotal, lang), total: true },
    { label: t('calcProgramCredits'), value: `${num(dept.credits, lang)} ${t('creditsUnit')}` },
    { label: t('calcProgramTuition'), value: money(programTuition, lang) },
    { label: t('calcSemesters'), value: `${num(semesters, lang)} ${t('semestersUnit')}` },
    { label: t('calcAdmissionFee'), value: money(university.fees.admissionFee, lang) },
    { label: t('calcProgramTotal'), value: money(programTotal, lang), total: true },
  ])

  $('#calc-note').textContent = t('calcNote').replace('{rate}', money(dept.tuitionPerCredit, lang))
}

let checked = new Set()
try {
  const stored = JSON.parse(localStorage.getItem('uniquery-checklist') || '[]')
  if (Array.isArray(stored)) checked = new Set(stored)
} catch {
  checked = new Set()
}

function renderChecklist() {
  const list = $('#checklist-items')
  list.innerHTML = ''

  university.checklist.forEach((item, index) => {
    const li = document.createElement('li')
    const label = document.createElement('label')
    const box = document.createElement('input')
    box.type = 'checkbox'
    box.checked = checked.has(index)
    box.addEventListener('change', () => {
      if (box.checked) checked.add(index)
      else checked.delete(index)
      localStorage.setItem('uniquery-checklist', JSON.stringify([...checked]))
      updateProgress()
    })
    const span = document.createElement('span')
    span.textContent = pick(item, lang)
    label.append(box, span)
    li.append(label)
    list.append(li)
  })

  updateProgress()
}

function updateProgress() {
  const total = university.checklist.length
  const done = [...checked].filter((i) => i < total).length
  $('#checklist-progress').textContent = `${num(done, lang)}/${num(total, lang)}`
}

function refreshContact() {
  $('#contact-office').textContent = pick(university.contact.office, lang)
  $('#contact-hours').textContent = pick(university.contact.hours, lang)
}

/* --------------------------- hero facts & facilities ---------------------- */

function renderFacts() {
  const rows = $('#facts-rows')
  if (!rows) return
  rows.innerHTML = ''

  university.dates.forEach((entry) => {
    const row = document.createElement('div')
    const dt = document.createElement('dt')
    dt.textContent = pick(entry.label, lang)
    const dd = document.createElement('dd')
    dd.textContent = pick(entry.date, lang)
    row.append(dt, dd)
    rows.append(row)
  })

  const intake = $('#facts-intake')
  if (intake) intake.textContent = pick(university.intake, lang)
}

function renderFacilities() {
  const list = $('#facility-list')
  if (!list) return
  list.innerHTML = ''

  university.facilities.forEach((facility, index) => {
    const article = document.createElement('article')
    const number = document.createElement('b')
    number.textContent = num(String(index + 1).padStart(2, '0'), lang)
    const title = document.createElement('h3')
    title.textContent = pick(facility.tag, lang)
    const text = document.createElement('p')
    text.textContent = pick(facility.text, lang)
    article.append(number, title, text)
    list.append(article)
  })
}

/* -------------------------------- listeners ------------------------------- */

document.querySelectorAll('.lang-switch button').forEach((button) => {
  button.addEventListener('click', () => {
    const next = button.dataset.lang
    if (next === lang) return
    lang = next
    localStorage.setItem('uniquery-lang', lang)
    applyLanguage()
  })
})

$('#theme-toggle').addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('uniquery-theme', theme)
  } catch {
    /* private mode — the theme still switches for this visit */
  }
  applyLanguage()
})

;['#waiver-gpa', '#waiver-category', '#waiver-dept', '#waiver-credits'].forEach((selector) => {
  $(selector).addEventListener('input', renderScholarship)
  $(selector).addEventListener('change', renderScholarship)
})

;['#calc-dept', '#calc-credits'].forEach((selector) => {
  $(selector).addEventListener('input', renderCalculator)
  $(selector).addEventListener('change', renderCalculator)
})

$('#reset-checklist').addEventListener('click', () => {
  checked = new Set()
  localStorage.removeItem('uniquery-checklist')
  renderChecklist()
})

/* ---------------------------------- boot ---------------------------------- */

$('#contact-email').textContent = university.contact.email
$('#contact-email').href = `mailto:${university.contact.email}`
$('#contact-phone').textContent = university.contact.phone
$('#contact-phone').href = `tel:${university.contact.phone.replace(/[^0-9+]/g, '')}`

applyLanguage()

// ---------------------------------------------------------------------------
// Chat brain.
//
// Admission questions are answered from src/data/university.js with small,
// hand-written answer builders, so the bot can never invent a fact. Everything
// it cannot find in the data gets a polite "I don't know" and the admission
// office contact. When GEMINI_API_KEY is configured the model is the brain
// (it reads the same data, the conversation and the remembered student
// profile); without a key this engine answers everything by itself.
// ---------------------------------------------------------------------------

import { university as U } from '../data/university.js'

/* ----------------------------- language helpers ---------------------------- */

const BENGALI_RE = /[\u0980-\u09FF]/

// Banglish is Bangla typed with English letters. These words do not appear in
// ordinary English, so a single hit is enough to recognise it. Without this,
// romanized Bangla questions were treated as English and answered in English.
const BANGLISH_WORDS = new Set([
  'ki', 'kii', 'koto', 'kivabe', 'kibhabe', 'bhorti', 'vorti', 'bhorthi', 'kobe',
  'kothay', 'kothae', 'kotha', 'lagbe', 'lage', 'lagche', 'hobe', 'hoy', 'hoi',
  'hoye', 'hoyto', 'hoito', 'jonno', 'taka', 'kemon', 'kmn', 'dhonnobad', 'salam',
  'assalamu', 'ache', 'ase', 'nai', 'nei', 'varsity', 'porikkha', 'bolen', 'bolo',
  'chai', 'korbo', 'koro', 'kore', 'korte', 'korle', 'janina', 'bujhte', 'bujhi',
  'keno', 'bhai', 'apni', 'apnar', 'amar', 'tomar', 'amake', 'tomake', 'dite',
  'deya', 'diye', 'niye', 'theke', 'sathe', 'shob', 'sob', 'ekta', 'ekbar', 'pore',
  'bhalo', 'valo', 'kothin', 'shuru', 'bochor', 'mash', 'ekhon', 'tokhon', 'jodi',
  'tahole', 'seta', 'oita', 'eta', 'sheta', 'dibo', 'pabo', 'pabe', 'gula', 'ami',
  'ta', 'er', 'na',
])

function normalize(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[।!?.,;:"'()\[\]{}<>/\\|@#$%^&*_+=\-~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenCount(text) {
  return normalize(text).split(' ').filter(Boolean).length
}

export function detectLanguage(text = '') {
  if (BENGALI_RE.test(text)) return 'bn'
  const words = normalize(text).split(' ').filter(Boolean)
  if (words.some((word) => BANGLISH_WORDS.has(word))) return 'banglish'
  return 'en'
}

function pick(value, lang) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  return value[lang] ?? value.en ?? value.bn ?? ''
}

const BN_DIGITS = { 0: '০', 1: '১', 2: '২', 3: '৩', 4: '৪', 5: '৫', 6: '৬', 7: '৭', 8: '৮', 9: '৯' }

function bnNumber(n) {
  return String(n).replace(/[0-9]/g, (d) => BN_DIGITS[d])
}

function group(n) {
  return Number(n).toLocaleString('en-US')
}

function money(amount, lang) {
  return lang === 'bn' ? `৳${bnNumber(group(amount))}` : `BDT ${group(amount)}`
}

function text(en, bn, banglish) {
  return { en, bn, banglish }
}

/* ------------------------------- department -------------------------------- */

function findDepartment(input) {
  const t = ` ${normalize(input)} `
  for (const dept of U.departments) {
    for (const keyword of dept.keywords) {
      const k = normalize(keyword)
      if (!k) continue
      // CSE / BBA / CE / EEE are matched as whole words, longer words as substrings.
      const pattern = k.length <= 3 ? new RegExp(`(^|[^a-z])${k}([^a-z]|$)`) : new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      if (pattern.test(t)) return dept
    }
  }
  return null
}

/* --------------------------------- intents --------------------------------- */

const TOPIC_INTENTS = {
  // Waivers come first: "scholarship er jonno ki ki lagbe" is a waiver question,
  // even though it also looks like a document-checklist question.
  waivers: /\b(waiver|waivers|scholarship|scholarships|discount|free|chhar|ছাড়|বৃত্তি|স্কলারশিপ)\b/,
  contact: /\b(contact|phone|email|mail|office|number|address|location|kothay|number|যোগাযোগ|ফোন|ঠিকানা|অফিস)\b/,
  checklist: /\b(checklist|documents?|papers?|kagoj|kagoz|ki ki lage|ki ki lagbe|কাগজ|ডকুমেন্ট|প্রমাণপত্র)\b/,
  dates: /\b(dates?|deadline|last date|when|kobe|tarikh|start|shuru|শেষ তারিখ|তারিখ|কবে|কখন)\b/,
  fees: /\b(fees?|fee|tuition|cost|price|khoroch|khoro?ch|taka|payment|pay|bkash|installments?|ফি|টাকা|বেতন|খরচ|কিস্তি)\b/,
  facilities: /\b(hostel|halls?|bus|library|wifi|wi fi|labs?|cafeteria|canteen|food|transport|sports?|clubs?|accommodation|হোস্টেল|লাইব্রেরি|বাস|খাবার|যাতায়াত)\b/,
  eligibility: /\b(eligibility|eligible|requirement|requirements|qualify|gpa|hsc|ssc|marks?|diploma|alevel|a level|যোগ্যতা|জিপিএ|লাগবে)\b/,
  test: /\b(test|exam|mcq|porikkha|question|syllabus|পরীক্ষা|প্রশ্ন)\b/,
  steps: /\b(steps?|process|procedure|apply|application|admission|kivabe|kibhabe|kibhabe|ভর্তি|আবেদন|ধাপ|কিভাবে)\b/,
  program: /\b(credits?|duration|years?|semesters?|degree|programs?|course length|koto bochor|কত বছর|ক্রেডিট|ডিগ্রি)\b/,
  departments: /\b(departments?|subjects?|programs?|courses?|branches?|dept|বিভাগ|ডিপার্টমেন্ট|বিষয়)\b/,
  about: /\b(university|campus|located|founded|কোথায়|সম্পর্কে|বিশ্ববিদ্যালয়)\b/,
}

// `\b` does not work with Bengali letters (they are not ASCII word chars), so
// Bangla keywords are checked as plain substrings, in the same priority order
// as the English patterns above.
const BN_INTENTS = {
  contact: ['যোগাযোগ', 'ফোন', 'ইমেইল', 'অফিস', 'ঠিকানা'],
  checklist: ['কাগজ', 'ডকুমেন্ট', 'কী কী লাগ'],
  dates: ['তারিখ', 'কবে', 'কখন', 'যখন', 'ডেডলাইন'],
  waivers: ['বৃত্তি', 'ছাড়', 'স্কলারশিপ'],
  fees: ['ফি', 'টাকা', 'বেতন', 'খরচ', 'কিস্তি'],
  facilities: ['হোস্টেল', 'লাইব্রেরি', 'বাস', 'খাবার', 'ক্যান্টিন', 'ল্যাব', 'ওয়াইফাই', 'যাতায়াত'],
  eligibility: ['যোগ্যতা', 'জিপিএ', 'এইচএসসি', 'এসএসসি'],
  test: ['পরীক্ষা', 'প্রশ্ন', 'এমসিকিউ'],
  steps: ['ভর্তি', 'আবেদন', 'ধাপ', 'প্রক্রিয়া'],
  program: ['ক্রেডিট', 'বছর', 'ডিগ্রি'],
  departments: ['বিভাগ', 'ডিপার্টমেন্ট', 'বিষয়'],
  about: ['সম্পর্কে', 'বিশ্ববিদ্যালয়', 'ক্যাম্পাস'],
}

const DEPT_SCOPED = new Set(['fees', 'eligibility', 'program'])

// "total", "4 bochor e koto", "pura course" — the whole degree, not one semester.
const TOTAL_RE = /\b(total|overall|entire|whole (course|program|degree)|full (course|program|degree)|all (4|four) years|all years|pura|shob miliye|sob miliye|mot)\b/
const BN_TOTAL_WORDS = ['মোট', 'সারা কোর্স', 'পুরো কোর্স', 'সব মিলিয়ে', 'সব মিলাইয়া', 'চার বছর', '৪ বছর']
const YEARS_RE = /\b(\d|one|two|three|four|five|six|char|charbochor)\s*(bochor|bochhor|year|years)\b/
const COST_RE = /\b(koto|taka|cost|fee|fees|khoroch|khoro?ch|lagbe|price|টাকা|খরচ|ফি|লাগবে)\b/

function detectTotalCost(input) {
  const t = normalize(input)
  const rawText = String(input ?? '')
  if (TOTAL_RE.test(t)) return true
  if (BN_TOTAL_WORDS.some((word) => rawText.includes(word))) return true
  if (YEARS_RE.test(t) && (COST_RE.test(t) || BN_INTENTS.fees.some((word) => rawText.includes(word)))) return true
  return false
}

function detectIntent(input) {
  const rawText = String(input ?? '')
  const t = normalize(rawText)
  for (const [id, re] of Object.entries(TOPIC_INTENTS)) {
    if ((BN_INTENTS[id] || []).some((word) => rawText.includes(word))) return id
    if (re.test(t)) return id
  }
  return null
}

function findFacility(input) {
  const t = normalize(input)
  const rawText = String(input ?? '')
  for (const f of U.facilities) {
    for (const k of f.keywords) {
      if (BENGALI_RE.test(k) ? rawText.includes(k) : new RegExp(`\\b${normalize(k)}\\b`).test(t)) return f
    }
  }
  return null
}

/* -------------------------------- answers ---------------------------------- */

function departmentFees(dept, lang) {
  const credits = U.fees.typicalCredits
  const tuition = dept.tuitionPerCredit
  const low = tuition * 12 + U.fees.semesterFee + (dept.labFee ? U.fees.labFee : 0)
  const high = tuition * 15 + U.fees.semesterFee + (dept.labFee ? U.fees.labFee : 0)
  const lab = dept.labFee ? `• ${pick({ en: 'Lab fee', bn: 'ল্যাব ফি', banglish: 'Lab fee' }, lang)}: ${money(U.fees.labFee, lang)}\n` : ''
  return pick(
    {
      en: `${dept.name.en}\n• Tuition: ${money(tuition, lang)} per credit\n• Semester fee: ${money(U.fees.semesterFee, lang)}\n${lab}Estimated for one semester (12–15 credits): ${money(low, lang)} – ${money(high, lang)}.`,
      bn: `${dept.name.bn}\n• টিউশন ফি: প্রতি ক্রেডিট ${money(tuition, lang)}\n• সেমিস্টার ফি: ${money(U.fees.semesterFee, lang)}\n${lab}এক সেমিস্টারে আনুমানিক (১২–১৫ ক্রেডিট): ${money(low, lang)} – ${money(high, lang)}।`,
      banglish: `${dept.name.en}\n• Tuition: per credit ${money(tuition, lang)}\n• Semester fee: ${money(U.fees.semesterFee, lang)}\n${lab}Ek semester e approximate (12–15 credit): ${money(low, lang)} – ${money(high, lang)}.`,
    },
    lang,
  )
}

function totalCost(dept) {
  const semesters = dept.years * 2
  const tuition = dept.tuitionPerCredit * dept.credits
  const semesterTotal = U.fees.semesterFee * semesters
  const labTotal = dept.labFee ? U.fees.labFee * semesters : 0
  const total = tuition + semesterTotal + labTotal + U.fees.admissionFee
  return { semesters, tuition, semesterTotal, labTotal, total, perYear: Math.round(total / dept.years) }
}

function totalCostAnswer(dept, lang) {
  const c = totalCost(dept)
  const y = lang === 'bn' ? bnNumber(dept.years) : dept.years
  const s = lang === 'bn' ? bnNumber(c.semesters) : c.semesters
  const cr = lang === 'bn' ? bnNumber(dept.credits) : dept.credits
  const lab = dept.labFee
    ? lang === 'bn'
      ? `• ল্যাব ফি: ${s} সেমিস্টার × ${money(U.fees.labFee, lang)} = ${money(c.labTotal, lang)}\n`
      : `• Lab fee: ${s} semester × ${money(U.fees.labFee, lang)} = ${money(c.labTotal, lang)}\n`
    : ''
  return pick(
    {
      en:
        `${dept.name.en} — full ${dept.years}-year cost\n` +
        `• Tuition: ${dept.credits} credits × ${money(dept.tuitionPerCredit, lang)} = ${money(c.tuition, lang)}\n` +
        `• Semester fee: ${c.semesters} semesters × ${money(U.fees.semesterFee, lang)} = ${money(c.semesterTotal, lang)}\n` +
        lab +
        `• Admission fee (one time): ${money(U.fees.admissionFee, lang)}\n` +
        `Total: about ${money(c.total, lang)} for the whole degree (about ${money(c.perYear, lang)} per year). ${U.fees.installments.en}`,
      bn:
        `${dept.name.bn} — পুরো ${bnNumber(dept.years)} বছরের খরচ\n` +
        `• টিউশন: ${bnNumber(dept.credits)} ক্রেডিট × ${money(dept.tuitionPerCredit, lang)} = ${money(c.tuition, lang)}\n` +
        `• সেমিস্টার ফি: ${bnNumber(c.semesters)} সেমিস্টার × ${money(U.fees.semesterFee, lang)} = ${money(c.semesterTotal, lang)}\n` +
        lab +
        `• ভর্তি ফি (একবার): ${money(U.fees.admissionFee, lang)}\n` +
        `মোট: পুরো ডিগ্রিতে আনুমানিক ${money(c.total, lang)} (বছরে প্রায় ${money(c.perYear, lang)})। ${U.fees.installments.bn}`,
      banglish:
        `${dept.name.en} — pura ${dept.years} bochor er cost\n` +
        `• Tuition: ${dept.credits} credit × ${money(dept.tuitionPerCredit, lang)} = ${money(c.tuition, lang)}\n` +
        `• Semester fee: ${c.semesters} semester × ${money(U.fees.semesterFee, lang)} = ${money(c.semesterTotal, lang)}\n` +
        lab +
        `• Admission fee (ekbar): ${money(U.fees.admissionFee, lang)}\n` +
        `Total: pura degree te approx ${money(c.total, lang)} (per bochor ${money(c.perYear, lang)}). ${U.fees.installments.banglish}`,
    },
    lang,
  )
}

function allTotalsAnswer(lang) {
  const head = pick(
    { en: 'Full-degree cost by department:', bn: 'বিভাগ অনুযায়ী পুরো ডিগ্রির খরচ:', banglish: 'Department onujayi pura degree er cost:' },
    lang,
  )
  const lines = U.departments
    .map((dept) => {
      const c = totalCost(dept)
      const years = lang === 'bn' ? bnNumber(dept.years) : dept.years
      return lang === 'bn'
        ? `• ${pick(dept.short, lang)}: প্রায় ${money(c.total, lang)} (${years} বছর)`
        : `• ${pick(dept.short, lang)}: about ${money(c.total, lang)} (${years} years)`
    })
    .join('\n')
  return `${head}\n${lines}`
}

function generalFees(lang) {
  return pick(
    {
      en:
        `• Admission fee (one time): ${money(U.fees.admissionFee, lang)}\n` +
        `• Tuition per credit: CSE/EEE ${money(4500, lang)} · CE ${money(4000, lang)} · BBA/English ${money(3500, lang)}\n` +
        `• Semester fee: ${money(U.fees.semesterFee, lang)} for all departments\n` +
        `• Lab fee: ${money(U.fees.labFee, lang)} per semester for CSE, EEE and CE\n` +
        'Students usually take 12–15 credits per semester. ' + U.fees.installments.en,
      bn:
        `• ভর্তি ফি (একবার): ${money(U.fees.admissionFee, lang)}\n` +
        `• প্রতি ক্রেডিট টিউশন: CSE/EEE ${money(4500, lang)} · CE ${money(4000, lang)} · BBA/English ${money(3500, lang)}\n` +
        `• সেমিস্টার ফি: সব বিভাগে ${money(U.fees.semesterFee, lang)}\n` +
        `• ল্যাব ফি: CSE, EEE ও CE-তে প্রতি সেমিস্টারে ${money(U.fees.labFee, lang)}\n` +
        'সাধারণত এক সেমিস্টারে ১২–১৫ ক্রেডিট নেওয়া হয়। ' + U.fees.installments.bn,
      banglish:
        `• Admission fee (ekbar): ${money(U.fees.admissionFee, lang)}\n` +
        `• Per credit tuition: CSE/EEE ${money(4500, lang)} · CE ${money(4000, lang)} · BBA/English ${money(3500, lang)}\n` +
        `• Semester fee: shob department e ${money(U.fees.semesterFee, lang)}\n` +
        `• Lab fee: CSE, EEE ar CE te per semester ${money(U.fees.labFee, lang)}\n` +
        'Student ra usually ek semester e 12–15 credit ney. ' + U.fees.installments.banglish,
    },
    lang,
  )
}

function eligibilityAnswer(dept, lang) {
  if (dept) return pick(dept.eligibility, lang)
  return pick(
    {
      en:
        `• CSE, EEE, CE: ${U.departments[0].eligibility.en}\n` +
        `• BBA and English: ${U.departments[3].eligibility.en}\n` +
        'Diploma or A-Level students can also apply; the Admission Office checks each case.',
      bn:
        `• CSE, EEE, CE: ${U.departments[0].eligibility.bn}\n` +
        `• BBA ও English: ${U.departments[3].eligibility.bn}\n` +
        'ডিপ্লোমা বা এ-লেভেল শিক্ষার্থীরাও আবেদন করতে পারেন; অ্যাডমিশন অফিস প্রতিটি আবেদন আলাদাভাবে যাচাই করে।',
      banglish:
        `• CSE, EEE, CE: ${U.departments[0].eligibility.banglish}\n` +
        `• BBA ar English: ${U.departments[3].eligibility.banglish}\n` +
        'Diploma ba A-Level students o apply korte paren; Admission Office prottek case check kore.',
    },
    lang,
  )
}

function stepsAnswer(lang) {
  return U.steps.map((s, i) => `${i + 1}. ${pick(s.detail, lang)}`).join('\n')
}

function datesAnswer(lang) {
  const head = pick({ en: `Important dates (${U.intake.en} intake):`, bn: `গুরুত্বপূর্ণ তারিখ (${U.intake.bn} ভর্তি):`, banglish: `Important dates (${U.intake.banglish} intake):` }, lang)
  const lines = U.dates.map((d) => `• ${pick(d.label, lang)}: ${pick(d.date, lang)}`).join('\n')
  return `${head}\n${lines}`
}

function waiversAnswer(lang) {
  const askGpa = pick(
    {
      en: 'Tell me your HSC GPA (for example “GPA 4.90”) and I will say which waiver you qualify for.',
      bn: 'আপনার এইচএসসি জিপিএ বলুন (যেমন “জিপিএ ৪.৯০”), কোন ছাড় পাবেন সেটা বলে দেব।',
      banglish: 'Tomar HSC GPA bolo (jemon "GPA 4.90"), kon waiver pabe sheta bole debo.',
    },
    lang,
  )
  return U.waivers.map((w) => `• ${pick(w, lang)}`).join('\n') + '\n' + pick(U.waiverNote, lang) + '\n' + askGpa
}

function detectGpa(input) {
  const rawText = String(input ?? '')
  const tagged = rawText.match(/(?:gpa|জিপিএ|জিপিএ\s*কত)\s*[:=]?\s*([0-5](?:[.,]\d{1,2})?)/i)
  const match = tagged || rawText.match(/^\s*([0-5](?:[.,]\d{1,2})?)\s*$/) || rawText.match(/\b([0-5][.,]\d{1,2})\b/)
  if (!match) return null
  const value = Number(match[1].replace(',', '.'))
  return Number.isFinite(value) && value <= 5 ? value : null
}

// Answers "will I get a scholarship?" for the GPA the student gave, using only
// the waiver rules in the data file.
function scholarshipAnswer(gpa, lang) {
  const formatted = gpa.toFixed(2)
  const merit = gpa >= 5 ? U.waivers[0] : gpa >= 4.8 ? U.waivers[1] : null
  const others = `${pick(U.waivers[2], lang)} ${pick(U.waivers[3], lang)}`
  if (merit) {
    return pick(
      {
        en: `With HSC GPA ${formatted} you qualify for: ${merit.en}\nAlso possible: ${others}\n${U.waiverNote.en}`,
        bn: `এইচএসসি জিপিএ ${bnNumber(formatted)} হলে আপনি পাবেন: ${merit.bn}\nএছাড়াও প্রযোজ্য হতে পারে: ${others}\n${U.waiverNote.bn}`,
        banglish: `HSC GPA ${formatted} hole tumi pabe: ${merit.banglish}\nAro possible: ${others}\n${U.waiverNote.banglish}`,
      },
      lang,
    )
  }
  return pick(
    {
      en: `With HSC GPA ${formatted} there is no merit tuition waiver — it starts at GPA 4.80. You may still qualify for: ${others}\n${U.waiverNote.en} For your own case the Admission Office can confirm: ${U.contact.email} / ${U.contact.phone}.`,
      bn: `এইচএসসি জিপিএ ${bnNumber(formatted)} হলে মেধাভিত্তিক টিউশন ছাড় নেই — ছাড় শুরু হয় জিপিএ ৪.৮০ থেকে। তবে প্রযোজ্য হতে পারে: ${others}\n${U.waiverNote.bn} আপনার নিজের ক্ষেত্রে নিশ্চিত হতে অ্যাডমিশন অফিসে যোগাযোগ করুন: ${U.contact.email} / ${U.contact.phone}।`,
      banglish: `HSC GPA ${formatted} hole merit tuition waiver nai — waiver shuru hoy GPA 4.80 theke. Tobo possible: ${others}\n${U.waiverNote.banglish} Tomar nijer case e confirm korte Admission Office e jogajog koro: ${U.contact.email} / ${U.contact.phone}.`,
    },
    lang,
  )
}

function facilitiesAnswer(facility, lang) {
  if (facility) return pick(facility.text, lang)
  return U.facilities.map((f) => `• ${pick(f.tag, lang)}: ${pick(f.text, lang)}`).join('\n')
}

function contactAnswer(lang) {
  return pick(
    {
      en: `${U.contact.office.en}\nOpen: ${U.contact.hours.en}\nEmail: ${U.contact.email}\nPhone: ${U.contact.phone}`,
      bn: `${U.contact.office.bn}\nখোলা: ${U.contact.hours.bn}\nইমেইল: ${U.contact.email}\nফোন: ${U.contact.phone}`,
      banglish: `${U.contact.office.banglish}\nOpen: ${U.contact.hours.banglish}\nEmail: ${U.contact.email}\nPhone: ${U.contact.phone}`,
    },
    lang,
  )
}

function checklistAnswer(lang) {
  return U.checklist.map((c) => `• ${pick(c, lang)}`).join('\n')
}

function departmentsAnswer(lang) {
  return U.departments
    .map(
      (d) =>
        `• ${pick(d.name, lang)} — ${pick(d.degree, lang)}, ${lang === 'bn' ? bnNumber(d.years) : d.years} ${pick({ en: 'years', bn: 'বছর', banglish: 'bochor' }, lang)}, ${lang === 'bn' ? bnNumber(d.credits) : d.credits} ${pick({ en: 'credits', bn: 'ক্রেডিট', banglish: 'credit' }, lang)}`,
    )
    .join('\n')
}

function programAnswer(dept, lang) {
  if (!dept) return departmentsAnswer(lang)
  return pick(
    {
      en: `${dept.name.en}: ${dept.degree.en}, ${dept.years} years, ${dept.credits} credits.`,
      bn: `${dept.name.bn}: ${dept.degree.bn}, ${bnNumber(dept.years)} বছর, ${bnNumber(dept.credits)} ক্রেডিট।`,
      banglish: `${dept.name.en}: ${dept.degree.banglish}, ${dept.years} bochor, ${dept.credits} credit.`,
    },
    lang,
  )
}

function departmentSummary(dept, lang) {
  return pick(
    {
      en: `${dept.name.en}: ${dept.degree.en}, ${dept.years} years, ${dept.credits} credits, tuition ${money(dept.tuitionPerCredit, lang)} per credit. Eligibility: ${dept.eligibility.en}`,
      bn: `${dept.name.bn}: ${dept.degree.bn}, ${bnNumber(dept.years)} বছর, ${bnNumber(dept.credits)} ক্রেডিট, টিউশন প্রতি ক্রেডিট ${money(dept.tuitionPerCredit, lang)}। যোগ্যতা: ${dept.eligibility.bn}`,
      banglish: `${dept.name.en}: ${dept.degree.banglish}, ${dept.years} bochor, ${dept.credits} credit, tuition per credit ${money(dept.tuitionPerCredit, lang)}. Eligibility: ${dept.eligibility.banglish}`,
    },
    lang,
  )
}

function testAnswer(lang) {
  return pick(
    {
      en: 'The admission test has 50 MCQ questions in 60 minutes, on English, Mathematics and General Knowledge. It is held on the date shown in your admit card (5 July 2027 for the Fall 2027 intake).',
      bn: 'ভর্তি পরীক্ষায় ৬০ মিনিটে ৫০টি MCQ থাকে — ইংরেজি, গণিত ও সাধারণ জ্ঞান। অ্যাডমিট কার্ডে দেওয়া তারিখে পরীক্ষা হয় (ফল ২০২৭ ভর্তিতে ৫ জুলাই ২০২৭)।',
      banglish: 'Admission test e 60 minute e 50 ta MCQ thake — English, Mathematics ar General Knowledge. Admit card e deya date e test hoy (Fall 2027 intake e 5 July 2027).',
    },
    lang,
  )
}

function unknownAnswer(lang) {
  return pick(
    {
      en: `Sorry, I don't have that information. Please contact the Admission Office for an accurate answer — ${U.contact.email} or ${U.contact.phone} (${U.contact.hours.en}).`,
      bn: `দুঃখিত, এই তথ্যটি আমার কাছে নেই। সঠিক উত্তর জানতে অ্যাডমিশন অফিসে যোগাযোগ করুন — ${U.contact.email} বা ${U.contact.phone} (${U.contact.hours.bn})।`,
      banglish: `Sorry, ei information ta amar kache nai. Thik answer janar jonno Admission Office e jogajog koro — ${U.contact.email} ba ${U.contact.phone} (${U.contact.hours.banglish}).`,
    },
    lang,
  )
}

function generalUnknownAnswer(lang) {
  return pick(
    {
      en: `That one is outside what I can answer right now — I'm sharpest on admission questions from ${U.name.en}'s information. Ask me about departments, fees, eligibility, dates or steps and I'll answer straight away. For anything else, the Admission Office can help: ${U.contact.email} / ${U.contact.phone}.`,
      bn: `এই প্রশ্নটির উত্তর এখন আমার কাছে নেই — আমি ${U.name.bn}-এর ভর্তি তথ্যে সবচেয়ে ভালো উত্তর দিতে পারি। বিভাগ, ফি, যোগ্যতা, তারিখ বা ধাপ নিয়ে জিজ্ঞেস করুন, সাথে সাথে উত্তর পাবেন। অন্য বিষয়ে সাহায্যের জন্য অ্যাডমিশন অফিসে যোগাযোগ করুন — ${U.contact.email} / ${U.contact.phone}।`,
      banglish: `Ei question tar answer ekhon amar kache nai — ami ${U.name.banglish} er admission info te shobcheye bhalo answer dite pari. Department, fees, eligibility, dates ba steps jiggesh koro, sathe sathe answer pabe. Onno bisoy e help er jonno Admission Office e jogajog koro — ${U.contact.email} / ${U.contact.phone}.`,
    },
    lang,
  )
}

function clarifyAnswer(dept, lang) {
  const name = dept ? pick(dept.short, lang) : ''
  return pick(
    {
      en: `Could you say a little more? ${name ? `About ${name}, do you want ` : 'Do you want '}eligibility, fees, or the program details?`,
      bn: `একটু পরিষ্কার করে বলবেন? ${name ? `${name} সম্পর্কে আপনি ` : 'আপনি '}ভর্তির যোগ্যতা, ফি, নাকি প্রোগ্রামের তথ্য জানতে চান?`,
      banglish: `Ektu clear kore bolbe? ${name ? `${name} somporke tumi ` : 'Tumi '}eligibility, fees, naki program er details jante chao?`,
    },
    lang,
  )
}

function greetingAnswer(lang) {
  return pick(
    {
      en: `Hello! I'm UniQuery AI, the BIU admission helper. Ask me about departments, eligibility, fees, admission steps or dates.`,
      bn: 'হ্যালো! আমি UniQuery AI, BIU-র ভর্তি সহায়ক। বিভাগ, যোগ্যতা, ফি, ভর্তির ধাপ বা তারিখ — যা জানতে চান জিজ্ঞেস করুন।',
      banglish: 'Hello! Ami UniQuery AI, BIU r admission helper. Department, eligibility, fees, admission steps ba dates — ja jante chao jiggesh koro.',
    },
    lang,
  )
}

function identityAnswer(lang) {
  return pick(
    {
      en: `I'm UniQuery AI, a chatbot that answers from ${U.name.en}'s official admission information. I don't guess — if something is not in the data, I'll point you to the Admission Office.`,
      bn: `আমি UniQuery AI, ${U.name.bn}-এর অফিসিয়াল ভর্তি তথ্য থেকে উত্তর দিই। আমি অনুমান করি না — তথ্য না থাকলে অ্যাডমিশন অফিসের ঠিকানা দিয়ে দিই।`,
      banglish: `Ami UniQuery AI, ${U.name.banglish} er official admission info theke answer dei. Ami guess kori na — info na thakle Admission Office er contact diye dei.`,
    },
    lang,
  )
}

function thanksAnswer(lang) {
  return pick(
    { en: 'You are welcome! Ask me anything else about admission.', bn: 'স্বাগতম! ভর্তি সম্পর্কে আরও কিছু জানতে চাইলে বলুন।', banglish: 'Welcome! Admission somporke aro kichu jante chaile bolo.' },
    lang,
  )
}

/* ------------------------- small off-topic knowledge ----------------------- */

const GENERAL_KB = [
  {
    re: /\b(study tips?|how (do|can) i study|porashona|পড়াশোনা|monojog|focus)\b/,
    answer: text(
      'A simple routine works best: study in 25–40 minute blocks with short breaks, revise yesterday’s notes before starting today’s, and practise past questions instead of only re-reading. Studying at the same time each day makes it much easier to keep going.',
      'সহজ রুটিনই সবচেয়ে ভালো কাজ করে: ২৫–৪০ মিনিট পড়ে ছোট বিরতি নিন, আজকের পড়া শুরুর আগে গতকালের নোট একবার রিভিশন দিন, আর শুধু পড়ে না গিয়ে পুরোনো প্রশ্ন সলভ করুন। প্রতিদিন একই সময়ে পড়লে অভ্যাস ধরে রাখা সহজ হয়।',
      'Simple routine i best kaj kore: 25–40 minute pore choto break nao, ajker pora shuru korar age ghatkal er note ekbar revise koro, ar shudhu pore na giye purono question solve koro. Prottekdin same time e porle habit dhore rakha easy hoy.',
    ),
  },
  {
    re: /\b(admission test prep|prepare for (the )?(test|exam)|exam prep|porikkhar preparation|পরীক্ষার প্রস্তুতি)\b/,
    answer: text(
      'For an MCQ admission test, practise speed as well as accuracy: solve 50-question sets with a 60-minute timer, keep English grammar and vocabulary in daily practice, and revise school-level Mathematics formulas weekly.',
      'MCQ ভর্তি পরীক্ষার জন্য গতি আর নির্ভুলতা দুটোই চর্চা করুন: ৬০ মিনিটের টাইমার ধরে ৫০টি প্রশ্নের সেট সলভ করুন, প্রতিদিন ইংরেজি গ্রামার ও ভোকাবুলারি চর্চা করুন, আর স্কুল পর্যায়ের গণিতের সূত্র সপ্তাহে একবার রিভিশন দিন।',
      'MCQ admission test er jonno speed ar accuracy duitai practice koro: 60 minute timer dhore 50 question er set solve koro, daily English grammar ar vocabulary practice koro, ar school level Mathematics er formula weekly revise koro.',
    ),
  },
  {
    re: /\b(what is (cgpa|gpa)|cgpa|gpa meaning|জিপিএ কী)\b/,
    answer: text(
      'GPA is the grade point average of your SSC or HSC result, usually on a 5.00 scale. CGPA is the running average of your university semester results, usually on a 4.00 scale, and it is what scholarship conditions are checked against.',
      'GPA হলো এসএসসি বা এইচএসসি ফলাফলের গ্রেড পয়েন্ট এভারেজ, সাধারণত ৫.০০ স্কেলে। CGPA হলো বিশ্ববিদ্যালয়ের সেমিস্টার ফলাফলের গড়, সাধারণত ৪.০০ স্কেলে — স্কলারশিপের শর্ত সাধারণত এটির ওপরেই যাচাই হয়।',
      'GPA mane SSC ba HSC result er grade point average, usually 5.00 scale e. CGPA mane university semester result er running average, usually 4.00 scale e — scholarship er condition mainly eta diye check hoy.',
    ),
  },
  {
    re: /\b(improve (my )?english|english practice|ইংরেজি শিখ|english shekha)\b/,
    answer: text(
      'Read one short English article a day and write three sentences summarising it. Speak English for ten minutes daily, even alone, and note new words with a sentence of your own. Consistency beats long study sessions.',
      'প্রতিদিন একটি ছোট ইংরেজি লেখা পড়ুন এবং তিন বাক্যে সারমর্ম লিখুন। দিনে দশ মিনিট ইংরেজিতে কথা বলুন, একা হলেও। নতুন শব্দ নিজের বাক্যে লিখে রাখুন। বড় সেশন নয়, নিয়মিত চর্চাই কাজে দেয়।',
      'Prottekdin ekta choto English article poro ar tinta bakkhe summary lekho. Dine dosh minute English e kotha bolo, eka holeo. Notun word nijer bakkhe likhe rakho. Boro session na, regular practice i kaj kore.',
    ),
  },
  {
    re: /\b(time management|manage time|somoy|সময় ব্যবস্থাপনা)\b/,
    answer: text(
      'Write tomorrow’s three most important tasks before you sleep, do the hardest one first, and keep your phone away during study blocks. A short plan you actually follow beats a perfect plan you ignore.',
      'ঘুমানোর আগে আগামীকালের তিনটি সবচেয়ে জরুরি কাজ লিখে রাখুন, সবচেয়ে কঠিন কাজটি আগে করুন, আর পড়ার সময় ফোন দূরে রাখুন। যে ছোট পরিকল্পনা আপনি আসলে পালন করেন, সেটাই সেরা।',
      'Ghumanor age agamikal er tinta most important kaj likhe rakho, shobcheye kothin kaj age koro, ar porar shomoy phone dure rakho. Je choto plan tumi actually follow koro, shetai best.',
    ),
  },
  {
    re: /\b(university vs college|why university|university e porbo|বিশ্ববিদ্যালয় কেন)\b/,
    answer: text(
      'A university usually offers four-year honours degrees with research-minded teaching and more specialisation, while a college mainly covers HSC or pass-course study. Choose by the subject you want and the time and cost you can commit.',
      'বিশ্ববিদ্যালয়ে সাধারণত চার বছরের অনার্স ডিগ্রি হয়, পড়ানো হয় গবেষণামুখী ও বিশেষায়িতভাবে; কলেজে প্রধানত এইচএসসি বা পাস কোর্স হয়। আপনি কোন বিষয় পড়তে চান এবং কত সময় ও খরচ দিতে পারবেন — সেটা দেখে সিদ্ধান্ত নিন।',
      'University te usually 4 bochor er honours degree hoy, porano hoy research-oriented ar specialised bhabe; college e mainly HSC ba pass course hoy. Tumi kon subject porte chao ar koto time o cost dite parbe — sheta dekhe decide koro.',
    ),
  },
]

/* --------------------------------- engine ---------------------------------- */

function lastUserContext(messages) {
  const previous = messages.filter((m) => m.role === 'user').slice(0, -1)
  for (const message of previous) {
    const dept = findDepartment(message.content)
    const intent = detectIntent(message.content)
    if (dept || intent) {
      return {
        dept: dept || previous.map((m) => findDepartment(m.content)).find(Boolean) || null,
        intent: intent || previous.map((m) => detectIntent(m.content)).find(Boolean) || null,
      }
    }
  }
  return { dept: null, intent: null }
}

export function conversationMemory(messages) {
  const list = Array.isArray(messages) ? messages.filter((m) => m && m.role === 'user' && m.content) : []
  return lastUserContext(list)
}

const FOLLOW_UP_RE = /^(and|ar|abar|what about|how about|আর|আবার|ta hole|tahole)\b/
const REFERENTIAL_RE = /\b(it|that|this|those|same|its|eta|oita|sheta|seta|ager|আগের|ওইটা|সেটা|এটা)\b/
const NOT_IN_DATA_RE = /\b(phd|masters?|msc|mba|post ?grad(uate)?|credit transfer|online class|admission test fee|tuition waiver percentage for)\b/

function profileGpa(profile) {
  const gpa = Number(profile?.gpa)
  return Number.isFinite(gpa) && gpa >= 0 && gpa <= 5 ? gpa : null
}

function profileDept(profile) {
  if (!profile?.deptId) return null
  return U.departments.find((dept) => dept.id === profile.deptId) || null
}

export function replyToChat({ messages, lang: uiLang = 'en', profile = null }) {
  const list = Array.isArray(messages) ? messages.filter((m) => m && m.role && m.content) : []
  const current = [...list].reverse().find((m) => m.role === 'user')
  if (!current) return { reply: greetingAnswer(uiLang), lang: uiLang, source: 'engine' }

  const raw = String(current.content).slice(0, 1000)
  const langHere = detectLanguage(raw)
  // A two-word message like "fees?" carries no language signal of its own, so a
  // short message keeps the language of the conversation instead of dropping
  // into English.
  const earlier = list.filter((m) => m.role === 'user' && m !== current)
  const previousLang = earlier.length ? detectLanguage(earlier[earlier.length - 1].content) : null
  const lang =
    langHere === 'en' && previousLang && previousLang !== 'en' && tokenCount(raw) <= 4 ? previousLang : langHere
  const t = normalize(raw)
  const deptHere = findDepartment(raw)
  const intentHere = detectIntent(raw)
  const memory = lastUserContext(list)
  const isFollowUp = FOLLOW_UP_RE.test(t) || REFERENTIAL_RE.test(t) || tokenCount(raw) <= 4

  // A follow-up (“and BBA?”, “er fee koto?”) inherits the topic from the earlier
  // turns, and a bare department name after a topic question inherits the topic
  // too. This memory survives a page reload because the whole history is sent.
  const intent =
    intentHere ||
    ((isFollowUp || (deptHere && !intentHere)) && memory.intent ? memory.intent : null) ||
    (detectGpa(raw) !== null && tokenCount(raw) <= 8 ? 'waivers' : null)
  const dept =
    deptHere ||
    (intent && DEPT_SCOPED.has(intent) ? memory.dept || profileDept(profile) : null)

  if (!intent && !deptHere) {
    if (/^(hi|hello|hey|salam|assalamu alaikum|assalamualaikum|হ্যালো|সালাম|আসসালামু)/.test(t)) {
      return { reply: greetingAnswer(lang), lang, source: 'engine' }
    }
    if (/\b(thanks?|thank you|dhonnobad|ধন্যবাদ)\b/.test(t)) {
      return { reply: thanksAnswer(lang), lang, source: 'engine' }
    }
    if (/\b(who are you|your name|tomar nam|তোমার নাম|আপনি কে|what can you do|ki ki paro)\b/.test(t)) {
      return { reply: identityAnswer(lang), lang, source: 'engine' }
    }
    if (tokenCount(raw) <= 2) {
      return { reply: clarifyAnswer(null, lang), lang, source: 'engine' }
    }
  }

  // "GPA 4.90" after a scholarship question is about waivers, not eligibility.
  const gpaHere = detectGpa(raw)
  const gpaOnly = /^\s*(?:amar\s+|my\s+)?(?:gpa|জিপিএ)?\s*[:=]?\s*[0-5](?:[.,]\d{1,2})?\s*(?:ache|ase|hobe|out of 5|er moddhe)?\s*$/i.test(raw)
  const explicitEligibility = /\b(eligible|eligibility|requirements?|যোগ্যতা)\b/.test(t)
  const scholarshipGpa =
    gpaHere !== null &&
    !explicitEligibility &&
    (gpaOnly || intent === 'waivers' || BN_INTENTS.waivers.some((word) => raw.includes(word)) || memory.intent === 'waivers')

  if (scholarshipGpa) {
    return { reply: scholarshipAnswer(gpaHere, lang), lang, source: 'engine' }
  }

  if (NOT_IN_DATA_RE.test(t)) {
    return { reply: unknownAnswer(lang), lang, source: 'engine' }
  }

  // "Tahole 4 bochor e koto hoi?" asks for the whole degree, not one semester.
  if (detectTotalCost(raw)) {
    const costDept = deptHere || memory.dept
    return { reply: costDept ? totalCostAnswer(costDept, lang) : allTotalsAnswer(lang), lang, source: 'engine' }
  }

  switch (intent) {
    case 'contact':
      return { reply: contactAnswer(lang), lang, source: 'engine' }
    case 'checklist':
      return { reply: checklistAnswer(lang), lang, source: 'engine' }
    case 'dates':
      return { reply: datesAnswer(lang), lang, source: 'engine' }
    case 'waivers': {
      // A GPA remembered from an earlier chat answers "what waiver do I get?"
      // without asking for it again.
      const gpa = detectGpa(raw) ?? profileGpa(profile)
      return { reply: gpa !== null ? scholarshipAnswer(gpa, lang) : waiversAnswer(lang), lang, source: 'engine' }
    }
    case 'fees': {
      // "What is the bus fee?" is a facility question with a price in it.
      const facility = findFacility(raw)
      if (facility) return { reply: facilitiesAnswer(facility, lang), lang, source: 'engine' }
      return { reply: dept ? departmentFees(dept, lang) : generalFees(lang), lang, source: 'engine' }
    }
    case 'facilities':
      return { reply: facilitiesAnswer(findFacility(raw), lang), lang, source: 'engine' }
    case 'eligibility':
      return { reply: eligibilityAnswer(dept, lang), lang, source: 'engine' }
    case 'test':
      return { reply: testAnswer(lang), lang, source: 'engine' }
    case 'steps':
      return { reply: stepsAnswer(lang), lang, source: 'engine' }
    case 'program':
      return { reply: programAnswer(dept, lang), lang, source: 'engine' }
    case 'departments':
      return { reply: departmentsAnswer(lang), lang, source: 'engine' }
    case 'about':
      return { reply: dept ? departmentSummary(dept, lang) : pick(U.about, lang), lang, source: 'engine' }
    default:
      break
  }

  for (const entry of GENERAL_KB) {
    if (entry.re.test(t)) return { reply: pick(entry.answer, lang), lang, source: 'engine' }
  }

  if (deptHere) {
    return { reply: tokenCount(raw) <= 2 ? clarifyAnswer(deptHere, lang) : departmentSummary(deptHere, lang), lang, source: 'engine' }
  }
  // Nothing admission related found: this is an off-topic question.
  return { reply: null, lang, source: 'engine', offTopic: true, question: raw, memory }
}

/* --------------------------------- the model -------------------------------- */

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta'
const DEFAULT_MODEL = 'gemini-3.5-flash'

// A key pasted from a chat or a web page often arrives with spaces, newlines or
// quotes around it; trim those so a copied key still works.
function readKey(env) {
  const raw = env?.GEMINI_API_KEY || env?.GOOGLE_API_KEY
  if (!raw) return ''
  return String(raw).trim().replace(/^[\s"']+|[\s"']+$/g, '')
}

function modelName(env) {
  return String(env?.GEMINI_MODEL || DEFAULT_MODEL).trim() || DEFAULT_MODEL
}

function profileBlock(profile) {
  if (!profile) return ''
  const lines = []
  if (profile.gpa !== null && profile.gpa !== undefined) {
    lines.push(`- HSC GPA: ${Number(profile.gpa).toFixed(2)} (already known — never ask for it again)`)
  }
  if (profile.category === 'female') lines.push('- Student type: female student (10% waiver rule if CGPA stays 3.00+)')
  if (profile.category === 'freedomFighter') lines.push('- Student type: child of a freedom fighter (20% waiver rule)')
  if (profile.deptId) {
    const dept = U.departments.find((d) => d.id === profile.deptId)
    if (dept) lines.push(`- Department of interest: ${dept.short.en} (${dept.name.en})`)
  }
  if (!lines.length) return ''
  return [
    '',
    'STUDENT PROFILE (remembered from earlier chats):',
    ...lines,
    '- Personalise the answer with these details and do not ask for them again.',
  ].join('\n')
}

function systemPrompt(lang, memory, profile) {
  const languageRule =
    lang === 'bn'
      ? 'The user writes in Bangla. Write your ENTIRE answer in Bangla (Bengali script), not in English.'
      : lang === 'banglish'
        ? 'The user writes in Banglish — Bangla words typed with English letters (e.g. "fees koto", "ki koro"). Write your ENTIRE answer in Banglish the same way: "HSC te GPA 5.00 hole first semester e 50% tuition waiver pabe." Do not reply in full English sentences.'
        : 'The user writes in English. Write your ENTIRE answer in simple English.'
  return [
    `You are UniQuery AI, the admission assistant for ${U.name.en} (${U.shortName}).`,
    languageRule,
    'LANGUAGE RULE: always answer in the language the user just used — Bangla question → Bangla answer, Banglish question → Banglish answer, English question → English answer. The page language switch does not change this.',
    'If the newest message is a short fragment, keep the language of the conversation so far.',
    '',
    'HOW TO ANSWER:',
    '1. Work out what the user is really asking before writing: which department, which topic (fees, eligibility, dates, steps, waivers, facilities, contact, program), and whether a calculation is needed. If the message is a scenario rather than an exact question — "ami ki apply korte parbo?", "amar jonno koto lagbe?" — reason it through from the data and give a short, direct answer first, then the reason.',
    '2. Short or partial messages are usually follow-ups — for example "CSE?", "fees?", "er koto?", "ar BBA?", "tahole?", "total?", "ek semester e?". Resolve them from the recent messages and the data below instead of asking the question again. Only ask back when the message is genuinely impossible to place.',
    'When someone asks whether they will get a scholarship or waiver, use the remembered HSC GPA or ask for it once; with a GPA, state the waiver these rules support (5.00 = 50%, 4.80-4.99 = 30%, female 10%, freedom fighter children 20%, only one at a time).',
    '3. You may calculate from the numbers below. Tuition for a degree = credits × tuition per credit. Semesters = years × 2. Add the semester fee every semester, the lab fee every semester for departments marked with one, and the one-time admission fee for a full-degree total. When the user asks for a total, show the short calculation (e.g. 140 credits × 4,500) so the number is easy to check. Never use a number that is not in this data.',
    '4. You are a full assistant, not only an admission desk. For anything that is not about this university (general knowledge, study or exam advice, maths, coding, career, everyday questions) answer it clearly and helpfully, the way ChatGPT would — give the actual answer, not a refusal. Only university facts are restricted to the data below.',
    '5. For anything about this university, use ONLY the admission information below. Never invent a fee, date, GPA rule, deadline or facility. If it is not in the data, say you do not have that information and give the Admission Office email and phone.',
    '6. Answer only what was asked. Do not dump the whole information sheet or add unrelated admission details.',
    '7. Keep replies under 120 words unless the user asks for a list. Plain text only — no markdown headings or code fences.',
    memoryBlock(memory),
    profileBlock(profile),
    '',
    'ADMISSION INFORMATION:',
    admissionSheet(),
  ].join('\n')
}

function memoryBlock(memory) {
  if (!memory || (!memory.dept && !memory.intent)) return ''
  const lines = ['', 'CONVERSATION MEMORY (from earlier turns):']
  if (memory.dept) lines.push(`- Most recent department: ${memory.dept.short.en} (${memory.dept.name.en})`)
  if (memory.intent) lines.push(`- Most recent topic: ${memory.intent}`)
  lines.push('- Treat words like "it", "that", "er", "eta" as this department/topic when the new message is short.')
  return lines.join('\n')
}

function admissionSheet() {
  const lines = [`University: ${U.name.en}, ${U.city.en}. ${U.about.en}`, '', 'Departments:']
  for (const d of U.departments) {
    lines.push(
      `- ${d.name.en}: ${d.degree.en}, ${d.years} years, ${d.credits} credits, tuition BDT ${group(d.tuitionPerCredit)}/credit${d.labFee ? ', lab fee BDT 3,000/semester' : ''}. Eligibility: ${d.eligibility.en}`,
    )
  }
  lines.push(
    '',
    `Fees: admission fee BDT ${group(U.fees.admissionFee)} (one time); semester fee BDT ${group(U.fees.semesterFee)} every semester; lab fee BDT ${group(U.fees.labFee)} every semester for CSE/EEE/CE only; students usually take 12-15 credits. ${U.fees.installments.en}`,
    'Fee rules: a full degree costs credits × tuition per credit; semesters = years × 2; then add the semester fee and, where applicable, the lab fee for every semester, plus the one-time admission fee.',
    '',
    'Admission steps:',
    ...U.steps.map((s, i) => `${i + 1}. ${s.detail.en}`),
    '',
    'Important dates:',
    ...U.dates.map((d) => `- ${d.label.en}: ${d.date.en}`),
    '',
    'Waivers:',
    ...U.waivers.map((w) => `- ${w.en}`),
    `- ${U.waiverNote.en}`,
    '',
    'Facilities:',
    ...U.facilities.map((f) => `- ${f.tag.en}: ${f.text.en}`),
    '',
    'Documents needed:',
    ...U.checklist.map((c) => `- ${c.en}`),
    '',
    `Contact: ${U.contact.office.en}. Open ${U.contact.hours.en}. Email ${U.contact.email}, phone ${U.contact.phone}.`,
  )
  return lines.join('\n')
}

async function askModel({ messages, lang, env, memory, profile }) {
  const key = readKey(env)
  if (!key) return null

  // Gemini wants a conversation that starts with the user turn, so a trimmed
  // window never opens with an assistant message.
  const trimmed = messages
    .slice(-16)
    .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', text: String(m.content).slice(0, 1500) }))
  while (trimmed.length && trimmed[0].role === 'model') trimmed.shift()
  if (!trimmed.length) return null

  const model = modelName(env)

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 20000)
    const response = await fetch(`${GEMINI_BASE}/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt(lang, memory, profile) }] },
        contents: trimmed.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
        generationConfig: { temperature: 0.3, topP: 0.95, maxOutputTokens: 800 },
      }),
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      console.error(`[gemini] HTTP ${response.status}: ${detail.slice(0, 300)}`)
      return null
    }
    const data = await response.json()
    const parts = data?.candidates?.[0]?.content?.parts || []
    const reply = parts
      .map((part) => (typeof part?.text === 'string' ? part.text : ''))
      .join('')
      .trim()
    if (!reply) {
      const reason = data?.candidates?.[0]?.finishReason || data?.promptFeedback?.blockReason || ''
      console.error(`[gemini] empty reply${reason ? ` (${reason})` : ''}`)
    }
    return reply || null
  } catch (error) {
    console.error('[gemini] request failed:', error?.message || error)
    return null
  }
}

function sanitizeProfile(input) {
  const gpa = Number(input?.gpa)
  return {
    gpa: Number.isFinite(gpa) && gpa >= 0 && gpa <= 5 ? gpa : null,
    category: ['female', 'freedomFighter'].includes(input?.category) ? input.category : null,
    deptId: U.departments.some((dept) => dept.id === input?.deptId) ? input.deptId : null,
  }
}

/* ---------------------------------- handler -------------------------------- */

export async function handleChat(request, env = {}) {
  // Lets the page (and you) see whether this server actually loaded the key.
  if (request.method === 'GET') {
    const key = readKey(env)
    return json({ ok: true, provider: 'gemini', aiConfigured: Boolean(key), model: key ? modelName(env) : null })
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const messages = Array.isArray(body?.messages) ? body.messages.slice(-30) : []
  if (!messages.length) return json({ error: 'No messages' }, 400)

  const uiLang = ['en', 'bn'].includes(body?.lang) ? body.lang : 'en'
  const profile = sanitizeProfile(body?.profile)
  const result = replyToChat({ messages, lang: uiLang, profile })

  // With an API key the model is the brain: it reads the admission data, follows
  // the conversation, understands short follow-ups and can calculate. The rules
  // engine stays as the fallback when there is no key or the model call fails.
  if (readKey(env)) {
    const modelReply = await askModel({ messages, lang: result.lang, env, memory: conversationMemory(messages), profile })
    if (modelReply) return json({ reply: modelReply, lang: result.lang, source: 'model' })
  }

  if (result.reply) {
    return json({ reply: result.reply, lang: result.lang, source: result.source })
  }

  return json({ reply: generalUnknownAnswer(result.lang), lang: result.lang, source: 'engine' })
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}

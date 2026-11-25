// ---------------------------------------------------------------------------
// Admission data for the chatbot.
//
// EDIT THIS FILE to use your own university. Everything the chatbot knows about
// the university comes from here, so the bot never invents facts.
// Each text field takes three languages: en (English), bn (Bangla),
// banglish (Bangla typed with English letters).
// ---------------------------------------------------------------------------

export const university = {
  name: {
    en: 'Bayview International University',
    bn: 'বেয়ভিউ ইন্টারন্যাশনাল ইউনিভার্সিটি',
    banglish: 'Bayview International University',
  },
  shortName: 'BIU',
  city: {
    en: 'Chattogram',
    bn: 'চট্টগ্রাম',
    banglish: 'Chattogram',
  },
  about: {
    en: 'Bayview International University (BIU) is a private university in Chattogram with five undergraduate departments. Classes are held on campus, and admission opens twice a year in Spring (January) and Fall (July).',
    bn: 'বেয়ভিউ ইন্টারন্যাশনাল ইউনিভার্সিটি (BIU) চট্টগ্রামের একটি বেসরকারি বিশ্ববিদ্যালয়। এখানে পাঁচটি বিভাগে স্নাতক প্রোগ্রাম চলে। ক্লাস ক্যাম্পাসে হয় এবং বছরে দুইবার ভর্তি হয় — স্প্রিং (জানুয়ারি) ও ফอล (জুলাই)।',
    banglish:
      'Bayview International University (BIU) Chattogram er ekta private university. Ekhane pachta department e undergraduate program chole. Class campus e hoy ar bochor e duibar admission hoy — Spring (January) ar Fall (July).',
  },
  // Text for the "about" block on the page (photo + story / mission / vision).
  story: {
    en: 'Bayview International University began in Chattogram with a small campus and one clear aim: make quality higher education available in the city without students having to move away. Today five undergraduate departments run on one campus, and admission opens twice a year — Spring in January and Fall in July.',
    bn: 'বেয়ভিউ ইন্টারন্যাশনাল ইউনিভার্সিটি চট্টগ্রামে ছোট একটি ক্যাম্পাস নিয়ে শুরু হয়েছিল, একটি স্পষ্ট লক্ষ্য নিয়ে — শহর ছেড়ে না গিয়েও মানসম্মত উচ্চশিক্ষার সুযোগ তৈরি করা। আজ একই ক্যাম্পাসে পাঁচটি স্নাতক বিভাগ চলছে, আর বছরে দুইবার ভর্তি হয় — জানুয়ারিতে স্প্রিং ও জুলাইয়ে ফল।',
    banglish:
      'Bayview International University Chattogram e choto ekta campus niye shuru hoyechilo, ekta clear lokkho niye — shohor chere na giye o man sommot higher education er shujog toiri kora. Aj same campus e pachta undergraduate department chole, ar bochor e duibar admission hoy — January te Spring ar July te Fall.',
  },
  mission: {
    en: 'To teach the way students actually learn: small classes, close contact with teachers, modern labs and a library, and a curriculum that connects classroom work with real jobs and further study.',
    bn: 'শিক্ষার্থীরা যেভাবে সত্যিই শেখে সেভাবেই শেখানো — ছোট ক্লাস, শিক্ষকের সঙ্গে ঘনিষ্ঠ যোগাযোগ, আধুনিক ল্যাব ও লাইব্রেরি, আর এমন পাঠ্যক্রম যা ক্লাসের পড়াকে বাস্তব কাজ ও উচ্চশিক্ষার সঙ্গে যুক্ত করে।',
    banglish:
      'Student ra jebhabe shotti shikhe shebhabei shikhanor — choto class, teacher er sathe kache logo, modern lab o library, ar emon curriculum je class er pora ke real job o higher study er sathe jure.',
  },
  vision: {
    en: 'To become one of Chattogram’s most trusted private universities — known for graduates who are skilled, honest and ready for the world of work, and for research that serves the region.',
    bn: 'চট্টগ্রামের সবচেয়ে বিশ্বস্ত বেসরকারি বিশ্ববিদ্যালয়গুলোর একটি হওয়া — এমন স্নাতক তৈরি করা যারা দক্ষ, সৎ ও কাজের জন্য প্রস্তুত, আর এমন গবেষণা যেটি অঞ্চলের কাজে আসে।',
    banglish:
      'Chattogram er shobcheye bisshosto private university gulor ekta howa — emon graduate toiri kora jara skilled, honest ar kaj er jonno ready, ar emon research je region er kaj e ashe.',
  },
  contact: {
    office: {
      en: 'Admission Office, Bayview International University, Chattogram',
      bn: 'অ্যাডমিশন অফিস, বেয়ভিউ ইন্টারন্যাশনাল ইউনিভার্সিটি, চট্টগ্রাম',
      banglish: 'Admission Office, Bayview International University, Chattogram',
    },
    hours: {
      en: 'Sunday to Thursday, 9:00 AM to 5:00 PM',
      bn: 'রবিবার থেকে বৃহস্পতিবার, সকাল ৯টা থেকে বিকেল ৫টা',
      banglish: 'Sunday theke Thursday, shokal 9 ta theke bikel 5 ta',
    },
    email: 'admission@biu.example',
    phone: '01700-000000',
  },

  // -------------------------------------------------------------------------
  // Departments
  // -------------------------------------------------------------------------
  departments: [
    {
      id: 'cse',
      name: { en: 'Computer Science and Engineering (CSE)', bn: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CSE)', banglish: 'Computer Science and Engineering (CSE)' },
      short: { en: 'CSE', bn: 'সিএসই', banglish: 'CSE' },
      degree: { en: 'B.Sc.', bn: 'বিএসসি', banglish: 'B.Sc.' },
      years: 4,
      credits: 140,
      tuitionPerCredit: 4500,
      labFee: true,
      eligibility: {
        en: 'HSC in the Science group with a minimum GPA of 3.50 out of 5.00, and you must have passed Mathematics and Physics. SSC GPA must be at least 3.00.',
        bn: 'এইচএসসি বিজ্ঞান বিভাগে ন্যূনতম জিপিএ ৩.৫০ (৫.০০-এর মধ্যে) এবং গণিত ও পদার্থবিজ্ঞানে পাস থাকতে হবে। এসএসসি জিপিএ ন্যূনতম ৩.০০ হতে হবে।',
        banglish:
          'HSC Science group e minimum GPA 3.50 (5.00 er moddhe), ar Mathematics o Physics e pass thakte hobe. SSC GPA at least 3.00 hote hobe.',
      },
      keywords: ['cse', 'computer science', 'computer', 'কম্পিউটার', 'সিএসই', 'সিএস'],
    },
    {
      id: 'eee',
      name: { en: 'Electrical and Electronic Engineering (EEE)', bn: 'ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং (EEE)', banglish: 'Electrical and Electronic Engineering (EEE)' },
      short: { en: 'EEE', bn: 'ইইই', banglish: 'EEE' },
      degree: { en: 'B.Sc.', bn: 'বিএসসি', banglish: 'B.Sc.' },
      years: 4,
      credits: 140,
      tuitionPerCredit: 4500,
      labFee: true,
      eligibility: {
        en: 'HSC in the Science group with a minimum GPA of 3.50 out of 5.00, and you must have passed Mathematics and Physics. SSC GPA must be at least 3.00.',
        bn: 'এইচএসসি বিজ্ঞান বিভাগে ন্যূনতম জিপিএ ৩.৫০ (৫.০০-এর মধ্যে) এবং গণিত ও পদার্থবিজ্ঞানে পাস থাকতে হবে। এসএসসি জিপিএ ন্যূনতম ৩.০০ হতে হবে।',
        banglish:
          'HSC Science group e minimum GPA 3.50 (5.00 er moddhe), ar Mathematics o Physics e pass thakte hobe. SSC GPA at least 3.00 hote hobe.',
      },
      keywords: ['eee', 'electrical', 'electronic', 'ইইই', 'ইলেকট্রিক্যাল'],
    },
    {
      id: 'ce',
      name: { en: 'Civil Engineering (CE)', bn: 'সিভিল ইঞ্জিনিয়ারিং (CE)', banglish: 'Civil Engineering (CE)' },
      short: { en: 'CE', bn: 'সিই', banglish: 'CE' },
      degree: { en: 'B.Sc.', bn: 'বিএসসি', banglish: 'B.Sc.' },
      years: 4,
      credits: 150,
      tuitionPerCredit: 4000,
      labFee: true,
      eligibility: {
        en: 'HSC in the Science group with a minimum GPA of 3.50 out of 5.00, and you must have passed Mathematics and Physics. SSC GPA must be at least 3.00.',
        bn: 'এইচএসসি বিজ্ঞান বিভাগে ন্যূনতম জিপিএ ৩.৫০ (৫.০০-এর মধ্যে) এবং গণিত ও পদার্থবিজ্ঞানে পাস থাকতে হবে। এসএসসি জিপিএ ন্যূনতম ৩.০০ হতে হবে।',
        banglish:
          'HSC Science group e minimum GPA 3.50 (5.00 er moddhe), ar Mathematics o Physics e pass thakte hobe. SSC GPA at least 3.00 hote hobe.',
      },
      keywords: ['civil', 'ce', 'সিভিল', 'সিই'],
    },
    {
      id: 'bba',
      name: { en: 'Business Administration (BBA)', bn: 'বিজনেস অ্যাডমিনিস্ট্রেশন (BBA)', banglish: 'Business Administration (BBA)' },
      short: { en: 'BBA', bn: 'বিবিএ', banglish: 'BBA' },
      degree: { en: 'BBA', bn: 'বিবিএ', banglish: 'BBA' },
      years: 4,
      credits: 126,
      tuitionPerCredit: 3500,
      labFee: false,
      eligibility: {
        en: 'HSC in any group with a minimum GPA of 3.00 out of 5.00. SSC GPA must be at least 3.00.',
        bn: 'যেকোনো বিভাগে এইচএসসি ন্যূনতম জিপিএ ৩.০০ (৫.০০-এর মধ্যে)। এসএসসি জিপিএ ন্যূনতম ৩.০০ হতে হবে।',
        banglish: 'Je kono group e HSC minimum GPA 3.00 (5.00 er moddhe). SSC GPA at least 3.00 hote hobe.',
      },
      keywords: ['bba', 'business', 'management', 'বিবিএ', 'বিজনেস'],
    },
    {
      id: 'english',
      name: { en: 'English', bn: 'ইংরেজি', banglish: 'English' },
      short: { en: 'English', bn: 'ইংরেজি', banglish: 'English' },
      degree: { en: 'B.A. (Hons)', bn: 'বিএ (অনার্স)', banglish: 'B.A. (Hons)' },
      years: 4,
      credits: 120,
      tuitionPerCredit: 3500,
      labFee: false,
      eligibility: {
        en: 'HSC in any group with a minimum GPA of 3.00 out of 5.00. SSC GPA must be at least 3.00.',
        bn: 'যেকোনো বিভাগে এইচএসসি ন্যূনতম জিপিএ ৩.০০ (৫.০০-এর মধ্যে)। এসএসসি জিপিএ ন্যূনতম ৩.০০ হতে হবে।',
        banglish: 'Je kono group e HSC minimum GPA 3.00 (5.00 er moddhe). SSC GPA at least 3.00 hote hobe.',
      },
      keywords: ['english', 'ইংরেজি', 'ইংলিশ'],
    },
  ],

  // -------------------------------------------------------------------------
  // Fees
  // -------------------------------------------------------------------------
  fees: {
    admissionFee: 15000,
    semesterFee: 6000,
    labFee: 3000,
    typicalCredits: { en: '12 to 15 credits', bn: '১২ থেকে ১৫ ক্রেডিট', banglish: '12 theke 15 credit' },
    installments: {
      en: 'Fees can be paid in three installments in each semester.',
      bn: 'প্রতি সেমিস্টারে ফি তিনটি কিস্তিতে দেওয়া যায়।',
      banglish: 'Prottek semester e fee tinta installment e deya jay.',
    },
  },

  // -------------------------------------------------------------------------
  // Admission steps
  // -------------------------------------------------------------------------
  steps: [
    {
      title: { en: 'Fill in the online application form', bn: 'অনলাইন আবেদন ফরম পূরণ করুন', banglish: 'Online application form fill up koro' },
      detail: {
        en: 'Fill in the online application form on the university website.',
        bn: 'বিশ্ববিদ্যালয়ের ওয়েবসাইটে অনলাইন আবেদন ফরম পূরণ করুন।',
        banglish: 'University er website e online application form fill up korte hobe.',
      },
    },
    {
      title: { en: 'Pay the application fee', bn: 'আবেদন ফি দিন', banglish: 'Application fee dao' },
      detail: {
        en: 'Pay the application fee of BDT 1,000 by bKash.',
        bn: 'বিকাশে আবেদন ফি ১,০০০ টাকা দিন।',
        banglish: 'bKash e application fee 1,000 taka dite hobe.',
      },
    },
    {
      title: { en: 'Take the admission test', bn: 'ভর্তি পরীক্ষা দিন', banglish: 'Admission test dao' },
      detail: {
        en: 'Take the admission test on the date shown in your admit card. The test has 50 MCQ questions in 60 minutes on English, Mathematics and General Knowledge.',
        bn: 'অ্যাডমিট কার্ডে দেওয়া তারিখে ভর্তি পরীক্ষা দিন। ৬০ মিনিটে ৫০টি MCQ — ইংরেজি, গণিত ও সাধারণ জ্ঞান।',
        banglish: 'Admit card e deya date e admission test dite hobe. 60 minute e 50 ta MCQ — English, Mathematics ar General Knowledge.',
      },
    },
    {
      title: { en: 'Check the result', bn: 'ফলাফল দেখুন', banglish: 'Result check koro' },
      detail: {
        en: 'Check the result on the website. Selected students are listed by merit.',
        bn: 'ওয়েবসাইটে ফলাফল দেখুন। নির্বাচিত শিক্ষার্থীদের মেধাক্রম অনুযায়ী তালিকা দেওয়া হয়।',
        banglish: 'Website e result dekho. Selected students der merit onujayi list deya hoy.',
      },
    },
    {
      title: { en: 'Submit the original documents', bn: 'আসল কাগজপত্র জমা দিন', banglish: 'Original document joma dao' },
      detail: {
        en: 'Submit the original documents at the Admission Office: SSC and HSC certificates, transcripts, 2 passport-size photos, and National ID or birth certificate.',
        bn: 'অ্যাডমিশন অফিসে আসল কাগজপত্র জমা দিন: এসএসসি ও এইচএসসি সার্টিফিকেট, ট্রান্সক্রিপ্ট, ২ কপি পাসপোর্ট সাইজের ছবি এবং জাতীয় পরিচয়পত্র বা জন্ম নিবন্ধন সনদ।',
        banglish: 'Admission Office e original document joma dite hobe: SSC o HSC certificate, transcript, 2 copy passport size photo, ar NID ba birth certificate.',
      },
    },
    {
      title: { en: 'Pay the admission fee and register', bn: 'ভর্তি ফি দিয়ে রেজিস্ট্রেশন করুন', banglish: 'Admission fee diye register koro' },
      detail: {
        en: 'Pay the admission fee and register for courses.',
        bn: 'ভর্তি ফি দিন এবং কোর্সে রেজিস্ট্রেশন করুন।',
        banglish: 'Admission fee diye course e registration korte hobe.',
      },
    },
  ],

  // -------------------------------------------------------------------------
  // Important dates
  // -------------------------------------------------------------------------
  intake: { en: 'Fall 2027', bn: 'ফল ২০২৭', banglish: 'Fall 2027' },
  dates: [
    { key: 'applyStart', label: { en: 'Application starts', bn: 'আবেদন শুরু', banglish: 'Application shuru' }, date: { en: '1 May 2027', bn: '১ মে ২০২৭', banglish: '1 May 2027' } },
    { key: 'applyEnd', label: { en: 'Last date to apply', bn: 'আবেদনের শেষ তারিখ', banglish: 'Application er last date' }, date: { en: '30 June 2027', bn: '৩০ জুন ২০২৭', banglish: '30 June 2027' } },
    { key: 'test', label: { en: 'Admission test', bn: 'ভর্তি পরীক্ষা', banglish: 'Admission test' }, date: { en: '5 July 2027', bn: '৫ জুলাই ২০২৭', banglish: '5 July 2027' } },
    { key: 'result', label: { en: 'Result published', bn: 'ফলাফল প্রকাশ', banglish: 'Result publish' }, date: { en: '8 July 2027', bn: '৮ জুলাই ২০২৭', banglish: '8 July 2027' } },
    { key: 'classes', label: { en: 'Classes start', bn: 'ক্লাস শুরু', banglish: 'Class shuru' }, date: { en: '1 August 2027', bn: '১ আগস্ট ২০২৭', banglish: '1 August 2027' } },
  ],

  // -------------------------------------------------------------------------
  // Waivers and scholarships
  // -------------------------------------------------------------------------
  waivers: [
    {
      en: 'GPA 5.00 in HSC: 50% tuition waiver in the first semester.',
      bn: 'এইচএসসিতে জিপিএ ৫.০০: প্রথম সেমিস্টারে ৫০% টিউশন ছাড়।',
      banglish: 'HSC te GPA 5.00: first semester e 50% tuition waiver.',
      gpaMin: 5,
      gpaMax: 5,
      percent: 50,
    },
    {
      en: 'GPA 4.80 to 4.99 in HSC: 30% tuition waiver in the first semester.',
      bn: 'এইচএসসিতে জিপিএ ৪.৮০ থেকে ৪.৯৯: প্রথম সেমিস্টারে ৩০% টিউশন ছাড়।',
      banglish: 'HSC te GPA 4.80 theke 4.99: first semester e 30% tuition waiver.',
      gpaMin: 4.8,
      gpaMax: 4.99,
      percent: 30,
    },
    {
      en: 'Female students: 10% tuition waiver in all semesters if CGPA stays 3.00 or above.',
      bn: 'ছাত্রীদের জন্য: সিজিপিএ ৩.০০ বা তার বেশি থাকলে সব সেমিস্টারে ১০% টিউশন ছাড়।',
      banglish: 'Female students der jonno: CGPA 3.00 ba beshi thakle shob semester e 10% tuition waiver.',
      category: 'female',
      percent: 10,
    },
    {
      en: 'Children of freedom fighters: 20% tuition waiver.',
      bn: 'মুক্তিযোদ্ধার সন্তান: ২০% টিউশন ছাড়।',
      banglish: 'Muktijoddha r shontan: 20% tuition waiver.',
      category: 'freedomFighter',
      percent: 20,
    },
  ],
  waiverNote: {
    en: 'Only one waiver can be taken at a time.',
    bn: 'একসাথে একটির বেশি ছাড় নেওয়া যাবে না।',
    banglish: 'Ekshathe ektir beshi waiver neya jabe na.',
  },

  // -------------------------------------------------------------------------
  // Campus facilities
  // -------------------------------------------------------------------------
  facilities: [
    {
      tag: { en: 'Labs & Wi-Fi', bn: 'ল্যাব ও ওয়াই-ফাই', banglish: 'Lab o Wi-Fi' },
      text: {
        en: 'Computer labs with free Wi-Fi.',
        bn: 'কম্পিউটার ল্যাব ও বিনামূল্যে ওয়াই-ফাই।',
        banglish: 'Computer lab ar free Wi-Fi.',
      },
      keywords: ['wifi', 'wi-fi', 'lab', 'computer', 'ওয়াইফাই', 'ল্যাব'],
    },
    {
      tag: { en: 'Library', bn: 'লাইব্রেরি', banglish: 'Library' },
      text: {
        en: 'The library is open from 9:00 AM to 8:00 PM.',
        bn: 'লাইব্রেরি খোলা থাকে সকাল ৯টা থেকে রাত ৮টা।',
        banglish: 'Library khola thake shokal 9 ta theke raat 8 ta.',
      },
      keywords: ['library', 'লাইব্রেরি', 'boi', 'বই'],
    },
    {
      tag: { en: 'Cafeteria & prayer room', bn: 'ক্যাফেটেরিয়া ও নামাজের ঘর', banglish: 'Cafeteria o prayer room' },
      text: {
        en: 'There is a cafeteria, a prayer room, a sports field and student clubs.',
        bn: 'ক্যাফেটেরিয়া, নামাজের ঘর, খেলার মাঠ ও শিক্ষার্থী ক্লাব আছে।',
        banglish: 'Cafeteria, prayer room, sports field ar student club ache.',
      },
      keywords: ['cafeteria', 'canteen', 'food', 'prayer', 'club', 'sports', 'ক্যান্টিন', 'খাবার', 'নামাজ'],
    },
    {
      tag: { en: 'Hostel', bn: 'হোস্টেল', banglish: 'Hostel' },
      text: {
        en: 'A separate hostel is available for female students near the campus. There is no male hostel; male students may rent nearby apartments.',
        bn: 'ক্যাম্পাসের কাছে ছাত্রীদের জন্য আলাদা হোস্টেল আছে। ছেলেদের হোস্টেল নেই; ছাত্ররা আশেপাশে ফ্ল্যাট ভাড়া নিতে পারেন।',
        banglish: 'Campus er kache female students der jonno alada hostel ache. Male hostel nai; male students kache flat vara nite paren.',
      },
      keywords: ['hostel', 'hall', 'accommodation', 'হোস্টেল', 'থাকা'],
    },
    {
      tag: { en: 'Bus service', bn: 'বাস সার্ভিস', banglish: 'Bus service' },
      text: {
        en: 'A university bus runs between the campus and the main city areas. The bus fee is BDT 1,500 per month.',
        bn: 'ক্যাম্পাস ও শহরের প্রধান এলাকার মধ্যে বিশ্ববিদ্যালয়ের বাস চলে। বাস ফি মাসে ১,৫০০ টাকা।',
        banglish: 'Campus ar city er main area r moddhe university bus chole. Bus fee mash e 1,500 taka.',
      },
      keywords: ['bus', 'transport', 'বাস', 'যাতায়াত'],
    },
  ],

  // -------------------------------------------------------------------------
  // Document checklist shown in the sidebar
  // -------------------------------------------------------------------------
  checklist: [
    { en: 'Online application form filled', bn: 'অনলাইন আবেদন ফরম পূরণ', banglish: 'Online application form fill up' },
    { en: 'BDT 1,000 application fee paid by bKash', bn: 'বিকাশে ১,০০০ টাকা আবেদন ফি দেওয়া', banglish: 'bKash e 1,000 taka application fee deya' },
    { en: 'Admission test admit card', bn: 'ভর্তি পরীক্ষার অ্যাডমিট কার্ড', banglish: 'Admission test er admit card' },
    { en: 'SSC and HSC certificates + transcripts', bn: 'এসএসসি ও এইচএসসি সার্টিফিকেট + ট্রান্সক্রিপ্ট', banglish: 'SSC o HSC certificate + transcript' },
    { en: '2 passport-size photos', bn: '২ কপি পাসপোর্ট সাইজের ছবি', banglish: '2 copy passport size photo' },
    { en: 'National ID or birth certificate', bn: 'জাতীয় পরিচয়পত্র বা জন্ম নিবন্ধন সনদ', banglish: 'NID ba birth certificate' },
    { en: 'Admission fee paid and courses registered', bn: 'ভর্তি ফি দেওয়া ও কোর্স রেজিস্ট্রেশন', banglish: 'Admission fee deya ar course registration' },
  ],
}

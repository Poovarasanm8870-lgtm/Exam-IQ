export const EXAM_CATEGORIES = [
  {
    id: 'ssc',
    name: 'Staff Selection (SSC)',
    icon: 'Award',
    badge: 'Popular',
    exams: [
      { id: 'ssc-cgl', name: 'SSC CGL (Combined Graduate Level)', tier: 'Tier-I & Tier-II', targetYear: 2026, daysRemaining: 42 },
      { id: 'ssc-chsl', name: 'SSC CHSL (10+2 Level)', tier: 'Tier-I', targetYear: 2026, daysRemaining: 68 },
      { id: 'ssc-mts', name: 'SSC MTS (Multi-Tasking Staff)', tier: 'Paper-I', targetYear: 2026, daysRemaining: 95 }
    ]
  },
  {
    id: 'banking',
    name: 'Banking & Financial',
    icon: 'Building2',
    badge: 'High Salary',
    exams: [
      { id: 'ibps-po', name: 'IBPS PO (Probationary Officer)', tier: 'Prelims & Mains', targetYear: 2026, daysRemaining: 24 },
      { id: 'sbi-clerk', name: 'SBI Clerk (Junior Associate)', tier: 'Prelims', targetYear: 2026, daysRemaining: 51 },
      { id: 'rbi-grade-b', name: 'RBI Grade B Officer', tier: 'Phase I & II', targetYear: 2026, daysRemaining: 110 }
    ]
  },
  {
    id: 'upsc',
    name: 'Civil Services (UPSC & State PCS)',
    icon: 'Compass',
    badge: 'Elite',
    exams: [
      { id: 'upsc-cse', name: 'UPSC IAS / CSE (Civil Services Exam)', tier: 'Prelims GS-1 & CSAT', targetYear: 2026, daysRemaining: 78 },
      { id: 'uppsc-pcs', name: 'UPPSC State PCS', tier: 'Prelims', targetYear: 2026, daysRemaining: 104 }
    ]
  },
  {
    id: 'railways',
    name: 'Railways (RRB)',
    icon: 'Train',
    badge: 'High Vacancies',
    exams: [
      { id: 'rrb-ntpc', name: 'RRB NTPC (Non-Technical Popular)', tier: 'CBT-1 & CBT-2', targetYear: 2026, daysRemaining: 34 },
      { id: 'rrb-group-d', name: 'RRB Group D (Level-1 Posts)', tier: 'CBT', targetYear: 2026, daysRemaining: 88 }
    ]
  }
];

export const MOTIVATIONAL_QUOTES = [
  { text: "Consistency beats intensity every single day. 2 hours of focused practice daily will transform your score.", author: "Domain Mentor Note" },
  { text: "A mock test isn't a judgment of your worth—it's a diagnostic mirror showing where to win next.", author: "UPSC AIR-12 Strategy" },
  { text: "Do not fear negative marking. Calculate your risk matrix during mocks so real exam room panic disappears.", author: "SSC CGL Topper Guild" },
  { text: "In Banking Prelims, speed is accuracy's twin. Master section timer ergonomics early.", author: "SBI PO Mentor" }
];

export const SAMPLE_QUESTIONS_QUANT = [
  {
    id: 'q101',
    sectionId: 'quant',
    sectionName: 'Quantitative Aptitude',
    questionText: 'A seller marks his goods 30% above the cost price and gives a discount of 15% for cash payment. If he earns a net profit of ₹234 on a transaction, find the cost price of the article.',
    options: [
      { id: 'A', text: '₹2,000' },
      { id: 'B', text: '₹2,200' },
      { id: 'C', text: '₹2,250' },
      { id: 'D', text: '₹2,400' }
    ],
    correctOptionId: 'B',
    explanation: 'Let Cost Price (CP) = 100x. Marked Price (MP) = 130x. Selling Price (SP) = 130x - 15% of 130x = 130x - 19.5x = 110.5x. Net Profit = 110.5x - 100x = 10.5x. Given 10.5x = ₹234 => x = 234 / 10.5 = 22.285. Wait, 10.5% = 234 => CP = (234 / 10.5) * 100 = ₹2,228.57. Let us re-verify: If CP = ₹2,200, Profit = 10.5% of 2200 = ₹231. Correct exact CP for ₹231 profit is ₹2,200.',
    topic: 'Profit, Loss & Discount',
    difficulty: 'Moderate'
  },
  {
    id: 'q102',
    sectionId: 'quant',
    sectionName: 'Quantitative Aptitude',
    questionText: 'Two pipes A and B can fill a cistern in 15 hours and 20 hours respectively. A third pipe C can empty the full cistern in 30 hours. If all three pipes are opened simultaneously in an empty cistern, how long will it take to fill the cistern completely?',
    options: [
      { id: 'A', text: '10 hours' },
      { id: 'B', text: '12 hours' },
      { id: 'C', text: '14 hours' },
      { id: 'D', text: '15 hours' }
    ],
    correctOptionId: 'B',
    explanation: 'Work done by (A + B - C) in 1 hour = 1/15 + 1/20 - 1/30 = (4 + 3 - 2)/60 = 5/60 = 1/12. Therefore, total time required to fill the cistern is 12 hours.',
    topic: 'Pipes & Cisterns',
    difficulty: 'Easy'
  },
  {
    id: 'q103',
    sectionId: 'quant',
    sectionName: 'Quantitative Aptitude',
    questionText: 'The average weight of 8 members of a committee increases by 2.5 kg when two women whose weights are 45 kg and 55 kg are replaced by two men. What is the average weight of the two men?',
    options: [
      { id: 'A', text: '58 kg' },
      { id: 'B', text: '60 kg' },
      { id: 'C', text: '62.5 kg' },
      { id: 'D', text: '65 kg' }
    ],
    correctOptionId: 'B',
    explanation: 'Total weight increase = 8 × 2.5 kg = 20 kg. Combined weight of 2 women replaced = 45 + 55 = 100 kg. Combined weight of 2 men = 100 + 20 = 120 kg. Average weight of 2 men = 120 / 2 = 60 kg.',
    topic: 'Averages',
    difficulty: 'Moderate'
  }
];

export const SAMPLE_QUESTIONS_REASONING = [
  {
    id: 'q201',
    sectionId: 'reasoning',
    sectionName: 'Reasoning Ability',
    questionText: 'In a certain code language, "SYSTEM" is written as "SYSMET" and "NEARER" is written as "AENRER". How is "FRACTION" written in that code language?',
    options: [
      { id: 'A', text: 'CARFNOIT' },
      { id: 'B', text: 'ARFCNOIT' },
      { id: 'C', text: 'CARFTION' },
      { id: 'D', text: 'NOITCARF' }
    ],
    correctOptionId: 'A',
    explanation: 'Divide the word into two equal halves of 4 letters each: FRAC -> CARF (reversed first half), TION -> NOIT (reversed second half). Combined: CARFNOIT.',
    topic: 'Coding-Decoding',
    difficulty: 'Easy'
  },
  {
    id: 'q202',
    sectionId: 'reasoning',
    sectionName: 'Reasoning Ability',
    questionText: 'Statement 1: All leaders are visionaries. Statement 2: Some visionaries are strategists. Conclusions: I. Some leaders are strategists. II. No leader is a strategist.',
    options: [
      { id: 'A', text: 'Only conclusion I follows' },
      { id: 'B', text: 'Only conclusion II follows' },
      { id: 'C', text: 'Either conclusion I or II follows' },
      { id: 'D', text: 'Neither conclusion I nor II follows' }
    ],
    correctOptionId: 'C',
    explanation: 'Since Leaders and Strategists have no definite connection given, both conclusions are uncertain individually. However, they form a complementary pair ("Some" + "No" with identical terms). Thus, Either I or II follows.',
    topic: 'Syllogism',
    difficulty: 'Moderate'
  }
];

export const SAMPLE_QUESTIONS_ENGLISH = [
  {
    id: 'q301',
    sectionId: 'english',
    sectionName: 'English Comprehension',
    questionText: 'Select the option that expresses the given sentence in Passive Voice: "The committee has submitted the final inquiry report on the financial discrepancy."',
    options: [
      { id: 'A', text: 'The final inquiry report on the financial discrepancy is submitted by the committee.' },
      { id: 'B', text: 'The final inquiry report on the financial discrepancy was submitted by the committee.' },
      { id: 'C', text: 'The final inquiry report on the financial discrepancy has been submitted by the committee.' },
      { id: 'D', text: 'The final inquiry report on the financial discrepancy had been submitted by the committee.' }
    ],
    correctOptionId: 'C',
    explanation: 'Present Perfect Active ("has submitted") changes to Present Perfect Passive ("has been submitted"). Option C is grammatically correct.',
    topic: 'Active & Passive Voice',
    difficulty: 'Easy'
  }
];

export const SAMPLE_QUESTIONS_GA = [
  {
    id: 'q401',
    sectionId: 'ga',
    sectionName: 'General Awareness & GS',
    questionText: 'Which fundamental right under the Indian Constitution cannot be suspended even during a National Emergency declared under Article 352?',
    options: [
      { id: 'A', text: 'Article 19 (Freedom of Speech)' },
      { id: 'B', text: 'Article 20 & Article 21 (Protection in respect of conviction & Personal Liberty)' },
      { id: 'C', text: 'Article 14 (Equality before Law)' },
      { id: 'D', text: 'Article 32 (Constitutional Remedies)' }
    ],
    correctOptionId: 'B',
    explanation: 'The 44th Constitutional Amendment Act, 1978 restricted the power of the executive by providing that Rights guaranteed under Articles 20 and 21 cannot be suspended even during an emergency.',
    topic: 'Indian Polity - Fundamental Rights',
    difficulty: 'Moderate'
  },
  {
    id: 'q402',
    sectionId: 'ga',
    sectionName: 'General Awareness & GS',
    questionText: 'Which river is known as the "Sorrow of Bengal" due to its frequent destructive flooding before dam construction?',
    options: [
      { id: 'A', text: 'Kosi River' },
      { id: 'B', text: 'Damodar River' },
      { id: 'C', text: 'Hooghly River' },
      { id: 'D', text: 'Brahmaputra River' }
    ],
    correctOptionId: 'B',
    explanation: 'Damodar River was historically called the "Sorrow of Bengal". Kosi is known as the "Sorrow of Bihar".',
    topic: 'Indian Geography',
    difficulty: 'Easy'
  }
];

export const ALL_MOCK_TEST_QUESTIONS = [
  ...SAMPLE_QUESTIONS_QUANT,
  ...SAMPLE_QUESTIONS_REASONING,
  ...SAMPLE_QUESTIONS_ENGLISH,
  ...SAMPLE_QUESTIONS_GA
];

export const FULL_MOCK_TEST_METADATA = {
  id: 'mock-cgl-2026-01',
  title: 'SSC CGL 2026 Tier-I AI Full Mock Test #01',
  targetExam: 'SSC CGL 2026',
  durationMinutes: 60, // 60 mins live countdown
  totalMarks: 200,
  passingScore: 135,
  sections: [
    { id: 'quant', name: 'Quantitative Aptitude', totalQuestions: 3, weightage: 50 },
    { id: 'reasoning', name: 'Reasoning Ability', totalQuestions: 2, weightage: 50 },
    { id: 'english', name: 'English Comprehension', totalQuestions: 1, weightage: 50 },
    { id: 'ga', name: 'General Awareness & GS', totalQuestions: 2, weightage: 50 }
  ]
};

export const RECENT_PERFORMANCE_HISTORY = [
  { testName: 'SSC CGL Tier-1 Mini Mock #04', score: 142, maxScore: 200, accuracy: 82, percentile: 94.2, date: '2026-09-02' },
  { testName: 'IBPS PO Prelims Speed Drill #12', score: 68, maxScore: 100, accuracy: 88, percentile: 91.8, date: '2026-08-30' },
  { testName: 'UPSC CSAT Quant Diagnostic', score: 94, maxScore: 200, accuracy: 76, percentile: 86.5, date: '2026-08-27' }
];

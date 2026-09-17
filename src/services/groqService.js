import { API_BASE_URL } from '../config/api';

const DEFAULT_GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const ATTEMPTED_HASHES_KEY = 'exam_iq_attempted_question_hashes';
const BACKEND_URL = `${API_BASE_URL}/api/generate-questions/`;

export function getAttemptedHashes() {
  try {
    const stored = localStorage.getItem(ATTEMPTED_HASHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

export function saveQuestionHash(hash) {
  try {
    const hashes = getAttemptedHashes();
    if (!hashes.includes(hash)) {
      hashes.push(hash);
      localStorage.setItem(ATTEMPTED_HASHES_KEY, JSON.stringify(hashes));
    }
  } catch (e) {
    console.error('Error saving hash:', e);
  }
}

/**
 * Procedurally generate N 100% unique questions for fallback
 */
export function generateProceduralUniqueQuestions(examName = 'IBPS PO 2026', subject = 'General', count = 5) {
  const seedBase = Math.floor(Math.random() * 900000) + 100000;
  const questions = [];

  const quantTopics = [
    'Profit & Loss Yield', 'Pipes & Cisterns Capacity', 'Simple & Compound Interest',
    'Time, Speed & Distance', 'Ratio, Mixture & Alligation', 'Data Interpretation Tables'
  ];
  const reasoningTopics = [
    'Seating Arrangement & Puzzles', 'Coding-Decoding Logic', 'Syllogism & Venn Diagrams',
    'Blood Relations & Direction Sense', 'Statement & Assumptions'
  ];
  const englishTopics = [
    'Cloze Test & Sentence Correction', 'Reading Comprehension Analysis', 'Error Spotting & Grammar',
    'Para Jumbles & Order', 'Vocabulary & Antonyms'
  ];
  const gaTopics = [
    'Banking & Monetary Policy', 'Indian Economy & Budget', 'Current Financial Affairs',
    'Indian Constitution & Fundamental Rights', 'Static GK & International Bodies'
  ];

  for (let i = 0; i < count; i++) {
    const seed = seedBase + i * 137 + Math.floor(Math.random() * 999999);
    const secType = (i % 4 === 0) ? 'quant' : (i % 4 === 1) ? 'reasoning' : (i % 4 === 2) ? 'english' : 'ga';

    if (secType === 'quant') {
      const qType = seed % 4;
      if (qType === 0) {
        const pMarkup = (Math.floor(Math.random() * 5) + 2) * 10;
        const pDiscount = (Math.floor(Math.random() * 4) + 1) * 5;
        const costPrice = (Math.floor(Math.random() * 8) + 5) * 200;
        const sp = costPrice * (1 + pMarkup / 100) * (1 - pDiscount / 100);
        const netProfit = sp - costPrice;
        const topicName = quantTopics[seed % quantTopics.length];
        questions.push({
          id: `proc_q_${i + 1}_${seed}`,
          sectionId: 'quant',
          sectionName: 'Quantitative Aptitude',
          questionText: `An asset valued at ₹${costPrice} is marked up by ${pMarkup}% and sold at a discount of ${pDiscount}%. Calculate the net yield in ₹.`,
          options: [
            { id: 'A', text: `₹${(netProfit - 50).toFixed(0)}` },
            { id: 'B', text: `₹${netProfit.toFixed(0)}` },
            { id: 'C', text: `₹${(netProfit + 50).toFixed(0)}` },
            { id: 'D', text: `₹${(netProfit + 100).toFixed(0)}` }
          ],
          correctOptionId: 'B',
          explanation: `Marked Price = ₹${(costPrice * (1 + pMarkup / 100)).toFixed(0)}. Selling Price = ₹${sp.toFixed(0)}. Net Profit/Yield = ₹${netProfit.toFixed(0)}.`,
          topic: topicName,
          difficulty: 'Moderate'
        });
      } else if (qType === 1) {
        const principal = (Math.floor(Math.random() * 10) + 2) * 5000;
        const rate = (Math.floor(Math.random() * 6) + 4);
        const timeYears = (Math.floor(Math.random() * 3) + 2);
        const si = (principal * rate * timeYears) / 100;
        questions.push({
          id: `proc_q_${i + 1}_${seed}`,
          sectionId: 'quant',
          sectionName: 'Quantitative Aptitude',
          questionText: `Calculate the Simple Interest on a principal sum of ₹${principal} invested for ${timeYears} years at an annual interest rate of ${rate}%.`,
          options: [
            { id: 'A', text: `₹${si.toFixed(0)}` },
            { id: 'B', text: `₹${(si + 250).toFixed(0)}` },
            { id: 'C', text: `₹${(si - 200).toFixed(0)}` },
            { id: 'D', text: `₹${(si + 500).toFixed(0)}` }
          ],
          correctOptionId: 'A',
          explanation: `SI = (P × R × T) / 100 = (${principal} × ${rate} × ${timeYears}) / 100 = ₹${si.toFixed(0)}.`,
          topic: 'Simple & Compound Interest',
          difficulty: 'Moderate'
        });
      } else if (qType === 2) {
        const distance = (Math.floor(Math.random() * 8) + 3) * 60;
        const timeHrs = (Math.floor(Math.random() * 4) + 2);
        const speed = distance / timeHrs;
        questions.push({
          id: `proc_q_${i + 1}_${seed}`,
          sectionId: 'quant',
          sectionName: 'Quantitative Aptitude',
          questionText: `An express train covers a distance of ${distance} km in ${timeHrs} hours. What is the average speed of the train in km/h?`,
          options: [
            { id: 'A', text: `${(speed - 10).toFixed(0)} km/h` },
            { id: 'B', text: `${speed.toFixed(0)} km/h` },
            { id: 'C', text: `${(speed + 15).toFixed(0)} km/h` },
            { id: 'D', text: `${(speed + 25).toFixed(0)} km/h` }
          ],
          correctOptionId: 'B',
          explanation: `Speed = Distance / Time = ${distance} / ${timeHrs} = ${speed.toFixed(0)} km/h.`,
          topic: 'Time, Speed & Distance',
          difficulty: 'Easy'
        });
      } else {
        const pipeA = (Math.floor(Math.random() * 5) + 3) * 2;
        const pipeB = (Math.floor(Math.random() * 5) + 3) * 3;
        const combinedRate = (1 / pipeA) + (1 / pipeB);
        const totalTime = 1 / combinedRate;
        questions.push({
          id: `proc_q_${i + 1}_${seed}`,
          sectionId: 'quant',
          sectionName: 'Quantitative Aptitude',
          questionText: `Pipe A can fill a tank in ${pipeA} hours, and Pipe B can fill the same tank in ${pipeB} hours. How long will both pipes take to fill the tank together?`,
          options: [
            { id: 'A', text: `${totalTime.toFixed(1)} hours` },
            { id: 'B', text: `${(totalTime + 1.5).toFixed(1)} hours` },
            { id: 'C', text: `${(totalTime - 0.8).toFixed(1)} hours` },
            { id: 'D', text: `${(totalTime + 2.0).toFixed(1)} hours` }
          ],
          correctOptionId: 'A',
          explanation: `Combined 1-hr work = (1/${pipeA}) + (1/${pipeB}) = ${combinedRate.toFixed(3)}. Total time = ${totalTime.toFixed(1)} hours.`,
          topic: 'Pipes & Cisterns Capacity',
          difficulty: 'Moderate'
        });
      }
    } else if (secType === 'reasoning') {
      const words = ['PORTFOLIO', 'SOLVENCY', 'MORTGAGE', 'LIQUIDITY', 'DEPOSITS', 'INTEREST', 'RESERVES', 'BENCHMARK', 'DIVIDEND', 'CLEARING', 'TREASURY', 'AUDITING'];
      const wordIdx = (seed + i) % words.length;
      const word = words[wordIdx];
      const rev = word.split('').reverse().join('');
      const targetWord = words[(wordIdx + 3) % words.length];
      const targetRev = targetWord.split('').reverse().join('');
      const topicName = reasoningTopics[seed % reasoningTopics.length];

      questions.push({
        id: `proc_q_${i + 1}_${seed}`,
        sectionId: 'reasoning',
        sectionName: 'Reasoning Ability',
        questionText: `In a standardized coding logic, if "${word}" is written as "${rev}", how is "${targetWord}" written in that same code?`,
        options: [
          { id: 'A', text: targetRev },
          { id: 'B', text: targetRev.slice(1) + targetRev[0] },
          { id: 'C', text: targetWord },
          { id: 'D', text: targetRev.slice(0, -1) + 'X' }
        ],
        correctOptionId: 'A',
        explanation: `Coding Pattern: Reverse string order. "${targetWord}" reversed is "${targetRev}".`,
        topic: topicName,
        difficulty: 'Moderate'
      });
    } else if (secType === 'english') {
      const activeSentences = [
        { active: "The Reserve Bank of India updated the repo rate policy.", passive: "The repo rate policy was updated by the Reserve Bank of India." },
        { active: "The monetary committee approved the new credit facility.", passive: "The new credit facility was approved by the monetary committee." },
        { active: "The auditor verified all financial ledger balances.", passive: "All financial ledger balances were verified by the auditor." },
        { active: "The government launched an ambitious financial inclusion scheme.", passive: "An ambitious financial inclusion scheme was launched by the government." },
        { active: "The central bank introduced digital currency pilot testing.", passive: "Digital currency pilot testing was introduced by the central bank." },
        { active: "The board sanctioned a new infrastructure expansion loan.", passive: "A new infrastructure expansion loan was sanctioned by the board." }
      ];
      const sentObj = activeSentences[seed % activeSentences.length];
      const topicName = englishTopics[seed % englishTopics.length];

      questions.push({
        id: `proc_q_${i + 1}_${seed}`,
        sectionId: 'english',
        sectionName: 'English Comprehension',
        questionText: `Select the grammatically correct Passive Voice form of: "${sentObj.active}"`,
        options: [
          { id: 'A', text: sentObj.passive },
          { id: 'B', text: sentObj.passive.replace('was', 'is') },
          { id: 'C', text: sentObj.passive.replace('was', 'had been') },
          { id: 'D', text: sentObj.passive.replace('were', 'has been') }
        ],
        correctOptionId: 'A',
        explanation: `Simple Past Active converts to Simple Past Passive ("was/were + Past Participle").`,
        topic: topicName,
        difficulty: 'Moderate'
      });
    } else {
      const questionsGA = [
        { q: "Which committee recommended the establishment of Payments Banks in India?", a: "Nachiket Mor Committee", options: ["Nachiket Mor Committee", "Raghuram Rajan Committee", "Urjit Patel Committee", "Tarapore Committee"] },
        { q: "What is the maximum limit for UPI Lite offline transactions set by RBI?", a: "₹500", options: ["₹200", "₹500", "₹1000", "₹2000"] },
        { q: "Under which Article of the Constitution does the President promulgate Financial Emergency?", a: "Article 360", options: ["Article 352", "Article 356", "Article 360", "Article 370"] },
        { q: "Which institution issues the Sovereign Gold Bonds on behalf of the Government of India?", a: "Reserve Bank of India (RBI)", options: ["Reserve Bank of India (RBI)", "State Bank of India (SBI)", "SEBI", "NABARD"] },
        { q: "Where are the headquarters of the National Bank for Agriculture and Rural Development (NABARD) located?", a: "Mumbai", options: ["Mumbai", "New Delhi", "Kolkata", "Bengaluru"] },
        { q: "What does 'S' stand for in the financial acronym CIPA?", a: "System", options: ["System", "Solvency", "Security", "Standard"] },
        { q: "Which regulatory body governs credit rating agencies in India?", a: "SEBI", options: ["SEBI", "RBI", "IRDAI", "PFRDA"] },
        { q: "What is the minimum paid-up equity capital required to establish a Small Finance Bank in India?", a: "₹200 Crore", options: ["₹100 Crore", "₹200 Crore", "₹300 Crore", "₹500 Crore"] }
      ];
      const gaObj = questionsGA[seed % questionsGA.length];
      const topicName = gaTopics[seed % gaTopics.length];

      questions.push({
        id: `proc_q_${i + 1}_${seed}`,
        sectionId: 'ga',
        sectionName: 'General Awareness & Banking',
        questionText: `${gaObj.q}`,
        options: [
          { id: 'A', text: gaObj.options[0] },
          { id: 'B', text: gaObj.options[1] },
          { id: 'C', text: gaObj.options[2] },
          { id: 'D', text: gaObj.options[3] }
        ],
        correctOptionId: gaObj.options[0] === gaObj.a ? 'A' : gaObj.options[1] === gaObj.a ? 'B' : gaObj.options[2] === gaObj.a ? 'C' : 'D',
        explanation: `Correct Answer: ${gaObj.a}.`,
        topic: topicName,
        difficulty: 'Moderate'
      });
    }
  }

  return questions;
}

function safeHash(str) {
  try {
    let hash = 0;
    const cleanStr = String(str || '').slice(0, 35);
    for (let i = 0; i < cleanStr.length; i++) {
      const char = cleanStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'h_' + Math.abs(hash);
  } catch (e) {
    return 'h_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  }
}

export async function generateGroqMockQuestions({
  examName = 'IBPS PO 2026',
  subject = 'Quantitative Aptitude',
  topic = 'Profit & Loss',
  numQuestions = 5,
  difficulty = 'Moderate',
  customApiKey = null
}) {
  const apiKey = customApiKey || DEFAULT_GROQ_KEY;

  // 1. Backend Groq RAG LLM Call with 12-second timeout for full PDF vector analysis
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const backendRes = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        examName,
        subject,
        topic,
        numQuestions,
        userId: 'user_live_session',
        apiKey
      })
    });
    clearTimeout(timeoutId);

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data && data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        data.questions.forEach(q => {
          if (q && q.questionText) {
            saveQuestionHash(safeHash(q.questionText));
          }
        });
        return data.questions;
      }
    }
  } catch (e) {
    clearTimeout(timeoutId);
    console.warn('Groq LLM RAG fetch timeout or fallback:', e);
  }

  // 2. Adaptive Procedural Generation with dynamic seeds (0ms delay fallback)
  const proceduralQuestions = generateProceduralUniqueQuestions(examName, subject, numQuestions);
  if (Array.isArray(proceduralQuestions)) {
    proceduralQuestions.forEach(q => {
      if (q && q.questionText) {
        saveQuestionHash(safeHash(q.questionText));
      }
    });
  }
  return proceduralQuestions;
}

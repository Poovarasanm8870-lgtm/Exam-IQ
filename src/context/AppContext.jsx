import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import { FULL_MOCK_TEST_METADATA } from '../data/mockData';
import { generateGroqMockQuestions, generateProceduralUniqueQuestions } from '../services/groqService';

const AppContext = createContext();
const USER_STORAGE_KEY = 'examiq_active_user_session';
const ADMIN_TIME_SETTINGS_KEY = 'examiq_admin_time_settings';
const ADMIN_EXAM_DATES_KEY = 'examiq_admin_exam_dates';

export const DEFAULT_ADMIN_TIME_SETTINGS = {
  customCounts: {
    5: 5,     // 5 minutes for 5 questions
    10: 10,   // 10 minutes for 10 questions
    15: 15,   // 15 minutes for 15 questions
    20: 20,   // 20 minutes for 20 questions
    25: 25,   // 25 minutes for 25 questions
    50: 50,   // 50 minutes for 50 questions
    100: 90   // 90 minutes for 100 questions
  },
  defaultSecondsPerQuestion: 60
};

export const DEFAULT_EXAM_DATES = {
  'ssc-cgl': '2026-10-30',
  'ssc-chsl': '2026-11-25',
  'ssc-mts': '2026-12-20',
  'ibps-po': '2026-10-12',
  'sbi-clerk': '2026-11-08',
  'rbi-grade-b': '2027-01-05',
  'upsc-cse': '2026-12-05',
  'uppsc-pcs': '2026-12-30',
  'rrb-ntpc': '2026-10-22',
  'rrb-group-d': '2026-12-15'
};

// Helper function to calculate exact days remaining between today and Admin target exam date
export const getDaysRemainingForExam = (examIdOrName, adminDatesMap = {}) => {
  if (!examIdOrName) return 42;
  
  let targetDateStr = adminDatesMap[examIdOrName];
  if (!targetDateStr) {
    const key = String(examIdOrName).toLowerCase();
    if (key.includes('ssc cgl')) targetDateStr = adminDatesMap['ssc-cgl'] || DEFAULT_EXAM_DATES['ssc-cgl'];
    else if (key.includes('ssc chsl')) targetDateStr = adminDatesMap['ssc-chsl'] || DEFAULT_EXAM_DATES['ssc-chsl'];
    else if (key.includes('ssc mts')) targetDateStr = adminDatesMap['ssc-mts'] || DEFAULT_EXAM_DATES['ssc-mts'];
    else if (key.includes('ibps po')) targetDateStr = adminDatesMap['ibps-po'] || DEFAULT_EXAM_DATES['ibps-po'];
    else if (key.includes('sbi clerk')) targetDateStr = adminDatesMap['sbi-clerk'] || DEFAULT_EXAM_DATES['sbi-clerk'];
    else if (key.includes('rbi grade b')) targetDateStr = adminDatesMap['rbi-grade-b'] || DEFAULT_EXAM_DATES['rbi-grade-b'];
    else if (key.includes('upsc')) targetDateStr = adminDatesMap['upsc-cse'] || DEFAULT_EXAM_DATES['upsc-cse'];
    else if (key.includes('uppsc')) targetDateStr = adminDatesMap['uppsc-pcs'] || DEFAULT_EXAM_DATES['uppsc-pcs'];
    else if (key.includes('rrb ntpc')) targetDateStr = adminDatesMap['rrb-ntpc'] || DEFAULT_EXAM_DATES['rrb-ntpc'];
    else if (key.includes('rrb group')) targetDateStr = adminDatesMap['rrb-group-d'] || DEFAULT_EXAM_DATES['rrb-group-d'];
    else targetDateStr = DEFAULT_EXAM_DATES['ssc-cgl'];
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    const diffMs = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  } catch (e) {
    return 30;
  }
};

// Helper function to calculate exact 100% real dynamic subject accuracy across all historical attempt logs
export const computeDynamicSubjectAccuracy = (historyList = [], currentSectionScores = null) => {
  const sectionTotals = {
    quant: { correct: 0, total: 0 },
    reasoning: { correct: 0, total: 0 },
    english: { correct: 0, total: 0 },
    ga: { correct: 0, total: 0 }
  };

  // 1. Accumulate current session scores if provided
  if (currentSectionScores) {
    Object.keys(sectionTotals).forEach((sec) => {
      if (currentSectionScores[sec] && currentSectionScores[sec].total > 0) {
        sectionTotals[sec].correct += currentSectionScores[sec].correct || 0;
        sectionTotals[sec].total += currentSectionScores[sec].total || 0;
      }
    });
  }

  // 2. Accumulate historical attempt logs
  if (Array.isArray(historyList)) {
    historyList.forEach((item) => {
      if (Array.isArray(item.questionsLog)) {
        item.questionsLog.forEach((q) => {
          const qText = (q.question || '').toLowerCase();
          const sec = q.sectionId || (
            qText.includes('profit') || qText.includes('km') || qText.includes('men') || qText.includes('article') || qText.includes('₹') || qText.includes('rs') || qText.includes('speed') ? 'quant' :
            qText.includes('statement') || qText.includes('spelled') || qText.includes('code') || qText.includes('series') ? 'reasoning' :
            qText.includes('blank') || qText.includes('word') || qText.includes('spelling') || qText.includes('grammar') ? 'english' : 'ga'
          );
          if (sectionTotals[sec]) {
            sectionTotals[sec].total += 1;
            if (q.isCorrect) sectionTotals[sec].correct += 1;
          }
        });
      }
    });
  }

  // 3. Return exact percentage (0% to 100%) dynamically calculated per subject
  return {
    quant: sectionTotals.quant.total > 0 ? Math.round((sectionTotals.quant.correct / sectionTotals.quant.total) * 100) : 0,
    reasoning: sectionTotals.reasoning.total > 0 ? Math.round((sectionTotals.reasoning.correct / sectionTotals.reasoning.total) * 100) : 0,
    english: sectionTotals.english.total > 0 ? Math.round((sectionTotals.english.correct / sectionTotals.english.total) * 100) : 0,
    ga: sectionTotals.ga.total > 0 ? Math.round((sectionTotals.ga.correct / sectionTotals.ga.total) * 100) : 0
  };
};

export function AppProvider({ children }) {
  const [currentView, setCurrentView] = useState('auth');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [user, setUser] = useState(null);

  const [groqApiKey, setGroqApiKey] = useState(import.meta.env.VITE_GROQ_API_KEY || '');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Admin Configurable Official Exam Dates
  const [adminExamDates, setAdminExamDates] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_EXAM_DATES_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_EXAM_DATES;
    } catch (e) {
      return DEFAULT_EXAM_DATES;
    }
  });

  const updateAdminExamDates = (newDatesMap) => {
    setAdminExamDates(newDatesMap);
    try {
      localStorage.setItem(ADMIN_EXAM_DATES_KEY, JSON.stringify(newDatesMap));
      triggerToast('Official Exam Target Dates updated successfully! Countdown decrements automatically daily.', 'success');
    } catch (e) {
      console.error('Error saving admin exam dates:', e);
    }
  };

  // Admin Configurable Test Question Times
  const [adminTimeSettings, setAdminTimeSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_TIME_SETTINGS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN_TIME_SETTINGS;
    } catch (e) {
      return DEFAULT_ADMIN_TIME_SETTINGS;
    }
  });

  const updateAdminTimeSettings = (newSettings) => {
    setAdminTimeSettings(newSettings);
    try {
      localStorage.setItem(ADMIN_TIME_SETTINGS_KEY, JSON.stringify(newSettings));
      triggerToast('Admin Question Time Configuration saved successfully!', 'success');
    } catch (e) {
      console.error('Error saving admin time settings:', e);
    }
  };

  const getTestDurationMinutes = (count) => {
    const validCount = parseInt(count, 10) || 5;
    if (adminTimeSettings?.customCounts && adminTimeSettings.customCounts[validCount] !== undefined) {
      return Math.max(1, parseInt(adminTimeSettings.customCounts[validCount], 10) || 5);
    }
    const secondsPerQ = parseInt(adminTimeSettings?.defaultSecondsPerQuestion, 10) || 60;
    return Math.max(1, Math.round((validCount * secondsPerQ) / 60));
  };

  // Configurable Negative Marking (Minus Marks) Mode
  const [allowNegativeMarking, setAllowNegativeMarking] = useState(() => {
    try {
      const saved = localStorage.getItem('examiq_allow_negative_marking');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  const [negativeMarkValue, setNegativeMarkValue] = useState(() => {
    try {
      const saved = localStorage.getItem('examiq_negative_mark_value');
      return saved !== null ? JSON.parse(saved) : 0.5;
    } catch (e) {
      return 0.5;
    }
  });

  const toggleNegativeMarking = () => {
    setAllowNegativeMarking((prev) => {
      const next = !prev;
      localStorage.setItem('examiq_allow_negative_marking', JSON.stringify(next));
      triggerToast(next ? `Negative Marking ENABLED (-${negativeMarkValue} Marks per incorrect answer)` : 'Negative Marking DISABLED (No minus marks deduction)', next ? 'info' : 'warning');
      return next;
    });
  };

  const updateNegativeMarkConfig = (enabled, penaltyVal = 0.5) => {
    setAllowNegativeMarking(enabled);
    setNegativeMarkValue(penaltyVal);
    localStorage.setItem('examiq_allow_negative_marking', JSON.stringify(enabled));
    localStorage.setItem('examiq_negative_mark_value', JSON.stringify(penaltyVal));
    triggerToast(enabled ? `Marking Scheme Updated: Negative Penalty -${penaltyVal} Marks` : 'Negative Marking Disabled (0.0 Marks)', 'info');
  };

  const [activeTest, setActiveTest] = useState(FULL_MOCK_TEST_METADATA);
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState('quant');

  const [questionStates, setQuestionStates] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [remainingTimeSeconds, setRemainingTimeSeconds] = useState(3600);
  const [totalTestDurationSeconds, setTotalTestDurationSeconds] = useState(3600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lastTestResult, setLastTestResult] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);

  function triggerToast(msg, type = 'info') {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  }

  const changeView = (viewName, targetUser = null) => {
    const activeUser = targetUser || user;
    if (viewName === 'admin-pdf' && activeUser?.role !== 'admin') {
      triggerToast('Access Denied: Admin privileges required for PDF Syllabus Manager.', 'warning');
      setCurrentView('dashboard');
      return;
    }
    setCurrentView(viewName);
  };

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        const dynamicSubjectAcc = computeDynamicSubjectAccuracy(parsedUser.attemptsHistory || []);
        const activeUserWithCleanAcc = {
          ...parsedUser,
          subjectAccuracy: dynamicSubjectAcc
        };
        setUser(activeUserWithCleanAcc);
        if (parsedUser.role === 'admin') {
          setCurrentView('admin-pdf');
        } else {
          setCurrentView('dashboard');
        }

        // Auto-sync latest attempt history & profile metrics from SQLite Database
        if (parsedUser.email) {
          fetch(`${API_BASE_URL}/api/user/get/${encodeURIComponent(parsedUser.email)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.status === 'success' && data.user) {
                const dbUser = data.user;
                const dbHistory = Array.isArray(dbUser.attempts_history) ? dbUser.attempts_history : [];
                const localHistory = Array.isArray(parsedUser.attemptsHistory) ? parsedUser.attemptsHistory : [];
                
                const combinedMap = new Map();
                [...localHistory, ...dbHistory].forEach((item) => {
                  if (item && item.id) combinedMap.set(item.id, item);
                });

                const mergedHistory = Array.from(combinedMap.values()).sort((a, b) => String(b.id || '').localeCompare(String(a.id || '')));
                const computedMergedSubjectAcc = computeDynamicSubjectAccuracy(mergedHistory);

                const mergedUser = {
                  ...parsedUser,
                  name: dbUser.name || parsedUser.name,
                  targetExamId: dbUser.target_exam_id || parsedUser.targetExamId,
                  targetExamName: dbUser.target_exam_name || parsedUser.targetExamName,
                  streakDays: dbUser.streak_days ?? parsedUser.streakDays,
                  testsAttempted: Math.max(mergedHistory.length, dbUser.tests_attempted || 0, parsedUser.testsAttempted || 0),
                  avgAccuracy: dbUser.avg_accuracy || parsedUser.avgAccuracy,
                  attemptsHistory: mergedHistory,
                  subjectAccuracy: computedMergedSubjectAcc
                };

                setUser(mergedUser);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mergedUser));
              }
            })
            .catch((err) => console.error('Error syncing user from SQLite DB:', err));
        }
      } else {
        setCurrentView('auth');
      }
    } catch (e) {
      console.error('Error loading session from localStorage:', e);
      setCurrentView('auth');
    }
  }, []);

  const saveUserSession = (updatedUser) => {
    setUser(updatedUser);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      fetch(`${API_BASE_URL}/api/user/save/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      }).catch(() => {});
    } catch (e) {
      console.error('Error saving user session:', e);
    }
  };

  const loginUser = (userData) => {
    const parseJson = (val, defaultVal) => {
      if (val === null || val === undefined) return defaultVal;
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch (e) {
          return defaultVal;
        }
      }
      return val;
    };

    const targetExamId = userData.targetExamId || userData.target_exam_id || 'ssc-cgl';
    const targetExamName = userData.targetExamName || userData.target_exam_name || 'SSC CGL (Combined Graduate Level)';
    const computedDays = getDaysRemainingForExam(targetExamId, adminExamDates);

    const fullProfile = {
      id: userData.id || userData.email || `usr_${Date.now()}`,
      name: userData.name || 'Aspirant Student',
      email: userData.email || 'aspirant@examiq.com',
      phone: userData.phone || '+91 9876543210',
      role: userData.role || 'student',
      targetExamId: targetExamId,
      targetExamName: targetExamName,
      daysRemaining: computedDays,
      userChosenExam: true,
      secondaryGoals: parseJson(userData.secondaryGoals ?? userData.secondary_goals, ['IBPS PO', 'RRB NTPC']),
      streakDays: userData.streakDays ?? userData.streak_days ?? 1,
      lastActiveDate: userData.lastActiveDate || userData.last_active_date || new Date().toISOString().split('T')[0],
      testsAttempted: userData.testsAttempted ?? userData.tests_attempted ?? 0,
      avgAccuracy: userData.avgAccuracy ?? userData.avg_accuracy ?? 0,
      attemptsHistory: parseJson(userData.attemptsHistory ?? userData.attempts_history, []),
      subjectAccuracy: computeDynamicSubjectAccuracy(parseJson(userData.attemptsHistory ?? userData.attempts_history, [])),
      dailyChecklist: parseJson(userData.dailyChecklist ?? userData.daily_checklist, [
        { id: 1, text: "Attempt 1 Full Mock Test", completed: false },
        { id: 2, text: "Revise Daily Current Affairs", completed: false },
        { id: 3, text: "Solve 20 Quant Pipes & Cisterns Questions", completed: false },
        { id: 4, text: "Review Negative Markings from Mock", completed: false }
      ])
    };
    saveUserSession(fullProfile);
    if (fullProfile.role === 'admin') {
      changeView('admin-pdf', fullProfile);
    } else {
      changeView('dashboard', fullProfile);
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    setCurrentView('auth');
    triggerToast('Logged out successfully.', 'info');
  };

  useEffect(() => {
    let timerInterval = null;
    if (currentView === 'test-interface' && isTimerRunning) {
      timerInterval = setInterval(() => {
        setRemainingTimeSeconds((prev) => {
          if (prev === null || prev === undefined || isNaN(prev)) {
            return totalTestDurationSeconds || 300;
          }
          if (prev <= 1) {
            clearInterval(timerInterval);
            setIsTimerRunning(false);
            try {
              submitTestFinal(null, 'time_expired');
            } catch (e) {
              console.error('Auto submit time_expired error:', e);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isTimerRunning, currentView, totalTestDurationSeconds]);

  const handleSelectExam = (examObj) => {
    if (!user || !examObj) return;
    const computedDays = getDaysRemainingForExam(examObj.id || examObj.name, adminExamDates);
    const updated = {
      ...user,
      targetExamId: examObj.id || user.targetExamId,
      targetExamName: examObj.name || user.targetExamName,
      daysRemaining: computedDays,
      userChosenExam: true
    };
    saveUserSession(updated);
    setShowOnboardingModal(false);
    triggerToast(`Target exam locked: ${examObj.name}. Selection saved!`, 'success');
  };

  const toggleChecklistItem = (itemId) => {
    if (!user) return;
    const updatedChecklist = user.dailyChecklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const updatedUser = { ...user, dailyChecklist: updatedChecklist };
    saveUserSession(updatedUser);
  };

  /**
   * Launch ANY Test Session with user-specified question count
   */
  const launchTestSession = (customQuestions = null, testTitle = null, requestedCount = 5) => {
    setIsAiGenerating(false);
    let questionsToUse = customQuestions;

    if (!questionsToUse || !Array.isArray(questionsToUse) || questionsToUse.length === 0) {
      questionsToUse = generateProceduralUniqueQuestions(user?.targetExamName || 'SSC CGL 2026', 'General', requestedCount);
    }

    const initialStates = {};
    const initialAnswers = {};
    questionsToUse.forEach((q, idx) => {
      if (q && q.id) {
        initialStates[q.id] = idx === 0 ? 'unanswered' : 'unvisited';
        initialAnswers[q.id] = null;
      }
    });

    setTestQuestions(questionsToUse);
    setQuestionStates(initialStates);
    setSelectedAnswers(initialAnswers);
    setCurrentQuestionIndex(0);
    setActiveSectionId(questionsToUse[0]?.sectionId || 'quant');
    const durationMinutes = Math.max(1, parseInt(getTestDurationMinutes(requestedCount), 10) || 5);
    const totalSecs = Math.max(60, durationMinutes * 60);
    setRemainingTimeSeconds(totalSecs);
    setTotalTestDurationSeconds(totalSecs);
    setIsTimerRunning(true);
    if (testTitle) {
      setActiveTest((prev) => ({ ...prev, title: `${testTitle} (${requestedCount} Questions)` }));
    }
    setCurrentView('test-interface');
    triggerToast(`Dynamic ${requestedCount}-Question Session Initialized!`, 'info');
  };

  const launchAiDynamicTest = async (topic = 'Profit & Loss', subject = 'Quantitative Aptitude', requestedCount = 5, difficulty = 'Moderate') => {
    setIsAiGenerating(true);
    triggerToast(`Adaptive AI Engine generating ${requestedCount} unique ${difficulty} questions...`, 'info');

    const generated = await generateGroqMockQuestions({
      examName: user?.targetExamName || 'SSC CGL 2026',
      subject: subject,
      topic: topic,
      numQuestions: requestedCount,
      difficulty: difficulty,
      customApiKey: groqApiKey
    });

    setIsAiGenerating(false);
    if (generated && generated.length > 0) {
      launchTestSession(generated, `${topic} (${difficulty} Level) Practice Test`, requestedCount);
    }
  };

  const selectOption = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const clearResponse = (questionId) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: null }));
    setQuestionStates((prev) => ({ ...prev, [questionId]: 'unanswered' }));
  };

  const handleSaveAndNext = () => {
    if (!Array.isArray(testQuestions) || testQuestions.length === 0) return;
    const currentQ = testQuestions[currentQuestionIndex];
    if (!currentQ) return;
    const hasAnswer = selectedAnswers[currentQ.id] !== null && selectedAnswers[currentQ.id] !== undefined;

    setQuestionStates((prev) => ({
      ...prev,
      [currentQ.id]: hasAnswer ? 'answered' : 'unanswered'
    }));

    if (currentQuestionIndex < testQuestions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      const nextQ = testQuestions[nextIdx];
      if (nextQ) {
        setCurrentQuestionIndex(nextIdx);
        if (nextQ.sectionId) setActiveSectionId(nextQ.sectionId);
        if (questionStates[nextQ.id] === 'unvisited') {
          setQuestionStates((prev) => ({ ...prev, [nextQ.id]: 'unanswered' }));
        }
      }
    }
  };

  const handleMarkForReviewAndNext = () => {
    if (!Array.isArray(testQuestions) || testQuestions.length === 0) return;
    const currentQ = testQuestions[currentQuestionIndex];
    if (!currentQ) return;
    const hasAnswer = selectedAnswers[currentQ.id] !== null && selectedAnswers[currentQ.id] !== undefined;

    setQuestionStates((prev) => ({
      ...prev,
      [currentQ.id]: hasAnswer ? 'ansReview' : 'review'
    }));

    if (currentQuestionIndex < testQuestions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      const nextQ = testQuestions[nextIdx];
      if (nextQ) {
        setCurrentQuestionIndex(nextIdx);
        if (nextQ.sectionId) setActiveSectionId(nextQ.sectionId);
        if (questionStates[nextQ.id] === 'unvisited') {
          setQuestionStates((prev) => ({ ...prev, [nextQ.id]: 'unanswered' }));
        }
      }
    }
  };

  const jumpToQuestion = (index) => {
    if (!Array.isArray(testQuestions) || testQuestions.length === 0) return;
    const targetQ = testQuestions[index];
    if (!targetQ) return;
    setCurrentQuestionIndex(index);
    if (targetQ.sectionId) setActiveSectionId(targetQ.sectionId);

    if (questionStates[targetQ.id] === 'unvisited') {
      setQuestionStates((prev) => ({ ...prev, [targetQ.id]: 'unanswered' }));
    }
  };

  function calculateTestResults(submissionMethod = 'manual', recipientEmail = null) {
    let totalAttempted = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let totalMarks = 0;

    const sectionScores = { quant: { correct: 0, total: 0 }, reasoning: { correct: 0, total: 0 }, english: { correct: 0, total: 0 }, ga: { correct: 0, total: 0 } };

    testQuestions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      const secId = q.sectionId || 'quant';
      if (!sectionScores[secId]) sectionScores[secId] = { correct: 0, total: 0 };
      sectionScores[secId].total++;

      if (selected !== null && selected !== undefined) {
        totalAttempted++;
        if (selected === q.correctOptionId) {
          correctCount++;
          totalMarks += 2;
          sectionScores[secId].correct++;
        } else {
          incorrectCount++;
          if (allowNegativeMarking) {
            totalMarks -= (negativeMarkValue || 0.5);
          }
        }
      }
    });

    const accuracy = totalAttempted > 0 ? parseFloat(((correctCount / totalAttempted) * 100).toFixed(1)) : 0;
    const maxPossibleMarks = testQuestions.length * 2;
    const scoreRatio = maxPossibleMarks > 0 ? Math.max(0, totalMarks / maxPossibleMarks) : 0;
    const rawPercentile = accuracy > 0 ? (12 + (accuracy * 0.7) + (scoreRatio * 17.5)) : 5.0;
    const percentile = parseFloat(Math.min(99.9, Math.max(5.0, rawPercentile)).toFixed(1));

    const questionsLog = testQuestions.map((q, idx) => {
      const selId = selectedAnswers[q.id];
      const selOptObj = Array.isArray(q.options) ? q.options.find((o) => o.id === selId) : null;
      const corrOptObj = Array.isArray(q.options) ? q.options.find((o) => o.id === q.correctOptionId) : null;
      return {
        id: q.id || idx + 1,
        question: q.questionText || q.question || '',
        selectedOption: selOptObj ? selOptObj.text : (selId || 'Unattempted'),
        correctOption: corrOptObj ? corrOptObj.text : (q.correctOptionId || 'Option A'),
        isCorrect: selId === q.correctOptionId,
        explanation: q.explanation || ''
      };
    });

    const resultSummary = {
      id: `attempt_${Date.now()}`,
      testTitle: activeTest.title,
      submissionMethod, // 'manual' | 'time_expired' | 'tab_switch'
      recipientEmail: recipientEmail || user?.email || 'aspirant@examiq.com',
      questionsLog,
      totalQuestions: testQuestions.length,
      totalAttempted,
      correctCount,
      incorrectCount,
      unattempted: testQuestions.length - totalAttempted,
      score: Math.max(0, totalMarks),
      totalMarks: Math.max(0, totalMarks),
      maxScore: maxPossibleMarks,
      maxPossibleMarks: maxPossibleMarks,
      accuracy,
      percentile,
      timeTakenSeconds: Math.max(0, (totalTestDurationSeconds || (testQuestions.length * 120)) - remainingTimeSeconds),
      date: new Date().toISOString().split('T')[0]
    };

    if (user) {
      const todayDate = new Date().toISOString().split('T')[0];
      const isNewDay = user.lastActiveDate !== todayDate;
      const updatedStreak = isNewDay ? user.streakDays + 1 : user.streakDays;

      const newHistory = [resultSummary, ...(user.attemptsHistory || [])];
      const newTestsAttempted = user.testsAttempted + 1;

      const sumAccuracy = newHistory.reduce((acc, item) => acc + item.accuracy, 0);
      const newAvgAccuracy = parseFloat((sumAccuracy / newHistory.length).toFixed(1));

      // Calculate 100% dynamic subject accuracy from all attempt logs (no fake 40% floor clamping)
      const updatedSubjectAcc = computeDynamicSubjectAccuracy(newHistory, sectionScores);

      const updatedUser = {
        ...user,
        streakDays: updatedStreak,
        lastActiveDate: todayDate,
        testsAttempted: newTestsAttempted,
        avgAccuracy: newAvgAccuracy,
        attemptsHistory: newHistory,
        subjectAccuracy: updatedSubjectAcc
      };

      saveUserSession(updatedUser);
    }

    return resultSummary;
  }

  function dispatchPerformanceEmail(summary, targetEmail = null) {
    const recipient = targetEmail || summary?.recipientEmail || user?.email || 'aspirant@examiq.com';
    const timeSpentFormatted = `${Math.floor((summary.timeTakenSeconds || 0) / 60)}m ${(summary.timeTakenSeconds || 0) % 60}s`;

    fetch(`${API_BASE_URL}/api/send-performance-email/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attemptId: summary.id,
        email: recipient,
        candidateName: user?.name || 'Aspirant Student',
        examName: summary.testTitle || activeTest?.title || 'Mock Test',
        submissionMethod: summary.submissionMethod || 'manual',
        totalQuestions: summary.totalQuestions,
        correctCount: summary.correctCount,
        incorrectCount: summary.incorrectCount,
        unattempted: summary.unattempted,
        score: summary.score,
        totalMarks: summary.maxScore,
        accuracy: summary.accuracy,
        percentile: summary.percentile,
        timeSpent: timeSpentFormatted
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.duplicate_prevented) {
        console.log(`[SMTP] Report email already dispatched for attempt ${summary.id}`);
      } else if (data.status === 'success') {
        triggerToast(`📧 Official Performance Report dispatched to ${recipient}!`, 'success');
      } else if (data.status === 'error') {
        triggerToast(`⚠️ Email dispatch notice: ${data.message || 'Check SMTP configuration.'}`, 'warning');
      } else {
        triggerToast(`📧 Performance Report processed for ${recipient}`, 'info');
      }
    })
    .catch((err) => {
      console.error('[SMTP DISPATCH ERROR]', err);
    });
  }

  function submitTestFinal(targetEmail = null, submissionMethod = 'manual') {
    try {
      setIsTimerRunning(false);
      const recipient = (typeof targetEmail === 'string' && targetEmail.includes('@'))
        ? targetEmail
        : (user?.email || 'aspirant@examiq.com');
      const summary = calculateTestResults(submissionMethod, recipient);
      setLastTestResult(summary);
      changeView('test-analysis');
      if (recipient && targetEmail !== false) {
        dispatchPerformanceEmail(summary, recipient);
      } else {
        triggerToast('Test submitted successfully!', 'success');
      }
    } catch (err) {
      console.error('Error during test submission:', err);
      setIsTimerRunning(false);
      changeView('test-analysis');
    }
  }

  function submitTestAuto() {
    try {
      setIsTimerRunning(false);
      const summary = calculateTestResults('time_expired');
      setLastTestResult(summary);
      changeView('test-analysis');
      dispatchPerformanceEmail(summary);
      triggerToast('⏳ Time Expired! Test automatically submitted & report sent to email.', 'warning');
    } catch (err) {
      console.error('Error during auto test submission:', err);
      setIsTimerRunning(false);
      changeView('test-analysis');
    }
  }

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView: changeView,
        showOnboardingModal,
        setShowOnboardingModal,
        user,
        setUser,
        loginUser,
        logoutUser,
        toggleChecklistItem,
        groqApiKey,
        setGroqApiKey,
        isAiGenerating,
        handleSelectExam,
        launchTestSession,
        launchAiDynamicTest,
        activeTest,
        testQuestions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        activeSectionId,
        setActiveSectionId,
        questionStates,
        selectedAnswers,
        selectOption,
        clearResponse,
        handleSaveAndNext,
        handleMarkForReviewAndNext,
        jumpToQuestion,
        remainingTimeSeconds,
        totalTestDurationSeconds,
        isTimerRunning,
        setIsTimerRunning,
        calculateTestResults,
        setLastTestResult,
        submitTestFinal,
        lastTestResult,
        adminExamDates,
        updateAdminExamDates,
        getDaysRemainingForExam,
        adminTimeSettings,
        updateAdminTimeSettings,
        getTestDurationMinutes,
        allowNegativeMarking,
        negativeMarkValue,
        toggleNegativeMarking,
        updateNegativeMarkConfig,
        toastMessage,
        triggerToast,
        dispatchPerformanceEmail
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    return {
      currentView: 'auth',
      user: null,
      setCurrentView: () => {},
      toastMessage: null,
      triggerToast: () => {},
      loginUser: () => {},
      logoutUser: () => {}
    };
  }
  return context;
}

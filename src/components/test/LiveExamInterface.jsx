import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Bookmark, 
  Send, 
  Menu, 
  X, 
  User, 
  Info,
  ShieldCheck,
  ShieldAlert,
  Mail,
  FileText
} from 'lucide-react';

export default function LiveExamInterface() {
  const { 
    user, 
    activeTest, 
    testQuestions, 
    currentQuestionIndex, 
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
    allowNegativeMarking,
    negativeMarkValue,
    submitTestFinal,
    setCurrentView,
    triggerToast,
    dispatchPerformanceEmail
  } = useApp() || {};

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showHalfTimeModal, setShowHalfTimeModal] = useState(false);
  const [hasShownHalfTimeModal, setHasShownHalfTimeModal] = useState(false);
  const [showStartWarningModal, setShowStartWarningModal] = useState(true);
  const [showTabWarningBanner, setShowTabWarningBanner] = useState(false);

  // Strict Proctoring & Tab Switch Violation State
  const [candidateEmail, setCandidateEmail] = useState(user?.email || '');
  const [sendEmailReport, setSendEmailReport] = useState(true);

  // Dynamically sync candidate recipient email with logged-in user session email
  useEffect(() => {
    if (user?.email) {
      setCandidateEmail(user.email);
    }
  }, [user?.email]);

  // Comprehensive Single-Tab Switch & Focus Loss Proctoring Auto-Submission
  useEffect(() => {
    let hasSubmittedOnTabSwitch = false;

    const executeImmediateTabSwitchSubmission = (reason = 'Tab Switch') => {
      if (hasSubmittedOnTabSwitch) return;
      hasSubmittedOnTabSwitch = true;
      setShowTabWarningBanner(false);

      // 1. Immediately open Tab Switch Violation Popup Alert Modal on screen
      setShowSubmitModal('tab_switch');
      if (triggerToast) {
        triggerToast(`🚨 Single-Tab Proctoring Violation (${reason}): Live exam auto-submitted!`, 'warning');
      }

      // 2. Record tab_switch attempt in SQLite database & dispatch performance email report
      try {
        const recipient = candidateEmail || user?.email || 'aspirant@examiq.com';
        if (calculateTestResults) {
          const summary = calculateTestResults('tab_switch', recipient);
          if (setLastTestResult) setLastTestResult(summary);
          if (recipient) {
            dispatchPerformanceEmail(summary, recipient);
          }
        }
      } catch (e) {
        console.error('Error saving tab switch history:', e);
      }
    };

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasSubmittedOnTabSwitch) {
        setShowTabWarningBanner(true);
        if (triggerToast) {
          triggerToast('🚨 PROCTORING WARNING: Do not switch tabs! Stay on this window.', 'warning');
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' || document.hidden) {
        executeImmediateTabSwitchSubmission('Tab Changed / Hidden');
      }
    };

    const handleWindowBlur = () => {
      executeImmediateTabSwitchSubmission('Window Focus Lost');
    };

    const handlePageHide = () => {
      executeImmediateTabSwitchSubmission('Page Unloaded / Switched');
    };

    const handleGlobalClick = (e) => {
      if (e.ctrlKey || e.metaKey || e.button === 1 || (e.target?.tagName === 'A' && e.target?.target === '_blank')) {
        executeImmediateTabSwitchSubmission('External Tab Navigation');
      }
    };

    const handleBeforeUnload = (e) => {
      executeImmediateTabSwitchSubmission('Navigated Away');
      e.preventDefault();
      e.returnValue = '⚠️ PROCTORING WARNING: Navigating away or opening a new tab will auto-submit your live test!';
      return e.returnValue;
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [calculateTestResults, setLastTestResult, dispatchPerformanceEmail, triggerToast, candidateEmail, user?.email]);

  // Trigger popup modal when remaining time reaches 0
  useEffect(() => {
    if (remainingTimeSeconds === 0 && !showSubmitModal) {
      setShowSubmitModal('time_expired');
    }
  }, [remainingTimeSeconds, showSubmitModal]);

  // Calculate dynamic active total test duration from AppContext
  const activeTestDuration = (typeof totalTestDurationSeconds === 'number' && !isNaN(totalTestDurationSeconds) && totalTestDurationSeconds > 0)
    ? totalTestDurationSeconds
    : (typeof remainingTimeSeconds === 'number' && !isNaN(remainingTimeSeconds) && remainingTimeSeconds > 0 ? remainingTimeSeconds : 300);

  // Time remaining directly from AppContext live timer
  const displayTimeSeconds = (typeof remainingTimeSeconds === 'number' && !isNaN(remainingTimeSeconds))
    ? remainingTimeSeconds
    : activeTestDuration;

  // Dynamic Timer & Half-Time Detection
  const halfTimeThreshold = Math.floor(activeTestDuration / 2);
  const isHalfTimePassed = activeTestDuration > 0 && displayTimeSeconds > 0 && displayTimeSeconds <= halfTimeThreshold;

  // Dynamic critical threshold (last 15% of test time, max 3 mins, min 30s)
  const criticalThreshold = Math.max(30, Math.floor(activeTestDuration * 0.15));
  const isTimerCritical = displayTimeSeconds > 0 && displayTimeSeconds <= criticalThreshold;
  const isTimerBlinking = isHalfTimePassed || isTimerCritical;

  // Trigger Half-Time Alert Popup Modal & Toast when 50% of total test duration has elapsed
  useEffect(() => {
    if (
      activeTestDuration > 0 &&
      displayTimeSeconds > 0 &&
      displayTimeSeconds <= halfTimeThreshold &&
      displayTimeSeconds < activeTestDuration &&
      !hasShownHalfTimeModal
    ) {
      setShowHalfTimeModal(true);
      setHasShownHalfTimeModal(true);
      if (triggerToast) {
        triggerToast('⏳ HALF-TIME ALERT: 50% of your test duration has finished! Keep up the pace.', 'warning');
      }
    }
  }, [displayTimeSeconds, activeTestDuration, halfTimeThreshold, hasShownHalfTimeModal, triggerToast]);

  // Toggle Fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Format Timer Format (HH:MM:SS or MM:SS)
  const formatTime = (secs) => {
    const validSecs = Math.max(0, parseInt(secs, 10) || 0);
    const hours = Math.floor(validSecs / 3600);
    const minutes = Math.floor((validSecs % 3600) / 60);
    const seconds = validSecs % 60;
    return `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Filter questions for current active section tab
  const safeQuestions = Array.isArray(testQuestions) ? testQuestions : [];
  const currentSectionQuestions = safeQuestions.filter((q) => q && q.sectionId === activeSectionId);
  const currentQ = safeQuestions[currentQuestionIndex] || safeQuestions[0];
  const selectedOption = currentQ ? (selectedAnswers[currentQ.id] || null) : null;

  if (safeQuestions.length === 0 || !currentQ) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fadeIn">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-base font-bold font-outfit text-slate-900">Initializing Dynamic AI Test Session...</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Analyzing PDF syllabus vector chunks & building non-repeating questions.
        </p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Calculate NTA Summary Counters
  let countUnvisited = 0;
  let countUnanswered = 0;
  let countAnswered = 0;
  let countReview = 0;
  let countAnsReview = 0;

  safeQuestions.forEach((q) => {
    if (!q) return;
    const st = questionStates[q.id] || 'unvisited';
    if (st === 'unvisited') countUnvisited++;
    else if (st === 'unanswered') countUnanswered++;
    else if (st === 'answered') countAnswered++;
    else if (st === 'review') countReview++;
    else if (st === 'ansReview') countAnsReview++;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      
      {/* Top NTA TCS-iON Style Header Bar */}
      <header className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between shadow-md z-30">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="bg-blue-600 text-white font-extrabold text-xs px-2.5 py-1 rounded shadow-xs">
            NTA TCS-iON
          </div>
          <div className="truncate">
            <h1 className="text-sm font-bold truncate max-w-xs sm:max-w-md">{activeTest?.title || 'Live Mock Test'}</h1>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Candidate: <strong className="text-white">{user?.name || 'Aspirant Student'}</strong> (Roll: 2026-NTA-{(user?.targetExamId || 'SSC-CGL').toUpperCase()})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle Fullscreen Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Exit Test Button */}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to pause and exit the live exam session? Progress will be saved.')) {
                setCurrentView('dashboard');
              }
            }}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
            title="Exit Exam & Return to Dashboard"
          >
            <X className="w-3.5 h-3.5 text-red-300" />
            <span className="hidden sm:inline">Exit Test</span>
          </button>



          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 shadow-xs cursor-pointer"
          >
            <Menu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Palette</span>
          </button>
        </div>
      </header>

      {/* Main Workspace (Left Question Panel + Right Palette Sidebar) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT MAIN QUESTION PANEL */}
        <div className="flex-1 flex flex-col justify-between bg-white p-3 sm:p-6 overflow-y-auto">
          
          <div>
            {/* Question Box Header: Exam Name, Section, Topic & Question Number */}
            <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 p-4 rounded-2xl border border-blue-100/80 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-extrabold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-md border border-amber-300">
                    {user?.targetExamName ? user.targetExamName.replace(/\([^)]*\)/g, '').trim() : 'IBPS PO'}
                  </span>
                  <span className="text-[11px] font-extrabold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-md border border-blue-200 uppercase tracking-wider">
                    {activeTest?.sections?.find((s) => s.id === activeSectionId)?.name || currentQ.sectionName || 'General Practice'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600">
                    Topic: <strong className="text-slate-900">{currentQ.topic || 'General Practice'}</strong>
                  </span>
                </div>

                <div className="text-lg font-black text-slate-900 font-outfit mt-1 flex items-center space-x-2">
                  <span>Question {currentQuestionIndex + 1}</span>
                  <span className="text-xs font-semibold text-slate-400 font-sans">
                    (of {safeQuestions.length} Total Questions)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  currentQ.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  currentQ.difficulty === 'Moderate' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {currentQ.difficulty || 'Moderate'}
                </span>
                <span className="text-xs font-bold bg-white text-slate-700 px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  +2.0 / {allowNegativeMarking ? `-${negativeMarkValue}` : '0.0'} Marks
                </span>
              </div>
            </div>

            {/* Question Content Box */}
            <div className="space-y-4 sm:space-y-6">
              <div className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                {currentQ.questionText}
              </div>

              {/* Options Radio List */}
              <div className="space-y-2.5 sm:space-y-3">
                {currentQ.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  return (
                    <label
                      key={option.id}
                      onClick={() => selectOption(currentQ.id, option.id)}
                      className={`flex items-start space-x-3 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-200 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 font-bold text-xs ${
                        isSelected ? 'border-blue-600 bg-blue-600 text-white shadow-xs' : 'border-slate-300 text-slate-600 bg-slate-50'
                      }`}>
                        {option.id}
                      </div>
                      <span className="text-xs sm:text-sm text-slate-800 font-semibold leading-normal pt-0.5">
                        {option.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Clean Action Footer Bar (Standard NTA Navigation Buttons) */}
          <div className="pt-4 sm:pt-5 mt-4 sm:mt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 w-full bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
            
            {/* Left Controls: Mark for Review & Clear Response */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleMarkForReviewAndNext}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <Bookmark className="w-3.5 h-3.5 shrink-0" />
                <span>Mark for Review & Next</span>
              </button>

              <button
                onClick={() => clearResponse(currentQ.id)}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>Clear Response</span>
              </button>
            </div>

            {/* Right Controls: Previous & Save & Next */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => jumpToQuestion(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="bg-slate-700 hover:bg-slate-800 text-white disabled:bg-slate-300 disabled:opacity-50 text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center space-x-1 cursor-pointer disabled:cursor-not-allowed active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleSaveAndNext}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>

          </div>

        </div>

        {/* MOBILE SIDEBAR BACKDROP OVERLAY */}
        {mobileSidebarOpen && (
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden animate-fadeIn"
          />
        )}

        {/* RIGHT SIDEBAR: TIMER & NTA QUESTION PALETTE GRID */}
        <aside className={`bg-slate-50 border-l border-slate-200 flex flex-col justify-between p-4 overflow-y-auto ${
          mobileSidebarOpen 
            ? 'fixed inset-y-0 right-0 w-80 max-w-[85vw] z-50 shadow-2xl flex animate-slideLeft' 
            : 'hidden lg:flex lg:w-80'
        }`}>
          
          <div className="space-y-4">
            
            {/* Candidate Profile Snippet */}
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="truncate">
                <h4 className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Aspirant Student'}</h4>
                <p className="text-[11px] text-slate-500 font-medium">Target: {user?.targetExamName || 'SSC CGL 2026'}</p>
              </div>
            </div>

            {/* Digital Countdown Timer Widget */}
            <div className={`rounded-2xl p-4 border text-center transition-all ${
              isTimerBlinking
                ? 'animate-timer-alert font-bold shadow-2xl border-4'
                : 'bg-slate-900 text-white border-slate-800'
            }`}>
              <div className="flex items-center justify-center space-x-1.5 text-xs font-semibold mb-1">
                <Clock className="w-4 h-4" />
                <span>Time Remaining</span>
              </div>

              <div className="text-3xl sm:text-4xl font-black tracking-widest font-mono font-outfit my-2">
                {formatTime(displayTimeSeconds)}
              </div>
            </div>

            {/* NTA Palette Legend Counters */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2 text-[11px] font-semibold text-slate-700">
              <div className="grid grid-cols-2 gap-2">
                
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-slate-200 text-slate-700 font-bold text-[10px]">
                    {countUnvisited}
                  </span>
                  <span className="text-slate-600">Not Visited</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-red-500 text-white font-bold text-[10px]">
                    {countUnanswered}
                  </span>
                  <span className="text-slate-600">Not Answered</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-emerald-500 text-white font-bold text-[10px]">
                    {countAnswered}
                  </span>
                  <span className="text-slate-600">Answered</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-purple-500 text-white font-bold text-[10px]">
                    {countReview}
                  </span>
                  <span className="text-slate-600">Marked Review</span>
                </div>

              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                <span className="w-5 h-5 rounded flex items-center justify-center bg-purple-600 text-white font-bold text-[10px] relative">
                  {countAnsReview}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-0.5 right-0.5"></span>
                </span>
                <span className="text-slate-600 text-[10px]">Ans & Marked for Review</span>
              </div>
            </div>

            {/* 5-State Question Palette Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Question Palette Grid
              </h4>

              <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1">
                {testQuestions.map((q, index) => {
                  const state = questionStates[q.id] || 'unvisited';
                  const isCurrent = index === currentQuestionIndex;

                  let bgClass = 'bg-slate-200 text-slate-700 hover:bg-slate-300';
                  if (state === 'unanswered') bgClass = 'bg-red-500 text-white';
                  else if (state === 'answered') bgClass = 'bg-emerald-500 text-white';
                  else if (state === 'review') bgClass = 'bg-purple-500 text-white';
                  else if (state === 'ansReview') bgClass = 'bg-purple-600 text-white relative';

                  return (
                    <button
                      key={q.id}
                      onClick={() => jumpToQuestion(index)}
                      className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-transform cursor-pointer ${bgClass} ${
                        isCurrent ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 z-10' : ''
                      }`}
                    >
                      {index + 1}
                      {state === 'ansReview' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-300 absolute top-0.5 right-0.5 border border-purple-700"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-200 mt-4">
            <button
              onClick={() => setShowSubmitModal('manual')}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black py-3.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Submit Test</span>
            </button>
          </div>

        </aside>

      </div>

      {/* TEST SUBMISSION CONFIRMATION MODAL (MANUAL, TIME EXPIRED, OR TAB SWITCH) */}
      {Boolean(showSubmitModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-6">
            
            {/* Header Banner dynamically styled per submission trigger */}
            {showSubmitModal === 'tab_switch' ? (
              <div className="flex items-center space-x-3 text-red-800 bg-red-50 p-4 rounded-2xl border border-red-200">
                <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-red-950">🚨 Single-Tab Proctoring Violation Detected</h3>
                  <p className="text-xs text-red-800">You clicked away or switched tabs. Your exam is auto-submitting below.</p>
                </div>
              </div>
            ) : showSubmitModal === 'time_expired' ? (
              <div className="flex items-center space-x-3 text-orange-800 bg-orange-50 p-4 rounded-2xl border border-orange-200">
                <Clock className="w-6 h-6 text-orange-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-orange-950">⏳ Exam Time Expired</h3>
                  <p className="text-xs text-orange-800">Your test duration has ended. Finalize your submission to view results & email report.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600" />
                <div>
                  <h3 className="text-sm font-bold text-amber-950">Confirm Test Submission</h3>
                  <p className="text-xs text-amber-800">Are you sure you want to end your test session?</p>
                </div>
              </div>
            )}

            {/* Section Breakdown Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">Section-wise Summary Breakdown</h4>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-slate-700 border-b border-slate-200 pb-1.5">
                  <span>Total Questions:</span>
                  <span className="font-bold">{testQuestions.length}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Answered:</span>
                  <span className="font-bold">{countAnswered + countAnsReview}</span>
                </div>
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>Not Answered:</span>
                  <span className="font-bold">{countUnanswered}</span>
                </div>
                <div className="flex justify-between text-purple-700 font-semibold">
                  <span>Marked for Review:</span>
                  <span className="font-bold">{countReview}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-semibold">
                  <span>Not Visited:</span>
                  <span className="font-bold">{countUnvisited}</span>
                </div>
              </div>
            </div>

            {/* Email Performance Report Option */}
            <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Send Performance Report to Email</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmailReport}
                    onChange={(e) => setSendEmailReport(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {sendEmailReport && (
                <div>
                  <label className="block text-[11px] font-bold text-blue-800 mb-1">Candidate Recipient Email</label>
                  <input
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-400"
                    placeholder="candidate@gmail.com"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              {showSubmitModal === 'manual' && (
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100"
                >
                  Resume Test
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const targetMethod = typeof showSubmitModal === 'string' ? showSubmitModal : 'manual';
                  const emailRecipient = sendEmailReport ? (candidateEmail || user?.email) : false;
                  setShowSubmitModal(false);
                  submitTestFinal(emailRecipient, targetMethod);
                  setCurrentView('test-analysis');
                }}
                className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md cursor-pointer transition-all flex items-center space-x-1.5 ${
                  showSubmitModal === 'tab_switch'
                    ? 'bg-red-600 hover:bg-red-700 active:scale-95'
                    : showSubmitModal === 'time_expired'
                    ? 'bg-orange-600 hover:bg-orange-700 active:scale-95'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                }`}
              >
                <span>
                  {showSubmitModal === 'tab_switch'
                    ? 'Finalize & Send Email Report'
                    : showSubmitModal === 'time_expired'
                    ? 'Finalize & Send Email Report'
                    : sendEmailReport
                    ? 'Submit & Send Email'
                    : 'Submit Without Email'}
                </span>
              </button>
            </div>

          </div>
        </div>
      )}



      {/* HALF-TIME POP-UP ALERT MODAL */}
      {showHalfTimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden p-6 space-y-6 animate-scaleUp">
            
            {/* Vibrant Gradient Header Banner */}
            <div className="flex items-center space-x-3 text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-5 rounded-2xl shadow-lg border border-amber-300">
              <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 shadow-md font-bold border border-white/30">
                <Clock className="w-8 h-8 text-white animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-black font-outfit text-white tracking-wide">⏳ HALF-TIME ALERT!</h3>
                <p className="text-xs text-amber-100 font-extrabold">50% of your test duration has elapsed.</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <p className="leading-relaxed font-bold text-slate-800 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80">
                Attention Aspirant: You have reached the <strong className="text-amber-700 font-black underline">50% halfway mark</strong> of your live exam. Keep track of your speed and remaining questions!
              </p>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 shadow-2xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider">Total Duration</span>
                  <span className="text-lg font-black text-slate-900 font-outfit">
                    {Math.max(1, Math.floor((activeTestDuration || 300) / 60))} Mins
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider">Time Remaining</span>
                  <span className="text-lg font-black text-red-600 font-outfit font-mono">
                    {formatTime(displayTimeSeconds)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-blue-50 p-3.5 rounded-2xl border border-blue-200 text-blue-900 shadow-2xs">
                <span className="font-bold">Questions Answered:</span>
                <span className="font-black text-blue-700 text-base">{countAnswered + countAnsReview} / {testQuestions.length}</span>
              </div>
            </div>

            {/* Ultra-Vibrant Colorful Action Button */}
            <button
              type="button"
              onClick={() => setShowHalfTimeModal(false)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-orange-500/30 ring-2 ring-amber-300 ring-offset-2 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              <span>Acknowledge & Continue Exam</span>
            </button>
          </div>
        </div>
      )}

      {/* DURING-TEST TAB SWITCH WARNING ALERT MODAL */}
      {showTabWarningBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden p-6 space-y-4 animate-scaleUp text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-sm">
              <ShieldAlert className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h3 className="text-lg font-black text-red-900 font-outfit">
                🚨 PROCTORING ALERT: DO NOT SWITCH TABS!
              </h3>
              <p className="text-xs text-red-700 font-semibold mt-1 leading-relaxed">
                You moved your cursor towards another browser tab. Switching tabs or leaving this window will <strong className="underline font-bold">IMMEDIATELY auto-submit</strong> your live test!
              </p>
            </div>

            <div className="bg-red-50 p-3 rounded-2xl border border-red-200 text-[11px] font-bold text-red-900">
              ⚠️ Final Warning: Stay on this window to complete your test safely.
            </div>

            <button
              type="button"
              onClick={() => setShowTabWarningBanner(false)}
              className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold py-3.5 px-5 rounded-2xl shadow-lg transition-all text-xs cursor-pointer"
            >
              <span>Return to Exam & Continue</span>
            </button>

          </div>
        </div>
      )}

      {/* PRE-TEST COMPREHENSIVE PROCTORING & REPORT PROTOCOL MODAL */}
      {showStartWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden p-6 sm:p-7 space-y-5 animate-scaleUp">
            
            {/* Header Alert Banner */}
            <div className="flex items-start space-x-3 text-amber-950 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 p-4 rounded-2xl border border-amber-300">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-bold">
                <ShieldAlert className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-widest bg-amber-200/80 px-2 py-0.5 rounded-md border border-amber-400">
                  NTA TCS-iON Examination Instructions
                </span>
                <h3 className="text-lg font-black text-amber-950 font-outfit mt-0.5">
                  ⚠️ Pre-Test Instructions & Report Guidelines
                </h3>
              </div>
            </div>

            {/* Comprehensive Guidelines List */}
            <div className="space-y-3.5 text-xs text-slate-700">
              <p className="font-bold text-slate-900">
                Please review your exam guidelines and report settings before beginning:
              </p>

              <div className="space-y-2.5">
                {/* Rule 1: Single Tab */}
                <div className="flex items-start space-x-2.5 bg-red-50/70 p-3 rounded-2xl border border-red-200 text-red-900 font-medium">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-red-950 font-bold block">1. Single-Tab Proctoring Enforced</strong>
                    <span>You must remain on this test window throughout the exam. Switching browser tabs or opening another window will <strong className="text-red-700 font-extrabold underline">IMMEDIATELY auto-submit</strong> your live test.</span>
                  </div>
                </div>

                {/* Rule 2: Email Report */}
                <div className="flex items-start space-x-2.5 bg-blue-50/80 p-3 rounded-2xl border border-blue-200 text-blue-950 font-medium">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-blue-900 font-bold block">2. Automated Performance Email Report</strong>
                    <span>Upon test submission (or auto-submission), an official scorecard with accuracy metrics and answer solutions will be automatically dispatched to:</span>
                    <div className="mt-1.5 flex items-center space-x-2">
                      <span className="text-[11px] font-bold text-blue-800 bg-white px-2.5 py-1 rounded-lg border border-blue-300 truncate max-w-[280px]">
                        📧 {candidateEmail || user?.email || 'aspirant@examiq.com'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rule 3: PDF Download in History */}
                <div className="flex items-start space-x-2.5 bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-emerald-950 font-medium">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-900 font-bold block">3. Permanent History & Downloadable PDF Solutions</strong>
                    <span>All test attempt records are permanently saved to your database. You can review solutions and <strong className="text-emerald-900 font-extrabold">download your complete test paper in PDF format</strong> anytime from the <em className="not-italic font-bold text-emerald-800">My Progress / History</em> tab.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Acknowledge Button */}
            <button
              type="button"
              onClick={() => {
                setShowStartWarningModal(false);
                if (triggerToast) {
                  triggerToast('🛡️ Single-Tab Proctoring Active: Good luck with your exam!', 'info');
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-600/30 transition-all text-xs flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>I Understand & Agree to Start Test Session</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

import React from 'react';
import { jsPDF } from 'jspdf';
import { API_BASE_URL } from '../../config/api';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Target, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  RotateCcw, 
  BookOpen, 
  ArrowRight,
  Mail,
  ShieldCheck,
  Check,
  Sparkles,
  Download
} from 'lucide-react';

export default function TestAnalysisModal() {
  const { lastTestResult, testQuestions, selectedAnswers, setCurrentView, launchTestSession, user, triggerToast } = useApp() || {};

  if (!lastTestResult) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-xl font-bold">No test result available.</h2>
        <button onClick={() => setCurrentView('dashboard')} className="mt-4 text-blue-600 font-bold underline">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const {
    testTitle,
    totalQuestions,
    totalAttempted,
    correctCount,
    incorrectCount,
    unattempted,
    accuracy,
    percentile,
    timeTakenSeconds
  } = lastTestResult;

  const displayScore = lastTestResult.score ?? lastTestResult.totalMarks ?? 0;
  const displayMaxMarks = lastTestResult.maxScore ?? lastTestResult.maxPossibleMarks ?? ((totalQuestions || 5) * 2);

  const minutesTaken = Math.floor(timeTakenSeconds / 60);
  const secondsTaken = timeTakenSeconds % 60;

  // Dynamic Subtitle Metrics
  const topPercentage = Math.max(0.1, parseFloat((100 - Number(percentile || 0)).toFixed(1)));
  const avgSecondsPerQ = (totalQuestions || 5) > 0 ? Math.round(timeTakenSeconds / (totalQuestions || 5)) : 0;
  const cutoffMarks = Math.round(displayMaxMarks * 0.45);
  const isAboveCutoff = Number(displayScore) >= cutoffMarks;

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxTextWidth = 168; // 168mm width fits comfortably within X=19 to X=187
      let y = 14;

      const sanitize = (str) => {
        if (!str) return '';
        return String(str)
          .replace(/\u00A0/g, ' ')
          .replace(/₹/g, 'Rs. ')
          .replace(/’/g, "'")
          .replace(/‘/g, "'")
          .replace(/“/g, '"')
          .replace(/”/g, '"')
          .replace(/–/g, '-')
          .replace(/—/g, '-')
          .replace(/\s+/g, ' ')
          .trim();
      };

      // Banner Header (Exam Name / Topic & Candidate Info)
      doc.setFillColor(30, 58, 138);
      doc.roundedRect(14, y, pageWidth - 28, 18, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(sanitize(`${testTitle || user?.targetExamName || 'ExamiQ'} - Test Scorecard`), 18, y + 7.5);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(219, 234, 254);
      doc.text(sanitize(`Candidate: ${user?.name || 'Aspirant Student'} (${user?.email || 'aspirant@examiq.com'})  |  Date: ${new Date().toLocaleDateString()}`), 18, y + 13.5);
      y += 22;

      // Scorecard Summary
      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(14, y, pageWidth - 28, 16, 3, 3, 'FD');
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(29, 78, 216);
      doc.text(`SCORE: ${displayScore} / ${displayMaxMarks} MARKS`, 18, y + 10.5);
      doc.setFontSize(9);
      doc.setTextColor(22, 163, 74);
      doc.text(`Accuracy: ${accuracy}%`, 110, y + 10.5);
      doc.setTextColor(37, 99, 235);
      doc.text(`Percentile: ${percentile}%`, 155, y + 10.5);
      y += 23;

      // Questions Loop
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Question-by-Question Solutions & Explanations', 14, y);
      y += 7;

      (testQuestions || []).forEach((q, idx) => {
        const userAns = selectedAnswers?.[q.id];
        const isCorrect = userAns === q.correctOptionId;
        const isSkipped = !userAns;
        
        let statusText = 'INCORRECT (-0.5 Marks)';
        if (isCorrect) {
          statusText = 'CORRECT (+2.0 Marks)';
        } else if (isSkipped) {
          statusText = 'UNATTEMPTED (0.0 Marks)';
        }

        const cleanQ = sanitize(q.questionText || q.question);
        const userOptObj = q.options?.find(o => o.id === userAns);
        const corrOptObj = q.options?.find(o => o.id === q.correctOptionId);
        const cleanUserOpt = sanitize(userOptObj ? userOptObj.text : (userAns || 'Unattempted'));
        const cleanCorrOpt = sanitize(corrOptObj ? corrOptObj.text : (q.correctOptionId || 'Option A'));

        const cleanExp = sanitize(q.explanation);

        // Pre-calculate wrapped lines for Question, Choices & Explanation (Matching View Format)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        const qLines = doc.splitTextToSize(`Q${idx + 1}. ${cleanQ}`, maxTextWidth);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        const userOptLines = doc.splitTextToSize(cleanUserOpt, maxTextWidth - 26);
        const corrOptLines = doc.splitTextToSize(cleanCorrOpt, maxTextWidth - 30);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        const expLines = cleanExp ? doc.splitTextToSize(`Explanation: ${cleanExp}`, maxTextWidth - 10) : [];

        // Dynamic Heights
        const headerHeight = 9.5;
        const qHeight = (qLines.length * 4.6) + 2;
        const userOptHeight = (userOptLines.length * 4.2) + 1;
        const corrOptHeight = (corrOptLines.length * 4.2) + 1;
        const expHeight = cleanExp ? (expLines.length * 3.8) + 4 : 0;
        const optionsHeight = userOptHeight + corrOptHeight + expHeight + 2;
        const cardPadding = 5;

        const boxHeight = headerHeight + qHeight + optionsHeight + cardPadding;

        // Auto Page-Break Check
        if (y + boxHeight > 275) {
          doc.addPage();
          y = 14;
        }

        // Card Outer Background & Border
        if (isCorrect) {
          doc.setFillColor(240, 253, 244);
          doc.setDrawColor(187, 247, 208);
        } else if (isSkipped) {
          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
        } else {
          doc.setFillColor(254, 242, 242);
          doc.setDrawColor(254, 202, 202);
        }
        doc.roundedRect(14, y, pageWidth - 28, boxHeight, 2.5, 2.5, 'FD');

        // --- CARD HEADER ROW ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(30, 58, 138);
        doc.text(`QUESTION ${idx + 1}`, 19, y + 6.5);

        // Right Status Badge
        const badgeWidth = 42;
        const badgeX = pageWidth - 19 - badgeWidth;
        if (isCorrect) {
          doc.setFillColor(220, 252, 231);
          doc.setDrawColor(134, 239, 172);
          doc.setTextColor(22, 101, 52);
        } else if (isSkipped) {
          doc.setFillColor(241, 245, 249);
          doc.setDrawColor(203, 213, 225);
          doc.setTextColor(71, 85, 105);
        } else {
          doc.setFillColor(254, 226, 226);
          doc.setDrawColor(252, 165, 165);
          doc.setTextColor(153, 27, 27);
        }
        doc.roundedRect(badgeX, y + 2, badgeWidth, 5.5, 1.5, 1.5, 'FD');
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.text(statusText, badgeX + (badgeWidth / 2), y + 5.8, { align: 'center' });

        // Divider Line below Header Row
        doc.setDrawColor(isCorrect ? 209 : (isSkipped ? 226 : 254), isCorrect ? 250 : (isSkipped ? 232 : 215), isCorrect ? 229 : (isSkipped ? 240 : 215));
        doc.line(14, y + headerHeight, pageWidth - 14, y + headerHeight);

        // --- ROW 2: QUESTION TEXT ---
        let currentY = y + headerHeight + 5;
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        qLines.forEach((line, lIdx) => {
          doc.text(line, 19, currentY + (lIdx * 4.6));
        });

        currentY += qHeight;

        // --- ROW 3: STACKED OPTIONS ---
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        
        // Option 1: Your Choice
        doc.setTextColor(100, 116, 139);
        doc.text('Your Choice:', 19, currentY);
        doc.setTextColor(isCorrect ? 22 : (isSkipped ? 71 : 185), isCorrect ? 101 : (isSkipped ? 85 : 28), isCorrect ? 52 : (isSkipped ? 105 : 28));
        userOptLines.forEach((line, lIdx) => {
          doc.text(line, 45, currentY + (lIdx * 4.2));
        });

        currentY += userOptHeight + 1;

        // Option 2: Correct Answer
        doc.setTextColor(100, 116, 139);
        doc.text('Correct Answer:', 19, currentY);
        doc.setTextColor(22, 101, 52);
        corrOptLines.forEach((line, lIdx) => {
          doc.text(line, 48, currentY + (lIdx * 4.2));
        });

        // Option 3: Explanation (Matching View Format)
        if (cleanExp) {
          currentY += corrOptHeight + 2;
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          expLines.forEach((line, lIdx) => {
            doc.text(line, 19, currentY + (lIdx * 3.8));
          });
        }

        y += boxHeight + 5;
      });

      doc.save('Scorecard_Report.pdf');
      if (triggerToast) triggerToast('Scorecard PDF downloaded successfully!', 'success');
    } catch (e) {
      console.error('PDF download error:', e);
      if (triggerToast) triggerToast('Error generating PDF.', 'warning');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Performance Summary</span>
            </span>
            <span className="text-xs text-blue-200">{testTitle?.replace('AI Adaptive Drill: ', '')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit">Your Test Scorecard</h1>
          <p className="text-blue-100 text-sm mt-1">
            Detailed score summary and step-by-step solutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Scorecard PDF</span>
          </button>
          <button
            onClick={() => launchTestSession(null, testTitle)}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Re-attempt Test</span>
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Email Report & Submission Method Status Banner */}
      <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold ${
        lastTestResult.submissionMethod === 'tab_switch'
          ? 'bg-amber-50/90 border-amber-300 text-amber-950'
          : lastTestResult.submissionMethod === 'time_expired'
          ? 'bg-orange-50/90 border-orange-300 text-orange-950'
          : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
      }`}>
        <div className="flex items-start sm:items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
            lastTestResult.submissionMethod === 'tab_switch'
              ? 'bg-red-500 text-white'
              : lastTestResult.submissionMethod === 'time_expired'
              ? 'bg-orange-500 text-white'
              : 'bg-emerald-500 text-white'
          }`}>
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-0.5">
              <span className="font-bold text-slate-900 text-sm">
                Scorecard Email Sent
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                lastTestResult.submissionMethod === 'tab_switch'
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : lastTestResult.submissionMethod === 'time_expired'
                  ? 'bg-orange-100 text-orange-800 border border-orange-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {lastTestResult.submissionMethod === 'tab_switch' ? '⚠️ Auto-Submitted (Tab Switch)' :
                 lastTestResult.submissionMethod === 'time_expired' ? '⏳ Auto-Submitted (Time Expired)' :
                 '✓ Submitted'}
              </span>
            </div>
            <p className="text-slate-600 font-medium">
              Detailed score report and feedback sent to <strong className="text-slate-900 font-bold">{lastTestResult.recipientEmail || user?.email || 'candidate@gmail.com'}</strong>.
              {lastTestResult.submissionMethod === 'tab_switch' && ' (Submitted automatically when tab switch / blur was detected)'}
              {lastTestResult.submissionMethod === 'time_expired' && ' (Submitted automatically when exam timer hit 00:00)'}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const targetRecipient = lastTestResult.recipientEmail || user?.email || 'aspirant@examiq.com';
            fetch(`${API_BASE_URL}/api/send-performance-email/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                attemptId: `${lastTestResult.id}_resend_${Date.now()}`,
                email: targetRecipient,
                candidateName: user?.name || 'Aspirant Candidate',
                examName: testTitle,
                submissionMethod: lastTestResult.submissionMethod || 'manual',
                score: displayScore,
                totalMarks: displayMaxMarks,
                accuracy: accuracy,
                percentile: percentile,
                timeSpent: `${minutesTaken}m ${secondsTaken}s`
              })
            }).then(() => triggerToast(`📧 Resent Performance Email to ${targetRecipient}`, 'success'));
          }}
          className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5 text-blue-600" />
          <span>Resend Email Report</span>
        </button>
      </div>

      {/* Score Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Total Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Score Obtained</div>
          <div className="text-3xl font-extrabold text-blue-600 font-outfit">
            {(displayScore !== null && displayScore !== undefined && !isNaN(displayScore) && Number(displayScore) > 0) ? String(displayScore) : '0'} <span className="text-sm text-slate-400 font-normal">/ {displayMaxMarks}</span>
          </div>
          <div className={`text-[11px] font-semibold mt-1 ${isAboveCutoff ? 'text-emerald-600' : 'text-red-500'}`}>
            {isAboveCutoff ? '✓ Above Cutoff' : 'Below Cutoff'} ({cutoffMarks} Cutoff)
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Accuracy</div>
          <div className="text-3xl font-extrabold text-emerald-600 font-outfit">{accuracy}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{correctCount} Correct, {incorrectCount} Wrong</div>
        </div>

        {/* Percentile Rank */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Estimated Percentile</div>
          <div className="text-3xl font-extrabold text-indigo-600 font-outfit">{percentile}%</div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-1">
            Top {topPercentage}% Candidates
          </div>
        </div>

        {/* Time Taken */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Time Elapsed</div>
          <div className="text-3xl font-extrabold text-slate-800 font-outfit">
            {minutesTaken}m {secondsTaken}s
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Avg {avgSecondsPerQ}s / Question
          </div>
        </div>

      </div>

      {/* Solutions & Explanation Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-outfit flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Step-by-Step Verified Solutions & Explanations</span>
            </h2>
            <p className="text-xs text-slate-500">Review your choices against verified answer keys</p>
          </div>
        </div>

        <div className="space-y-6">
          {testQuestions.map((q, idx) => {
            const userChoice = selectedAnswers[q.id];
            const isCorrect = userChoice === q.correctOptionId;
            const isSkipped = !userChoice;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isSkipped
                    ? 'border-slate-200 bg-slate-50/50'
                    : 'border-red-200 bg-red-50/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      {q.topic}
                    </span>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 ${
                    isCorrect ? 'bg-emerald-100 text-emerald-800' : isSkipped ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-800'
                  }`}>
                    {isCorrect && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {!isCorrect && !isSkipped && <XCircle className="w-3.5 h-3.5" />}
                    <span>{isCorrect ? 'Correct (+2.0)' : isSkipped ? 'Skipped (0.0)' : 'Incorrect (-0.5)'}</span>
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-900 mb-4">{q.questionText}</p>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                  {q.options.map((opt) => {
                    const isOptionCorrect = opt.id === q.correctOptionId;
                    const isUserSelected = opt.id === userChoice;

                    let style = 'border-slate-200 bg-white text-slate-700';
                    if (isOptionCorrect) {
                      style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-300';
                    } else if (isUserSelected && !isOptionCorrect) {
                      style = 'border-red-400 bg-red-50 text-red-900 font-bold';
                    }

                    return (
                      <div key={opt.id} className={`p-3 rounded-xl border text-xs flex items-center justify-between ${style}`}>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{opt.id}.</span>
                          <span>{opt.text}</span>
                        </div>
                        {isOptionCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                        {isUserSelected && !isOptionCorrect && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                  <h4 className="font-bold text-blue-900 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Detailed Solution Explanation:</span>
                  </h4>
                  <p className="text-slate-700 leading-relaxed pt-1">{q.explanation}</p>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

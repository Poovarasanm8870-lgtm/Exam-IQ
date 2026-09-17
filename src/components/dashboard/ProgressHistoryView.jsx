import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { useApp } from '../../context/AppContext';
import { 
  History, 
  Award, 
  Eye, 
  Play, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  BookOpen,
  Search,
  Download,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';

export default function ProgressHistoryView() {
  const { user, launchTestSession, triggerToast } = useApp() || {};
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [questionCount] = useState(5);

  const history = user?.attemptsHistory || [];

  // Helper to format date as "16 Sept 2026" (Day First, then Month, then Year)
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      const formattedDay = day < 10 ? `0${day}` : day;
      return `${formattedDay} ${months[monthIdx] || parts[1]} ${year}`;
    }
    return dateStr;
  };

  // Helper to clean up technical jargon & nested brackets from test titles
  const cleanTestTitle = (rawTitle) => {
    if (!rawTitle) return 'Practice Test Session';
    let cleaned = rawTitle.replace(/^AI Adaptive Drill:\s*/i, '');
    cleaned = cleaned.replace(/AI Adaptive Drill:\s*/g, '');
    cleaned = cleaned.replace(/\s*\([^()]*\([^()]*\)[^()]*\)/g, '');
    cleaned = cleaned.replace(/\(SSC CGL \([^)]+\)\)/g, '');
    cleaned = cleaned.replace(/\(Combined Graduate Level\)/g, '');
    return cleaned.trim() || rawTitle;
  };

  // Filter history items by search query and date filter
  const filteredHistory = history.filter((item) => {
    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = cleanTestTitle(item.testTitle).toLowerCase();
      const formattedDate = formatDisplayDate(item.date).toLowerCase();
      const matchesSearch = (
        title.includes(q) ||
        formattedDate.includes(q) ||
        item.date?.toLowerCase().includes(q) ||
        String(item.score).includes(q) ||
        String(item.accuracy).includes(q)
      );
      if (!matchesSearch) return false;
    }

    // 2. Exact Date Filter (YYYY-MM-DD input match)
    if (selectedDateFilter) {
      if (item.date !== selectedDateFilter) return false;
    }

    return true;
  });

  // Pagination Logic (10 items per page)
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsToDisplay = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  // Helper to generate dynamic mock question breakdown log for inspection view
  const getQuestionBreakdown = (item) => {
    if (item.questionsLog && item.questionsLog.length > 0) {
      return item.questionsLog;
    }
    // Fallback sample questions breakdown based on accuracy
    const totalQs = 5;
    const correctCount = Math.round((Number(item.accuracy) / 100) * totalQs);
    
    return [
      {
        id: 1,
        question: "A shopkeeper buys an article for ₹800 and sells it for ₹1,000. Calculate profit percentage.",
        selectedOption: "25%",
        correctOption: "25%",
        isCorrect: correctCount >= 1,
        explanation: "Profit = Selling Price - Cost Price = 1000 - 800 = 200. Profit % = (200 / 800) * 100 = 25%."
      },
      {
        id: 2,
        question: "Select the correctly spelled word from the options below.",
        selectedOption: correctCount >= 2 ? "Accommodation" : "Acomodation",
        correctOption: "Accommodation",
        isCorrect: correctCount >= 2,
        explanation: "The correct spelling is 'Accommodation' with double 'c' and double 'm'."
      },
      {
        id: 3,
        question: "Statements: All Birds are Animals. All Animals can Fly. Conclusion: All Birds can Fly.",
        selectedOption: correctCount >= 3 ? "Follows" : "Does not follow",
        correctOption: "Follows",
        isCorrect: correctCount >= 3,
        explanation: "Since Birds are a subset of Animals, and all Animals can fly, Birds must also fly."
      },
      {
        id: 4,
        question: "Which Article of the Indian Constitution guarantees the Right to Equality?",
        selectedOption: correctCount >= 4 ? "Article 14-18" : "Article 21",
        correctOption: "Article 14-18",
        isCorrect: correctCount >= 4,
        explanation: "Articles 14 to 18 of the Constitution deal with the Right to Equality."
      },
      {
        id: 5,
        question: "If 12 men complete a job in 15 days, how many days will 10 men take at the same rate?",
        selectedOption: correctCount >= 5 ? "18 days" : "16 days",
        correctOption: "18 days",
        isCorrect: correctCount >= 5,
        explanation: "Work = Men × Days = 12 × 15 = 180 man-days. Days required = 180 / 10 = 18 days."
      }
    ];
  };

  // Download Test Paper Directly as a Genuine Binary PDF Document
  const handleDownloadTestPaperPDF = (item) => {
    if (!item) return;

    // Helper to replace unicode characters unsupported by standard jsPDF fonts
    const sanitizePDFText = (str) => {
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

    const qList = getQuestionBreakdown(item);
    const displayTitle = sanitizePDFText(cleanTestTitle(item.testTitle));
    const displayDate = sanitizePDFText(formatDisplayDate(item.date));
    const examShortName = (user?.targetExamName || 'SSC CGL').split(' ')[0] || 'SSC_CGL';
    const fullExamName = user?.targetExamName ? user.targetExamName.replace(/\([^)]*\)/g, '').trim() : 'Competitive Exam';
    const simpleHeading = `${fullExamName} - Performance & Solution Audit`;
    const pdfFileName = `${examShortName}_Test_Report.pdf`;

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const maxTextWidth = 168; // 168mm width fits comfortably within X=19 to X=187
      let y = 14;

      // 1. ELEGANT BLUE BANNER HEADER
      doc.setFillColor(30, 58, 138); // Dark Royal Navy Blue
      doc.roundedRect(14, y, pageWidth - 28, 15, 2, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11.5);
      doc.setTextColor(255, 255, 255);
      doc.text(sanitizePDFText(simpleHeading), 18, y + 9.5);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(224, 231, 255);
      doc.text('EXAMIQ TEST REPORT', pageWidth - 18, y + 9.5, { align: 'right' });
      
      y += 19;

      // 2. CANDIDATE METADATA GRID BOX
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, y, pageWidth - 28, 26, 3, 3, 'FD');

      doc.setFontSize(8.5);

      // Left Column
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text('CANDIDATE NAME:', 18, y + 8);
      doc.setTextColor(15, 23, 42);
      doc.text(sanitizePDFText(user?.name || 'Aspirant Student'), 52, y + 8);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text('ATTEMPT DATE:', 18, y + 17);
      doc.setTextColor(15, 23, 42);
      doc.text(displayDate, 52, y + 17);

      // Right Column
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text('EMAIL ADDRESS:', 105, y + 8);
      doc.setTextColor(15, 23, 42);
      const safeEmail = sanitizePDFText(user?.email || 'aspirant@examiq.com');
      const emailLines = doc.splitTextToSize(safeEmail, 55);
      doc.text(emailLines[0], 135, y + 8);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text('TEST TITLE:', 105, y + 17);
      doc.setTextColor(15, 23, 42);
      const titleLines = doc.splitTextToSize(displayTitle, 55);
      doc.text(titleLines[0] + (titleLines.length > 1 ? '...' : ''), 130, y + 17);

      y += 31;

      // 3. SCORECARD SUMMARY BOX
      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(14, y, pageWidth - 28, 16, 3, 3, 'FD');

      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(29, 78, 216);
      doc.text(`SCORE: ${item.score} / ${item.maxScore} MARKS`, 18, y + 10.5);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 163, 74);
      doc.text(`Accuracy: ${item.accuracy}%`, 110, y + 10.5);
      doc.setTextColor(37, 99, 235);
      doc.text(`Percentile: ${item.percentile}%`, 155, y + 10.5);

      y += 23;

      // 4. SECTION HEADING
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Question-by-Question Solutions & Explanations', 14, y);
      y += 7;

      // 5. QUESTION CARDS LOOP - ZERO SOLUTIONS INCLUDED (PER USER REQUEST)
      qList.forEach((q, idx) => {
        const isCorrect = q.isCorrect;
        const isSkipped = !isCorrect && (q.selectedOption === 'Unattempted' || !q.selectedOption);
        
        let statusText = 'INCORRECT (-0.5 Marks)';
        if (isCorrect) {
          statusText = 'CORRECT (+2.0 Marks)';
        } else if (isSkipped) {
          statusText = 'UNATTEMPTED (0.0 Marks)';
        }

        const cleanQuestion = sanitizePDFText(q.question);
        const cleanSelected = sanitizePDFText(q.selectedOption || 'Unattempted');
        const cleanCorrect = sanitizePDFText(q.correctOption || 'Option A');

        // Pre-calculate wrapped lines for Question & Choices (NO SOLUTIONS)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        const qLines = doc.splitTextToSize(`Q${idx + 1}. ${cleanQuestion}`, maxTextWidth);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        const userOptLines = doc.splitTextToSize(cleanSelected, maxTextWidth - 26);
        const corrOptLines = doc.splitTextToSize(cleanCorrect, maxTextWidth - 30);

        // Dynamic Heights (Zero Solution height)
        const headerHeight = 9.5;
        const qHeight = (qLines.length * 4.6) + 2;
        const userOptHeight = (userOptLines.length * 4.2) + 1;
        const corrOptHeight = (corrOptLines.length * 4.2) + 1;
        const optionsHeight = userOptHeight + corrOptHeight + 2;
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

        y += boxHeight + 5;
      });

      // Save Genuine Binary PDF File Directly
      doc.save(pdfFileName);

      if (triggerToast) triggerToast(`PDF downloaded successfully: ${pdfFileName}`, 'success');
    } catch (err) {
      console.error('jsPDF generation error:', err);
      if (triggerToast) triggerToast('Failed to generate PDF file.', 'warning');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner (Regal Warm Amber & Espresso Gold Theme) */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-950 via-stone-900 to-slate-950 text-white p-6 sm:p-8 shadow-2xl border border-amber-800/40 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-orange-600/15 rounded-full blur-3xl"></div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-xs">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Attempt Audit & Score Log</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight text-white">
            My Progress / History
          </h1>
          <p className="text-amber-100/90 text-sm max-w-2xl leading-relaxed">
            Review your recent test sessions, evaluate accuracy trends, and inspect detailed question-by-question solutions for each test.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center shrink-0 shadow-lg">
          <div className="px-3">
            <div className="text-xl font-extrabold text-white font-outfit leading-tight">{user?.testsAttempted || 0}</div>
            <div className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">Total Attempts</div>
          </div>
          <div className="px-3 border-l border-white/20">
            <div className="text-xl font-extrabold text-amber-300 font-outfit leading-tight">{user?.avgAccuracy || 0}%</div>
            <div className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">Avg Accuracy</div>
          </div>
        </div>
      </div>

      {/* History Table Card with Real-time Search & Date Filters */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-outfit flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Test Attempt Logs</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Showing 10 sessions per page. Filter by text or pick a specific date below.</p>
          </div>

          {/* Search Filter & Date Picker Inputs */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Text Search Input */}
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by test title..."
                className="pl-9 pr-8 py-2 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs font-medium w-full sm:w-56 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date Filter Input */}
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="date"
                value={selectedDateFilter}
                onChange={(e) => {
                  setSelectedDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-8 py-2 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs font-medium text-slate-700 bg-white transition-all cursor-pointer"
                title="Select date to filter history logs"
              />
              {selectedDateFilter && (
                <button
                  onClick={() => {
                    setSelectedDateFilter('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  title="Clear date filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-2 rounded-xl border border-blue-200 whitespace-nowrap">
              {filteredHistory.length} Total Match{filteredHistory.length !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              {searchQuery || selectedDateFilter ? 'No test attempts found for applied filters' : 'No test attempts logged yet'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedDateFilter 
                ? 'Try clearing your search keyword or date filter to view all logged exam sessions.' 
                : 'Start your first test session from the Tests page to view your diagnostic scorecards here.'}
            </p>
            {(searchQuery || selectedDateFilter) ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDateFilter('');
                  setCurrentPage(1);
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            ) : (
              <button
                onClick={() => launchTestSession(null, `Full Mock: ${user?.targetExamName || 'SSC CGL'}`, 5)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Take Your First Test Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Test Title</th>
                    <th className="py-3.5 px-4">Score</th>
                    <th className="py-3.5 px-4">Accuracy</th>
                    <th className="py-3.5 px-4">Percentile</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {currentItemsToDisplay.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      onClick={() => setSelectedHistoryItem(item)}
                      className="hover:bg-blue-50/70 transition-colors cursor-pointer group"
                      title="Click to view detailed score & question breakdown"
                    >
                      <td className="py-3.5 px-4 text-slate-900 flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Award className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="group-hover:text-blue-700 transition-colors text-xs font-bold">{cleanTestTitle(item.testTitle)}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900 text-xs">
                        {item.score} <span className="text-slate-400 font-normal text-[11px]">/ {item.maxScore}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-emerald-200">
                          {item.accuracy}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-blue-700 text-xs">
                        {item.percentile}%
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-semibold text-xs whitespace-nowrap">
                        {formatDisplayDate(item.date)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2 shrink-0">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedHistoryItem(item);
                            }}
                            className="text-xs text-blue-600 group-hover:text-blue-800 font-bold hover:underline inline-flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors shrink-0"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadTestPaperPDF(item);
                            }}
                            className="text-xs text-emerald-700 font-bold hover:underline inline-flex items-center space-x-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors shrink-0"
                            title="Download complete test paper PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls (Max 10 per page) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs font-medium text-slate-600">
              <div>
                Showing <strong className="text-slate-900 font-bold">{indexOfFirstItem + 1}</strong> to <strong className="text-slate-900 font-bold">{Math.min(indexOfLastItem, filteredHistory.length)}</strong> of <strong className="text-slate-900 font-bold">{filteredHistory.length}</strong> test attempt logs
              </div>

              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <span className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 rounded-lg border border-blue-200">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Detailed Attempt Question-by-Question Breakdown Modal */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 max-h-[90vh] flex flex-col justify-between">
            
            <button
              onClick={() => setSelectedHistoryItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Title */}
            <div className="flex items-center space-x-3 mb-4 border-b border-slate-100 pb-4 shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  Question-by-Question Analysis
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-outfit mt-0.5">{cleanTestTitle(selectedHistoryItem.testTitle)}</h3>
                <p className="text-xs text-slate-500">Attempted on {formatDisplayDate(selectedHistoryItem.date)}</p>
              </div>
            </div>

            <div className="overflow-y-auto pr-1 space-y-5 flex-1">
              
              {/* TAB SWITCH VIOLATION PROCTORING BANNER */}
              {selectedHistoryItem.submissionMethod === 'tab_switch' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start space-x-3 text-red-900">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-red-800 uppercase tracking-wider flex items-center space-x-1.5">
                      <span>🚨 Auto-Submitted via Single-Tab Proctoring Violation</span>
                    </div>
                    <p className="text-xs text-red-700 mt-1 font-semibold leading-relaxed">
                      This test session was auto-submitted because the candidate switched tabs or lost window focus during the live exam.
                    </p>
                  </div>
                </div>
              )}

              {/* Score Highlight Box */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Score Achieved</div>
                  <div className="text-3xl font-black text-blue-700 font-outfit">
                    {selectedHistoryItem.score} <span className="text-sm text-slate-500 font-semibold">/ {selectedHistoryItem.maxScore}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                    Accuracy: {selectedHistoryItem.accuracy}%
                  </span>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200">
                    Percentile: {selectedHistoryItem.percentile}%
                  </span>
                </div>
              </div>

              {/* Correct / Wrong Questions Section Header */}
              <div className="flex items-center justify-between pt-1 border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Exam Response Breakdown & Solutions</span>
                </h4>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {getQuestionBreakdown(selectedHistoryItem).map((q, idx) => (
                  <div 
                    key={q.id || idx}
                    className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                      q.isCorrect 
                        ? 'bg-emerald-50/50 border-emerald-200' 
                        : 'bg-red-50/50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-2">
                        <span className="font-extrabold text-xs text-slate-700 shrink-0">Q{idx + 1}.</span>
                        <p className="text-xs font-bold text-slate-900 leading-relaxed">{q.question}</p>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center space-x-1 shrink-0 ${
                        q.isCorrect 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : 'bg-red-100 text-red-800 border-red-300'
                      }`}>
                        {q.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-red-600" />}
                        <span>{q.isCorrect ? 'Correct (+2.0)' : 'Incorrect (-0.5)'}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium pt-1">
                      <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Your Choice</span>
                        <span className={q.isCorrect ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                          {q.selectedOption}
                        </span>
                      </div>
                      <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Correct Answer</span>
                        <span className="text-emerald-700 font-bold">
                          {q.correctOption}
                        </span>
                      </div>
                    </div>

                    {q.explanation && (
                      <div className="bg-white/90 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed mt-2">
                        <strong className="text-slate-900 font-bold block mb-0.5">Solution & Explanation:</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 shrink-0 mt-4">
              <button
                onClick={() => handleDownloadTestPaperPDF(selectedHistoryItem)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Paper</span>
              </button>
              <button
                onClick={() => {
                  const title = selectedHistoryItem.testTitle;
                  setSelectedHistoryItem(null);
                  launchTestSession(null, title, questionCount);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Re-attempt This Test</span>
              </button>
              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

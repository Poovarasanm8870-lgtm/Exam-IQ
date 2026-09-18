import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe,
  Bell,
  ExternalLink,
  FileText,
  Calendar,
  ShieldCheck,
  Target, 
  Award, 
  Activity,
  History,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function AspirantDashboard() {
  const { 
    user, 
    setCurrentView,
    setShowOnboardingModal,
    getDaysRemainingForExam,
    adminExamDates
  } = useApp() || {};

  const liveDaysRemaining = getDaysRemainingForExam(user?.targetExamId || user?.targetExamName, adminExamDates);

  const webUpdates = [
    {
      id: 1,
      tag: 'SSC CGL 2026',
      title: 'Tier-1 & Tier-2 Official Exam Pattern & Marking Guidelines',
      date: 'Sept 2026',
      badge: 'Official Web Notice',
      link: 'https://ssc.gov.in',
      desc: '100 Questions, 60 minutes duration. Tier-1 includes minus marking penalty of -0.50 per incorrect attempt.'
    },
    {
      id: 2,
      tag: 'UPSC CSE 2026',
      title: 'General Studies & CSAT Weightage & Syllabus Structure',
      date: 'Sept 2026',
      badge: 'Syllabus PDF Active',
      link: 'https://upsc.gov.in',
      desc: 'High-yield focus on Indian Polity, Current Events, Economics & Quantitative Aptitude comprehension.'
    },
    {
      id: 3,
      tag: 'IBPS PO / Bank Exams',
      title: 'Banking Awareness & Quantitative Speed Drills Benchmark',
      date: 'Sept 2026',
      badge: 'Portal Update',
      link: 'https://ibps.in',
      desc: 'Adaptive speed benchmarks updated for Data Interpretation & Syllogism Reasoning drills.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* 1. Dynamic Header Welcome Banner (Deep Sapphire & Midnight Navy Theme) */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 overflow-hidden shadow-2xl border border-blue-800/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-amber-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1 shadow-sm">
                <Target className="w-3.5 h-3.5" />
                <span>Target: {user?.targetExamName || 'SSC CGL 2026'}</span>
              </span>
              <span className="bg-white/10 backdrop-blur-md text-blue-100 text-xs px-3 py-1 rounded-full border border-white/15">
                {liveDaysRemaining} Days to Exam
              </span>
            </div>

            <h1 className="text-fluid-h1 font-extrabold font-outfit tracking-tight text-white leading-tight">
              Welcome back, {user?.name || 'Aspirant'}! 👋
            </h1>
            <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
              Your live calculated accuracy across <strong className="text-white font-bold">{user?.testsAttempted || 0} attempts</strong> is <strong className="text-amber-300 font-bold">{user?.avgAccuracy || 0}%</strong>. Select a dedicated page from the menu to continue your preparation.
            </p>
          </div>

          {/* Header Live Quick Stats */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0 shadow-lg">
            <div className="flex items-center space-x-3 px-3 py-1">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-white font-outfit leading-tight">{user?.testsAttempted || 0}</div>
                <div className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Tests Taken</div>
              </div>
            </div>

            <div className="h-10 w-px bg-white/20"></div>

            <div className="flex items-center space-x-3 px-3 py-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-amber-300 font-outfit leading-tight">{user?.avgAccuracy || 0}%</div>
                <div className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Live Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Navigation Portals to Dedicated Pages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Navigation Card 0: Target Exam Goal (Featured Distinctive Card) */}
        <div 
          onClick={() => setShowOnboardingModal(true)}
          className="bg-gradient-to-br from-blue-50 via-indigo-50/80 to-sky-100/70 p-6 rounded-3xl border-2 border-blue-400/90 shadow-md hover:shadow-xl hover:border-blue-600 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-blue-500/20">
                <Target className="w-6 h-6" />
              </div>
              <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                {liveDaysRemaining} Days Left
              </span>
            </div>
            <h3 className="font-extrabold text-blue-950 text-lg mb-1 font-outfit group-hover:text-blue-700 transition-colors">
              {user?.targetExamName || 'SSC CGL 2026'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Your active target exam goal. Click anytime to switch exam or adjust countdown.
            </p>
          </div>
          <div className="text-xs font-extrabold text-blue-700 flex items-center space-x-1">
            <span>Change Target Exam</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Navigation Card 1: Tests */}
        <div 
          onClick={() => setCurrentView('tests')}
          className="bg-white hover:bg-blue-50/50 p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-1 font-outfit group-hover:text-blue-600 transition-colors">
              Tests Suite
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Access AI full mocks, customizable question counts, and minus marking control rules.
            </p>
          </div>
          <div className="text-xs font-bold text-blue-600 flex items-center space-x-1">
            <span>Open Tests Page</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Navigation Card 2: Activity (Subject Mastery & Daily Goals) */}
        <div 
          onClick={() => setCurrentView('activity')}
          className="bg-white hover:bg-indigo-50/50 p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-1 font-outfit group-hover:text-indigo-600 transition-colors">
              Activity & Goals
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Track live subject-wise accuracy breakdowns, concepts mastery, and interactive daily goals.
            </p>
          </div>
          <div className="text-xs font-bold text-indigo-600 flex items-center space-x-1">
            <span>Open Activity Page</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Navigation Card 3: My Progress / History */}
        <div 
          onClick={() => setCurrentView('progress-history')}
          className="bg-white hover:bg-amber-50/50 p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-1 font-outfit group-hover:text-amber-600 transition-colors">
              My Progress / History
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Inspect your last 8 test attempt logs, performance grades, and detailed evaluation scorecards.
            </p>
          </div>
          <div className="text-xs font-bold text-amber-600 flex items-center space-x-1">
            <span>View Attempt History</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* 3. Official Competitive Exam Notifications Hub */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 font-outfit flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Official Exam Notifications & Syllabus Hub</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Stay updated with official portal notices, exam patterns, and syllabus benchmarks</p>
          </div>
        </div>

        {/* Web News Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {webUpdates.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-50 hover:bg-blue-50/40 p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-700 transition-colors leading-snug font-outfit">
                  {item.title}
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600 text-[11px] flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{item.badge}</span>
                </span>
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center space-x-1 hover:underline"
                >
                  <span>Portal Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Exam Syllabus & Pattern Summary Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Target Syllabus Guide</span>
            </div>
            <h4 className="text-base font-extrabold font-outfit">
              Ready for {user?.targetExamName || 'SSC CGL 2026'} Syllabus Drill?
            </h4>
            <p className="text-xs text-slate-300 max-w-xl">
              Configurable test parameters, negative marking simulations, and AI question generators are available on your dedicated Tests Suite page.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('tests')}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 px-5 rounded-xl shadow-md transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Go to Tests Suite</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}

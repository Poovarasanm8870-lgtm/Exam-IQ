import React from 'react';
import { useApp, computeDynamicSubjectAccuracy, DEFAULT_DAILY_CHECKLIST } from '../../context/AppContext';
import { 
  Activity, 
  BarChart3, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  BrainCircuit, 
  ArrowRight,
  Calculator,
  Compass,
  FileText,
  Globe,
  CheckCircle
} from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../../data/mockData';

export default function ActivityView() {
  const { user, toggleChecklistItem, setCurrentView } = useApp() || {};
  
  // Dynamically compute subject accuracy from user's attempt history (wiping out stale 40% cached values)
  const subjectAcc = computeDynamicSubjectAccuracy(user?.attemptsHistory || []);
  const rawChecklist = user?.dailyChecklist;
  const checklist = (Array.isArray(rawChecklist) && rawChecklist.length > 0) ? rawChecklist : DEFAULT_DAILY_CHECKLIST;
  const completedCount = checklist.filter((item) => item.completed).length;
  const checklistPercent = Math.round((completedCount / (checklist.length || 1)) * 100);

  const subjects = [
    {
      id: 'quant',
      title: 'Quantitative Aptitude',
      accuracy: subjectAcc.quant ?? 0,
      icon: Calculator,
      color: 'blue',
      accentBg: 'bg-blue-50 border-blue-200 text-blue-700',
      barColor: 'bg-blue-600',
      topics: ['DI Tables & Charts', 'Profit & Loss', 'SI & CI', 'Simplification']
    },
    {
      id: 'reasoning',
      title: 'Reasoning Ability',
      accuracy: subjectAcc.reasoning ?? 0,
      icon: Compass,
      color: 'indigo',
      accentBg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      barColor: 'bg-indigo-600',
      topics: ['Seating Arrangement', 'Puzzles', 'Syllogisms', 'Coding-Decoding']
    },
    {
      id: 'english',
      title: 'English Language',
      accuracy: subjectAcc.english ?? 0,
      icon: FileText,
      color: 'amber',
      accentBg: 'bg-amber-50 border-amber-200 text-amber-700',
      barColor: 'bg-amber-500',
      topics: ['Reading Comprehension', 'Error Detection', 'Para Jumbles', 'Cloze Test']
    },
    {
      id: 'ga',
      title: 'General Awareness',
      accuracy: subjectAcc.ga ?? 0,
      icon: Globe,
      color: 'emerald',
      accentBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      barColor: 'bg-emerald-500',
      topics: ['Current Affairs', 'Banking Awareness', 'Static GK', 'Financial News']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Clean Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 shadow-2xl border border-indigo-800/40 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-xs">
              <Activity className="w-3.5 h-3.5 text-blue-300" />
              <span>Daily Preparation & Progress Hub</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight text-white">
            Student Activity & Study Goals
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Organize your daily preparation goals, track topic performance across all subjects, and stay on target for your target exam.
          </p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Columns: Subject Performance Grid */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-outfit flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Subject Performance & Accuracy</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Calculated dynamically from your completed test sessions</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                4 Core Subjects
              </span>
            </div>

            {/* Subject Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((sub) => {
                const IconComp = sub.icon;
                return (
                  <div key={sub.id} className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className={`p-2.5 rounded-xl ${sub.accentBg}`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-slate-900 leading-snug">{sub.title}</h3>
                            <span className="text-[10px] text-slate-500 font-medium">Core Section</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-slate-600 font-semibold">Accuracy</span>
                          <span className="text-base font-extrabold font-outfit text-slate-900">{sub.accuracy}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${sub.barColor} rounded-full transition-all duration-500`}
                            style={{ width: `${sub.accuracy}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Topic Tags */}
                      <div className="pt-2 border-t border-slate-200/60">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Key Syllabus Topics</p>
                        <div className="flex flex-wrap gap-1">
                          {sub.topics.map((t, idx) => (
                            <span key={idx} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Practice Prompt Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-bold flex items-center justify-center sm:justify-start space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Targeted Subject Practice</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Want to improve accuracy in weak sections? Launch custom topic mock drills.
                </p>
              </div>
              <button
                onClick={() => setCurrentView && setCurrentView('tests')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shrink-0 flex items-center space-x-1.5 shadow-md active:scale-95"
              >
                <span>Select Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* Right 5 Columns: Daily Checklist & Inspiration */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Daily Checklist Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-outfit flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Interactive Daily Study Goals</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Click any task below to check off completion</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {checklistPercent}% Complete
              </span>
            </div>

            {/* Checklist items */}
            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`flex items-center space-x-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    item.completed
                      ? 'bg-emerald-50/70 border-emerald-200 text-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-blue-400 hover:bg-blue-50/30'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
                    item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {item.completed && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={`text-xs font-semibold leading-relaxed ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Daily Milestone Progress</span>
                <span className="text-emerald-600 font-extrabold">{completedCount} of {checklist.length} Completed</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${checklistPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* AI Mentor Advice Card */}
          <div className="space-y-4">
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-3xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
                <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Mentor Preparation Advice</span>
              </div>
              <p className="text-xs text-blue-950 leading-relaxed">
                Consistency is key in competitive exam preparation. Focus on regular daily practice drills and thorough error analysis after every mock test.
              </p>
            </div>

            {/* Daily Quote Card */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-3 shadow-md relative overflow-hidden">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Mentor Inspiration</span>
              </div>
              <blockquote className="text-xs sm:text-sm text-blue-100 italic font-serif leading-relaxed">
                "{MOTIVATIONAL_QUOTES[0].text}"
              </blockquote>
              <p className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wide text-right">
                — {MOTIVATIONAL_QUOTES[0].author}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

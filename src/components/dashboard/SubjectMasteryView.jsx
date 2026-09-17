import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  ShieldAlert, 
  Sparkles, 
  Play, 
  Target,
  Award,
  ArrowRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

export default function SubjectMasteryView() {
  const { user, launchAiDynamicTest, isAiGenerating, setCurrentView } = useApp();
  const subjectAcc = user?.subjectAccuracy || { quant: 75, reasoning: 80, english: 70, ga: 72 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-amber-300" />
              <span>Real-Time Mastery Diagnostics</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
            Live Subject Mastery & Performance
          </h1>
          <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
            Track your accuracy across Quantitative Aptitude, Reasoning Ability, English Comprehension, and General Awareness in real-time based on test logs.
          </p>
        </div>

        <button
          onClick={() => launchAiDynamicTest('High Difficulty Yield & Weak Areas', 'Quantitative Aptitude', 10)}
          disabled={isAiGenerating}
          className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold py-3 px-5 rounded-2xl shadow-md transition-all text-xs flex items-center space-x-2 shrink-0 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch AI Weak Area Drill</span>
        </button>
      </div>

      {/* Subject Mastery Progress Bars Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-outfit flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Subject Accuracy & Concepts Mastery</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Calculated dynamically from your completed test sessions</p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
            Live Evaluation Active
          </span>
        </div>

        <div className="space-y-6">
          {/* Quantitative Aptitude */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <span className="text-sm">Quantitative Aptitude</span>
              </span>
              <span className="text-blue-600 text-sm font-extrabold">{subjectAcc.quant}% Accuracy</span>
            </div>
            <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-500 shadow-xs" style={{ width: `${subjectAcc.quant}%` }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-1">
              <span>Topics: Profit & Loss, DI Tables, SI/CI, Time & Distance</span>
              <span>{subjectAcc.quant >= 75 ? 'Mastery Level: High' : 'Mastery Level: Moderate'}</span>
            </div>
          </div>

          {/* Reasoning Ability */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                <span className="text-sm">Reasoning Ability</span>
              </span>
              <span className="text-indigo-600 text-sm font-extrabold">{subjectAcc.reasoning}% Accuracy</span>
            </div>
            <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden flex">
              <div className="h-full bg-indigo-600 rounded-full transition-all duration-500 shadow-xs" style={{ width: `${subjectAcc.reasoning}%` }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-1">
              <span>Topics: Puzzles, Seating Arrangement, Syllogisms, Coding</span>
              <span>{subjectAcc.reasoning >= 75 ? 'Mastery Level: High' : 'Mastery Level: Moderate'}</span>
            </div>
          </div>

          {/* English Comprehension */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-sm">English Comprehension</span>
              </span>
              <span className="text-amber-600 text-sm font-extrabold">{subjectAcc.english}% Accuracy</span>
            </div>
            <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden flex">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-500 shadow-xs" style={{ width: `${subjectAcc.english}%` }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-1">
              <span>Topics: Reading Passages, Error Spotting, Cloze Test</span>
              <span>{subjectAcc.english >= 75 ? 'Mastery Level: High' : 'Mastery Level: Moderate'}</span>
            </div>
          </div>

          {/* General Awareness & GS */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-sm">General Awareness & GS</span>
              </span>
              <span className="text-emerald-600 text-sm font-extrabold">{subjectAcc.ga}% Accuracy</span>
            </div>
            <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-xs" style={{ width: `${subjectAcc.ga}%` }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-1">
              <span>Topics: Current Affairs, Banking Policy, Indian Constitution</span>
              <span>{subjectAcc.ga >= 75 ? 'Mastery Level: High' : 'Mastery Level: Moderate'}</span>
            </div>
          </div>
        </div>

        {/* Mentor Diagnostic Note */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-blue-900">Empathetic Mentor Diagnostic Insight</h4>
            <p className="text-xs text-blue-800 leading-relaxed mt-0.5">
              {user?.testsAttempted === 0
                ? "Take your first test session to generate customized subject diagnostics and recommendations."
                : `You have completed ${user.testsAttempted} tests so far with ${user.avgAccuracy}% average accuracy. Practice targeted drills to boost lower accuracy subjects above 80%.`}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

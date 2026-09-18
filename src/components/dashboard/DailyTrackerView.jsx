import React from 'react';
import { useApp, DEFAULT_DAILY_CHECKLIST } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Flame, 
  Target, 
  Clock, 
  Award,
  Sparkles,
  Calendar,
  BookOpen
} from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../../data/mockData';

export default function DailyTrackerView() {
  const { user, toggleChecklistItem } = useApp();
  const rawChecklist = user?.dailyChecklist;
  const checklist = (Array.isArray(rawChecklist) && rawChecklist.length > 0) ? rawChecklist : DEFAULT_DAILY_CHECKLIST;
  const completedCount = checklist.filter((item) => item.completed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{user?.streakDays || 1}-Day Active Streak</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
            Tracker & Daily Study Goals
          </h1>
          <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
            Build exam consistency by checking off daily syllabus goals and maintaining your study streak.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center shrink-0 min-w-[180px]">
          <div className="text-2xl font-black text-amber-300 font-outfit">
            {completedCount} / {checklist.length || 4}
          </div>
          <div className="text-[11px] text-blue-200 uppercase font-bold tracking-wider mt-0.5">Tasks Completed Today</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interactive Checklist Column */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-outfit flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Interactive Daily Task Checklist</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Click any task to check or uncheck your progress for today</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              {Math.round((completedCount / (checklist.length || 1)) * 100)}% Complete
            </span>
          </div>

          <div className="space-y-3.5">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`flex items-center space-x-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  item.completed
                    ? 'bg-emerald-50/70 border-emerald-200 text-slate-500 line-through'
                    : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-blue-400 hover:bg-blue-50/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => {}}
                  className="w-5 h-5 text-blue-600 rounded-lg border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0"
                />
                <span className="text-xs sm:text-sm font-bold leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="pt-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Overall Goal Progress</span>
              <span className="text-blue-600">{completedCount} of {checklist.length} Tasks</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / (checklist.length || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Streak & Motivation Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Streak Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-200 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 text-sm font-bold text-amber-900">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{user?.streakDays || 1}-Day Streak Burning</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Complete at least 1 mock test or daily study drill every 24 hours to keep your streak burning bright!
            </p>
          </div>

          {/* Motivational Quote Card */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Aspirant Mentor Quote</span>
            </div>
            <blockquote className="text-xs text-blue-100 italic font-serif leading-relaxed">
              "{MOTIVATIONAL_QUOTES[0].text}"
            </blockquote>
            <p className="text-[11px] font-extrabold text-amber-400 uppercase">
              — {MOTIVATIONAL_QUOTES[0].author}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

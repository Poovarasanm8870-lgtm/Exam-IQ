import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Zap, 
  Award, 
  BookOpen, 
  Layers, 
  Sliders, 
  Clock, 
  Sparkles,
  Target,
  FileText
} from 'lucide-react';

export default function TestsView() {
  const { 
    user, 
    launchAiDynamicTest, 
    isAiGenerating,
    getTestDurationMinutes,
    allowNegativeMarking,
    negativeMarkValue,
    toggleNegativeMarking
  } = useApp() || {};

  const [questionCount, setQuestionCount] = useState(5);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Moderate');
  const [activeCardId, setActiveCardId] = useState(null);

  const handleLaunch = async (cardId, launchFn) => {
    setActiveCardId(cardId);
    try {
      await launchFn();
    } finally {
      setActiveCardId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner (Royal Violet & Fuchsia Practice Suite Theme) */}
      <div className="relative rounded-3xl bg-gradient-to-r from-violet-900 via-purple-950 to-indigo-950 text-white p-6 sm:p-8 shadow-2xl border border-purple-800/40 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 -mb-10 w-64 h-64 bg-violet-600/25 rounded-full blur-3xl"></div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-400/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-xs">
              <Layers className="w-3.5 h-3.5 text-fuchsia-300" />
              <span>Practice & Mock Test Suite</span>
            </span>
            <span className="bg-amber-400 text-amber-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1 shadow-xs">
              <Target className="w-3.5 h-3.5" />
              <span>{user?.targetExamName || 'SSC CGL 2026'}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight text-white">
            AI Test Launchers & Practice Drills
          </h1>
          <p className="text-purple-100 text-sm max-w-2xl leading-relaxed">
            Generate 100% unique, non-repeating question sets from official syllabus PDFs across Quantitative, Reasoning, English, and General Awareness.
          </p>
        </div>

        <button
          onClick={() => handleLaunch('header-mock', () => launchAiDynamicTest('Full Syllabus Mock', 'All Subjects', questionCount, selectedDifficulty))}
          disabled={isAiGenerating}
          className="relative z-10 bg-gradient-to-r from-fuchsia-500 to-indigo-600 hover:from-fuchsia-400 hover:to-indigo-500 text-white font-extrabold py-3 px-6 rounded-2xl shadow-lg shadow-fuchsia-900/40 border border-white/20 transition-all text-xs flex items-center space-x-2 shrink-0 disabled:opacity-50 cursor-pointer group"
        >
          <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span>Launch AI Full Mock</span>
        </button>
      </div>

      {/* TEST SESSION CONFIGURATION CARD */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        
        {/* Top Header: Title & Live Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-outfit">Test Session Configuration</h3>
              <p className="text-xs text-slate-500">Configure level, duration, penalty rules, and question count</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 flex items-center space-x-1.5 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Configured: <strong className="text-blue-950 font-bold">{questionCount} Qs • {getTestDurationMinutes(questionCount)} Mins • {selectedDifficulty}</strong></span>
            </span>
          </div>
        </div>

        {/* 4-Control Dedicated Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Control 1: Question Difficulty Level */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">1. Difficulty Level</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full text-xs font-bold bg-white text-indigo-900 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 cursor-pointer shadow-2xs"
            >
              <option value="Easy">Easy Level</option>
              <option value="Moderate">Moderate Level</option>
              <option value="Difficult">Difficult Level</option>
              <option value="Mixed">Mixed / Adaptive</option>
            </select>
          </div>

          {/* Control 2: Question Count */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">2. Question Count</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full text-xs font-bold bg-white text-blue-900 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 cursor-pointer shadow-2xs"
            >
              <option value={5}>5 Questions ({getTestDurationMinutes(5)} mins)</option>
              <option value={10}>10 Questions ({getTestDurationMinutes(10)} mins)</option>
              <option value={15}>15 Questions ({getTestDurationMinutes(15)} mins)</option>
              <option value={20}>20 Questions ({getTestDurationMinutes(20)} mins)</option>
              <option value={25}>25 Questions ({getTestDurationMinutes(25)} mins)</option>
              <option value={50}>50 Questions ({getTestDurationMinutes(50)} mins)</option>
              <option value={100}>100 Questions ({getTestDurationMinutes(100)} mins)</option>
            </select>
          </div>

          {/* Control 3: Negative Marking Rule */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">3. Negative Marking (-0.5)</label>
            <button
              type="button"
              onClick={toggleNegativeMarking}
              className={`w-full text-xs font-bold py-2 px-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer shadow-2xs ${
                allowNegativeMarking
                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              title="Click to toggle negative marking penalty"
            >
              <span className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${allowNegativeMarking ? 'bg-red-600 animate-pulse' : 'bg-slate-400'}`}></span>
                <span>Minus Marks</span>
              </span>
              <strong className="uppercase text-[11px] font-extrabold">{allowNegativeMarking ? `Active (-${negativeMarkValue})` : 'Disabled'}</strong>
            </button>
          </div>

          {/* Control 4: Session Duration */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">4. Total Duration</label>
            <div className="w-full h-[36px] bg-white border border-slate-300 rounded-xl px-3 flex items-center justify-between text-xs font-bold text-blue-950 shadow-2xs">
              <span className="flex items-center space-x-1.5 text-slate-700 font-semibold">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Duration</span>
              </span>
              <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded-lg text-[11px] font-extrabold border border-blue-200">
                {getTestDurationMinutes(questionCount)} Mins
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Full Mock */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-1 font-outfit">
              Full Syllabus Mock ({questionCount} Qs)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              AI generates {questionCount} unique non-repeating questions at <strong className="text-blue-700">{selectedDifficulty} level</strong> across all subjects from official PDF syllabus.
            </p>
          </div>
          <button
            onClick={() => handleLaunch('card-full-mock', () => launchAiDynamicTest('Full Syllabus Mock', 'All Subjects', questionCount, selectedDifficulty))}
            disabled={isAiGenerating}
            className={`w-full text-white font-bold py-3 px-4 rounded-xl shadow-xs transition-all text-xs flex items-center justify-center space-x-2 ${
              activeCardId === 'card-full-mock'
                ? 'bg-blue-400 opacity-60 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer active:scale-95'
            }`}
          >
            {activeCardId === 'card-full-mock' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating {questionCount} AI Qs...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Start AI Full Mock ({questionCount} Qs • {selectedDifficulty})</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: Daily Current Affairs */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-1 font-outfit">
              Daily Current Affairs ({questionCount} Qs)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              AI generates {questionCount} General Awareness & Polity questions at <strong className="text-amber-700">{selectedDifficulty} level</strong>.
            </p>
          </div>
          <button
            onClick={() => handleLaunch('card-current-affairs', () => launchAiDynamicTest('Daily Current Affairs & Polity', 'General Awareness & GS', questionCount, selectedDifficulty))}
            disabled={isAiGenerating}
            className={`w-full text-white font-bold py-3 px-4 rounded-xl shadow-xs transition-all text-xs flex items-center justify-center space-x-2 ${
              activeCardId === 'card-current-affairs'
                ? 'bg-slate-500 opacity-60 cursor-wait'
                : 'bg-slate-900 hover:bg-black cursor-pointer active:scale-95'
            }`}
          >
            {activeCardId === 'card-current-affairs' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating {questionCount} AI Qs...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Current Affairs Quiz ({questionCount} Qs • {selectedDifficulty})</span>
              </>
            )}
          </button>
        </div>

        {/* Card 3: Weak Area Diagnostic */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-1 font-outfit">
              Weak Area Diagnostic ({questionCount} Qs)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              AI evaluates lower accuracy subjects and constructs targeted <strong className="text-emerald-700">{selectedDifficulty} level</strong> problem sets.
            </p>
          </div>
          <button
            onClick={() => handleLaunch('card-weak-area', () => launchAiDynamicTest('High Difficulty Yield & Weak Areas', 'Quantitative Aptitude', questionCount, selectedDifficulty))}
            disabled={isAiGenerating}
            className={`w-full text-white font-bold py-3 px-4 rounded-xl shadow-xs transition-all text-xs flex items-center justify-center space-x-2 ${
              activeCardId === 'card-weak-area'
                ? 'bg-emerald-400 opacity-60 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer active:scale-95'
            }`}
          >
            {activeCardId === 'card-weak-area' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating {questionCount} AI Qs...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Start Weak Area Quiz ({questionCount} Qs • {selectedDifficulty})</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}

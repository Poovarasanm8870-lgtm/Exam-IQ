import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EXAM_CATEGORIES } from '../../data/mockData';
import { 
  Target, 
  Check, 
  Award, 
  Building2, 
  Compass, 
  Train, 
  Sparkles, 
  X, 
  ArrowRight,
  BookmarkCheck
} from 'lucide-react';

const CATEGORY_ICONS = {
  ssc: Award,
  banking: Building2,
  upsc: Compass,
  railways: Train
};

export default function ExamOnboardingModal() {
  const { showOnboardingModal, setShowOnboardingModal, handleSelectExam, user, getDaysRemainingForExam, adminExamDates } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('ssc');
  const [tempExam, setTempExam] = useState(user.targetExamId);

  if (!showOnboardingModal) return null;

  const currentCatObj = EXAM_CATEGORIES.find((c) => c.id === selectedCategory) || EXAM_CATEGORIES[0];

  const handleConfirm = () => {
    let chosenExam = null;
    EXAM_CATEGORIES.forEach((cat) => {
      const match = cat.exams.find((e) => e.id === tempExam);
      if (match) chosenExam = match;
    });

    if (chosenExam) {
      handleSelectExam(chosenExam);
    } else {
      setShowOnboardingModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-outfit">Select Your Primary Target Exam</h2>
              <p className="text-xs text-blue-100 mt-0.5">
                ExamiQ optimizes mock test difficulty & Adaptive AI syllabus retrieval based on your selection.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowOnboardingModal(false)}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Category Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Choose Exam Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {EXAM_CATEGORIES.map((cat) => {
                const IconComponent = CATEGORY_ICONS[cat.id] || Award;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-100'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {cat.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{cat.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{cat.exams.length} Major Target Exams</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exam Selection List */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              2. Select Specific Target Exam ({currentCatObj.name})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentCatObj.exams.map((exam) => {
                const isChosen = tempExam === exam.id;
                return (
                  <div
                    key={exam.id}
                    onClick={() => setTempExam(exam.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                      isChosen
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-100'
                        : 'border-slate-200 hover:border-blue-300 bg-white hover:shadow-xs'
                    }`}
                  >
                    {isChosen && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div>
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 mb-2 border border-slate-200">
                        {exam.tier}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{exam.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">Target Year: {exam.targetYear}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-500">Estimated Days:</span>
                      <span className="font-bold text-blue-600">{getDaysRemainingForExam(exam.id || exam.name, adminExamDates)} Days</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secondary Goal Badges */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 mb-2">
              <BookmarkCheck className="w-4 h-4 text-blue-600" />
              <span>Secondary Parallel Goals (Auto-Configured)</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              ExamiQ aligns syllabus overlap so preparation for {currentCatObj.name} also builds preparedness for secondary exams.
            </p>
            <div className="flex flex-wrap gap-2">
              {user.secondaryGoals.map((goal, idx) => (
                <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                  + {goal}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Choice can be changed anytime from the top navigation bar.
          </span>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center space-x-2 text-xs"
          >
            <span>Confirm Target & Launch</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

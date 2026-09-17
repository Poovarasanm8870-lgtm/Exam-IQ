import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Target, 
  LayoutDashboard, 
  FileSpreadsheet, 
  Sparkles, 
  ChevronDown, 
  LogOut,
  Layers,
  Activity,
  BarChart3,
  CheckCircle2,
  History,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentView, 
    setCurrentView, 
    user, 
    logoutUser,
    setShowOnboardingModal,
    getDaysRemainingForExam,
    adminExamDates
  } = useApp() || {};

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const liveDaysRemaining = getDaysRemainingForExam(user.targetExamId || user.targetExamName, adminExamDates);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Logo & Target Badge */}
          <div className="flex items-center space-x-2.5 sm:space-x-4">
            <button 
              onClick={() => setCurrentView('dashboard')} 
              className="flex items-center space-x-2 group focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-1">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 font-outfit">ExamiQ</span>
                </div>
              </div>
            </button>

            {/* Target Exam Switcher Pill */}
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="hidden lg:flex items-center space-x-1.5 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200 hover:border-blue-300 transition-all cursor-pointer"
              title="Click to change target exam"
            >
              <Target className="w-3 h-3 text-blue-600" />
              <span>Target: <strong className="text-blue-700">{user.targetExamName}</strong></span>
              <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.1 rounded-full font-bold">{liveDaysRemaining}d</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* 4 Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentView('tests')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'tests'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tests</span>
            </button>

            <button
              onClick={() => setCurrentView('activity')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'activity' || currentView === 'subject-mastery' || currentView === 'daily-tracker'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>Activity</span>
            </button>

            <button
              onClick={() => setCurrentView('progress-history')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'progress-history' || currentView === 'test-analysis'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-500" />
              <span>My Progress / History</span>
            </button>
          </nav>

          {/* Right Action Icons & Dynamic User Profile Dropdown */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">

            {/* Dynamic User Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-1.5 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shadow-2xs">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="text-xs font-bold text-slate-700 hidden lg:inline">{user.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 space-y-1 z-50 animate-fadeIn">
                  <div className="p-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500">{user.email}</p>
                    <span className="inline-block mt-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.2 rounded border border-blue-200">
                      Role: {user.role === 'admin' ? 'Exam Controller (Admin)' : 'Aspirant Student'}
                    </span>
                  </div>

                  {user.role === 'admin' && (
                    <div className="pt-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">Admin Tools</p>
                      <button
                        onClick={() => {
                          setCurrentView('admin-pdf');
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 text-left"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        <span>PDF Syllabus Manager</span>
                      </button>
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logoutUser();
                      }}
                      className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout User</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>
        </div>

        {/* Collapsible Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 p-3 space-y-2 bg-white animate-fadeIn">
            <button
              onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                currentView === 'dashboard' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { setCurrentView('tests'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                currentView === 'tests' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tests</span>
            </button>

            <button
              onClick={() => { setCurrentView('activity'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                currentView === 'activity' || currentView === 'subject-mastery' || currentView === 'daily-tracker' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>Activity</span>
            </button>

            <button
              onClick={() => { setCurrentView('progress-history'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                currentView === 'progress-history' || currentView === 'test-analysis' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-500" />
              <span>My Progress / History</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => { setCurrentView('admin-pdf'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                  currentView === 'admin-pdf' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>PDF Syllabus Manager (Admin)</span>
              </button>
            )}

            <button
              onClick={() => { setShowOnboardingModal(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold bg-slate-50 border border-slate-200 text-slate-800"
            >
              <span className="flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600" />
                <span>Target: {user.targetExamName}</span>
              </span>
              <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">{liveDaysRemaining}d</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); logoutUser(); }}
              className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout User</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
}

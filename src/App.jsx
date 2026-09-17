import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import AuthPage from './components/auth/AuthPage';
import ExamOnboardingModal from './components/onboarding/ExamOnboardingModal';
import AspirantDashboard from './components/dashboard/AspirantDashboard';
import TestsView from './components/dashboard/TestsView';
import ActivityView from './components/dashboard/ActivityView';
import ProgressHistoryView from './components/dashboard/ProgressHistoryView';
import LiveExamInterface from './components/test/LiveExamInterface';
import TestAnalysisModal from './components/test/TestAnalysisModal';
import AdminPdfManager from './components/admin/AdminPdfManager';
import { Info, CheckCircle2, AlertTriangle } from 'lucide-react';

function AppContent() {
  const appState = useApp() || {};
  const { currentView = 'auth', user = null, toastMessage = null, setCurrentView = () => {} } = appState;

  // If user is not logged in, force Auth page
  if (!user || currentView === 'auth') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce">
            <div className={`flex items-center space-x-2 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold text-white ${
              toastMessage.type === 'success' ? 'bg-emerald-600 border-emerald-500' :
              toastMessage.type === 'warning' ? 'bg-amber-600 border-amber-500' : 'bg-slate-900 border-slate-800'
            }`}>
              {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
              {toastMessage.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
              {toastMessage.type === 'info' && <Info className="w-4 h-4 text-blue-300" />}
              <span>{toastMessage.msg}</span>
            </div>
          </div>
        )}
        <AuthPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`flex items-center space-x-2 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold text-white ${
            toastMessage.type === 'success' ? 'bg-emerald-600 border-emerald-500' :
            toastMessage.type === 'warning' ? 'bg-amber-600 border-amber-500' : 'bg-slate-900 border-slate-800'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
            {toastMessage.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-blue-300" />}
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}

      {/* Show Navbar on views except Live Exam Interface */}
      {currentView !== 'test-interface' && <Navbar />}

      {/* Global Onboarding Modal Overlay */}
      <ExamOnboardingModal />

      {/* View Router */}
      <main className="flex-1">
        {currentView === 'dashboard' && <AspirantDashboard />}
        {currentView === 'tests' && <TestsView />}
        {(currentView === 'activity' || currentView === 'subject-mastery' || currentView === 'daily-tracker') && <ActivityView />}
        {currentView === 'progress-history' && <ProgressHistoryView />}
        {currentView === 'test-interface' && <LiveExamInterface />}
        {currentView === 'test-analysis' && <TestAnalysisModal />}
        {currentView === 'admin-pdf' && (
          user?.role === 'admin' ? (
            <AdminPdfManager />
          ) : (
            <div className="max-w-3xl mx-auto my-12 p-8 bg-amber-50 border border-amber-200 rounded-3xl text-center shadow-md">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-amber-900 font-outfit mb-1">Access Restricted</h2>
              <p className="text-xs text-amber-800 mb-4 max-w-md mx-auto">
                The Admin PDF Syllabus Manager is strictly reserved for Exam Controller administrators. Aspirant students cannot access or upload files.
              </p>
              <button 
                onClick={() => setCurrentView('dashboard')} 
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Return to Aspirant Dashboard
              </button>
            </div>
          )
        )}
      </main>

      {/* Global Footer */}
      {currentView !== 'test-interface' && (
        <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 font-outfit">ExamiQ AI</span>
              <span>— Dynamic Competitive Exam Engine for Aspirants</span>
            </div>
            <p className="text-slate-400">
              UPSC CSE • SSC CGL • IBPS PO • Railways RRB NTPC
            </p>
          </div>
        </footer>
      )}

    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ExamiQ App Error Boundary Caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold font-outfit text-white">Application Exception Caught</h2>
          <p className="text-xs text-slate-400 max-w-md">
            The platform trapped a client runtime error. Details below:
          </p>

          {this.state.error && (
            <div className="w-full max-w-lg p-4 bg-slate-950 border border-red-900/50 rounded-2xl text-left font-mono text-xs text-red-300 overflow-x-auto max-h-40">
              <strong className="block text-red-400 mb-1">{this.state.error.name}: {this.state.error.message}</strong>
              <pre className="text-[10px] text-slate-400 whitespace-pre-wrap">{this.state.error.stack}</pre>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Reload Page
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="px-5 py-2.5 bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Reset Session & Clear Cache
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

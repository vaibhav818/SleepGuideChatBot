import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SleepProvider } from './context/SleepContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import Analytics from './pages/Analytics';
import SleepTools from './pages/SleepTools';
import AuthView from './pages/AuthView';
import LogSleepModal from './components/LogSleepModal';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sleep-950 text-indigo-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold tracking-wider text-slate-400">Loading SomnaAI...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-sleep-950 text-slate-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogModal={() => setIsLogModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {!isAuthenticated ? (
          <AuthView />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                setActiveTab={setActiveTab}
                onOpenLogModal={() => setIsLogModalOpen(true)}
              />
            )}
            {activeTab === 'chat' && <Chatbot />}
            {activeTab === 'analytics' && <Analytics />}
            {activeTab === 'tools' && <SleepTools />}
          </>
        )}
      </main>

      {/* Global Log Sleep Modal */}
      <LogSleepModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SleepProvider>
        <AppContent />
      </SleepProvider>
    </AuthProvider>
  );
}


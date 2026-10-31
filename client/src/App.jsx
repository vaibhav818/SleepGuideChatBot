import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SleepProvider } from './context/SleepContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import SoothingDashboard from './pages/SoothingDashboard';
import Chatbot from './pages/Chatbot';
import Analytics from './pages/Analytics';
import SleepTools from './pages/SleepTools';
import AuthView from './pages/AuthView';
import LogSleepModal from './components/LogSleepModal';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-colors duration-700"
        style={{ backgroundColor: theme.bgDark, color: theme.accentPrimary }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 border-4 rounded-full animate-spin"
            style={{
              borderColor: `${theme.accentPrimary}33`,
              borderTopColor: theme.accentPrimary,
            }}
          ></div>
          <span className="text-xs font-semibold tracking-wider text-slate-400">
            Loading SomnaAI...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-700 relative text-slate-100"
      style={{
        backgroundColor: theme.bgDark,
      }}
    >
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogModal={() => setIsLogModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        {!isAuthenticated ? (
          <AuthView />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <SoothingDashboard
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
    <ThemeProvider>
      <AuthProvider>
        <SleepProvider>
          <AppContent />
        </SleepProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

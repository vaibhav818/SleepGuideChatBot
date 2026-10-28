import React from 'react';
import { Moon, Sparkles, LayoutDashboard, MessageSquareText, BarChart3, Wrench, Plus, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenLogModal }) {
  const { user, logout, demoLogin, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-950/60 bg-sleep-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-dream-purple flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Moon className="w-5 h-5 text-white" />
            <Sparkles className="w-3.5 h-3.5 text-indigo-200 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                SomnaAI
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                CV '25
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">AI Sleep Guidance Platform</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1 bg-sleep-900/90 p-1.5 rounded-xl border border-indigo-900/40">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-sleep-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-sleep-800/60'
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              AI Sleep Guide
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-sleep-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'tools'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-sleep-800/60'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Sleep Tools
            </button>
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button
                onClick={onOpenLogModal}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-102 active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Log Sleep</span>
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-indigo-950">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-medium text-slate-200">{user?.name}</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">{user?.sleepProfile?.chronotype || 'Lark'}</span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={demoLogin}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                1-Click Demo Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation bar */}
      {isAuthenticated && (
        <div className="md:hidden flex items-center justify-around border-t border-indigo-950/60 bg-sleep-950/95 py-2 px-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'chat' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            AI Guide
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'analytics' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'tools' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Tools
          </button>
        </div>
      )}
    </header>
  );
}

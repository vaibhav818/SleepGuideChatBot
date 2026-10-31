import React from 'react';
import {
  Moon,
  Sparkles,
  LayoutDashboard,
  MessageSquareText,
  BarChart3,
  Wrench,
  Plus,
  LogOut,
  Droplets,
  Sunset,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ activeTab, setActiveTab, onOpenLogModal }) {
  const { user, logout, demoLogin, isAuthenticated } = useAuth();
  const { theme, selectedPalette, setSelectedPalette } = useTheme();

  return (
    <header
      className="sticky top-0 z-40 w-full border-b backdrop-blur-2xl transition-colors duration-700"
      style={{
        backgroundColor: theme.bgSubtle,
        borderColor: theme.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <div
            className="relative w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${theme.accentPrimary} 0%, ${theme.accentSecondary} 100%)`,
              boxShadow: `0 4px 22px ${theme.glowColor}`,
            }}
          >
            <Moon className="w-5 h-5 text-slate-950 font-black fill-current" />
            <Sparkles className="w-3.5 h-3.5 text-white absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">
                Somna<span style={{ color: theme.accentPrimary }}>AI</span>
              </span>
              <span
                className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full border transition-colors duration-500"
                style={{
                  backgroundColor: theme.accentMuted,
                  color: theme.accentPrimary,
                  borderColor: theme.border,
                }}
              >
                Nocturnal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Circadian Telemetry & Neural Wind-Down
            </p>
          </div>
        </div>

        {/* Center: Global Theme Switcher Pills */}
        <div
          className="flex items-center p-1 rounded-2xl border backdrop-blur-md transition-colors duration-500"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderColor: theme.border,
          }}
        >
          <button
            onClick={() => setSelectedPalette('seafoamAurora')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedPalette === 'seafoamAurora'
                ? 'bg-[#2DD4BF] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Seafoam & Aurora</span>
          </button>
          <button
            onClick={() => setSelectedPalette('duneSand')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedPalette === 'duneSand'
                ? 'bg-[#E2B376] text-stone-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sunset className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dune & Amber Sand</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        {isAuthenticated && (
          <nav
            className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-2xl border backdrop-blur-md transition-colors duration-500"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderColor: theme.border,
            }}
          >
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
              style={
                activeTab === 'dashboard'
                  ? {
                      backgroundColor: theme.accentPrimary,
                      color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                    }
                  : {}
              }
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
              style={
                activeTab === 'chat'
                  ? {
                      backgroundColor: theme.accentPrimary,
                      color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                    }
                  : {}
              }
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              AI Sleep Guide
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
              style={
                activeTab === 'analytics'
                  ? {
                      backgroundColor: theme.accentPrimary,
                      color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                    }
                  : {}
              }
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tools'
                  ? 'shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
              style={
                activeTab === 'tools'
                  ? {
                      backgroundColor: theme.accentPrimary,
                      color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                    }
                  : {}
              }
            >
              <Wrench className="w-3.5 h-3.5" />
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
                className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold shadow-lg transition-all hover:scale-102 active:scale-98"
                style={{
                  backgroundColor: theme.accentPrimary,
                  color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                  boxShadow: `0 4px 18px ${theme.glowColor}`,
                }}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Log Sleep</span>
              </button>

              <div
                className="flex items-center gap-2 pl-2 border-l"
                style={{ borderColor: theme.border }}
              >
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-white">{user?.name}</span>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: theme.accentPrimary }}
                  >
                    {user?.sleepProfile?.chronotype || 'Intermediate'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/5 flex items-center justify-center transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={demoLogin}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border"
              style={{
                backgroundColor: theme.accentMuted,
                color: theme.accentPrimary,
                borderColor: theme.border,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} />
              <span>1-Click Demo Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sparkles, Lock, Mail, User, Shield, AlertCircle, ArrowRight, Droplets, Sunset } from 'lucide-react';

export default function AuthView() {
  const { login, register, demoLogin, error } = useAuth();
  const { theme, selectedPalette, setSelectedPalette } = useTheme();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetHours, setTargetHours] = useState(8);
  const [chronotype, setChronotype] = useState('Intermediate');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    try {
      if (isRegister) {
        await register(name, email, password, {
          targetHours: Number(targetHours),
          chronotype,
        });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setLocalError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    setLocalError(null);
    try {
      await demoLogin();
    } catch (err) {
      setLocalError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
      {/* Top Palette Selector on Login Screen */}
      <div
        className="mb-4 flex items-center p-1 rounded-2xl border backdrop-blur-md transition-colors duration-500"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderColor: theme.border,
        }}
      >
        <button
          onClick={() => setSelectedPalette('seafoamAurora')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedPalette === 'seafoamAurora'
              ? 'bg-[#2DD4BF] text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Seafoam & Aurora</span>
        </button>
        <button
          onClick={() => setSelectedPalette('duneSand')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedPalette === 'duneSand'
              ? 'bg-[#E2B376] text-stone-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sunset className="w-3.5 h-3.5" />
          <span>Dune & Amber Sand</span>
        </button>
      </div>

      <div
        className="w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden backdrop-blur-2xl transition-all duration-700"
        style={{
          backgroundColor: theme.cardGlass,
          borderColor: theme.border,
          boxShadow: `0 24px 60px -15px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Ambient Top Glow */}
        <div
          className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ backgroundColor: theme.accentPrimary }}
        ></div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl mb-3"
            style={{
              background: `linear-gradient(135deg, ${theme.accentPrimary} 0%, ${theme.accentSecondary} 100%)`,
              boxShadow: `0 4px 22px ${theme.glowColor}`,
            }}
          >
            <Moon className="w-7 h-7 text-slate-950 font-black fill-current" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Somna<span style={{ color: theme.accentPrimary }}>AI</span> Sleep Platform
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Clinical AI Guidance & Circadian Rhythm Optimization
          </p>
        </div>

        {/* 1-Click Demo Login Button */}
        <div
          className="mb-6 p-4 rounded-2xl border text-center transition-colors duration-500"
          style={{
            backgroundColor: theme.accentMuted,
            borderColor: theme.border,
          }}
        >
          <span
            className="text-[11px] font-bold uppercase tracking-wider block mb-1"
            style={{ color: theme.accentPrimary }}
          >
            Recruiter & Interview Mode
          </span>
          <p className="text-xs text-slate-300 mb-3">
            Test the live platform instantly with preloaded sleep telemetry & Gemini context.
          </p>
          <button
            type="button"
            onClick={handleDemo}
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
            style={{
              backgroundColor: theme.accentPrimary,
              color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
              boxShadow: `0 4px 14px ${theme.glowColor}`,
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>1-Click Demo Login</span>
          </button>
          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 mt-2 font-mono">
            <span>Demo Email: <b className="text-slate-300">demo@sleepguide.ai</b></span>
            <span>Password: <b className="text-slate-300">sleep123</b></span>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-white/[0.08]"></div>
          <span className="flex-shrink mx-3 text-[11px] text-slate-500 font-medium">Or use credentials</span>
          <div className="flex-grow border-t border-white/[0.08]"></div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-black/40 border border-white/[0.06] mb-5">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !isRegister ? 'font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
            style={
              !isRegister
                ? {
                    backgroundColor: theme.accentPrimary,
                    color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                  }
                : {}
            }
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isRegister ? 'font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
            style={
              isRegister
                ? {
                    backgroundColor: theme.accentPrimary,
                    color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                  }
                : {}
            }
          >
            Create Account
          </button>
        </div>

        {/* Error message display */}
        {(localError || error) && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vaibhav Singh"
                  className="w-full bg-white/[0.04] border rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                  style={{ borderColor: theme.border }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/[0.04] border rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                style={{ borderColor: theme.border }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                style={{ borderColor: theme.border }}
              />
            </div>
          </div>

          {isRegister && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Nightly Goal</label>
                <select
                  value={targetHours}
                  onChange={(e) => setTargetHours(e.target.value)}
                  className="w-full bg-slate-900 border rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                  style={{ borderColor: theme.border }}
                >
                  <option value={7}>7.0 hrs</option>
                  <option value={7.5}>7.5 hrs</option>
                  <option value={8}>8.0 hrs (Recommended)</option>
                  <option value={8.5}>8.5 hrs</option>
                  <option value={9}>9.0 hrs</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Chronotype</label>
                <select
                  value={chronotype}
                  onChange={(e) => setChronotype(e.target.value)}
                  className="w-full bg-slate-900 border rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                  style={{ borderColor: theme.border }}
                >
                  <option value="Early Bird / Lion">Early Bird / Lion</option>
                  <option value="Intermediate">Intermediate (Bear)</option>
                  <option value="Night Owl / Wolf">Night Owl / Wolf</option>
                  <option value="Variable">Variable / Dolphin</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl font-bold text-xs tracking-wide shadow-lg transition-all hover:scale-101 active:scale-98 flex items-center justify-center gap-2"
            style={{
              backgroundColor: theme.accentPrimary,
              color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
              boxShadow: `0 4px 18px ${theme.glowColor}`,
            }}
          >
            <span>{isRegister ? 'Create Sleep Account' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

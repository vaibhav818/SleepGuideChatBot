import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Moon, Sparkles, Lock, Mail, User, Shield, AlertCircle, ArrowRight } from 'lucide-react';

export default function AuthView() {
  const { login, register, demoLogin, error } = useAuth();
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
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 border border-indigo-900/60 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-dream-purple shadow-xl shadow-indigo-600/30 mb-3">
            <Moon className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            SomnaAI Sleep Platform
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Clinical AI Guidance & Circadian Rhythm Optimization
          </p>
        </div>

        {/* 1-Click Demo Login Button (Crucial for recruiters & interviewers!) */}
        <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-sleep-900 to-teal-950/50 border border-emerald-500/30 text-center">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            Recruiter & Interview Mode
          </span>
          <p className="text-xs text-slate-300 mb-2.5">
            Test the live platform instantly with preloaded sleep telemetry & Gemini context.
          </p>
          <button
            type="button"
            onClick={handleDemo}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 hover:scale-102"
          >
            <Sparkles className="w-4 h-4" />
            1-Click Demo Login
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-indigo-950"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-sleep-900 px-2 text-slate-500 font-semibold">Or use credentials</span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-sleep-950 p-1 rounded-xl border border-indigo-950 mb-5">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !isRegister ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isRegister ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
            }`}
          >
            Create Account
          </button>
        </div>

        {(localError || error) && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-sleep-950 border border-indigo-900/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-sleep-950 border border-indigo-900/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-sleep-950 border border-indigo-900/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {isRegister && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Target Hours
                </label>
                <select
                  value={targetHours}
                  onChange={(e) => setTargetHours(Number(e.target.value))}
                  className="w-full bg-sleep-950 border border-indigo-900/60 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={7}>7.0 hrs</option>
                  <option value={7.5}>7.5 hrs</option>
                  <option value={8}>8.0 hrs (Optimal)</option>
                  <option value={8.5}>8.5 hrs</option>
                  <option value={9}>9.0 hrs</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Chronotype
                </label>
                <select
                  value={chronotype}
                  onChange={(e) => setChronotype(e.target.value)}
                  className="w-full bg-sleep-950 border border-indigo-900/60 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Morning Lark">Early Lark</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Night Owl">Night Owl</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{isRegister ? 'Complete Onboarding' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}


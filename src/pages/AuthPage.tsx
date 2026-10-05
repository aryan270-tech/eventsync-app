import React, { useState } from 'react';
import { Ticket, Mail, Lock, User, Sparkles, Eye, EyeOff, LayoutDashboard, Calendar } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const { signup, login } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('attendee');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!name.trim()) { setError('Please enter your full name.'); setLoading(false); return; }
        await signup(email, password, name, role);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      const msg = err?.code || err?.message || 'Something went wrong';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('Invalid email or password. Please try again.');
      } else if (msg.includes('email-already-in-use')) {
        setError('This email is already registered. Please log in instead.');
      } else if (msg.includes('weak-password')) {
        setError('Password must be at least 6 characters.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-600/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Ticket className="w-6 h-6 text-white -rotate-12" />
            </div>
            <div className="text-left">
              <div className="font-heading font-extrabold text-2xl text-white">
                Event<span className="gradient-text">Sync</span>
              </div>
              <div className="text-xs text-slate-400">Real-Time Ticket Reservation Platform</div>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/30 text-violet-300 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3 h-3" />
            Discover · Book · Attend
          </div>
        </div>

        {/* Card */}
        <div className="glass-panel p-8">
          {/* Mode Tabs */}
          <div className="flex bg-slate-900 rounded-xl p-1 mb-6 gap-1">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name — signup only */}
            {mode === 'signup' && (
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Role Selector — signup only */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                  I am joining as...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('attendee')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      role === 'attendee'
                        ? 'bg-violet-600/20 border-violet-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Calendar className="w-5 h-5 mb-2 text-violet-400" />
                    <div className="font-heading font-bold text-sm">Attendee</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Browse & book events</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('organizer')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      role === 'organizer'
                        ? 'bg-cyan-600/20 border-cyan-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5 mb-2 text-cyan-400" />
                    <div className="font-heading font-bold text-sm">Organizer</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Create & manage events</div>
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm justify-center mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : mode === 'login' ? 'Sign In to EventSync' : 'Create My Account'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © 2026 EventSync Inc. · Real-Time Ticket Reservation Platform
        </p>
      </div>
    </div>
  );
};

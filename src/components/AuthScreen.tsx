import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, Gamepad2, ArrowRight, ShieldCheck, Flame, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { UserAccount, AppConfig } from '../types';

interface AuthScreenProps {
  config: AppConfig;
  onSuccess: (user: UserAccount) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ config, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ffUid, setFfUid] = useState('');
  const [inGameName, setInGameName] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!ffUid.trim()) {
        setError('Please enter your Free Fire UID');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      const { user, isRestored } = StorageService.loginOrRegister({
        email: email.trim(),
        password: password.trim(),
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        ffUid: ffUid.trim() || undefined,
        inGameName: inGameName.trim() || undefined,
      });

      setIsLoading(false);

      if (isRestored) {
        setNotice(`Welcome back! Signed in as ${user.email}. Balance: ৳${user.balance}`);
        setTimeout(() => {
          onSuccess(user);
        }, 900);
      } else {
        setNotice('Account created successfully! Welcome to ' + config.appName);
        setTimeout(() => {
          onSuccess(user);
        }, 900);
      }
    }, 400);
  };

  return (
    <div className="w-full min-h-screen bg-[#07090e] text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-rose-600/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Top Bar Branding */}
      <div className="w-full pt-8 pb-3 px-6 flex flex-col items-center text-center relative z-10">
        {/* Logo Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-3"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 p-1 shadow-xl shadow-orange-500/20 flex items-center justify-center">
            {config.logoUrl ? (
              <img
                src={config.logoUrl}
                alt={config.appName}
                className="w-full h-full object-cover rounded-[20px]"
              />
            ) : (
              <Gamepad2 className="w-10 h-10 text-white" />
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md font-mono tracking-wider shadow-sm">
            PRO
          </span>
        </motion.div>

        {/* App Title */}
        <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-wider text-white uppercase">
          {config.appName}
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-0.5 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>FREE FIRE TOURNAMENT ARENA</span>
        </p>

        {/* Toggle Pill (LOGIN / REGISTER) */}
        <div className="w-full max-w-xs mt-6 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center shadow-inner">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError('');
              setNotice('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-heading font-extrabold text-xs tracking-wider transition-all duration-200 ${
              !isRegister
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError('');
              setNotice('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-heading font-extrabold text-xs tracking-wider transition-all duration-200 ${
              isRegister
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            REGISTER
          </button>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="w-full max-w-md mx-auto px-6 py-2 flex-1 flex flex-col justify-center relative z-10">
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-2xl">
          {/* Header text inside box */}
          <div className="mb-4">
            <h2 className="text-lg font-bold font-heading text-white">
              {isRegister ? 'Create Player Account' : 'Sign In to Your Account'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isRegister
                ? 'Enter your details below to create your tournament account.'
                : 'Enter your credentials to access your tournaments and wallet.'}
            </p>
          </div>

          {/* Feedback & Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-2xl font-medium"
            >
              {error}
            </motion.div>
          )}

          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3 rounded-2xl font-medium flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{notice}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Username"
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Free Fire UID and In-Game Name */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Free Fire UID *
                    </label>
                    <input
                      type="text"
                      value={ffUid}
                      onChange={(e) => setFfUid(e.target.value)}
                      placeholder="Free Fire UID"
                      className="w-full px-3.5 py-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-2xl text-sm font-mono text-white placeholder-gray-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      In-Game Name
                    </label>
                    <input
                      type="text"
                      value={inGameName}
                      onChange={(e) => setInGameName(e.target.value)}
                      placeholder="In-game name"
                      className="w-full px-3.5 py-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Mobile number"
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-2xl text-sm font-mono text-white placeholder-gray-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                {isRegister ? 'Email Address *' : 'Email *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isRegister ? 'Email address' : 'Email'}
                  required
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm tracking-wide font-heading"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Register Now' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch link */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            {isRegister ? (
              <p className="text-xs text-gray-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                    setNotice('');
                  }}
                  className="text-blue-400 hover:text-blue-300 font-bold ml-1 underline underline-offset-2"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-xs text-gray-400">
                New player?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setError('');
                    setNotice('');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold ml-1 underline underline-offset-2"
                >
                  Create Account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="w-full py-4 text-center text-[11px] text-gray-500 font-medium relative z-10 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>100% Secure & Trusted Free Fire Tournament Platform</span>
      </div>
    </div>
  );
};

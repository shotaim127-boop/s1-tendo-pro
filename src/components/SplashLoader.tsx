import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AppConfig } from '../types';

interface SplashLoaderProps {
  config: AppConfig;
  onFinish: () => void;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ config, onFinish }) => {
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const t1 = setTimeout(() => setProgress(60), 400);
    const t2 = setTimeout(() => setProgress(88), 900);
    const t3 = setTimeout(() => setProgress(100), 1400);
    const tFinish = setTimeout(() => {
      onFinish();
    }, 1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tFinish);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#07090e] text-white flex flex-col items-center justify-between py-20 px-8 select-none overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top spacer */}
      <div />

      {/* Center Banner / Logo */}
      <div className="flex flex-col items-center text-center my-auto relative z-10">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative mb-4"
        >
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 p-1 shadow-2xl shadow-orange-500/20 flex items-center justify-center">
            {config.logoUrl ? (
              <img
                src={config.logoUrl}
                alt={config.appName}
                className="w-full h-full object-cover rounded-[22px]"
              />
            ) : (
              <span className="text-4xl font-black text-white font-heading">S1</span>
            )}
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-black font-heading tracking-wider text-white uppercase"
        >
          {config.appName}
        </motion.h1>
      </div>

      {/* Bottom Loading Progress Bar Only */}
      <div className="w-full max-w-xs flex flex-col items-center relative z-10">
        <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-teal-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

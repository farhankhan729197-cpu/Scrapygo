import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ArrowRight, ShieldCheck, Zap, Heart, AirVent, WashingMachine, Refrigerator, ChevronRight } from 'lucide-react';
import { CategoryType } from '../types';

interface WelcomeGreetingProps {
  onStartJourney?: (category?: CategoryType) => void;
  onSelectCategory?: (category: CategoryType) => void;
}

interface QuickCategoryItem {
  id: CategoryType;
  title: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  tag: string;
  accentBg: string;
  borderColor: string;
}

const QUICK_CATEGORIES: QuickCategoryItem[] = [
  {
    id: 'AC',
    title: 'AC',
    shortDesc: 'Split & Window',
    icon: AirVent,
    image: 'https://i.pinimg.com/1200x/44/7f/84/447f84d557a05888931325a7cc2c9ec4.jpg',
    tag: 'Top Value',
    accentBg: 'bg-sky-50 text-sky-700',
    borderColor: 'hover:border-sky-500 hover:bg-sky-50/30'
  },
  {
    id: 'WashingMachine',
    title: 'Washing Machine',
    shortDesc: 'Front & Top Load',
    icon: WashingMachine,
    image: 'https://i.pinimg.com/1200x/ce/ef/9f/ceef9ffbcf7cbbfbfe4a2d21eba9e88a.jpg',
    tag: 'Popular',
    accentBg: 'bg-pink-50 text-pink-700',
    borderColor: 'hover:border-pink-500 hover:bg-pink-50/30'
  },
  {
    id: 'Refrigerator',
    title: 'Refrigerator',
    shortDesc: 'Single & Double Door',
    icon: Refrigerator,
    image: 'https://i.pinimg.com/736x/a9/fd/48/a9fd48857f02f519c4c8133796e1993a.jpg',
    tag: 'High Scrap',
    accentBg: 'bg-teal-50 text-teal-700',
    borderColor: 'hover:border-teal-500 hover:bg-teal-50/30'
  }
];

export const WelcomeGreeting: React.FC<WelcomeGreetingProps> = ({ onStartJourney, onSelectCategory }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-dismiss after 6.5 seconds if user doesn't interact, but allow instant close
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 6500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleCategoryClick = (category: CategoryType) => {
    setIsVisible(false);
    if (onSelectCategory) {
      onSelectCategory(category);
    } else if (onStartJourney) {
      onStartJourney(category);
    }
  };

  const handleStart = () => {
    setIsVisible(false);
    if (onStartJourney) {
      onStartJourney('AC');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-hidden"
          onClick={handleDismiss}
        >
          {/* Animated Background Ambience / Glow Orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.15, 0.3, 0.15],
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.15, 0.25, 0.15],
                x: [0, -30, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl"
            />
          </div>

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-gradient-to-b from-white via-slate-50 to-emerald-50/40 rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 text-center overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors z-20 cursor-pointer"
              title="Close & enter site"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Sparkle Badges Floating */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotate: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-6 left-6 hidden sm:flex items-center gap-1 bg-emerald-100/80 border border-emerald-200/60 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Instant Payouts</span>
            </motion.div>

            <motion.div
              animate={{ y: [4, -4, 4], rotate: [5, -5, 5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute top-6 right-14 hidden sm:flex items-center gap-1 bg-teal-100/80 border border-teal-200/60 text-teal-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm"
            >
              <ShieldCheck className="w-3 h-3 text-teal-600" />
              <span>Verified Scrap Rates</span>
            </motion.div>

            {/* Animated Welcoming Lady Character */}
            <div className="relative mx-auto w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center my-1">
              {/* Outer Pulsing Glow */}
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.7, 0.35] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-2 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 blur-xl opacity-50"
              />

              {/* Character Circle Frame */}
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-b from-emerald-100 via-teal-50 to-emerald-200/60 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                {/* SVG Welcoming Lady Character */}
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full object-contain"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2c1810" />
                      <stop offset="100%" stopColor="#1a0c06" />
                    </linearGradient>
                    <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbd3b6" />
                      <stop offset="100%" stopColor="#f5b895" />
                    </linearGradient>
                    <linearGradient id="clothGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                    <linearGradient id="blushGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f87171" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#fb7185" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>

                  {/* Backdrop subtle leaves / shine */}
                  <circle cx="100" cy="100" r="85" fill="#e6f7f2" />

                  {/* Back Hair */}
                  <path
                    d="M 50 110 Q 40 60 100 45 Q 160 60 150 110 Q 155 160 140 170 Q 100 175 60 170 Q 45 160 50 110 Z"
                    fill="url(#hairGrad)"
                  />

                  {/* Body / Torso with ScrapyGo Emerald uniform */}
                  <path
                    d="M 60 160 Q 100 148 140 160 L 155 200 L 45 200 Z"
                    fill="url(#clothGrad)"
                  />
                  {/* Collar / Lapel */}
                  <path
                    d="M 85 152 L 100 172 L 115 152 Q 100 156 85 152 Z"
                    fill="#ffffff"
                  />
                  {/* ScrapyGo Eco Badge on uniform */}
                  <rect x="70" y="168" width="18" height="10" rx="3" fill="#ffffff" />
                  <circle cx="79" cy="173" r="2.5" fill="#059669" />

                  {/* Neck */}
                  <rect x="91" y="128" width="18" height="26" rx="6" fill="url(#skinGrad)" />

                  {/* Head / Face */}
                  <ellipse cx="100" cy="100" rx="36" ry="40" fill="url(#skinGrad)" />

                  {/* Cheerful Blush */}
                  <ellipse cx="78" cy="108" rx="6" ry="4" fill="url(#blushGrad)" />
                  <ellipse cx="122" cy="108" rx="6" ry="4" fill="url(#blushGrad)" />

                  {/* Friendly Eyes (happy arched open eyes with sparkles) */}
                  <ellipse cx="83" cy="95" rx="5" ry="6" fill="#1e293b" />
                  <circle cx="81.5" cy="93" r="2" fill="#ffffff" />
                  <circle cx="85" cy="97" r="1" fill="#ffffff" />

                  <ellipse cx="117" cy="95" rx="5" ry="6" fill="#1e293b" />
                  <circle cx="115.5" cy="93" r="2" fill="#ffffff" />
                  <circle cx="119" cy="97" r="1" fill="#ffffff" />

                  {/* Eyebrows */}
                  <path d="M 76 86 Q 84 81 92 85" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 108 85 Q 116 81 124 86" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                  {/* Cute Nose */}
                  <path d="M 99 101 Q 102 105 98 107" stroke="#e09067" strokeWidth="1.8" strokeLinecap="round" fill="none" />

                  {/* Big Welcoming Warm Smile with White Teeth */}
                  <path
                    d="M 88 114 Q 100 128 112 114 Q 100 118 88 114 Z"
                    fill="#b91c1c"
                  />
                  <path
                    d="M 91 115 Q 100 120 109 115 Q 100 114 91 115 Z"
                    fill="#ffffff"
                  />

                  {/* Front Hair / Stylish Bangs */}
                  <path
                    d="M 64 88 Q 80 50 100 52 Q 130 50 136 88 Q 120 66 100 68 Q 80 66 64 88 Z"
                    fill="url(#hairGrad)"
                  />
                  {/* Hair Strand Left */}
                  <path
                    d="M 65 82 Q 58 110 66 130 Q 61 110 65 82 Z"
                    fill="url(#hairGrad)"
                  />
                  {/* Hair Strand Right */}
                  <path
                    d="M 135 82 Q 142 110 134 130 Q 139 110 135 82 Z"
                    fill="url(#hairGrad)"
                  />

                  {/* Cute Green Headband / Hair Accessory */}
                  <path
                    d="M 65 72 Q 100 52 135 72"
                    stroke="#10b981"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle cx="126" cy="67" r="5" fill="#f59e0b" />
                  <circle cx="126" cy="67" r="2.5" fill="#ffffff" />
                </svg>

                {/* Animated Waving Hand */}
                <motion.div
                  animate={{
                    rotate: [0, 22, -8, 22, -4, 18, 0],
                    x: [0, 3, -2, 3, 0],
                    y: [0, -2, 2, -2, 0]
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: 'bottom right' }}
                  className="absolute bottom-2 right-1 w-11 h-11 pointer-events-none drop-shadow-md"
                >
                  <svg viewBox="0 0 60 60" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(5, 5)">
                      {/* Arm sleeve */}
                      <path d="M 38 48 L 22 28 L 30 22 L 46 42 Z" fill="#059669" />
                      <circle cx="26" cy="25" r="4" fill="#ffffff" />
                      {/* Palm & Fingers */}
                      <path
                        d="M 22 26 C 18 22 14 16 17 12 C 19 8 23 11 25 15 L 25 8 C 25 4 29 4 30 8 L 30 14 C 31 10 35 10 36 14 L 36 18 C 38 15 42 16 41 20 C 40 26 34 32 26 30 Z"
                        fill="#fbd3b6"
                        stroke="#e09067"
                        strokeWidth="1.2"
                      />
                    </g>
                  </svg>
                </motion.div>
              </div>

              {/* Heart floating particle */}
              <motion.div
                animate={{
                  y: [-5, -28],
                  x: [0, 10],
                  opacity: [0, 1, 0],
                  scale: [0.6, 1.1, 0.8],
                }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 }}
                className="absolute top-2 right-6 text-rose-500"
              >
                <Heart className="w-4 h-4 fill-rose-500" />
              </motion.div>

              {/* Sparkle particle */}
              <motion.div
                animate={{
                  scale: [0, 1.2, 0],
                  rotate: [0, 90, 180],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                className="absolute top-4 left-6 text-amber-400"
              >
                <Sparkles className="w-5 h-5 fill-amber-400" />
              </motion.div>
            </div>

            {/* Welcome Heading & Message */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="space-y-1.5 mt-1.5"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Namaste & Welcome!
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                Welcome to <span className="text-emerald-600">ScrapyGo</span>
              </h2>

              <p className="text-xs sm:text-[13px] text-slate-600 max-w-sm mx-auto leading-snug">
                India’s trusted doorstep recycling & scrap valuation platform. Click a category below to evaluate instant scrap cash value!
              </p>
            </motion.div>

            {/* Clickable Quick Categories: AC, Washing Machine, Refrigerator */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="my-3 text-left"
            >
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  Select Category to Sell:
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Instant Quote
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {QUICK_CATEGORIES.map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <motion.button
                      key={cat.id}
                      type="button"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`relative bg-white border border-slate-200/90 ${cat.borderColor} rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-between text-center transition-all shadow-xs hover:shadow-md cursor-pointer group`}
                    >
                      {/* Top Tag */}
                      <span className="absolute -top-1.5 right-2 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-900 text-white shadow-xs">
                        {cat.tag}
                      </span>

                      {/* Icon & Thumbnail */}
                      <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden mb-1.5 border border-slate-100 shadow-xs group-hover:scale-105 transition-transform">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                        <div className={`absolute bottom-0.5 right-0.5 p-1 rounded-md ${cat.accentBg} shadow-xs`}>
                          <IconComponent className="w-3 h-3" />
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="w-full">
                        <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-emerald-700 leading-tight truncate">
                          {cat.title}
                        </h4>
                        <span className="text-[9px] text-slate-400 block truncate mt-0.5">
                          {cat.shortDesc}
                        </span>
                      </div>

                      <div className="mt-1.5 w-full pt-1 border-t border-slate-100 flex items-center justify-center gap-0.5 text-[9.5px] font-bold text-emerald-600 group-hover:text-emerald-700">
                        <span>Sell {cat.id === 'WashingMachine' ? 'WM' : cat.title}</span>
                        <ChevronRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Trust Indicator Pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1 my-2 text-[10.5px] text-slate-500"
            >
              <span className="flex items-center gap-1 font-semibold text-slate-600">
                <Zap className="w-3 h-3 text-amber-500" /> 60-Sec AI Quote
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-slate-600">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Doorstep Pickup
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-slate-600">
                <Sparkles className="w-3 h-3 text-teal-600" /> Instant Cash
              </span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1.5"
            >
              <button
                onClick={handleStart}
                className="w-full sm:w-auto flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>View All Appliances & Scrap</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleDismiss}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
              >
                Explore Website
              </button>
            </motion.div>

            {/* Bottom subtle note */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <span>Auto-closing in a moment</span>
              <span>•</span>
              <button
                onClick={handleDismiss}
                className="underline hover:text-slate-600 cursor-pointer"
              >
                Skip greeting
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

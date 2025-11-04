import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface VaultModeProps {
  onEnter: () => void;
}

export function VaultMode({ onEnter }: VaultModeProps) {
  const { language, t } = useLanguage();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Show button after 3 seconds
    const timer = setTimeout(() => setShowButton(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      style={{
        background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)',
      }}
    >
      {/* Ambient ticking sound */}
      <audio autoPlay loop>
        <source src="/sounds/ambient-tick.mp3" type="audio/mpeg" />
      </audio>

      {/* Crown icon with glow */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute top-1/3 flex flex-col items-center"
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(212, 175, 55, 0.3)',
              '0 0 40px rgba(212, 175, 55, 0.6)',
              '0 0 20px rgba(212, 175, 55, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-8"
        >
          👑
        </motion.div>

        {/* Title text - word by word */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-5xl md:text-7xl font-serif text-[#f5f2e8] mb-4"
            style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.05em' }}
          >
            {language === 'ar' ? 'المجموعة الملكية' : 'Sheikh Ammar Royal Collection'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-2xl md:text-3xl text-[#d4af37] font-light"
            style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}
          >
            {language === 'ar' ? 'فن الوقت' : 'The Art of Time'}
          </motion.p>
        </div>
      </motion.div>

      {/* Enter button */}
      {showButton && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)',
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="absolute bottom-32 px-12 py-4 border-2 border-[#d4af37] text-[#d4af37] text-xl font-light tracking-wider transition-all duration-300"
          style={{
            background: 'rgba(212, 175, 55, 0.05)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {language === 'ar' ? 'ادخل المجموعة' : 'Enter Collection'}
        </motion.button>
      )}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 flex flex-col items-center text-[#d4af37]"
      >
        <div className="w-6 h-10 border-2 border-[#d4af37] rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-[#d4af37] rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

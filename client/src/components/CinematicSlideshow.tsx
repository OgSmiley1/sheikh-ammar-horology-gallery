import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CinematicSlideshow.css';

interface Watch {
  id: number;
  brand: { en: string; ar: string };
  model: { en: string; ar: string };
  reference: string;
  price: { min: number; max: number };
  story: { en: string; ar: string };
  movement: string;
  case: string;
  diameter: string;
  complications: string[];
  sheikhImage: string;
  watchImage: string;
  rarity: string;
  year: string;
}

interface CinematicSlideshowProps {
  watches: Watch[];
}

// Swipe gesture hook
const useSwipe = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEnd.current = e.changedTouches[0].clientX;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      onSwipeLeft();
    } else if (isRightSwipe) {
      onSwipeRight();
    }
  };

  return { handleTouchStart, handleTouchEnd };
};

export function CinematicSlideshow({ watches }: CinematicSlideshowProps) {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dominantColor, setDominantColor] = useState('#0a0a0a');
  const [isMobile, setIsMobile] = useState(false);
  const [specsExpanded, setSpecsExpanded] = useState(false);
  const watchImageRef = useRef<HTMLImageElement>(null);

  const currentWatch = watches[currentIndex];
  const isRTL = language === 'ar';

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % watches.length);
      setSpecsExpanded(false);
    }, 7000);
    return () => clearInterval(timer);
  }, [watches.length]);

  // Extract dominant color from watch image
  useEffect(() => {
    if (!watchImageRef.current) return;

    const img = watchImageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let r = 0, g = 0, b = 0;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      const pixelCount = data.length / 4;
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);

      setDominantColor(`rgb(${r}, ${g}, ${b})`);
    };
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % watches.length);
    setSpecsExpanded(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + watches.length) % watches.length);
    setSpecsExpanded(false);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setSpecsExpanded(false);
  };

  // Swipe handlers
  const { handleTouchStart, handleTouchEnd } = useSwipe(nextSlide, prevSlide);

  return (
    <div 
      className="cinematic-slideshow" 
      dir={isRTL ? 'rtl' : 'ltr'}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        animate={{
          background: `radial-gradient(ellipse at center, ${dominantColor}22 0%, #0a0a0a 70%)`,
        }}
        transition={{ duration: 1.5 }}
        className="slide-background"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="slide-container"
        >
          <div className="slide-content">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="left-panel"
            >
              <div className="sheikh-image-wrapper">
                <img
                  src={currentWatch.sheikhImage}
                  alt={`Sheikh Ammar with ${currentWatch.model.en}`}
                  className="sheikh-image"
                  loading="lazy"
                />
              </div>

              <div className="watch-info">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="watch-brand"
                >
                  {isRTL ? currentWatch.brand.ar : currentWatch.brand.en}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="watch-model"
                >
                  {isRTL ? currentWatch.model.ar : currentWatch.model.en}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="rarity-badge"
                >
                  {currentWatch.rarity}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="price"
                >
                  ${(currentWatch.price.max / 1000).toFixed(0)}K - ${(currentWatch.price.min / 1000).toFixed(0)}K
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="story"
                >
                  {isRTL ? currentWatch.story.ar : currentWatch.story.en}
                </motion.p>
              </div>
            </motion.div>

            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="right-panel"
              >
                <div className="watch-image-wrapper">
                  <img
                    ref={watchImageRef}
                    src={currentWatch.watchImage}
                    alt={`${currentWatch.model.en} watch`}
                    className="watch-image"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mobile-watch-image"
            >
              <img
                ref={watchImageRef}
                src={currentWatch.watchImage}
                alt={`${currentWatch.model.en} watch`}
                className="watch-image"
                loading="lazy"
              />
            </motion.div>
          )}

          {!isMobile && (
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="specs-card"
            >
              <h3>Specifications</h3>
              <dl className="specs-list">
                <div>
                  <dt>Reference</dt>
                  <dd>{currentWatch.reference}</dd>
                </div>
                <div>
                  <dt>Movement</dt>
                  <dd>{currentWatch.movement}</dd>
                </div>
                <div>
                  <dt>Case</dt>
                  <dd>{currentWatch.case}</dd>
                </div>
                <div>
                  <dt>Diameter</dt>
                  <dd>{currentWatch.diameter}</dd>
                </div>
                <div>
                  <dt>Complications</dt>
                  <dd>{currentWatch.complications.join(', ')}</dd>
                </div>
              </dl>
            </motion.aside>
          )}

          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="specs-accordion"
            >
              <button
                onClick={() => setSpecsExpanded(!specsExpanded)}
                className="accordion-button"
              >
                📋 Specifications {specsExpanded ? '−' : '+'}
              </button>
              {specsExpanded && (
                <dl className="specs-list">
                  <div>
                    <dt>Reference</dt>
                    <dd>{currentWatch.reference}</dd>
                  </div>
                  <div>
                    <dt>Movement</dt>
                    <dd>{currentWatch.movement}</dd>
                  </div>
                  <div>
                    <dt>Case</dt>
                    <dd>{currentWatch.case}</dd>
                  </div>
                  <div>
                    <dt>Diameter</dt>
                    <dd>{currentWatch.diameter}</dd>
                  </div>
                  <div>
                    <dt>Complications</dt>
                    <dd>{currentWatch.complications.join(', ')}</dd>
                  </div>
                </dl>
              )}
            </motion.div>
          )}

          <div className="navigation">
            {!isMobile && (
              <>
                <button onClick={prevSlide} className="nav-button prev" aria-label="Previous watch">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={nextSlide} className="nav-button next" aria-label="Next watch">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="slide-indicators">
            <div className="slide-counter">
              {String(currentIndex + 1).padStart(2, '0')} / {String(watches.length).padStart(2, '0')}
            </div>
            <div className="dots">
              {watches.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`dot ${idx === currentIndex ? 'active' : ''}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

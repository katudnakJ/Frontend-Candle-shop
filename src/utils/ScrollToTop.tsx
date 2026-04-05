'use client';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop = ({ threshold = 400 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-6 right-6 z-9999
        flex items-center justify-center
        w-15 h-15 rounded-full
        bg-[#3B382B] text-white
        shadow-[0_2px_12px_rgba(0,0,0,0.18)]
        transition-all duration-300 ease-out
        ${isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'}
        hover:bg-neutral-700 hover:shadow-[0_4px_20px_rgba(0,0,0,0.22)]
        active:scale-95
        cursor-pointer
      `}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-7 h-7" strokeWidth={2} />
    </button>
  );
};
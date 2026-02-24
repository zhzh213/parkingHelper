import React, { useState, useRef, useEffect } from 'react';

interface LongPressButtonProps {
  onComplete: () => void;
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export const LongPressButton: React.FC<LongPressButtonProps> = ({ 
  onComplete, 
  children, 
  className = '',
  duration = 1300
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTime = useRef<number>(0);
  const animationFrame = useRef<number | null>(null);
  const completed = useRef(false);

  const startPress = (e: React.TouchEvent | React.MouseEvent) => {
    if (completed.current) return;
    setIsPressing(true);
    setProgress(0);
    startTime.current = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (elapsed < duration) {
        animationFrame.current = requestAnimationFrame(updateProgress);
      } else {
        setIsPressing(false);
        setProgress(100);
        completed.current = true;
        onComplete();
        // Reset completed after a short delay so it can be pressed again if needed
        setTimeout(() => { 
          completed.current = false; 
          setProgress(0);
        }, 500);
      }
    };

    animationFrame.current = requestAnimationFrame(updateProgress);
  };

  const cancelPress = () => {
    if (completed.current) return;
    setIsPressing(false);
    setProgress(0);
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return (
    <button
      className={`relative overflow-hidden select-none ${className}`}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchCancel={cancelPress}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div 
        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-sky-400 to-sky-500 pointer-events-none"
        style={{ 
          height: `${progress}%`,
          transition: isPressing ? 'none' : 'height 0.3s ease-out',
          opacity: 0.8
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        {children}
      </div>
    </button>
  );
};

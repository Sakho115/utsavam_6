import { useState, useEffect, useRef } from 'react';

// ============================================
// 🎯 EDIT THIS DATE TO CHANGE THE COUNTDOWN
// Format: Year, Month (0-11), Day, Hour, Minute, Second
// Example: new Date(2025, 1, 28, 9, 0, 0) = February 28, 2025, 9:00 AM
// ============================================
const EVENT_DATE = new Date(2026, 2, 4, 9, 0, 0);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (): TimeLeft => {
  const now = new Date().getTime();
  const target = EVENT_DATE.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
};

const TimeUnit = ({ value, label, hasChanged }: { value: number; label: string; hasChanged: boolean }) => (
  <div className="flex flex-col items-center">
    <div className="relative overflow-hidden">
      <div 
        className={`bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 min-w-[60px] sm:min-w-[70px] md:min-w-[90px] shadow-lg ${
          hasChanged ? 'animate-countdown-flip' : ''
        }`}
      >
        <span className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-glow tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
    </div>
    <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground uppercase tracking-wider mt-2 font-medium">
      {label}
    </span>
  </div>
);

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const prevTimeRef = useRef<TimeLeft>(timeLeft);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Start interval only once on mount
    timerRef.current = window.setInterval(() => {
      const newTime = calculateTimeLeft();
      
      setTimeLeft((prev) => {
        prevTimeRef.current = prev;
        return newTime;
      });

      // Stop timer when countdown reaches zero
      if (newTime.days === 0 && newTime.hours === 0 && newTime.minutes === 0 && newTime.seconds === 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); // Empty dependency array - runs only once

  const prev = prevTimeRef.current;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
      <TimeUnit value={timeLeft.days} label="Days" hasChanged={timeLeft.days !== prev.days} />
      <span className="text-2xl sm:text-3xl md:text-4xl text-primary font-bold mb-6">:</span>
      <TimeUnit value={timeLeft.hours} label="Hours" hasChanged={timeLeft.hours !== prev.hours} />
      <span className="text-2xl sm:text-3xl md:text-4xl text-primary font-bold mb-6">:</span>
      <TimeUnit value={timeLeft.minutes} label="Minutes" hasChanged={timeLeft.minutes !== prev.minutes} />
      <span className="text-2xl sm:text-3xl md:text-4xl text-primary font-bold mb-6">:</span>
      <TimeUnit value={timeLeft.seconds} label="Seconds" hasChanged={timeLeft.seconds !== prev.seconds} />
    </div>
  );
};

export default CountdownTimer;

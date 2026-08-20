'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface ExpirationTimerProps {
  expiresAt?: string;
}

export default function ExpirationTimer({ expiresAt }: ExpirationTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const target = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const pad = (n: number) => (n < 10 ? `0${n}` : n);

  return (
    <div className="flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 text-xs font-mono">
      <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
        <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Purge Timer:</span>
      </div>
      <span className="font-extrabold text-emerald-700 dark:text-emerald-400 tracking-wider">
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    </div>
  );
}

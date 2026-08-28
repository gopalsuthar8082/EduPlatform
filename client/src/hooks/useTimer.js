import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useTimer Hook
 * Provides countdown timer with start, pause, resume, reset, and expiration callback
 * 
 * @param {number} initialSeconds - Starting time in seconds
 * @param {Object} options - { onExpire, autoStart = true }
 * @returns {Object} Timer states and controls
 */
export const useTimer = (initialSeconds = 0, { onExpire, autoStart = true } = {}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Update timeLeft if initialSeconds changes and timer hasn't started or reset
  useEffect(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsRunning(false);
          if (onExpireRef.current) {
            onExpireRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const resume = useCallback(() => setIsRunning(true), []);
  const reset = useCallback((newSeconds = initialSeconds) => {
    setTimeLeft(newSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  const formatTime = useCallback((seconds) => {
    const s = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const remainingSeconds = s % 60;

    const pad = (num) => String(num).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
    }
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  }, []);

  return {
    timeLeft,
    setTimeLeft,
    isRunning,
    start,
    pause,
    resume,
    reset,
    formattedTime: formatTime(timeLeft),
    formatTime,
    isWarning: timeLeft > 120 && timeLeft <= 600, // < 10 mins (yellow)
    isDanger: timeLeft <= 120 && timeLeft > 0,   // < 2 mins (red)
    isExpired: timeLeft === 0
  };
};

export default useTimer;

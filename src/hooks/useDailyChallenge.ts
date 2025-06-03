import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { format, isToday, differenceInDays } from 'date-fns';

export const useDailyChallenge = () => {
  const { 
    lastDailyChallenge,
    updateDailyChallenge,
    dailyStreak,
    updateDailyStreak
  } = useStore();

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (!lastDailyChallenge) {
      updateDailyChallenge(today);
      updateDailyStreak(0);
      return;
    }
    
    const lastDate = new Date(lastDailyChallenge);
    if (!isToday(lastDate)) {
      const daysDiff = differenceInDays(new Date(), lastDate);
      if (daysDiff === 1) {
        // Maintain streak
        updateDailyStreak(dailyStreak + 1);
      } else if (daysDiff > 1) {
        // Break streak
        updateDailyStreak(0);
      }
      updateDailyChallenge(today);
    }
  }, [lastDailyChallenge, dailyStreak, updateDailyChallenge, updateDailyStreak]);

  return {
    dailyStreak,
    updateDailyChallenge
  };
};
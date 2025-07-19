// useAutoUpdatingTodayDate.js
import { useEffect, useState } from 'react';

export default function useAutoUpdatingTodayDate() {
  const getToday = () => new Date().toLocaleDateString('en-CA');
  const [today, setToday] = useState(getToday());

  useEffect(() => {
    const checkDate = setInterval(() => {
      const current = getToday();
      if (current !== today) {
        setToday(current);
      }
    }, 60 * 1000);

    return () => clearInterval(checkDate);
  }, [today]);
  return today; // today
}

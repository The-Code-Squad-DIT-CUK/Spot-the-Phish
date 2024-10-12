import { useState, useEffect } from 'react';

const SmallTimer = ({ contestEndTime }) => {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = contestEndTime - now;
      

      if (difference > 0) {
        const days = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
        const hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        const minutes = String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, '0');

        setTimeLeft({ days, hours, minutes, seconds });
        
      } else {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [contestEndTime]);

  return (
    <div className="fixed top-0 left-0 m-4 mt-28 bg-slate-900 text-white p-2 rounded-md text-xs">
      <div>{timeLeft.days}:{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</div>
    </div>
  );
};

export default SmallTimer;

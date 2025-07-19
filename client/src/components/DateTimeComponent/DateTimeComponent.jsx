import { useState, useEffect } from "react";

const DateTimeComponent = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm font-medium">
      {now.toLocaleDateString()} | {now.toLocaleTimeString().substring(0,5)}
    </div>
  );
};

export default DateTimeComponent;

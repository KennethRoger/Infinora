import { useState, useEffect } from "react";

const OtpTimer = ({ duration = 30, onResend }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const expirationTime = localStorage.getItem("otpExpirationTime");
    const now = Date.now();

    if (expirationTime) {
      const timeRemaining = Math.ceil((parseInt(expirationTime, 10) - now) / 1000);

      if (timeRemaining > 0) {
        setTimeLeft(timeRemaining); 
      } else {
        setTimeLeft(0);
      }
    } else {
      setTimeLeft(0);
    }
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleResend = () => {
    const newExpirationTime = Date.now() + duration * 1000;
    localStorage.setItem("otpExpirationTime", newExpirationTime.toString());
    setTimeLeft(duration);
    if (onResend) onResend();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="mt-10">
      <div className="flex gap-1 text-base">
        <p>Didn't receive the OTP? </p>
        {timeLeft === 0 ? (
          <button onClick={handleResend} className="text-blue-500">
            Resend OTP
          </button>
        ) : (
          <p className="text-black/90">Resend OTP in: {formatTime(timeLeft)}</p>
        )}
      </div>
    </div>
  );
};

export default OtpTimer;

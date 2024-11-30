import { useState, useEffect } from "react";

const OtpTimer = ({ duration = 30, onResend }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const expirationTime = localStorage.getItem("otpExpirationTime");
    const now = Date.now();

    if (expirationTime && now < parseInt(expirationTime, 10)) {
      setTimeLeft(Math.ceil((parseInt(expirationTime, 10) - now) / 1000));
    } else {
      setTimeLeft(duration);
      setIsExpired(false);
    }
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      localStorage.removeItem("otpExpirationTime");
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleResend = () => {
    const newExpirationTime = Date.now() + duration * 1000;
    localStorage.setItem("otpExpirationTime", newExpirationTime.toString());
    setTimeLeft(duration);
    setIsExpired(false);
    if (onResend) onResend();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div>
      {isExpired ? (
        <div>
          <p>OTP expired. Please resend.</p>
          <button onClick={handleResend}>Resend OTP</button>
        </div>
      ) : (
        <p>OTP expires in: {formatTime(timeLeft)}</p>
      )}
    </div>
  );
};

export default OtpTimer;

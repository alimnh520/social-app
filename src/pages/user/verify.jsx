'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const OTPVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(120);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const inputRefs = useRef([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 2000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleChange = (index, value) => {
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        } else {
            setIsResendDisabled(false);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleResend = async () => {
        setTimeLeft(120);
        setIsResendDisabled(true);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        try {
            const res = await fetch('/api/user/resend', { method: 'GET' });
            const data = await res.json();
            setMessage(data.message);
        } catch (err) {
            console.error(err);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        const enteredOtp = otp.join('');
        try {
            const res = await fetch('/api/user/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp: enteredOtp })
            });
            const data = await res.json();
            setMessage(data.message);
            if (data.success) {
                router.push('/user/dashboard');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 px-4">
            <div className="w-full max-w-md p-8 z-10 rounded-2xl shadow-xl bg-white/10 backdrop-blur-xl text-white relative">
                {message && (
                    <p className="absolute top-4 left-1/2 -translate-x-1/2 text-center bg-rose-600/80 px-6 py-2 rounded-lg z-20">
                        {message}
                    </p>
                )}
                {loading && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
                        <img src="/197-1970959_whf-logo-spinner-to-indicate-loading-transparent-loading-heart-gif.png" className="w-20 h-20" />
                    </div>
                )}
                <h2 className="text-3xl font-bold text-center mb-2">OTP Verification</h2>
                <p className="text-center text-sm text-gray-300 mb-6">We've sent a 6-digit code to your email</p>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="flex justify-between space-x-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                autoFocus={index === 0}
                                className="w-full text-center text-xl py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                            />
                        ))}
                    </div>

                    <div className="text-center text-sm">
                        {timeLeft > 0 ? (
                            <span className="text-gray-300">Resend OTP in {formatTime(timeLeft)}</span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-pink-400 hover:text-pink-300 transition"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-pink-600 hover:bg-pink-700 transition rounded-lg font-semibold text-white shadow-xl"
                    >
                        Verify OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OTPVerification;

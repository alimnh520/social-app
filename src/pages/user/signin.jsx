'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaFacebookF } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [eye, setEye] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (message) {
        setTimeout(() => {
            setMessage('');
        }, 1500);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/user/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            setMessage(data.message);
            if (data.success) window.location.reload();
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleSignIn = async (provider) => {
        setLoading(true);
        await signIn(provider, { redirect: false, callbackUrl: '/components/dashboard' });
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-800 px-4 py-10 text-white">
            <div className="w-full max-w-md bg-white/10 z-10 backdrop-blur-lg rounded-2xl shadow-xl p-8 relative">
                <h2 className="text-3xl font-bold text-center mb-6">Login to Your Account</h2>

                {message && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-50">
                        {message}
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-opacity-40 z-50 rounded-2xl">
                        <img
                            src="/197-1970959_whf-logo-spinner-to-indicate-loading-transparent-loading-heart-gif.png"
                            alt="Loading"
                            className="w-16 h-16 object-contain"
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={eye ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 pr-10 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                            <button
                                type="button"
                                onClick={() => setEye(!eye)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl"
                            >
                                {eye ? <PiEyeBold /> : <PiEyeClosedBold />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between text-sm">
                        <Link href="/components/search-mail" className="text-blue-300 hover:underline">
                            Forgot password?
                        </Link>
                        <Link href="/user/signup" className="text-blue-300 hover:underline">
                            Create account
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white transition"
                    >
                        Login
                    </button>

                    <div className="flex items-center justify-between gap-4 my-3">
                        <div className="flex-1 h-px bg-white/40" />
                        <span className="text-sm">or</span>
                        <div className="flex-1 h-px bg-white/40" />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => handleSignIn('google')}
                            className="w-1/2 flex items-center justify-center gap-2 py-2 bg-white text-black rounded-lg hover:shadow-lg"
                        >
                            <FcGoogle className="text-2xl" />
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSignIn('facebook')}
                            className="w-1/2 flex items-center justify-center gap-2 py-2 bg-white text-blue-600 rounded-lg hover:shadow-lg"
                        >
                            <FaFacebookF className="text-2xl" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

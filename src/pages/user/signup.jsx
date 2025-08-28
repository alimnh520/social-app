'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { FaFacebookF } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const LoginForm = () => {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [method, setMethod] = useState("email");
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
            const response = await fetch('/api/user/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, method }),
            });
            const data = await response.json();
            setMessage(data.message);
            if (data.success) {
                setUserName('');
                setEmail('');
                setPassword('');
                router.push('/user/verify');
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleSignIn = async (provider) => {
        setLoading(true);
        const res = await signIn(provider, { redirect: false, callbackUrl: '/' });
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-800 px-4 py-10">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg z-10 rounded-2xl shadow-xl p-8 relative text-white">
                <h2 className="text-3xl font-bold text-center mb-6">Create Your Account</h2>

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

                <div className="flex items-center justify-center gap-6 mb-6">
                    <label htmlFor="email" className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-500 cursor-pointer  ${method === 'email' && 'bg-purple-600'} hover:bg-purple-600 hover:text-white transition`}>
                        <input
                            type="radio"
                            id="email"
                            name="loginMethod"
                            value="email"
                            checked={method === "email"}
                            onChange={() => setMethod("email")}
                            className="accent-purple-700"
                        />
                        <p >Email</p>
                    </label>
                    <label htmlFor="mobile" className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-500 cursor-pointer hover:bg-[rgba(0,255,0,0.56)] ${method === 'mobile' && 'bg-[rgba(0,255,0,0.56)]'} hover:text-white transition`}>
                        <input
                            type="radio"
                            id="mobile"
                            name="loginMethod"
                            value="mobile"
                            checked={method === "mobile"}
                            onChange={() => setMethod("mobile")}
                            className="accent-green-600"
                        />
                        <p>Mobile</p>
                    </label>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium mb-1">
                            Your Style Name
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>

                    {method === 'email' ? (
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
                    ) : (
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium mb-1">
                                Mobile Number
                            </label>
                            <div className="flex items-center justify-center gap-x-3">
                                <input type="text" className='w-3/12 px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30' disabled value={'+880'} />
                                <input
                                    id="mobile"
                                    name="mobile"
                                    type="number"
                                    required
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className="w-9/12 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                                />
                            </div>
                        </div>
                    )}

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
                        <Link href="/user/signin" className="text-blue-300 hover:underline">
                            Already have an account?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white transition"
                    >
                        Sign Up
                    </button>

                    {/* <div className="flex items-center justify-between gap-4 my-3">
                        <div className="flex-1 h-px bg-white/40" />
                        <span className="text-sm">or</span>
                        <div className="flex-1 h-px bg-white/40" />
                    </div> */}

                    {/* <div className="flex gap-4">
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
                    </div> */}
                </form>
            </div>
        </div>
    );
};

export default LoginForm;

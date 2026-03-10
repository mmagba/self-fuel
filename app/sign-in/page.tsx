"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignInPage: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    // Redirect to home if already signed in
    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                router.replace('/');
            }
        };
        checkSession();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                router.replace('/');
            }
        });

        return () => {
            sub.subscription.unsubscribe();
        };
    }, [router]);

    const signIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) alert(error.message);
        } finally {
            setLoading(false);
        }
    };



    const resetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) {
                alert(error.message);
            } else {
                setResetSent(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-100 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900">Self Fuel</h1>
                    <p className="text-zinc-500 mt-2">Your vault of motivation.</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-8">
                    {showResetForm ? (
                        <>
                            <h2 className="text-xl font-bold text-zinc-900 mb-1 text-center">Reset Password</h2>
                            <p className="text-zinc-500 text-sm text-center mb-6">
                                Enter your email and we&apos;ll send you a reset link.
                            </p>

                            {resetSent ? (
                                <div className="text-center">
                                    <p className="text-green-700 font-medium mb-4">Reset link sent! Check your email inbox.</p>
                                    <button
                                        onClick={() => { setShowResetForm(false); setResetSent(false); }}
                                        className="text-zinc-500 hover:text-zinc-800 transition-colors duration-200 underline cursor-pointer text-sm"
                                    >
                                        Back to Sign In
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <form onSubmit={resetPassword} className="flex flex-col gap-4">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email"
                                            className="px-3 py-2 rounded-md border border-zinc-300 text-sm"
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-4 py-2 text-sm bg-zinc-900 text-white rounded-md cursor-pointer disabled:opacity-50 font-medium"
                                        >
                                            {loading ? 'Sending…' : 'Send Reset Link'}
                                        </button>
                                    </form>
                                    <button
                                        onClick={() => setShowResetForm(false)}
                                        className="mt-4 w-full text-center text-zinc-500 hover:text-zinc-800 transition-colors duration-200 underline cursor-pointer text-sm"
                                    >
                                        Back to Sign In
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-zinc-900 mb-1 text-center">Welcome back</h2>
                            <p className="text-zinc-500 text-sm text-center mb-6">
                                Sign in to your account to continue.
                            </p>

                            <form onSubmit={signIn} className="flex flex-col gap-4">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    className="px-3 py-2 rounded-md border border-zinc-300 text-sm"
                                />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="px-3 py-2 rounded-md border border-zinc-300 text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 text-sm bg-zinc-900 text-white rounded-md cursor-pointer disabled:opacity-50 font-medium"
                                >
                                    {loading ? 'Signing in…' : 'Sign In'}
                                </button>
                            </form>

                            <div className="mt-4 flex flex-col items-center gap-2">
                                <button
                                    onClick={() => setShowResetForm(true)}
                                    className="text-zinc-500 hover:text-zinc-800 transition-colors duration-200 underline cursor-pointer text-sm"
                                >
                                    Forgot password?
                                </button>
                                <p className="text-zinc-500 text-sm">
                                    Don&apos;t have an account?{' '}
                                    <Link href="/sign-up" className="text-zinc-800 underline hover:text-zinc-600 transition-colors duration-200">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignInPage;

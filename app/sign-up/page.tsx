"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignUpPage: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const signUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                setError(error.message);
            } else {
                alert('Check your email to confirm your account.');
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
                    <h2 className="text-xl font-bold text-zinc-900 mb-1 text-center">Create an account</h2>
                    <p className="text-zinc-500 text-sm text-center mb-6">
                        Sign up to start building your motivation vault.
                    </p>

                    <form onSubmit={signUp} className="flex flex-col gap-4">
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
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="px-3 py-2 rounded-md border border-zinc-300 text-sm"
                        />

                        {error && (
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-zinc-900 text-white rounded-md cursor-pointer disabled:opacity-50 font-medium"
                        >
                            {loading ? 'Signing up…' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-zinc-500 text-sm">
                        Already have an account?{' '}
                        <Link href="/sign-in" className="text-zinc-800 underline hover:text-zinc-600 transition-colors duration-200">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;

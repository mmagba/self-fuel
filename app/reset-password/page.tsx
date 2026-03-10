"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const ResetPasswordPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Listen for the PASSWORD_RECOVERY event which fires when the user
        // arrives via the reset-password email link.
        const { data: sub } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setReady(true);
            }
        });

        // Also check if there is already an active session (the user may
        // have landed here after the auth state change already fired).
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) setReady(true);
        });

        return () => {
            sub.subscription.unsubscribe();
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        if (password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Password updated successfully!' });
                setPassword('');
                setConfirmPassword('');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-100 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-zinc-200 p-8">
                <h1 className="text-2xl font-bold text-zinc-900 mb-2 text-center">Reset Password</h1>
                <p className="text-zinc-500 text-sm text-center mb-6">Enter your new password below.</p>

                {!ready ? (
                    <p className="text-zinc-500 text-center text-sm">Verifying your reset link…</p>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New password"
                            className="px-3 py-2 rounded-md border border-zinc-300 text-sm"
                        />
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="px-3 py-2 rounded-md border border-zinc-300 text-sm"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-zinc-900 text-white rounded-md cursor-pointer disabled:opacity-50 font-medium"
                        >
                            {loading ? 'Updating…' : 'Update Password'}
                        </button>
                    </form>
                )}

                {message && (
                    <p className={`mt-4 text-sm text-center font-medium ${message.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                        {message.text}
                    </p>
                )}

                <div className="mt-6 text-center">
                    <a href="/" className="text-zinc-500 hover:text-zinc-800 transition-colors duration-200 underline text-sm">
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

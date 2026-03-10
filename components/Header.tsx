import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Header: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Password recovery state
  const [isRecovery, setIsRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUserEmail(data.session?.user?.email ?? null);
    };
    getSession();
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setUserEmail(session?.user?.email ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

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

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert('Check your email to confirm your account.');
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

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMessage(null);

    if (newPassword !== confirmPassword) {
      setUpdateMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setUpdateMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setUpdateMessage({ type: 'error', text: error.message });
      } else {
        setUpdateMessage({ type: 'success', text: 'Password updated successfully!' });
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setIsRecovery(false);
          setUpdateMessage(null);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsRecovery(false);
  };

  return (
    <header className="w-full max-w-2xl mx-auto text-center mb-8 md:mb-12">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900">
        Self Fuel
      </h1>
      <p className="text-zinc-500 mt-2">Your vault of motivation.</p>
      {isRecovery ? (
        <div className="mt-4">
          <p className="text-zinc-700 font-medium mb-3">Set your new password</p>
          <form onSubmit={handleUpdatePassword} className="flex flex-col items-center gap-2 mt-2 max-w-xs mx-auto">
            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className="w-full px-3 py-2 rounded-md border border-zinc-300 text-sm" />
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full px-3 py-2 rounded-md border border-zinc-300 text-sm" />
            <button type="submit" disabled={loading} className="w-full px-3 py-2 text-sm bg-zinc-900 text-white rounded-md cursor-pointer disabled:opacity-50 font-medium">
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
          {updateMessage && (
            <p className={`mt-2 text-sm font-medium ${updateMessage.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {updateMessage.text}
            </p>
          )}
        </div>
      ) : userEmail ? (
        <button
          onClick={signOut}
          className="fixed top-4 right-4 px-3 py-2 text-sm bg-zinc-900 text-white rounded-md cursor-pointer shadow"
        >
          Sign out
        </button>
      ) : showResetForm ? (
        <div className="mt-4">
          {resetSent ? (
            <div className="text-center">
              <p className="text-green-700 font-medium mb-2">Reset link sent! Check your email inbox.</p>
              <button
                onClick={() => { setShowResetForm(false); setResetSent(false); }}
                className="text-zinc-500 hover:text-zinc-800 transition-colors duration-200 underline cursor-pointer text-sm"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={resetPassword} className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="px-3 py-2 rounded-md border border-zinc-300 text-sm" />
                <button type="submit" disabled={loading} className="px-3 py-2 text-sm bg-zinc-900 text-white rounded-md cursor-pointer disabled:opacity-50">Send Reset Link</button>
              </form>
              <button
                onClick={() => setShowResetForm(false)}
                className="mt-2 text-zinc-500 hover:text-zinc-800 transition-colors duration-200 underline cursor-pointer text-sm"
              >
                Back to Sign In
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <form onSubmit={signIn} className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="px-3 py-2 rounded-md border border-zinc-300 text-sm" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="px-3 py-2 rounded-md border border-zinc-300 text-sm" />
            <button type="submit" disabled={loading} className="px-3 py-2 text-sm bg-zinc-900 text-white rounded-md cursor-pointer disabled:opacity-50">Sign in</button>
            <button onClick={signUp} disabled={loading} className="px-3 py-2 text-sm bg-zinc-200 text-zinc-900 rounded-md cursor-pointer disabled:opacity-50">Sign up</button>
          </form>
          <button
            onClick={() => setShowResetForm(true)}
            className="mt-2 text-zinc-500 hover:text-zinc-800 transition-colors duration-200 underline cursor-pointer text-sm"
          >
            Forgot password?
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
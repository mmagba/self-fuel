import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Header: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUserEmail(data.session?.user?.email ?? null);
    };
    getSession();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
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

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="w-full max-w-2xl mx-auto text-center mb-8 md:mb-12">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900">
        Self Fuel
      </h1>
      <p className="text-zinc-500 mt-2">Your vault of motivation.</p>
      {userEmail ? (
        <button
          onClick={signOut}
          className="fixed top-4 right-4 px-3 py-2 text-sm bg-zinc-900 text-white rounded-md cursor-pointer shadow"
        >
          Sign out
        </button>
      ) : (
        <div className="mt-4">
          <form onSubmit={signIn} className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="px-3 py-2 rounded-md border border-zinc-300 text-sm" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="px-3 py-2 rounded-md border border-zinc-300 text-sm" />
            <button type="submit" disabled={loading} className="px-3 py-2 text-sm bg-zinc-900 text-white rounded-md cursor-pointer disabled:opacity-50">Sign in</button>
            <button onClick={signUp} disabled={loading} className="px-3 py-2 text-sm bg-zinc-200 text-zinc-900 rounded-md cursor-pointer disabled:opacity-50">Sign up</button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
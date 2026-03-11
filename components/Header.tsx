import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

const Header: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUserEmail(data.session?.user?.email ?? null);
      setIsLoading(false);
    };
    getSession();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
      setIsLoading(false);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="w-full max-w-2xl mx-auto text-center mb-8 md:mb-12">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900">
        Self Fuel
      </h1>
      <p className="text-zinc-500 mt-2">Your vault of motivation.</p>
      {!isLoading && (
        userEmail ? (
          <button
            onClick={signOut}
            className="fixed top-4 right-4 px-3 py-2 text-sm bg-zinc-900 text-white rounded-md cursor-pointer shadow"
          >
            Sign out
          </button>
        ) : (
          <Link
            href="/sign-in"
            className="inline-block mt-4 px-6 py-2 text-sm bg-zinc-900 text-white rounded-md font-medium hover:bg-zinc-700 transition-colors duration-200"
          >
            Sign in
          </Link>
        )
      )}
    </header>
  );
};

export default Header;
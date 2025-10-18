import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-2xl mx-auto text-center mb-8 md:mb-12">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900">
        Motivation Boost
      </h1>
      <p className="text-zinc-500 mt-2">Your daily dose of inspiration.</p>
    </header>
  );
};

export default Header;
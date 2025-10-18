"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { MotivationItem } from '../types';
import { ItemType } from '../types';
import Header from '../components/Header';
import MotivationCard from '../components/MotivationCard';
import AddItemForm from '../components/AddItemForm';
import AllItemsList from '../components/AllItemsList';

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error loading from localStorage', error);
    } finally {
      setIsInitialized(true);
    }
  }, [key]);

  // Save to localStorage when value changes
  useEffect(() => {
    if (!isInitialized) return; // Don't save until we've loaded initial value

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }, [key, storedValue, isInitialized]);

  return [storedValue, setStoredValue];
};


const App: React.FC = () => {
  const [items, setItems] = useLocalStorage<MotivationItem[]>('motivationItems', []);
  const [currentItem, setCurrentItem] = useState<MotivationItem | null>(null);
  const [isListVisible, setListVisible] = useState(false);
  const [isAddFormVisible, setAddFormVisible] = useState(false);

  const selectNextItem = useCallback(() => {
    if (items.length === 0) {
      setCurrentItem(null);
      return;
    }

    // Ensure scores are at least 1 for the algorithm
    const validItems = items.map(item => ({ ...item, score: Math.max(item.score, 1) }));

    const totalScore = validItems.reduce((sum, item) => sum + item.score, 0);
    let randomPoint = Math.random() * totalScore;

    for (const item of validItems) {
      randomPoint -= item.score;
      if (randomPoint <= 0) {
        // To prevent showing the same item twice in a row if there are other options
        if (items.length > 1 && item.id === currentItem?.id) {
          // simple re-roll, not perfect but good enough
          selectNextItem();
          return;
        }
        setCurrentItem(item);
        return;
      }
    }

    // Fallback if something goes wrong
    if (items.length > 0) {
      setCurrentItem(items[0]);
    }
  }, [items, currentItem]);

  useEffect(() => {
    if (!currentItem && items.length > 0) {
      selectNextItem();
    }
  }, [items, currentItem, selectNextItem]);

  const handleAddItem = (type: ItemType, content: string) => {
    // Calculate the highest score among existing items to give the new item a fair chance.
    const maxScore = items.length > 0 ? Math.max(...items.map(item => item.score)) : 0;
    // New items should start with a score at least as high as the highest existing score, or 10 if it's the first item.
    const initialScore = Math.max(maxScore, 10);

    const newItem: MotivationItem = {
      id: Date.now(),
      type,
      content,
      score: initialScore,
      createdAt: Date.now(),
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    // Always show the newly added item immediately.
    setCurrentItem(newItem);
    setAddFormVisible(false);
  };

  const updateItemScore = (itemId: number, scoreChange: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, score: Math.max(1, item.score + scoreChange) } // Ensure score doesn't drop below 1
          : item
      )
    );
    // Use a short delay to allow state update before selecting next item
    setTimeout(selectNextItem, 50);
  };

  const handleLike = () => {
    if (currentItem) {
      updateItemScore(currentItem.id, 5);
    }
  };

  const handleDislike = () => {
    if (currentItem) {
      updateItemScore(currentItem.id, -5);
    }
  };

  const handleDeleteItem = (id: number) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    if (currentItem?.id === id) {
      if (newItems.length > 0) {
        // Use a short delay to allow state update before selecting next item
        setTimeout(selectNextItem, 50);
      } else {
        setCurrentItem(null);
      }
    }
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => b.createdAt - a.createdAt);
  }, [items]);

  return (
    <div className="min-h-screen bg-zinc-100 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <Header />
      <main className="w-full max-w-2xl mx-auto flex-grow flex flex-col items-center justify-center">
        {currentItem ? (
          <MotivationCard item={currentItem} onLike={handleLike} onDislike={handleDislike} />
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-800 mb-2">Welcome to Motivation Boost!</h2>
            <p className="text-zinc-600">Add a quote, image, or video to get started.</p>
          </div>
        )}
      </main>
      <section className="w-full max-w-2xl mx-auto mt-8 text-center flex flex-col items-center gap-4">
        <button
          onClick={() => setAddFormVisible(true)}
          className="px-8 py-3 bg-zinc-900 hover:bg-zinc-700 rounded-full font-semibold text-white transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-zinc-500/50 transform hover:scale-105 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add New Inspiration
        </button>
        <button
          onClick={() => setListVisible(true)}
          className="text-zinc-500 hover:text-zinc-800 transition-colors duration-200 underline cursor-pointer"
        >
          View All {items.length} Items
        </button>
      </section>
      <AddItemForm
        isOpen={isAddFormVisible}
        onClose={() => setAddFormVisible(false)}
        onAddItem={handleAddItem}
      />
      <AllItemsList
        isOpen={isListVisible}
        onClose={() => setListVisible(false)}
        items={sortedItems}
        onDeleteItem={handleDeleteItem}
      />
    </div>
  );
};

export default App;
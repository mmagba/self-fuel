import React, { useState, useEffect } from 'react';
import { ItemType } from '../types';

interface AddItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (type: ItemType, content: string) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ isOpen, onClose, onAddItem }) => {
  const [type, setType] = useState<ItemType>(ItemType.Quote);
  const [content, setContent] = useState('');

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setContent('');
      setType(ItemType.Quote);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddItem(type, content.trim());
    }
  };
  
  const placeholderText = {
      [ItemType.Quote]: "Enter a motivational quote...",
      [ItemType.Image]: "Enter URL of an inspiring image...",
      [ItemType.Video]: "Enter YouTube URL of a motivational video...",
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-zinc-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-zinc-800">Add New Inspiration</h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
        <div className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <select
                value={type}
                onChange={(e) => setType(e.target.value as ItemType)}
                className="bg-zinc-100 border border-zinc-300 rounded-md px-4 py-2 text-zinc-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                <option value={ItemType.Quote}>Quote</option>
                <option value={ItemType.Image}>Image</option>
                <option value={ItemType.Video}>Video</option>
                </select>
                <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholderText[type]}
                className="flex-grow bg-zinc-100 border border-zinc-300 rounded-md px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
                rows={3}
                />
                <button
                type="submit"
                className="px-6 py-2 bg-zinc-900 hover:bg-zinc-700 rounded-md font-semibold text-white transition-colors duration-200 flex items-center justify-center gap-2 self-end"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Add Item
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemForm;
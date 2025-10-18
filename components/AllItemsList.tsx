import React from 'react';
import type { MotivationItem } from '../types';
import { ItemType } from '../types';

interface AllItemsListProps {
  isOpen: boolean;
  onClose: () => void;
  items: MotivationItem[];
  onDeleteItem: (id: number) => void;
}

const AllItemsList: React.FC<AllItemsListProps> = ({ isOpen, onClose, items, onDeleteItem }) => {
  if (!isOpen) return null;
  
  const ItemIcon = ({type}: {type: ItemType}) => {
      const iconClass = "text-zinc-500";
      switch(type) {
          case ItemType.Quote: return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 2v7c0 7 4 8 7 8z"></path><path d="M14 21c3 0 7-1 7-8V5c0-1.25-.75-2.017-2-2h-4c-1.25 0-2 .75-2 2v7c0 7 4 8 7 8z"></path></svg>;
          case ItemType.Image: return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
          case ItemType.Video: return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
          default: return null;
      }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-zinc-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-800">All Items</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="overflow-y-auto p-4">
          {items.length > 0 ? (
            <ul className="space-y-3">
              {items.map(item => (
                <li key={item.id} className="bg-zinc-100 p-3 rounded-lg flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <ItemIcon type={item.type} />
                    <p className="truncate text-zinc-700 flex-1">{item.content}</p>
                    <span className="text-xs text-zinc-500 bg-zinc-200 px-2 py-1 rounded-full">Score: {item.score}</span>
                  </div>
                  <button 
                    onClick={() => onDeleteItem(item.id)}
                    className="flex-shrink-0 text-red-500 hover:text-red-400 p-1 cursor-pointer"
                    aria-label="Delete item"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-zinc-400 py-8">No items have been added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllItemsList;
import React from 'react';
import type { MotivationItem } from '../types';
import { ItemType } from '../types';

interface MotivationCardProps {
  item: MotivationItem;
  onLike: () => void;
  onDislike: () => void;
}

const getYouTubeEmbedUrl = (url: string): string | null => {
    let videoId = null;
    // This regex handles standard watch links, short youtu.be links, embed links, and the new shorts links.
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
        videoId = match[1];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};


const MotivationCard: React.FC<MotivationCardProps> = ({ item, onLike, onDislike }) => {
    
    const renderContent = () => {
        switch (item.type) {
            case ItemType.Quote:
                return (
                    <blockquote className="text-xl md:text-2xl italic text-center p-6 text-zinc-700">
                        &ldquo;{item.content}&rdquo;
                    </blockquote>
                );
            case ItemType.Image:
                return (
                    <img 
                        src={item.content} 
                        alt="Motivational" 
                        className="max-h-[60vh] w-auto rounded-lg object-contain" 
                        onError={(e) => (e.currentTarget.src = 'https://picsum.photos/600/400?grayscale')}
                    />
                );
            case ItemType.Video:
                const embedUrl = getYouTubeEmbedUrl(item.content);
                if (embedUrl) {
                    return (
                        <div className="aspect-video w-full">
                            <iframe 
                                src={embedUrl}
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="w-full h-full rounded-lg"
                            ></iframe>
                        </div>
                    );
                }
                return <a href={item.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{item.content}</a>;
        }
    };

    return (
        <div className="w-full bg-white border border-zinc-200 rounded-xl shadow-lg p-4 md:p-6 flex flex-col items-center gap-6 animate-fade-in">
            <div className="w-full flex items-center justify-center min-h-[200px]">
                {renderContent()}
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={onDislike}
                    className="group rounded-full p-4 bg-zinc-100 hover:bg-red-100 transition-all duration-200 transform hover:scale-110 cursor-pointer"
                    aria-label="Dislike"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 group-hover:text-red-600">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <button 
                    onClick={onLike}
                    className="group rounded-full p-4 bg-zinc-100 hover:bg-green-100 transition-all duration-200 transform hover:scale-110 cursor-pointer"
                    aria-label="Like"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 group-hover:text-green-600">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default MotivationCard;
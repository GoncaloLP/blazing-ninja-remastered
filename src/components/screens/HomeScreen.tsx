import React from 'react';
import { MobileLayout } from '../mobile/MobileLayout';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <MobileLayout currentScreen="home" onNavigate={onNavigate}>
      <div className="flex flex-col h-full">
        {/* Banner Section */}
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-700 m-4 rounded-lg overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-white">
            <h1 className="text-2xl font-bold mb-2">BLAZING FEST</h1>
            <p className="text-sm text-center px-4">New 6★ Naruto & Sasuke Available!</p>
            <div className="mt-4 flex space-x-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard
              title="Multi Summon"
              subtitle="Get 10 characters!"
              icon="⭐"
              color="from-purple-500 to-pink-500"
              onClick={() => onNavigate('summon')}
            />
            <QuickActionCard
              title="Story Mode"
              subtitle="Continue adventure"
              icon="🗺️"
              color="from-green-500 to-teal-500"
              onClick={() => onNavigate('story')}
            />
            <QuickActionCard
              title="Emergency Mission"
              subtitle="Limited time!"
              icon="🚨"
              color="from-red-500 to-orange-500"
              onClick={() => onNavigate('story')}
            />
            <QuickActionCard
              title="Phantom Castle"
              subtitle="Climb floors"
              icon="🏰"
              color="from-indigo-500 to-blue-500"
              onClick={() => onNavigate('battle')}
            />
          </div>
        </div>

        {/* News & Updates */}
        <div className="px-4 mb-4">
          <h2 className="text-white font-bold text-lg mb-3">News & Updates</h2>
          <div className="space-y-2">
            <NewsItem
              title="New 6★ Naruto Available!"
              date="2h ago"
              type="summon"
            />
            <NewsItem
              title="Emergency Mission: Sage Mode"
              date="1d ago"
              type="mission"
            />
            <NewsItem
              title="Phantom Castle Opens"
              date="3d ago"
              type="event"
            />
          </div>
        </div>

        {/* Featured Characters */}
        <div className="px-4 mb-4">
          <h2 className="text-white font-bold text-lg mb-3">Featured Characters</h2>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            <FeaturedCharacter name="Naruto" rarity={6} element="HRT" />
            <FeaturedCharacter name="Sasuke" rarity={6} element="SKL" />
            <FeaturedCharacter name="Sakura" rarity={6} element="BOD" />
            <FeaturedCharacter name="Madara" rarity={6} element="BRV" />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onClick: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, subtitle, icon, color, onClick }) => (
  <button onClick={onClick} className={`bg-gradient-to-br ${color} rounded-lg p-4 shadow-lg active:scale-95 transition-transform`}>
    <div className="flex items-center space-x-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <h3 className="text-white font-bold text-sm">{title}</h3>
        <p className="text-white/80 text-xs">{subtitle}</p>
      </div>
    </div>
  </button>
);

interface NewsItemProps {
  title: string;
  date: string;
  type: 'summon' | 'mission' | 'event';
}

const NewsItem: React.FC<NewsItemProps> = ({ title, date, type }) => {
  const getTypeColor = () => {
    switch (type) {
      case 'summon': return 'bg-purple-500';
      case 'mission': return 'bg-green-500';
      case 'event': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-3">
      <div className={`w-2 h-2 rounded-full ${getTypeColor()}`} />
      <div className="flex-1">
        <h4 className="text-white font-semibold text-sm">{title}</h4>
        <p className="text-white/60 text-xs">{date}</p>
      </div>
    </div>
  );
};

interface FeaturedCharacterProps {
  name: string;
  rarity: number;
  element: string;
}

const FeaturedCharacter: React.FC<FeaturedCharacterProps> = ({ name, rarity, element }) => (
  <div className="flex-none w-16 h-20 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-lg p-1 shadow-lg">
    <div className="w-full h-12 bg-white/20 rounded-md mb-1 flex items-center justify-center">
      <span className="text-2xl">👤</span>
    </div>
    <div className="text-center">
      <p className="text-white font-bold text-xs truncate">{name}</p>
      <div className="flex justify-center items-center space-x-1">
        <span className="text-yellow-300 text-xs">{'★'.repeat(rarity)}</span>
      </div>
    </div>
  </div>
);
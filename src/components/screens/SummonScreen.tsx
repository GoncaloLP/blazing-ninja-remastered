import React, { useState } from 'react';
import { MobileLayout } from '../mobile/MobileLayout';
import { BlaziingCharacter } from '../../types/blazing';
import { CHARACTERS } from '../../data/characters';

interface SummonScreenProps {
  onNavigate: (screen: string) => void;
}

export const SummonScreen: React.FC<SummonScreenProps> = ({ onNavigate }) => {
  const [selectedBanner, setSelectedBanner] = useState<'blazing' | 'rookie'>('blazing');
  const [summoning, setSummoning] = useState(false);
  const [summonResults, setSummonResults] = useState<BlaziingCharacter[]>([]);
  const [showResults, setShowResults] = useState(false);

  const performSummon = (type: 'single' | 'multi') => {
    setSummoning(true);
    
    setTimeout(() => {
      const results: BlaziingCharacter[] = [];
      const summonCount = type === 'single' ? 1 : 10;
      
      for (let i = 0; i < summonCount; i++) {
        const roll = Math.random();
        let character: BlaziingCharacter;
        
        if (selectedBanner === 'blazing') {
          if (roll < 0.01) {
            // 1% chance for 6-star featured
            character = CHARACTERS.find(c => c.rarity === 6)!;
          } else if (roll < 0.05) {
            // 4% chance for 5-star
            character = CHARACTERS.find(c => c.rarity === 5) || CHARACTERS[0];
          } else {
            // 95% chance for 4-star or lower
            character = CHARACTERS.find(c => c.rarity === 4) || CHARACTERS[0];
          }
        } else {
          // Rookie banner - higher rates for newer players
          if (roll < 0.1) {
            character = CHARACTERS.find(c => c.rarity === 5) || CHARACTERS[0];
          } else {
            character = CHARACTERS.find(c => c.rarity === 4) || CHARACTERS[0];
          }
        }
        
        results.push({ ...character, id: `${character.id}_${i}` });
      }
      
      setSummonResults(results);
      setSummoning(false);
      setShowResults(true);
    }, 2000);
  };

  const closeSummonResults = () => {
    setShowResults(false);
    setSummonResults([]);
  };

  if (showResults) {
    return (
      <MobileLayout showFooter={false}>
        <SummonResultsScreen 
          results={summonResults} 
          onClose={closeSummonResults}
        />
      </MobileLayout>
    );
  }

  if (summoning) {
    return (
      <MobileLayout showFooter={false}>
        <SummonAnimationScreen />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout currentScreen="summon" onNavigate={onNavigate}>
      <div className="flex flex-col h-full">
        {/* Banner Selector */}
        <div className="px-4 py-3">
          <div className="flex space-x-2">
            <BannerTab
              title="Blazing Fest"
              subtitle="6★ Featured"
              active={selectedBanner === 'blazing'}
              onClick={() => setSelectedBanner('blazing')}
            />
            <BannerTab
              title="Rookie Banner"
              subtitle="New Player"
              active={selectedBanner === 'rookie'}
              onClick={() => setSelectedBanner('rookie')}
            />
          </div>
        </div>

        {/* Banner Display */}
        <div className="relative h-64 mx-4 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-white">
            <h1 className="text-2xl font-bold mb-2">
              {selectedBanner === 'blazing' ? 'BLAZING FESTIVAL' : 'ROOKIE SUMMON'}
            </h1>
            <p className="text-sm text-center px-4 mb-4">
              {selectedBanner === 'blazing' 
                ? 'Higher rates for 6★ characters!' 
                : 'Perfect for new players!'}
            </p>
            <div className="flex space-x-2">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">🔥</span>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summon Rates */}
        <div className="px-4 mb-4">
          <h3 className="text-white font-bold text-lg mb-2">Summon Rates</h3>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="space-y-2">
              <RateRow stars={6} rate={selectedBanner === 'blazing' ? '1%' : '0.5%'} />
              <RateRow stars={5} rate={selectedBanner === 'blazing' ? '4%' : '10%'} />
              <RateRow stars={4} rate={selectedBanner === 'blazing' ? '95%' : '89.5%'} />
            </div>
          </div>
        </div>

        {/* Summon Buttons */}
        <div className="px-4 mt-auto mb-4">
          <div className="space-y-3">
            <SummonButton
              type="single"
              cost={5}
              onSummon={() => performSummon('single')}
            />
            <SummonButton
              type="multi"
              cost={40}
              onSummon={() => performSummon('multi')}
              discount="10 for 8!"
            />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

interface BannerTabProps {
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}

const BannerTab: React.FC<BannerTabProps> = ({ title, subtitle, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 p-3 rounded-lg transition-all ${
      active 
        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
        : 'bg-white/10 text-white/70 hover:bg-white/20'
    }`}
  >
    <h3 className="font-bold text-sm">{title}</h3>
    <p className="text-xs opacity-80">{subtitle}</p>
  </button>
);

interface RateRowProps {
  stars: number;
  rate: string;
}

const RateRow: React.FC<RateRowProps> = ({ stars, rate }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <span className="text-yellow-400">{'★'.repeat(stars)}</span>
      <span className="text-white text-sm">{stars}★</span>
    </div>
    <span className="text-white font-bold text-sm">{rate}</span>
  </div>
);

interface SummonButtonProps {
  type: 'single' | 'multi';
  cost: number;
  discount?: string;
  onSummon: () => void;
}

const SummonButton: React.FC<SummonButtonProps> = ({ type, cost, discount, onSummon }) => (
  <button
    onClick={onSummon}
    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg active:scale-95 transition-all"
  >
    <div className="flex justify-between items-center">
      <div className="text-left">
        <p className="text-lg">
          {type === 'single' ? 'Single Summon' : 'Multi Summon'}
        </p>
        {discount && <p className="text-sm opacity-80">{discount}</p>}
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-5 h-5 bg-blue-400 rounded-full" />
        <span className="text-lg">{cost}</span>
      </div>
    </div>
  </button>
);

const SummonAnimationScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-900 to-black text-white">
    <div className="text-6xl mb-8 animate-pulse">🔥</div>
    <h1 className="text-2xl font-bold mb-4">Summoning...</h1>
    <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse" />
    </div>
  </div>
);

interface SummonResultsScreenProps {
  results: BlaziingCharacter[];
  onClose: () => void;
}

const SummonResultsScreen: React.FC<SummonResultsScreenProps> = ({ results, onClose }) => (
  <div className="flex flex-col h-full bg-gradient-to-br from-purple-900 to-black text-white">
    <div className="flex-1 overflow-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Summon Results</h1>
      <div className="grid grid-cols-2 gap-4">
        {results.map((character, index) => (
          <div key={index} className="bg-gradient-to-b from-yellow-400 to-orange-500 rounded-lg p-3 shadow-lg">
            <div className="w-full h-24 bg-white/20 rounded-md mb-2 flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-sm truncate">{character.name}</p>
              <p className="text-white/80 text-xs truncate">{character.title}</p>
              <div className="flex justify-center items-center space-x-1 mt-1">
                <span className="text-yellow-300 text-xs">{'★'.repeat(character.rarity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="p-4">
      <button
        onClick={onClose}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg"
      >
        Continue
      </button>
    </div>
  </div>
);
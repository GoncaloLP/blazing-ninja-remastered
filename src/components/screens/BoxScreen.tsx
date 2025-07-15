import React, { useState } from 'react';
import { MobileLayout } from '../mobile/MobileLayout';
import { BlaziingCharacter } from '../../types/blazing';
import { STARTER_CHARACTERS } from '../../data/characters';

export const BoxScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'HRT' | 'SKL' | 'BOD' | 'BRV' | 'WIS'>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<BlaziingCharacter | null>(null);
  
  // For demo purposes, using starter characters
  const playerCharacters = STARTER_CHARACTERS;

  const filteredCharacters = selectedFilter === 'all' 
    ? playerCharacters 
    : playerCharacters.filter(char => char.element === selectedFilter);

  if (selectedCharacter) {
    return (
      <MobileLayout showFooter={false}>
        <CharacterDetailScreen 
          character={selectedCharacter} 
          onBack={() => setSelectedCharacter(null)}
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="flex justify-between items-center text-white">
            <h1 className="text-lg font-bold">Character Box</h1>
            <div className="text-sm">
              <span>{playerCharacters.length}/200</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-3">
          <div className="flex space-x-2 overflow-x-auto">
            <FilterTab 
              title="All" 
              active={selectedFilter === 'all'} 
              onClick={() => setSelectedFilter('all')}
            />
            <FilterTab 
              title="HRT" 
              active={selectedFilter === 'HRT'} 
              onClick={() => setSelectedFilter('HRT')}
              color="from-red-500 to-pink-500"
            />
            <FilterTab 
              title="SKL" 
              active={selectedFilter === 'SKL'} 
              onClick={() => setSelectedFilter('SKL')}
              color="from-blue-500 to-cyan-500"
            />
            <FilterTab 
              title="BOD" 
              active={selectedFilter === 'BOD'} 
              onClick={() => setSelectedFilter('BOD')}
              color="from-green-500 to-emerald-500"
            />
            <FilterTab 
              title="BRV" 
              active={selectedFilter === 'BRV'} 
              onClick={() => setSelectedFilter('BRV')}
              color="from-orange-500 to-yellow-500"
            />
            <FilterTab 
              title="WIS" 
              active={selectedFilter === 'WIS'} 
              onClick={() => setSelectedFilter('WIS')}
              color="from-purple-500 to-indigo-500"
            />
          </div>
        </div>

        {/* Character Grid */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="grid grid-cols-3 gap-3">
            {filteredCharacters.map((character) => (
              <CharacterBoxCard
                key={character.id}
                character={character}
                onClick={() => setSelectedCharacter(character)}
              />
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

interface FilterTabProps {
  title: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}

const FilterTab: React.FC<FilterTabProps> = ({ title, active, onClick, color = 'from-gray-500 to-gray-600' }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
      active 
        ? `bg-gradient-to-r ${color} text-white shadow-lg` 
        : 'bg-white/10 text-white/70 hover:bg-white/20'
    }`}
  >
    {title}
  </button>
);

interface CharacterBoxCardProps {
  character: BlaziingCharacter;
  onClick: () => void;
}

const CharacterBoxCard: React.FC<CharacterBoxCardProps> = ({ character, onClick }) => {
  const getElementColor = (element: string) => {
    switch (element) {
      case 'HRT': return 'from-red-500 to-pink-500';
      case 'SKL': return 'from-blue-500 to-cyan-500';
      case 'BOD': return 'from-green-500 to-emerald-500';
      case 'BRV': return 'from-orange-500 to-yellow-500';
      case 'WIS': return 'from-purple-500 to-indigo-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-b ${getElementColor(character.element)} rounded-lg p-2 shadow-lg active:scale-95 transition-transform`}
    >
      {/* Character Image */}
      <div className="w-full h-20 bg-white/20 rounded-md mb-2 flex items-center justify-center">
        <span className="text-2xl">👤</span>
      </div>
      
      {/* Character Info */}
      <div className="text-white text-center">
        <p className="font-bold text-xs truncate">{character.name}</p>
        <div className="flex justify-center items-center space-x-1 mt-1">
          <span className="text-yellow-300 text-xs">{'★'.repeat(character.rarity)}</span>
        </div>
        <p className="text-xs opacity-80">Lv.{character.level}</p>
      </div>
      
      {/* Element Badge */}
      <div className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">{character.element}</span>
      </div>
    </button>
  );
};

interface CharacterDetailScreenProps {
  character: BlaziingCharacter;
  onBack: () => void;
}

const CharacterDetailScreen: React.FC<CharacterDetailScreenProps> = ({ character, onBack }) => {
  const getElementColor = (element: string) => {
    switch (element) {
      case 'HRT': return 'from-red-500 to-pink-500';
      case 'SKL': return 'from-blue-500 to-cyan-500';
      case 'BOD': return 'from-green-500 to-emerald-500';
      case 'BRV': return 'from-orange-500 to-yellow-500';
      case 'WIS': return 'from-purple-500 to-indigo-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getElementColor(character.element)} p-4`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
          >
            <span>←</span>
          </button>
          <h1 className="text-lg font-bold">{character.name}</h1>
        </div>
      </div>

      {/* Character Artwork */}
      <div className="relative h-48 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-6xl">👤</span>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <div className="text-yellow-300 text-lg">{'★'.repeat(character.rarity)}</div>
          <div className="px-2 py-1 bg-black/50 rounded-full text-sm font-bold">
            {character.element}
          </div>
        </div>
      </div>

      {/* Character Info */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Basic Stats */}
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-bold mb-3">Basic Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-80">Level</p>
                <p className="font-bold">{character.level}/{character.maxLevel}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Cost</p>
                <p className="font-bold">{character.cost}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">HP</p>
                <p className="font-bold">{character.hp.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">ATK</p>
                <p className="font-bold">{character.attack.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Jutsu */}
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-bold mb-3">Jutsu</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">{character.jutsu.name}</p>
                <p className="text-sm opacity-80">{character.jutsu.description}</p>
                <div className="flex items-center space-x-4 text-xs mt-2">
                  <span>Chakra: {character.jutsu.chakraCost}</span>
                  <span>Range: {character.jutsu.range}</span>
                  <span>Hits: {character.jutsu.hitCount}</span>
                </div>
              </div>
              
              {character.ultimateJutsu && (
                <div>
                  <p className="font-semibold text-yellow-400">{character.ultimateJutsu.name}</p>
                  <p className="text-sm opacity-80">{character.ultimateJutsu.description}</p>
                  <div className="flex items-center space-x-4 text-xs mt-2">
                    <span>Chakra: {character.ultimateJutsu.chakraCost}</span>
                    <span>Range: {character.ultimateJutsu.range}</span>
                    <span>Hits: {character.ultimateJutsu.hitCount}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-bold mb-3">Skills</h3>
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-sm">Field Skill</p>
                <p className="text-sm opacity-80">{character.fieldSkill}</p>
              </div>
              <div>
                <p className="font-semibold text-sm">Buddy Skill</p>
                <p className="text-sm opacity-80">{character.buddySkill}</p>
              </div>
            </div>
          </div>

          {/* Abilities */}
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-bold mb-3">Abilities</h3>
            <div className="space-y-1">
              {character.abilities.map((ability, index) => (
                <p key={index} className="text-sm opacity-80">• {ability}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Character } from '../types/game';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onClick: () => void;
  isEnemy?: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isSelected,
  onClick,
  isEnemy = false
}) => {
  const getElementColor = (element: string): string => {
    const colors = {
      heart: 'from-red-500 to-red-600',
      body: 'from-yellow-500 to-yellow-600',
      skill: 'from-blue-500 to-blue-600',
      bravery: 'from-orange-500 to-orange-600',
      wisdom: 'from-green-500 to-green-600',
    };
    return colors[element as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const chakraPercentage = (character.chakra / character.maxChakra) * 100;
  const canUseNinjutsu = character.chakra >= character.ninjutsu.chakraCost;

  return (
    <div 
      className={`
        bg-gradient-to-br ${getElementColor(character.element)}
        rounded-lg p-3 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-102'}
        ${isEnemy ? 'opacity-80' : ''}
        text-white shadow-lg
      `}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="text-3xl">{character.avatar}</div>
          <div className="absolute -top-1 -right-1 flex items-center">
            {Array.from({ length: character.stars }, (_, i) => (
              <span key={i} className="text-xs text-yellow-400">⭐</span>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg">{character.name}</div>
          <div className="text-xs opacity-90 capitalize flex items-center space-x-2">
            <span>{character.element}</span>
            <span>•</span>
            <span>Lv.{character.level}</span>
            {character.isAwakened && <span className="text-yellow-400">★</span>}
          </div>
        </div>
        {canUseNinjutsu && !isEnemy && (
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        )}
      </div>
      
      <div className="mt-2 space-y-1">
        <div className="grid grid-cols-2 gap-1 text-xs">
          <span>ATK: {character.attack}</span>
          <span>HP: {character.hp}</span>
          <span>SPD: {character.speed}</span>
          <span>Cost: {character.cost}</span>
        </div>
        
        {!isEnemy && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Chakra</span>
              <span>{character.chakra}/{character.maxChakra}</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  canUseNinjutsu ? 'bg-yellow-400' : 'bg-blue-400'
                }`}
                style={{ width: `${chakraPercentage}%` }}
              ></div>
            </div>
            
            {/* Show jutsu info */}
            <div className="text-xs mt-1 opacity-80">
              <div>Ninjutsu: {character.ninjutsu.name}</div>
              {character.ultimateJutsu && (
                <div>Ultimate: {character.ultimateJutsu.name}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

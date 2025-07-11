
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
      fire: 'from-red-500 to-red-600',
      water: 'from-blue-500 to-blue-600',
      earth: 'from-yellow-500 to-yellow-600',
      lightning: 'from-purple-500 to-purple-600',
      wind: 'from-green-500 to-green-600',
    };
    return colors[element as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const chakraPercentage = (character.chakra / character.maxChakra) * 100;
  const canUseJutsu = character.chakra >= 50;

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
        <div className="text-3xl">{character.avatar}</div>
        <div className="flex-1">
          <div className="font-bold text-lg">{character.name}</div>
          <div className="text-xs opacity-90 capitalize">{character.element}</div>
        </div>
        {canUseJutsu && !isEnemy && (
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        )}
      </div>
      
      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-xs">
          <span>ATK: {character.attack}</span>
          <span>DEF: {character.defense}</span>
          <span>SPD: {character.speed}</span>
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
                  canUseJutsu ? 'bg-yellow-400' : 'bg-blue-400'
                }`}
                style={{ width: `${chakraPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


import React from 'react';
import { Character, Position } from '../types/game';

interface BattleGridProps {
  size: number;
  playerTeam: Character[];
  enemyTeam: Character[];
  selectedCharacter: Character | null;
  onCharacterSelect: (character: Character) => void;
  onMove: (position: Position) => void;
  gamePhase: string;
}

export const BattleGrid: React.FC<BattleGridProps> = ({
  size,
  playerTeam,
  enemyTeam,
  selectedCharacter,
  onCharacterSelect,
  onMove,
  gamePhase
}) => {
  const allCharacters = [...playerTeam, ...enemyTeam];
  
  const getCharacterAt = (x: number, y: number): Character | null => {
    return allCharacters.find(char => char.position.x === x && char.position.y === y) || null;
  };

  const canMoveTo = (x: number, y: number): boolean => {
    if (!selectedCharacter || gamePhase !== 'action') return false;
    
    // Check if position is occupied
    if (getCharacterAt(x, y)) return false;
    
    // Check movement range (simple: adjacent cells)
    const dx = Math.abs(x - selectedCharacter.position.x);
    const dy = Math.abs(y - selectedCharacter.position.y);
    return dx <= 1 && dy <= 1 && (dx + dy) > 0;
  };

  const isInAttackRange = (character: Character, x: number, y: number): boolean => {
    const dx = Math.abs(x - character.position.x);
    const dy = Math.abs(y - character.position.y);
    return Math.sqrt(dx * dx + dy * dy) <= character.attackRange;
  };

  const getElementColor = (element: string): string => {
    const colors = {
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      earth: 'bg-yellow-600',
      lightning: 'bg-purple-500',
      wind: 'bg-green-500',
    };
    return colors[element as keyof typeof colors] || 'bg-gray-500';
  };

  const handleCellClick = (x: number, y: number) => {
    const character = getCharacterAt(x, y);
    
    if (character) {
      onCharacterSelect(character);
    } else if (canMoveTo(x, y)) {
      onMove({ x, y });
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
      <div className="grid grid-cols-8 gap-1 aspect-square max-w-lg mx-auto">
        {Array.from({ length: size * size }, (_, index) => {
          const x = index % size;
          const y = Math.floor(index / size);
          const character = getCharacterAt(x, y);
          const canMove = canMoveTo(x, y);
          const isSelected = selectedCharacter?.position.x === x && selectedCharacter?.position.y === y;
          const showAttackRange = selectedCharacter && isInAttackRange(selectedCharacter, x, y);

          return (
            <div
              key={`${x}-${y}`}
              className={`
                aspect-square border border-white/20 rounded cursor-pointer
                transition-all duration-200 hover:bg-white/20
                flex items-center justify-center text-2xl font-bold
                ${character ? getElementColor(character.element) : 'bg-white/5'}
                ${isSelected ? 'ring-4 ring-yellow-400 ring-opacity-80' : ''}
                ${canMove ? 'bg-green-400/50 hover:bg-green-400/70' : ''}
                ${showAttackRange && !character ? 'bg-red-400/30' : ''}
                ${character?.team === 'enemy' ? 'border-red-400' : 'border-blue-400'}
              `}
              onClick={() => handleCellClick(x, y)}
            >
              {character && (
                <div className="relative">
                  <span className="drop-shadow-lg">{character.avatar}</span>
                  {character.chakra >= 50 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              )}
              {canMove && !character && (
                <div className="w-4 h-4 bg-green-400 rounded-full opacity-70"></div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center text-white/80">
        <div className="flex justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded border border-blue-400"></div>
            <span>Your Team</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded border border-red-400"></div>
            <span>Enemy Team</span>
          </div>
          {selectedCharacter && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-400/30 rounded"></div>
              <span>Attack Range</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

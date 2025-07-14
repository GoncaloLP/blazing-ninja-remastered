import React, { useRef, useState } from 'react';
import { Character, SpawnPoint } from '../types/game';
import battleBg from '../assets/battle-bg.jpg';
import narutoIcon from '../assets/naruto-icon.jpg';
import sasukeIcon from '../assets/sasuke-icon.jpg';
import sakuraIcon from '../assets/sakura-icon.jpg';
import itachiIcon from '../assets/itachi-icon.jpg';
import kisameIcon from '../assets/kisame-icon.jpg';
import orochimaruIcon from '../assets/orochimaru-icon.jpg';

interface BattleAreaProps {
  playerTeam: Character[];
  enemyTeam: Character[];
  playerSpawnPoints: SpawnPoint[];
  enemySpawnPoints: SpawnPoint[];
  onCharacterMove: (characterId: string, x: number, y: number) => void;
  onCharacterAttack: (characterId: string, targetId: string) => void;
  gamePhase: string;
  selectedCharacter: string | null;
  currentTurn: 'player' | 'enemy';
}

export const BattleArea: React.FC<BattleAreaProps> = ({
  playerTeam,
  enemyTeam,
  playerSpawnPoints,
  enemySpawnPoints,
  onCharacterMove,
  onCharacterAttack,
  gamePhase,
  selectedCharacter,
  currentTurn
}) => {
  const [draggedCharacter, setDraggedCharacter] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const battleAreaRef = useRef<HTMLDivElement>(null);

  const getCharacterIcon = (name: string): string => {
    const icons: Record<string, string> = {
      'Naruto': narutoIcon,
      'Sasuke': sasukeIcon,
      'Sakura': sakuraIcon,
      'Itachi': itachiIcon,
      'Kisame': kisameIcon,
      'Orochimaru': orochimaruIcon,
    };
    return icons[name] || narutoIcon;
  };

  const getAttackRange = (range: string): number => {
    switch (range) {
      case 'short': return 60;
      case 'mid': return 100;
      case 'long': return 140;
      case 'vast': return 180;
      default: return 80;
    }
  };

  const isInRange = (char1: Character, char2: Character, range: string): boolean => {
    const distance = Math.sqrt(
      Math.pow(char1.position.x - char2.position.x, 2) + 
      Math.pow(char1.position.y - char2.position.y, 2)
    );
    return distance <= getAttackRange(range);
  };

  const handleMouseDown = (e: React.MouseEvent, characterId: string) => {
    const character = [...playerTeam, ...enemyTeam].find(c => c.id === characterId);
    if (!character || character.team === 'enemy' || !character.canMove || currentTurn !== 'player' || selectedCharacter !== characterId) return;

    setDraggedCharacter(characterId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedCharacter || !battleAreaRef.current) return;

    const rect = battleAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    // Keep character within bounds
    const boundedX = Math.max(30, Math.min(rect.width - 30, x));
    const boundedY = Math.max(30, Math.min(rect.height - 30, y));

    onCharacterMove(draggedCharacter, boundedX, boundedY);
  };

  const handleMouseUp = () => {
    if (draggedCharacter) {
      const character = playerTeam.find(c => c.id === draggedCharacter);
      if (character && character.canMove) {
        // Just move the character, don't auto-attack
        // Attack is handled separately through action panel
      }
    }
    
    setDraggedCharacter(null);
    setDragOffset({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={battleAreaRef}
      className="relative w-full h-[300px] md:h-[400px] bg-cover bg-center bg-no-repeat rounded-lg border-2 md:border-4 border-amber-400 overflow-hidden touch-none"
      style={{ backgroundImage: `url(${battleBg})` }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={(e) => {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) {
          const mouseEvent = {
            clientX: touch.clientX,
            clientY: touch.clientY
          } as React.MouseEvent;
          handleMouseMove(mouseEvent);
        }
      }}
      onTouchEnd={handleMouseUp}
    >
      {/* Turn indicator */}
      <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded text-sm">
        {currentTurn === 'player' ? 'Your Turn' : 'Enemy Turn'}
      </div>

      {/* Player spawn points - only show during formation */}
      {gamePhase === 'formation' && playerSpawnPoints.map((spawn, index) => (
        <div
          key={`player-spawn-${index}`}
          className="absolute w-8 md:w-12 h-8 md:h-12 border-2 border-blue-400 border-dashed rounded-full bg-blue-500/20"
          style={{
            left: spawn.x - 16,
            top: spawn.y - 16
          }}
        />
      ))}

      {/* Enemy spawn points - only show during formation */}
      {gamePhase === 'formation' && enemySpawnPoints.map((spawn, index) => (
        <div
          key={`enemy-spawn-${index}`}
          className="absolute w-8 md:w-12 h-8 md:h-12 border-2 border-red-400 border-dashed rounded-full bg-red-500/20"
          style={{
            left: spawn.x - 16,
            top: spawn.y - 16
          }}
        />
      ))}

      {/* Render characters */}
      {[...playerTeam, ...enemyTeam].map(character => (
        <div key={character.id}>
          {/* Attack range circle */}
          {character.isAlive && character.team === 'player' && selectedCharacter === character.id && (
            <div
              className="absolute border-2 border-dashed border-blue-400/70 rounded-full pointer-events-none"
              style={{
                left: character.position.x - getAttackRange(character.attackRange),
                top: character.position.y - getAttackRange(character.attackRange),
                width: getAttackRange(character.attackRange) * 2,
                height: getAttackRange(character.attackRange) * 2,
                opacity: 0.6
              }}
            />
          )}
          
          {/* Character */}
          <div
            className={`
              absolute w-12 md:w-16 h-12 md:h-16 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2
              border-2 md:border-4 transition-all duration-200 overflow-hidden bg-white
              ${character.team === 'player' ? 'border-blue-400' : 'border-red-400'}
              ${selectedCharacter === character.id ? 'ring-4 ring-yellow-400 ring-opacity-70' : ''}
              ${draggedCharacter === character.id ? 'scale-110 z-50' : 'z-10'}
              ${!character.isAlive ? 'opacity-50 grayscale' : ''}
              ${!character.canMove && character.team === 'player' ? 'opacity-60' : ''}
              ${!character.canAct && character.team === 'player' ? 'brightness-75' : ''}
              shadow-lg hover:shadow-xl
            `}
            style={{
              left: character.position.x,
              top: character.position.y,
            }}
            onMouseDown={(e) => handleMouseDown(e, character.id)}
            onTouchStart={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              const rect = e.currentTarget.getBoundingClientRect();
              setDraggedCharacter(character.id);
              setDragOffset({
                x: touch.clientX - rect.left - rect.width / 2,
                y: touch.clientY - rect.top - rect.height / 2
              });
            }}
          >
            <img 
              src={getCharacterIcon(character.name)} 
              alt={character.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
            
            {/* Chakra indicator */}
            <div className="absolute -top-1 -right-1 w-3 md:w-4 h-3 md:h-4 bg-blue-500 rounded-full border border-white flex items-center justify-center">
              <span className="text-xs font-bold text-white">{character.chakra}</span>
            </div>
            
            {/* HP bar */}
            <div className="absolute -bottom-4 md:-bottom-6 left-1/2 transform -translate-x-1/2 w-10 md:w-12 h-1 md:h-1.5 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
              />
            </div>

            {/* Status indicators */}
            {!character.canAct && (
              <div className="absolute -top-1 -left-1 w-3 md:w-4 h-3 md:h-4 bg-red-500 rounded-full border border-white flex items-center justify-center">
                <span className="text-xs font-bold text-white">!</span>
              </div>
            )}
            
            {character.statusEffects.length > 0 && (
              <div className="absolute -bottom-1 -right-1 w-3 md:w-4 h-3 md:h-4 bg-purple-500 rounded-full border border-white flex items-center justify-center">
                <span className="text-xs font-bold text-white">*</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Instructions */}
      <div className="absolute bottom-1 md:bottom-2 left-1/2 transform -translate-x-1/2 text-center text-xs text-white bg-black/50 px-2 py-1 rounded">
        <p className="hidden md:block">Drag characters to move • Use action panel to attack</p>
        <p className="md:hidden">Tap & drag to move • Use panel to attack</p>
      </div>
    </div>
  );
};

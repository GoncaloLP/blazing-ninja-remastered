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
}

export const BattleArea: React.FC<BattleAreaProps> = ({
  playerTeam,
  enemyTeam,
  playerSpawnPoints,
  enemySpawnPoints,
  onCharacterMove,
  onCharacterAttack,
  gamePhase
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
    if (!character || character.team === 'enemy' || character.hasAttacked) return;

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
      // Check if character is in attack range of any enemy
      const character = playerTeam.find(c => c.id === draggedCharacter);
      if (character) {
        const enemiesInRange = enemyTeam.filter(enemy => 
          enemy.isAlive && isInRange(character, enemy, character.attackRange)
        );
        
        if (enemiesInRange.length > 0) {
          // Attack the first enemy in range
          onCharacterAttack(character.id, enemiesInRange[0].id);
        }
      }
    }
    
    setDraggedCharacter(null);
    setDragOffset({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={battleAreaRef}
      className="relative w-full h-[400px] bg-cover bg-center bg-no-repeat rounded-lg border-4 border-amber-400 overflow-hidden"
      style={{ backgroundImage: `url(${battleBg})` }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Player spawn points */}
      {playerSpawnPoints.map((spawn, index) => (
        <div
          key={`player-spawn-${index}`}
          className="absolute w-12 h-12 border-2 border-blue-400 border-dashed rounded-full bg-blue-500/20"
          style={{
            left: spawn.x - 24,
            top: spawn.y - 24
          }}
        />
      ))}

      {/* Enemy spawn points */}
      {enemySpawnPoints.map((spawn, index) => (
        <div
          key={`enemy-spawn-${index}`}
          className="absolute w-12 h-12 border-2 border-red-400 border-dashed rounded-full bg-red-500/20"
          style={{
            left: spawn.x - 24,
            top: spawn.y - 24
          }}
        />
      ))}

      {/* Render characters */}
      {[...playerTeam, ...enemyTeam].map(character => (
        <div key={character.id}>
          {/* Attack range circle */}
          {character.isAlive && character.team === 'player' && (
            <div
              className="absolute border-2 border-dashed border-gray-400/50 rounded-full pointer-events-none"
              style={{
                left: character.position.x - getAttackRange(character.attackRange),
                top: character.position.y - getAttackRange(character.attackRange),
                width: getAttackRange(character.attackRange) * 2,
                height: getAttackRange(character.attackRange) * 2,
                opacity: draggedCharacter === character.id ? 0.8 : 0.3
              }}
            />
          )}
          
          {/* Character */}
          <div
            className={`
              absolute w-16 h-16 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2
              border-4 ${character.team === 'player' ? 'border-blue-400' : 'border-red-400'}
              shadow-lg hover:shadow-xl transition-all duration-200
              ${draggedCharacter === character.id ? 'scale-110 z-50' : 'z-10'}
              ${!character.isAlive ? 'opacity-50 grayscale' : ''}
              ${character.hasAttacked ? 'opacity-70' : ''}
              overflow-hidden bg-white
            `}
            style={{
              left: character.position.x,
              top: character.position.y,
            }}
            onMouseDown={(e) => handleMouseDown(e, character.id)}
          >
            <img 
              src={getCharacterIcon(character.name)} 
              alt={character.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
            
            {/* Chakra indicator */}
            {character.chakra >= character.ninjutsu.chakraCost && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border border-white animate-pulse flex items-center justify-center">
                <span className="text-xs font-bold text-black">⚡</span>
              </div>
            )}
            
            {/* HP bar */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
              />
            </div>

            {/* Attack indicator */}
            {character.hasAttacked && (
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full border border-white flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Instructions */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-xs text-white bg-black/50 px-2 py-1 rounded">
        <p>Drag characters to move • Drop near enemies to attack</p>
      </div>
    </div>
  );
};

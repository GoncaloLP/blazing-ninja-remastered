
import React, { useRef, useState, useEffect } from 'react';
import { Character } from '../types/game';

interface BattleAreaProps {
  playerTeam: Character[];
  enemyTeam: Character[];
  onCharacterMove: (characterId: string, x: number, y: number) => void;
  onAttackTrigger: (attackerIds: string[], targetId: string) => void;
  gamePhase: string;
}

export const BattleArea: React.FC<BattleAreaProps> = ({
  playerTeam,
  enemyTeam,
  onCharacterMove,
  onAttackTrigger,
  gamePhase
}) => {
  const [draggedCharacter, setDraggedCharacter] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const battleAreaRef = useRef<HTMLDivElement>(null);

  const getAttackRange = (range: string): number => {
    switch (range) {
      case 'short': return 80;
      case 'mid': return 120;
      case 'long': return 160;
      case 'vast': return 200;
      default: return 100;
    }
  };

  const isInRange = (char1: Character, char2: Character, range: string): boolean => {
    const distance = Math.sqrt(
      Math.pow(char1.position.x - char2.position.x, 2) + 
      Math.pow(char1.position.y - char2.position.y, 2)
    );
    return distance <= getAttackRange(range);
  };

  const getCharactersInRange = (character: Character, targets: Character[]): Character[] => {
    return targets.filter(target => 
      target.isAlive && isInRange(character, target, character.attackRange)
    );
  };

  // Check for attacks when characters are in range
  useEffect(() => {
    if (gamePhase !== 'battle') return;

    playerTeam.forEach(playerChar => {
      if (!playerChar.isAlive) return;
      
      const enemiesInRange = getCharactersInRange(playerChar, enemyTeam);
      if (enemiesInRange.length > 0) {
        const target = enemiesInRange[0]; // Attack first enemy in range
        
        // Check for linked attacks - other players targeting same enemy
        const linkedAttackers = playerTeam.filter(char => 
          char.isAlive && 
          char.id !== playerChar.id && 
          getCharactersInRange(char, [target]).length > 0
        );
        
        const attackerIds = [playerChar.id, ...linkedAttackers.map(c => c.id)];
        onAttackTrigger(attackerIds, target.id);
      }
    });
  }, [playerTeam.map(c => `${c.position.x},${c.position.y}`).join('|'), gamePhase]);

  const handleMouseDown = (e: React.MouseEvent, characterId: string) => {
    const character = [...playerTeam, ...enemyTeam].find(c => c.id === characterId);
    if (!character || character.team === 'enemy') return;

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
    const boundedX = Math.max(40, Math.min(rect.width - 40, x));
    const boundedY = Math.max(40, Math.min(rect.height - 40, y));

    onCharacterMove(draggedCharacter, boundedX, boundedY);
  };

  const handleMouseUp = () => {
    setDraggedCharacter(null);
    setDragOffset({ x: 0, y: 0 });
  };

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

  return (
    <div 
      ref={battleAreaRef}
      className="relative w-full h-[600px] bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg border-4 border-amber-400 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Player spawn columns */}
      <div className="absolute left-4 top-4 bottom-4 w-32 bg-blue-500/20 rounded border-2 border-blue-400 border-dashed"></div>
      <div className="absolute left-40 top-4 bottom-4 w-32 bg-blue-500/10 rounded border-2 border-blue-300 border-dashed"></div>
      
      {/* Enemy spawn area */}
      <div className="absolute right-4 top-4 bottom-4 w-48 bg-red-500/20 rounded border-2 border-red-400 border-dashed"></div>

      {/* Render characters */}
      {[...playerTeam, ...enemyTeam].map(character => (
        <div key={character.id}>
          {/* Attack range circle */}
          {character.isAlive && (
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
              absolute w-20 h-20 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2
              bg-gradient-to-br ${getElementColor(character.element)}
              border-4 ${character.team === 'player' ? 'border-blue-400' : 'border-red-400'}
              shadow-lg hover:shadow-xl transition-all duration-200
              flex items-center justify-center text-3xl font-bold
              ${draggedCharacter === character.id ? 'scale-110 z-50' : 'z-10'}
              ${!character.isAlive ? 'opacity-50 grayscale' : ''}
            `}
            style={{
              left: character.position.x,
              top: character.position.y,
            }}
            onMouseDown={(e) => handleMouseDown(e, character.id)}
          >
            <span className="drop-shadow-lg">{character.avatar}</span>
            
            {/* Chakra indicator */}
            {character.chakra >= character.ninjutsu.chakraCost && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
                <span className="text-xs font-bold text-black">⚡</span>
              </div>
            )}
            
            {/* HP bar */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-black/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-sm text-gray-600">
        <p>Drag your characters from the blue columns to position them</p>
        <p>Attack ranges shown as dashed circles • Linked attacks when multiple characters target same enemy</p>
      </div>
    </div>
  );
};

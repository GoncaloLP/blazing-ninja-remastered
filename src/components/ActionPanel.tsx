
import React from 'react';
import { Character } from '../types/game';
import { Sword, Zap, Shield } from 'lucide-react';

interface ActionPanelProps {
  character: Character;
  enemyTeam: Character[];
  onAction: (actionType: 'attack' | 'jutsu' | 'defend', target?: Character) => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  character,
  enemyTeam,
  onAction
}) => {
  const canUseJutsu = character.chakra >= 50;
  
  const getEnemiesInRange = (range: number) => {
    return enemyTeam.filter(enemy => {
      const dx = Math.abs(enemy.position.x - character.position.x);
      const dy = Math.abs(enemy.position.y - character.position.y);
      return Math.sqrt(dx * dx + dy * dy) <= range;
    });
  };

  const attackTargets = getEnemiesInRange(character.attackRange);
  const jutsuTargets = getEnemiesInRange(character.jutsuRange);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
      <h3 className="font-bold text-lg mb-4">{character.name}'s Actions</h3>
      
      <div className="space-y-3">
        {/* Attack Action */}
        <div>
          <button
            className={`
              w-full flex items-center space-x-2 p-3 rounded-lg transition-all
              ${attackTargets.length > 0 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gray-500 cursor-not-allowed opacity-50'}
            `}
            disabled={attackTargets.length === 0}
          >
            <Sword className="w-5 h-5" />
            <span>Attack ({attackTargets.length} targets)</span>
          </button>
          
          {attackTargets.length > 0 && (
            <div className="mt-2 space-y-1">
              {attackTargets.map(enemy => (
                <button
                  key={enemy.id}
                  className="w-full text-left p-2 bg-white/10 rounded hover:bg-white/20 transition-all"
                  onClick={() => onAction('attack', enemy)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{enemy.avatar}</span>
                    <span>{enemy.name}</span>
                    <span className="text-xs opacity-70 ml-auto">{enemy.element}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Jutsu Action */}
        <div>
          <button
            className={`
              w-full flex items-center space-x-2 p-3 rounded-lg transition-all
              ${canUseJutsu && jutsuTargets.length > 0
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-gray-500 cursor-not-allowed opacity-50'}
            `}
            disabled={!canUseJutsu || jutsuTargets.length === 0}
          >
            <Zap className="w-5 h-5" />
            <span>Ultimate Jutsu ({jutsuTargets.length} targets)</span>
          </button>
          
          {canUseJutsu && jutsuTargets.length > 0 && (
            <div className="mt-2 space-y-1">
              {jutsuTargets.map(enemy => (
                <button
                  key={enemy.id}
                  className="w-full text-left p-2 bg-white/10 rounded hover:bg-white/20 transition-all"
                  onClick={() => onAction('jutsu', enemy)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{enemy.avatar}</span>
                    <span>{enemy.name}</span>
                    <span className="text-xs opacity-70 ml-auto">{enemy.element}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {!canUseJutsu && (
            <div className="mt-1 text-xs opacity-70">
              Need 50 chakra (current: {character.chakra})
            </div>
          )}
        </div>

        {/* Defend Action */}
        <button
          className="w-full flex items-center space-x-2 p-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all"
          onClick={() => onAction('defend')}
        >
          <Shield className="w-5 h-5" />
          <span>Defend & Build Chakra</span>
        </button>
      </div>

      <div className="mt-4 p-2 bg-black/20 rounded text-xs">
        <div>Position: ({character.position.x}, {character.position.y})</div>
        <div>Attack Range: {character.attackRange} • Jutsu Range: {character.jutsuRange}</div>
      </div>
    </div>
  );
};

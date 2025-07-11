
import React from 'react';
import { Character } from '../types/game';
import { Sword, Zap, Shield } from 'lucide-react';

interface ActionPanelProps {
  character: Character;
  enemyTeam: Character[];
  onAction: (actionType: 'attack' | 'ninjutsu' | 'ultimate' | 'defend', target?: Character) => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  character,
  enemyTeam,
  onAction
}) => {
  const canUseNinjutsu = character.chakra >= character.ninjutsu.chakraCost;
  const canUseUltimate = character.ultimateJutsu && character.chakra >= character.ultimateJutsu.chakraCost;
  
  const getEnemiesInRange = (range: number) => {
    return enemyTeam.filter(enemy => {
      const dx = Math.abs(enemy.position.x - character.position.x);
      const dy = Math.abs(enemy.position.y - character.position.y);
      return Math.sqrt(dx * dx + dy * dy) <= range;
    });
  };

  const attackTargets = getEnemiesInRange(2);
  const jutsuTargets = getEnemiesInRange(3);

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

        {/* Ninjutsu Action */}
        <div>
          <button
            className={`
              w-full flex items-center space-x-2 p-3 rounded-lg transition-all
              ${canUseNinjutsu && jutsuTargets.length > 0
                ? 'bg-purple-500 hover:bg-purple-600' 
                : 'bg-gray-500 cursor-not-allowed opacity-50'}
            `}
            disabled={!canUseNinjutsu || jutsuTargets.length === 0}
          >
            <Zap className="w-5 h-5" />
            <span>{character.ninjutsu.name} ({jutsuTargets.length} targets)</span>
          </button>
          
          {canUseNinjutsu && jutsuTargets.length > 0 && (
            <div className="mt-2 space-y-1">
              {jutsuTargets.map(enemy => (
                <button
                  key={enemy.id}
                  className="w-full text-left p-2 bg-white/10 rounded hover:bg-white/20 transition-all"
                  onClick={() => onAction('ninjutsu', enemy)}
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
          
          {!canUseNinjutsu && (
            <div className="mt-1 text-xs opacity-70">
              Need {character.ninjutsu.chakraCost} chakra (current: {character.chakra})
            </div>
          )}
        </div>

        {/* Ultimate Jutsu Action */}
        {character.ultimateJutsu && (
          <div>
            <button
              className={`
                w-full flex items-center space-x-2 p-3 rounded-lg transition-all
                ${canUseUltimate && jutsuTargets.length > 0
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-500 cursor-not-allowed opacity-50'}
              `}
              disabled={!canUseUltimate || jutsuTargets.length === 0}
            >
              <Zap className="w-5 h-5" />
              <span>{character.ultimateJutsu.name} ({jutsuTargets.length} targets)</span>
            </button>
            
            {canUseUltimate && jutsuTargets.length > 0 && (
              <div className="mt-2 space-y-1">
                {jutsuTargets.map(enemy => (
                  <button
                    key={enemy.id}
                    className="w-full text-left p-2 bg-white/10 rounded hover:bg-white/20 transition-all"
                    onClick={() => onAction('ultimate', enemy)}
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
            
            {!canUseUltimate && (
              <div className="mt-1 text-xs opacity-70">
                Need {character.ultimateJutsu.chakraCost} chakra (current: {character.chakra})
              </div>
            )}
          </div>
        )}

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
        <div>Range: {character.attackRange} • Stars: ⭐{character.stars}</div>
        <div>Level: {character.level}/{character.maxLevel} • Cost: {character.cost}</div>
      </div>
    </div>
  );
};

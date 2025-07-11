
import React from 'react';
import { Heart, Clock } from 'lucide-react';

interface GameHUDProps {
  playerHp: number;
  maxPlayerHp: number;
  enemyHp: number;
  maxEnemyHp: number;
  currentTurn: number;
  gamePhase: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  playerHp,
  maxPlayerHp,
  enemyHp,
  maxEnemyHp,
  currentTurn,
  gamePhase
}) => {
  const playerHpPercentage = (playerHp / maxPlayerHp) * 100;
  const enemyHpPercentage = (enemyHp / maxEnemyHp) * 100;

  const getPhaseText = () => {
    switch (gamePhase) {
      case 'positioning':
        return 'Select Your Ninja';
      case 'action':
        return 'Choose Your Action';
      case 'enemy':
        return 'Enemy Turn...';
      default:
        return 'Battle Phase';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span className="font-bold">Turn {Math.floor(currentTurn / 2) + 1}</span>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold">{getPhaseText()}</div>
          {gamePhase === 'enemy' && (
            <div className="text-sm opacity-70">Calculating enemy moves...</div>
          )}
        </div>
        
        <div className="text-right text-sm opacity-70">
          Tactical RPG
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Player HP */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-5 h-5 text-blue-400" />
            <span className="font-bold">Your Team</span>
            <span className="text-sm opacity-70">{playerHp}/{maxPlayerHp}</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-4">
            <div 
              className="h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${playerHpPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Enemy HP */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="font-bold">Enemy Team</span>
            <span className="text-sm opacity-70">{enemyHp}/{maxEnemyHp}</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-4">
            <div 
              className="h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-500"
              style={{ width: `${enemyHpPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Element Guide */}
      <div className="mt-4 text-xs opacity-70">
        <div className="text-center">
          🔥Fire > 🌪️Wind > ⚡Lightning > 🌍Earth > 🌊Water > 🔥Fire
        </div>
      </div>
    </div>
  );
};

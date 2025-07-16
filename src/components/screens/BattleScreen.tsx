import React, { useState, useEffect } from 'react';
import { MobileLayout } from '../mobile/MobileLayout';
import { Stage, PlayerData } from '../../types/blazing';

interface BattleScreenProps {
  stage: Stage;
  playerData: PlayerData;
  onComplete: (stage: Stage, victory: boolean) => void;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({ stage, playerData, onComplete }) => {
  const [battlePhase, setBattlePhase] = useState<'preparation' | 'fighting' | 'result'>('preparation');
  const [victory, setVictory] = useState(false);

  useEffect(() => {
    // Auto-start battle after preparation
    if (battlePhase === 'preparation') {
      const timer = setTimeout(() => {
        setBattlePhase('fighting');
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Auto-complete battle (simplified)
    if (battlePhase === 'fighting') {
      const timer = setTimeout(() => {
        const playerPower = playerData.characters.reduce((sum, char) => sum + char.attack + char.hp, 0);
        const enemyPower = stage.enemies.reduce((sum, enemy) => sum + enemy.attack + enemy.hp, 0);
        const winChance = Math.min(0.9, playerPower / (playerPower + enemyPower) + 0.2);
        
        const won = Math.random() < winChance;
        setVictory(won);
        setBattlePhase('result');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [battlePhase, playerData, stage]);

  const handleComplete = () => {
    onComplete(stage, victory);
  };

  return (
    <MobileLayout showFooter={false}>
      <div className="flex flex-col h-full bg-gradient-to-br from-orange-600 via-red-600 to-pink-700">
        {/* Battle Header */}
        <div className="p-4 bg-black/20">
          <h1 className="text-white text-xl font-bold text-center">{stage.name}</h1>
          <p className="text-white/80 text-sm text-center">Difficulty: {stage.difficulty}</p>
        </div>

        {/* Battle Content */}
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          {battlePhase === 'preparation' && (
            <div className="text-center text-white">
              <div className="text-6xl mb-4">⚔️</div>
              <h2 className="text-2xl font-bold mb-2">Preparing for Battle</h2>
              <p className="text-lg opacity-80">Get ready to fight!</p>
              <div className="w-64 h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 w-full animate-pulse" />
              </div>
            </div>
          )}

          {battlePhase === 'fighting' && (
            <div className="text-center text-white">
              <div className="text-6xl mb-4 animate-pulse">💥</div>
              <h2 className="text-2xl font-bold mb-2">Battle in Progress</h2>
              <p className="text-lg opacity-80">Fighting enemies...</p>
              <div className="grid grid-cols-2 gap-8 mt-8">
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-2">Your Team</h3>
                  <div className="space-y-2">
                    {playerData.characters.slice(0, 3).map((char) => (
                      <div key={char.id} className="bg-white/10 rounded p-2">
                        <p className="text-sm font-bold">{char.name}</p>
                        <p className="text-xs">Lvl {char.level}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-2">Enemies</h3>
                  <div className="space-y-2">
                    {stage.enemies.map((enemy, index) => (
                      <div key={index} className="bg-red-500/20 rounded p-2">
                        <p className="text-sm font-bold">{enemy.name}</p>
                        <p className="text-xs">Lvl {enemy.level}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {battlePhase === 'result' && (
            <div className="text-center text-white">
              <div className="text-6xl mb-4">{victory ? '🎉' : '💀'}</div>
              <h2 className="text-3xl font-bold mb-2">{victory ? 'Victory!' : 'Defeat!'}</h2>
              <p className="text-lg opacity-80 mb-4">
                {victory ? 'You won the battle!' : 'Better luck next time!'}
              </p>
              
              {victory && (
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-bold mb-2">Rewards</h3>
                  <div className="space-y-1">
                    {stage.rewards.map((reward, index) => (
                      <p key={index} className="text-sm">
                        {reward.type === 'ryo' ? `${reward.quantity} Ryo` : reward.item}
                        {reward.dropRate < 100 && ` (${reward.dropRate}% chance)`}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleComplete}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};
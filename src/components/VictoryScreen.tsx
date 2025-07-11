
import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

interface VictoryScreenProps {
  isVictory: boolean;
  onRestart: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ isVictory, onRestart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center text-white max-w-md w-full">
        <div className="mb-6">
          {isVictory ? (
            <>
              <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-400" />
              <h1 className="text-4xl font-bold mb-2">Victory!</h1>
              <p className="text-lg opacity-90">
                Excellent strategy, ninja! You've mastered the art of tactical combat.
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">💀</div>
              <h1 className="text-4xl font-bold mb-2">Defeat</h1>
              <p className="text-lg opacity-90">
                The enemy proved too strong this time. Learn from this battle and try again!
              </p>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="font-bold mb-2">Battle Stats</h3>
            <div className="text-sm opacity-90">
              <div>Tactical decisions made with precision</div>
              <div>Elemental advantages utilized</div>
              <div>Team coordination displayed</div>
            </div>
          </div>

          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 p-3 rounded-lg transition-all font-bold"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Battle Again</span>
          </button>
        </div>

        <div className="mt-6 text-xs opacity-70">
          "The true ninja never gives up!" - Naruto Uzumaki
        </div>
      </div>
    </div>
  );
};

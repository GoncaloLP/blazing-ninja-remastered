import React from 'react';
import { MobileLayout } from '../mobile/MobileLayout';
import { Stage } from '../../types/blazing';
import { STORY_STAGES, EMERGENCY_MISSIONS } from '../../data/stages';

export const StoryScreen: React.FC = () => {
  return (
    <MobileLayout>
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Mode Selector */}
        <div className="px-4 py-3">
          <div className="flex space-x-2">
            <ModeTab title="Story" active />
            <ModeTab title="Emergency" />
            <ModeTab title="Phantom Castle" />
          </div>
        </div>

        {/* Story Stages */}
        <div className="px-4 mb-4">
          <h2 className="text-white font-bold text-lg mb-3">Story Mode</h2>
          <div className="space-y-3">
            {STORY_STAGES.map((stage) => (
              <StageCard key={stage.id} stage={stage} />
            ))}
          </div>
        </div>

        {/* Emergency Missions */}
        <div className="px-4 mb-4">
          <h2 className="text-white font-bold text-lg mb-3">Emergency Missions</h2>
          <div className="space-y-3">
            {EMERGENCY_MISSIONS.map((stage) => (
              <StageCard key={stage.id} stage={stage} />
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

interface ModeTabProps {
  title: string;
  active?: boolean;
}

const ModeTab: React.FC<ModeTabProps> = ({ title, active }) => (
  <button
    className={`flex-1 p-3 rounded-lg transition-all ${
      active 
        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
        : 'bg-white/10 text-white/70 hover:bg-white/20'
    }`}
  >
    <h3 className="font-bold text-sm">{title}</h3>
  </button>
);

interface StageCardProps {
  stage: Stage;
}

const StageCard: React.FC<StageCardProps> = ({ stage }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'C': return 'bg-green-500';
      case 'B': return 'bg-blue-500';
      case 'A': return 'bg-purple-500';
      case 'S': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-lg p-4 shadow-lg ${
      stage.isUnlocked ? 'opacity-100' : 'opacity-50'
    }`}>
      {/* Lock overlay */}
      {!stage.isUnlocked && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-sm">Locked</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-4">
        {/* Stage Image */}
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-2xl">🏟️</span>
        </div>
        
        {/* Stage Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-white font-bold text-sm">{stage.name}</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor(stage.difficulty)}`}>
              {stage.difficulty}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-white/80">
            <div className="flex items-center space-x-1">
              <span>⚡</span>
              <span>{stage.staminaCost}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>👥</span>
              <span>{stage.enemies.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>💰</span>
              <span>{stage.rewards.length}</span>
            </div>
          </div>
        </div>
        
        {/* Start Button */}
        <button
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            stage.isUnlocked
              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg active:scale-95'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!stage.isUnlocked}
        >
          {stage.isUnlocked ? 'Start' : 'Locked'}
        </button>
      </div>
      
      {/* Rewards Preview */}
      {stage.isUnlocked && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center space-x-2">
            <span className="text-white/80 text-xs">Rewards:</span>
            <div className="flex space-x-2">
              {stage.rewards.slice(0, 3).map((reward, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <span className="text-xs">
                    {reward.type === 'ryo' ? '💰' : 
                     reward.type === 'character' ? '👤' : 
                     reward.type === 'pills' ? '💊' : '🎁'}
                  </span>
                  <span className="text-white/80 text-xs">{reward.dropRate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
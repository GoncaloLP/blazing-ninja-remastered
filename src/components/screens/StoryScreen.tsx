import React, { useState } from 'react';
import { MobileLayout } from '../mobile/MobileLayout';
import { Stage, PlayerData } from '../../types/blazing';
import { STORY_STAGES } from '../../data/stages';

interface StoryScreenProps {
  onNavigate: (screen: string) => void;
  playerData: PlayerData;
  onPlayStage: (stage: Stage) => void;
}

export const StoryScreen: React.FC<StoryScreenProps> = ({ onNavigate, playerData, onPlayStage }) => {
  const [selectedMode, setSelectedMode] = useState<'story' | 'emergency'>('story');

  return (
    <MobileLayout currentScreen="story" onNavigate={onNavigate}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600">
          <h1 className="text-white text-lg font-bold text-center">Story Mode</h1>
        </div>

        {/* Mode Selector */}
        <div className="px-4 py-3">
          <div className="flex space-x-2">
            <ModeTab
              title="Story"
              active={selectedMode === 'story'}
              onClick={() => setSelectedMode('story')}
            />
            <ModeTab
              title="Emergency"
              active={selectedMode === 'emergency'}
              onClick={() => setSelectedMode('emergency')}
            />
          </div>
        </div>

        {/* Stage List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 p-4">
            {STORY_STAGES.map((stage) => (
              <div key={stage.id} className={`p-4 rounded-lg shadow-lg ${stage.isUnlocked ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-600 opacity-50'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-bold text-lg">{stage.name}</h3>
                    <p className="text-white/80 text-sm">Difficulty: {stage.difficulty}</p>
                    <p className="text-white/70 text-xs">
                      Rewards: {stage.rewards.map(r => r.type === 'ryo' ? `${r.quantity} Ryo` : r.item).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">Stamina: {stage.staminaCost}</p>
                    <button 
                      disabled={!stage.isUnlocked || playerData.currency.stamina < stage.staminaCost}
                      onClick={() => stage.isUnlocked && onPlayStage(stage)}
                      className={`mt-2 px-4 py-2 rounded font-bold text-sm ${
                        stage.isUnlocked && playerData.currency.stamina >= stage.staminaCost
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                          : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {!stage.isUnlocked ? 'Locked' : playerData.currency.stamina < stage.staminaCost ? 'No Stamina' : 'Play'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

interface ModeTabProps {
  title: string;
  active: boolean;
  onClick: () => void;
}

const ModeTab: React.FC<ModeTabProps> = ({ title, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 p-3 rounded-lg transition-all ${
      active 
        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
        : 'bg-white/10 text-white/70 hover:bg-white/20'
    }`}
  >
    <h3 className="font-bold text-sm">{title}</h3>
  </button>
);
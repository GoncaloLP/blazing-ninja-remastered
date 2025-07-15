import React, { useState } from 'react';
import { GameState, PlayerData, Currency } from '../types/blazing';
import { STARTER_CHARACTERS } from '../data/characters';
import { HomeScreen } from './screens/HomeScreen';
import { SummonScreen } from './screens/SummonScreen';
import { BoxScreen } from './screens/BoxScreen';
import { StoryScreen } from './screens/StoryScreen';

export const BlaziingApp: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialPlayer: PlayerData = {
      name: 'Player',
      level: 1,
      exp: 0,
      currency: {
        pearls: 50,
        ryo: 10000,
        stamina: 120,
        maxStamina: 120
      },
      characters: STARTER_CHARACTERS,
      box: {
        capacity: 200,
        characters: STARTER_CHARACTERS
      },
      currentStage: 'prologue_1'
    };

    return {
      player: initialPlayer,
      currentScreen: 'home',
      activeBanner: null,
      currentStage: null,
      battleData: null
    };
  });

  const navigateToScreen = (screen: typeof gameState.currentScreen) => {
    setGameState(prev => ({
      ...prev,
      currentScreen: screen
    }));
  };

  const renderCurrentScreen = () => {
    switch (gameState.currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigateToScreen} />;
      case 'summon':
        return <SummonScreen onNavigate={navigateToScreen} />;
      case 'box':
        return <BoxScreen onNavigate={navigateToScreen} />;
      case 'story':
        return <StoryScreen onNavigate={navigateToScreen} />;
      case 'battle':
        return <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl mb-4">⚔️</div>
            <p className="text-xl font-bold">Battle System</p>
            <p className="text-sm opacity-80">Coming Soon!</p>
          </div>
        </div>;
      case 'settings':
        return <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <p className="text-xl font-bold">Settings</p>
            <p className="text-sm opacity-80">Coming Soon!</p>
          </div>
        </div>;
      default:
        return <HomeScreen onNavigate={navigateToScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {renderCurrentScreen()}
    </div>
  );
};
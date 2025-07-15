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
        return <HomeScreen />;
      case 'summon':
        return <SummonScreen />;
      case 'box':
        return <BoxScreen />;
      case 'story':
        return <StoryScreen />;
      case 'battle':
        return <div className="flex items-center justify-center h-screen bg-black text-white">
          <p>Battle System Coming Soon!</p>
        </div>;
      case 'settings':
        return <div className="flex items-center justify-center h-screen bg-black text-white">
          <p>Settings Coming Soon!</p>
        </div>;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {renderCurrentScreen()}
    </div>
  );
};
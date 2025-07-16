import React, { useState } from 'react';
import { GameState, PlayerData, Currency, BlaziingCharacter, Stage } from '../types/blazing';
import { STARTER_CHARACTERS, CHARACTERS } from '../data/characters';
import { STORY_STAGES } from '../data/stages';
import { HomeScreen } from './screens/HomeScreen';
import { SummonScreen } from './screens/SummonScreen';
import { BoxScreen } from './screens/BoxScreen';
import { StoryScreen } from './screens/StoryScreen';
import { BattleScreen } from './screens/BattleScreen';

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

  const addCharacterToCollection = (character: BlaziingCharacter) => {
    setGameState(prev => {
      const existingCharacter = prev.player.characters.find(c => c.id === character.id);
      
      if (existingCharacter) {
        // If character already exists, increase duplicates
        const updatedCharacters = prev.player.characters.map(c => 
          c.id === character.id ? { ...c, duplicates: c.duplicates + 1 } : c
        );
        const updatedBoxCharacters = prev.player.box.characters.map(c => 
          c.id === character.id ? { ...c, duplicates: c.duplicates + 1 } : c
        );
        
        return {
          ...prev,
          player: {
            ...prev.player,
            characters: updatedCharacters,
            box: {
              ...prev.player.box,
              characters: updatedBoxCharacters
            }
          }
        };
      } else {
        // Add new character at level 1
        const newCharacter = { ...character, level: 1, obtained: true };
        
        return {
          ...prev,
          player: {
            ...prev.player,
            characters: [...prev.player.characters, newCharacter],
            box: {
              ...prev.player.box,
              characters: [...prev.player.box.characters, newCharacter]
            }
          }
        };
      }
    });
  };

  const spendPearls = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        currency: {
          ...prev.player.currency,
          pearls: prev.player.currency.pearls - amount
        }
      }
    }));
  };

  const levelUpCharacter = (characterId: string) => {
    setGameState(prev => {
      const character = prev.player.characters.find(c => c.id === characterId);
      if (!character || character.level >= character.maxLevel) return prev;

      const levelUpCost = character.level * 1000; // Cost increases with level
      if (prev.player.currency.ryo < levelUpCost) return prev;

      const updatedCharacters = prev.player.characters.map(c => 
        c.id === characterId 
          ? { ...c, level: c.level + 1, hp: Math.floor(c.hp * 1.1), attack: Math.floor(c.attack * 1.1) }
          : c
      );
      
      const updatedBoxCharacters = prev.player.box.characters.map(c => 
        c.id === characterId 
          ? { ...c, level: c.level + 1, hp: Math.floor(c.hp * 1.1), attack: Math.floor(c.attack * 1.1) }
          : c
      );

      return {
        ...prev,
        player: {
          ...prev.player,
          currency: {
            ...prev.player.currency,
            ryo: prev.player.currency.ryo - levelUpCost
          },
          characters: updatedCharacters,
          box: {
            ...prev.player.box,
            characters: updatedBoxCharacters
          }
        }
      };
    });
  };

  const playStage = (stage: Stage) => {
    if (gameState.player.currency.stamina < stage.staminaCost) return;

    setGameState(prev => ({
      ...prev,
      currentStage: stage,
      currentScreen: 'battle',
      player: {
        ...prev.player,
        currency: {
          ...prev.player.currency,
          stamina: prev.player.currency.stamina - stage.staminaCost
        }
      }
    }));
  };

  const completeStage = (stage: Stage, victory: boolean) => {
    if (!victory) {
      setGameState(prev => ({ ...prev, currentScreen: 'story', currentStage: null }));
      return;
    }

    // Award rewards
    setGameState(prev => {
      let newRyo = prev.player.currency.ryo;
      const newCharacters = [...prev.player.characters];
      const newBoxCharacters = [...prev.player.box.characters];

      stage.rewards.forEach(reward => {
        const shouldDrop = Math.random() * 100 < reward.dropRate;
        if (shouldDrop) {
          if (reward.type === 'ryo') {
            newRyo += reward.quantity;
          } else if (reward.type === 'character') {
            const character = CHARACTERS.find(c => c.id === reward.item);
            if (character) {
              const newChar = { ...character, level: 1, obtained: true };
              newCharacters.push(newChar);
              newBoxCharacters.push(newChar);
            }
          }
        }
      });

      return {
        ...prev,
        currentScreen: 'story',
        currentStage: null,
        player: {
          ...prev.player,
          currency: {
            ...prev.player.currency,
            ryo: newRyo
          },
          characters: newCharacters,
          box: {
            ...prev.player.box,
            characters: newBoxCharacters
          }
        }
      };
    });
  };

  const renderCurrentScreen = () => {
    switch (gameState.currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigateToScreen} playerData={gameState.player} />;
      case 'summon':
        return <SummonScreen 
          onNavigate={navigateToScreen} 
          playerData={gameState.player}
          onCharacterObtained={addCharacterToCollection}
          onSpendPearls={spendPearls}
        />;
      case 'box':
        return <BoxScreen 
          onNavigate={navigateToScreen} 
          playerData={gameState.player}
          onLevelUp={levelUpCharacter}
        />;
      case 'story':
        return <StoryScreen 
          onNavigate={navigateToScreen} 
          playerData={gameState.player}
          onPlayStage={playStage}
        />;
      case 'battle':
        return <BattleScreen 
          stage={gameState.currentStage!}
          playerData={gameState.player}
          onComplete={completeStage}
        />;
      case 'settings':
        return <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <p className="text-xl font-bold">Settings</p>
            <p className="text-sm opacity-80">Coming Soon!</p>
          </div>
        </div>;
      default:
        return <HomeScreen onNavigate={navigateToScreen} playerData={gameState.player} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {renderCurrentScreen()}
    </div>
  );
};
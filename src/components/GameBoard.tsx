
import React, { useState, useEffect } from 'react';
import { Character, Position, GameState, ElementType } from '../types/game';
import { BattleGrid } from './BattleGrid';
import { CharacterCard } from './CharacterCard';
import { ActionPanel } from './ActionPanel';
import { GameHUD } from './GameHUD';
import { VictoryScreen } from './VictoryScreen';

const GRID_SIZE = 8;

const createInitialCharacter = (
  id: string,
  name: string,
  element: ElementType,
  position: Position,
  team: 'player' | 'enemy',
  avatar: string
): Character => ({
  id,
  name,
  element,
  hp: 100,
  maxHp: 100,
  attack: 45,
  defense: 25,
  speed: 30,
  chakra: 0,
  maxChakra: 100,
  position,
  attackRange: 2,
  jutsuRange: 3,
  isAlive: true,
  team,
  avatar
});

const GameBoard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const playerTeam = [
      createInitialCharacter('p1', 'Naruto', 'wind', { x: 1, y: 6 }, 'player', '🍥'),
      createInitialCharacter('p2', 'Sasuke', 'lightning', { x: 2, y: 7 }, 'player', '⚡'),
      createInitialCharacter('p3', 'Sakura', 'earth', { x: 0, y: 7 }, 'player', '🌸'),
    ];
    
    const enemyTeam = [
      createInitialCharacter('e1', 'Itachi', 'fire', { x: 6, y: 1 }, 'enemy', '🔥'),
      createInitialCharacter('e2', 'Kisame', 'water', { x: 7, y: 0 }, 'enemy', '🌊'),
      createInitialCharacter('e3', 'Orochimaru', 'earth', { x: 5, y: 0 }, 'enemy', '🐍'),
    ];

    return {
      playerTeam,
      enemyTeam,
      currentTurn: 0,
      selectedCharacter: null,
      gamePhase: 'positioning',
      sharedPlayerHp: 300,
      maxSharedPlayerHp: 300,
      sharedEnemyHp: 300,
      maxSharedEnemyHp: 300,
    };
  });

  const getElementAdvantage = (attacker: ElementType, defender: ElementType): number => {
    const advantages: Record<ElementType, ElementType> = {
      fire: 'wind',
      wind: 'lightning',
      lightning: 'earth',
      earth: 'water',
      water: 'fire',
    };
    
    if (advantages[attacker] === defender) return 1.5;
    if (advantages[defender] === attacker) return 0.7;
    return 1.0;
  };

  const calculateDamage = (attacker: Character, defender: Character, isJutsu = false): number => {
    const baseDamage = isJutsu ? attacker.attack * 1.8 : attacker.attack;
    const elementMultiplier = getElementAdvantage(attacker.element, defender.element);
    const defenseFactor = Math.max(0.1, 1 - defender.defense / 200);
    
    return Math.floor(baseDamage * elementMultiplier * defenseFactor);
  };

  const executeAttack = (attacker: Character, defender: Character, isJutsu = false) => {
    const damage = calculateDamage(attacker, defender, isJutsu);
    
    setGameState(prev => {
      const newState = { ...prev };
      
      // Apply damage to shared HP
      if (defender.team === 'player') {
        newState.sharedPlayerHp = Math.max(0, newState.sharedPlayerHp - damage);
      } else {
        newState.sharedEnemyHp = Math.max(0, newState.sharedEnemyHp - damage);
      }
      
      // Add chakra to attacker
      const chakraGain = isJutsu ? 0 : 20;
      if (attacker.team === 'player') {
        const playerIndex = newState.playerTeam.findIndex(c => c.id === attacker.id);
        if (playerIndex >= 0) {
          newState.playerTeam[playerIndex].chakra = Math.min(
            newState.playerTeam[playerIndex].maxChakra,
            newState.playerTeam[playerIndex].chakra + chakraGain
          );
        }
      }
      
      // Use chakra for jutsu
      if (isJutsu && attacker.team === 'player') {
        const playerIndex = newState.playerTeam.findIndex(c => c.id === attacker.id);
        if (playerIndex >= 0) {
          newState.playerTeam[playerIndex].chakra = Math.max(0, newState.playerTeam[playerIndex].chakra - 50);
        }
      }
      
      // Check win conditions
      if (newState.sharedPlayerHp <= 0) {
        newState.gamePhase = 'defeat';
      } else if (newState.sharedEnemyHp <= 0) {
        newState.gamePhase = 'victory';
      } else {
        // Next turn
        newState.currentTurn += 1;
        newState.gamePhase = newState.currentTurn % 2 === 0 ? 'positioning' : 'enemy';
        newState.selectedCharacter = null;
      }
      
      return newState;
    });
  };

  const handleCharacterSelect = (character: Character) => {
    if (gameState.gamePhase === 'positioning' && character.team === 'player') {
      setGameState(prev => ({
        ...prev,
        selectedCharacter: character,
        gamePhase: 'action'
      }));
    }
  };

  const handleMove = (newPosition: Position) => {
    if (gameState.selectedCharacter && gameState.gamePhase === 'action') {
      setGameState(prev => {
        const newState = { ...prev };
        const characterIndex = newState.playerTeam.findIndex(c => c.id === prev.selectedCharacter!.id);
        if (characterIndex >= 0) {
          newState.playerTeam[characterIndex].position = newPosition;
        }
        return newState;
      });
    }
  };

  const handleAction = (actionType: 'attack' | 'jutsu' | 'defend', target?: Character) => {
    const selected = gameState.selectedCharacter;
    if (!selected) return;

    if (actionType === 'attack' && target) {
      executeAttack(selected, target, false);
    } else if (actionType === 'jutsu' && target && selected.chakra >= 50) {
      executeAttack(selected, target, true);
    } else if (actionType === 'defend') {
      // Add defense buff and end turn
      setGameState(prev => ({
        ...prev,
        currentTurn: prev.currentTurn + 1,
        gamePhase: 'enemy',
        selectedCharacter: null
      }));
    }
  };

  // Enemy AI turn
  useEffect(() => {
    if (gameState.gamePhase === 'enemy') {
      const timer = setTimeout(() => {
        // Simple AI: random enemy attacks random player
        const aliveEnemies = gameState.enemyTeam.filter(c => c.isAlive);
        const alivePlayers = gameState.playerTeam.filter(c => c.isAlive);
        
        if (aliveEnemies.length > 0 && alivePlayers.length > 0) {
          const attacker = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
          const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
          executeAttack(attacker, target, false);
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.gamePhase]);

  if (gameState.gamePhase === 'victory' || gameState.gamePhase === 'defeat') {
    return (
      <VictoryScreen 
        isVictory={gameState.gamePhase === 'victory'}
        onRestart={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 p-4">
      <div className="max-w-7xl mx-auto">
        <GameHUD 
          playerHp={gameState.sharedPlayerHp}
          maxPlayerHp={gameState.maxSharedPlayerHp}
          enemyHp={gameState.sharedEnemyHp}
          maxEnemyHp={gameState.maxSharedEnemyHp}
          currentTurn={gameState.currentTurn}
          gamePhase={gameState.gamePhase}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Player Team */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">Your Team</h3>
            {gameState.playerTeam.map(character => (
              <CharacterCard
                key={character.id}
                character={character}
                isSelected={gameState.selectedCharacter?.id === character.id}
                onClick={() => handleCharacterSelect(character)}
              />
            ))}
          </div>
          
          {/* Battle Grid */}
          <div className="lg:col-span-2">
            <BattleGrid
              size={GRID_SIZE}
              playerTeam={gameState.playerTeam}
              enemyTeam={gameState.enemyTeam}
              selectedCharacter={gameState.selectedCharacter}
              onCharacterSelect={handleCharacterSelect}
              onMove={handleMove}
              gamePhase={gameState.gamePhase}
            />
          </div>
          
          {/* Action Panel & Enemy Team */}
          <div className="space-y-4">
            {gameState.selectedCharacter && (
              <ActionPanel
                character={gameState.selectedCharacter}
                enemyTeam={gameState.enemyTeam}
                onAction={handleAction}
              />
            )}
            
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">Enemy Team</h3>
              {gameState.enemyTeam.map(character => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  isSelected={false}
                  onClick={() => {}}
                  isEnemy
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;

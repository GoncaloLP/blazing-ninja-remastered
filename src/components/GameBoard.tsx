import React, { useState, useEffect } from 'react';
import { Character, Position, GameState, ElementType, Ninjutsu, SpawnPoint } from '../types/game';
import { BattleArea } from './BattleArea';
import { CharacterCard } from './CharacterCard';
import { VictoryScreen } from './VictoryScreen';

const createInitialCharacter = (
  id: string,
  name: string,
  element: ElementType,
  team: 'player' | 'enemy',
  stars: number = 5,
  spawnIndex: number = 0
): Character => {
  // Default positions - will be updated with proper spawn points
  const position: Position = { x: 100, y: 200 };

  return {
    id,
    name,
    element,
    stars,
    level: 80,
    maxLevel: 100,
    hp: 1200 + (stars * 200),
    maxHp: 1200 + (stars * 200),
    attack: 800 + (stars * 100),
    defense: 400 + (stars * 50),
    speed: 120 + (stars * 20),
    chakra: 0,
    maxChakra: 4,
    position,
    attackRange: stars >= 6 ? 'long' : 'mid',
    jutsuRange: 'long',
    isAlive: true,
    team,
    avatar: name,
    cost: stars + 10,
    isAwakened: stars >= 5,
    hasAttacked: false,
    isInStartPosition: true,
    ninjutsu: {
      name: `${name}'s Technique`,
      description: `${name}'s signature jutsu`,
      chakraCost: 4,
      damage: 1.2,
      range: 'mid',
      hitCount: 3
    },
    ultimateJutsu: stars >= 6 ? {
      name: `${name}'s Ultimate`,
      description: `${name}'s ultimate technique`,
      chakraCost: 8,
      damage: 2.5,
      range: 'vast',
      hitCount: 7
    } : undefined,
    fieldSkill: {
      name: 'Boost ATK',
      description: 'Boosts attack by 150-300',
      effect: {
        type: 'attack_boost',
        value: 150,
        target: 'allies'
      },
      range: 2
    },
    buddySkill: {
      name: 'Reduces damage',
      description: 'Reduces damage taken by 15%',
      effect: {
        type: 'damage_reduction',
        value: 15,
        target: 'self'
      }
    }
  };
};

const GameBoard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Create spawn points
    const playerSpawnPoints: SpawnPoint[] = [
      { x: 80, y: 120, isOccupied: false },  // First border top
      { x: 80, y: 280, isOccupied: false }, // First border bottom
      { x: 160, y: 200, isOccupied: false } // Second border middle
    ];

    const enemySpawnPoints: SpawnPoint[] = [
      { x: 450, y: 80, isOccupied: false },
      { x: 500, y: 130, isOccupied: false },
      { x: 550, y: 180, isOccupied: false },
      { x: 500, y: 230, isOccupied: false },
      { x: 450, y: 280, isOccupied: false },
      { x: 400, y: 320, isOccupied: false },
      { x: 350, y: 360, isOccupied: false }
    ];

    const playerTeam = [
      createInitialCharacter('p1', 'Naruto', 'heart', 'player', 6, 0),
      createInitialCharacter('p2', 'Sasuke', 'skill', 'player', 6, 1),
      createInitialCharacter('p3', 'Sakura', 'body', 'player', 5, 2),
    ];
    
    const enemyTeam = [
      createInitialCharacter('e1', 'Itachi', 'bravery', 'enemy', 6, 0),
      createInitialCharacter('e2', 'Kisame', 'wisdom', 'enemy', 6, 1),
      createInitialCharacter('e3', 'Orochimaru', 'body', 'enemy', 5, 2),
    ];

    // Position characters at spawn points
    playerTeam.forEach((char, index) => {
      if (playerSpawnPoints[index]) {
        char.position = { x: playerSpawnPoints[index].x, y: playerSpawnPoints[index].y };
        playerSpawnPoints[index].isOccupied = true;
      }
    });

    enemyTeam.forEach((char, index) => {
      if (enemySpawnPoints[index]) {
        char.position = { x: enemySpawnPoints[index].x, y: enemySpawnPoints[index].y };
        enemySpawnPoints[index].isOccupied = true;
      }
    });

    return {
      playerTeam,
      enemyTeam,
      frontRow: playerTeam.slice(0, 2),
      backRow: playerTeam.slice(2),
      currentTurn: 0,
      selectedCharacter: null,
      gamePhase: 'battle',
      playerSpawnPoints,
      enemySpawnPoints,
      turnTimer: 30,
      combo: 0,
    };
  });

  const getElementAdvantage = (attacker: ElementType, defender: ElementType): number => {
    const advantages: Record<ElementType, ElementType> = {
      heart: 'body',
      body: 'skill', 
      skill: 'bravery',
      bravery: 'wisdom',
      wisdom: 'heart',
    };
    
    if (advantages[attacker] === defender) return 2.0;
    if (advantages[defender] === attacker) return 0.5;
    return 1.0;
  };

  const calculateDamage = (attacker: Character, defender: Character): number => {
    const baseDamage = attacker.attack;
    const elementMultiplier = getElementAdvantage(attacker.element, defender.element);
    const defenseFactor = Math.max(0.1, 1 - defender.defense / 4000);
    
    return Math.floor(baseDamage * elementMultiplier * defenseFactor);
  };

  const handleCharacterMove = (characterId: string, x: number, y: number) => {
    setGameState(prev => {
      const newState = { ...prev };
      const characterIndex = newState.playerTeam.findIndex(c => c.id === characterId);
      if (characterIndex >= 0) {
        newState.playerTeam[characterIndex].position = { x, y };
        newState.playerTeam[characterIndex].isInStartPosition = false;
      }
      return newState;
    });
  };

  const handleCharacterAttack = (attackerId: string, targetId: string) => {
    setGameState(prev => {
      const newState = { ...prev };
      
      const attacker = newState.playerTeam.find(c => c.id === attackerId);
      const target = newState.enemyTeam.find(c => c.id === targetId);
      
      if (!attacker || !target || attacker.hasAttacked || !target.isAlive) return prev;

      // Calculate damage
      const damage = calculateDamage(attacker, target);
      
      // Apply damage
      const targetIndex = newState.enemyTeam.findIndex(c => c.id === targetId);
      newState.enemyTeam[targetIndex].hp = Math.max(0, newState.enemyTeam[targetIndex].hp - damage);
      
      // Mark character as having attacked
      const attackerIndex = newState.playerTeam.findIndex(c => c.id === attackerId);
      newState.playerTeam[attackerIndex].hasAttacked = true;
      newState.playerTeam[attackerIndex].chakra = Math.min(
        newState.playerTeam[attackerIndex].maxChakra,
        newState.playerTeam[attackerIndex].chakra + 1
      );

      // Check if target is defeated
      if (newState.enemyTeam[targetIndex].hp <= 0) {
        newState.enemyTeam[targetIndex].isAlive = false;
      }

      // Check win/lose conditions
      const aliveEnemies = newState.enemyTeam.filter(c => c.isAlive);
      const alivePlayers = newState.playerTeam.filter(c => c.isAlive);
      
      if (aliveEnemies.length === 0) {
        newState.gamePhase = 'victory';
      } else if (alivePlayers.length === 0) {
        newState.gamePhase = 'defeat';
      }

      return newState;
    });
  };

  // Reset attacks for new turn
  const resetTurn = () => {
    setGameState(prev => ({
      ...prev,
      playerTeam: prev.playerTeam.map(char => ({ ...char, hasAttacked: false })),
      currentTurn: prev.currentTurn + 1
    }));
  };

  // Enemy AI turn
  useEffect(() => {
    if (gameState.gamePhase === 'enemy') {
      const timer = setTimeout(() => {
        const aliveEnemies = gameState.enemyTeam.filter(c => c.isAlive);
        const alivePlayers = gameState.playerTeam.filter(c => c.isAlive);
        
        if (aliveEnemies.length > 0 && alivePlayers.length > 0) {
          // Simple AI: random enemy attacks random player
          const attacker = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
          const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
          
          setGameState(prev => {
            const newState = { ...prev };
            const damage = calculateDamage(attacker, target);
            
            const targetIndex = newState.playerTeam.findIndex(c => c.id === target.id);
            newState.playerTeam[targetIndex].hp = Math.max(0, newState.playerTeam[targetIndex].hp - damage);
            
            if (newState.playerTeam[targetIndex].hp <= 0) {
              newState.playerTeam[targetIndex].isAlive = false;
            }

            // Check win/lose conditions
            const alivePlayers = newState.playerTeam.filter(c => c.isAlive);
            if (alivePlayers.length === 0) {
              newState.gamePhase = 'defeat';
            } else {
              newState.gamePhase = 'battle';
              resetTurn();
            }

            return newState;
          });
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
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 p-2">
      <div className="max-w-lg mx-auto">
        {/* HUD */}
        <div className="bg-black/50 rounded-lg p-3 mb-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Turn: {gameState.currentTurn}</p>
              <p className="text-xs">Phase: {gameState.gamePhase}</p>
            </div>
            <div className="text-right">
              <div className="text-xs">
                <span className="text-blue-400">Players: {gameState.playerTeam.filter(c => c.isAlive).length}</span>
                <span className="mx-2">|</span>
                <span className="text-red-400">Enemies: {gameState.enemyTeam.filter(c => c.isAlive).length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Battle Area */}
        <BattleArea
          playerTeam={gameState.playerTeam}
          enemyTeam={gameState.enemyTeam}
          playerSpawnPoints={gameState.playerSpawnPoints}
          enemySpawnPoints={gameState.enemySpawnPoints}
          onCharacterMove={handleCharacterMove}
          onCharacterAttack={handleCharacterAttack}
          gamePhase={gameState.gamePhase}
        />
        
        {/* Character Cards */}
        <div className="mt-4 space-y-3">
          <div>
            <h3 className="text-white font-bold text-sm mb-2">Your Team</h3>
            <div className="grid grid-cols-3 gap-2">
              {gameState.playerTeam.map(character => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  isSelected={false}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-sm mb-2">Enemy Team</h3>
            <div className="grid grid-cols-3 gap-2">
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

        {/* Turn Controls */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={resetTurn}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold"
          >
            End Turn
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
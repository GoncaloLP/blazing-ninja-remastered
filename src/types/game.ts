
export interface Character {
  id: string;
  name: string;
  element: ElementType;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  chakra: number;
  maxChakra: number;
  position: Position;
  attackRange: number;
  jutsuRange: number;
  isAlive: boolean;
  team: 'player' | 'enemy';
  avatar: string;
}

export interface Position {
  x: number;
  y: number;
}

export type ElementType = 'fire' | 'water' | 'earth' | 'lightning' | 'wind';

export interface GameState {
  playerTeam: Character[];
  enemyTeam: Character[];
  currentTurn: number;
  selectedCharacter: Character | null;
  gamePhase: 'positioning' | 'action' | 'enemy' | 'victory' | 'defeat';
  sharedPlayerHp: number;
  maxSharedPlayerHp: number;
  sharedEnemyHp: number;
  maxSharedEnemyHp: number;
}

export interface BattleAction {
  type: 'move' | 'attack' | 'jutsu' | 'defend';
  character: Character;
  target?: Character;
  targetPosition?: Position;
}

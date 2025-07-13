
export interface Character {
  id: string;
  name: string;
  element: ElementType;
  stars: number;
  level: number;
  maxLevel: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  chakra: number;
  maxChakra: number;
  position: Position;
  attackRange: AttackRangeType;
  jutsuRange: AttackRangeType;
  isAlive: boolean;
  team: 'player' | 'enemy';
  avatar: string;
  fieldSkill?: FieldSkill;
  buddySkill?: BuddySkill;
  ninjutsu: Ninjutsu;
  ultimateJutsu?: Ninjutsu;
  cost: number;
  isAwakened: boolean;
  hasAttacked: boolean;
  isInStartPosition: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export type ElementType = 'heart' | 'body' | 'skill' | 'bravery' | 'wisdom';

export type AttackRangeType = 'short' | 'mid' | 'long' | 'vast';

export interface FieldSkill {
  name: string;
  description: string;
  effect: SkillEffect;
  range: number;
}

export interface BuddySkill {
  name: string;
  description: string;
  effect: SkillEffect;
}

export interface SkillEffect {
  type: 'attack_boost' | 'defense_boost' | 'health_boost' | 'chakra_boost' | 'critical_boost' | 'damage_reduction';
  value: number;
  target: 'self' | 'allies' | 'enemies';
}

export interface Ninjutsu {
  name: string;
  description: string;
  chakraCost: number;
  damage: number;
  effects?: NinjutsuEffect[];
  range: AttackRangeType;
  hitCount: number;
}

export interface NinjutsuEffect {
  type: 'slip_damage' | 'poison' | 'paralysis' | 'seal' | 'attack_boost' | 'defense_boost' | 'heal';
  duration: number;
  value: number;
}

export interface SpawnPoint {
  x: number;
  y: number;
  isOccupied: boolean;
}

export interface GameState {
  playerTeam: Character[];
  enemyTeam: Character[];
  frontRow: Character[];
  backRow: Character[];
  currentTurn: number;
  selectedCharacter: Character | null;
  gamePhase: 'formation' | 'positioning' | 'action' | 'battle' | 'enemy' | 'victory' | 'defeat';
  playerSpawnPoints: SpawnPoint[];
  enemySpawnPoints: SpawnPoint[];
  turnTimer: number;
  combo: number;
}

export interface BattleAction {
  type: 'move' | 'attack' | 'ninjutsu' | 'ultimate' | 'defend' | 'switch';
  character: Character;
  target?: Character;
  targetPosition?: Position;
  isComboAttack?: boolean;
}

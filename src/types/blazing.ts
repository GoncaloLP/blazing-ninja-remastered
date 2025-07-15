export interface BlaziingCharacter {
  id: string;
  name: string;
  title: string;
  element: 'HRT' | 'SKL' | 'BOD' | 'BRV' | 'WIS';
  rarity: 1 | 2 | 3 | 4 | 5 | 6;
  cost: number;
  level: number;
  maxLevel: number;
  hp: number;
  attack: number;
  luck: number;
  abilities: string[];
  fieldSkill: string;
  buddySkill: string;
  jutsu: Jutsu;
  ultimateJutsu?: Jutsu;
  isAwakened: boolean;
  image: string;
  artwork: string;
  obtained: boolean;
  pills: CharacterPills;
  duplicates: number;
}

export interface Jutsu {
  name: string;
  description: string;
  damage: number;
  range: 'Short' | 'Mid' | 'Long' | 'Vast';
  hitCount: number;
  effects: string[];
  chakraCost: number;
}

export interface CharacterPills {
  attack: number;
  health: number;
}

export interface Currency {
  pearls: number;
  ryo: number;
  stamina: number;
  maxStamina: number;
}

export interface Stage {
  id: string;
  name: string;
  difficulty: 'C' | 'B' | 'A' | 'S';
  staminaCost: number;
  rewards: StageReward[];
  enemies: BlaziingCharacter[];
  background: string;
  isUnlocked: boolean;
}

export interface StageReward {
  type: 'character' | 'ryo' | 'pills' | 'material';
  item: string;
  quantity: number;
  dropRate: number;
}

export interface PlayerData {
  name: string;
  level: number;
  exp: number;
  currency: Currency;
  characters: BlaziingCharacter[];
  box: BoxData;
  currentStage: string;
}

export interface BoxData {
  capacity: number;
  characters: BlaziingCharacter[];
}

export interface SummonBanner {
  id: string;
  name: string;
  featured: BlaziingCharacter[];
  rates: {
    [key: number]: number;
  };
  cost: number;
  isActive: boolean;
  endDate: Date;
}

export interface GameState {
  player: PlayerData;
  currentScreen: 'home' | 'summon' | 'box' | 'story' | 'battle' | 'settings';
  activeBanner: SummonBanner | null;
  currentStage: Stage | null;
  battleData: BattleData | null;
}

export interface BattleData {
  playerTeam: BlaziingCharacter[];
  enemyTeam: BlaziingCharacter[];
  currentTurn: number;
  battlePhase: 'formation' | 'battle' | 'result';
  selectedCharacter: BlaziingCharacter | null;
  actionQueue: BattleAction[];
}

export interface BattleAction {
  characterId: string;
  action: 'move' | 'attack' | 'jutsu' | 'ultimate';
  targetId?: string;
  targetPosition?: { x: number; y: number };
}
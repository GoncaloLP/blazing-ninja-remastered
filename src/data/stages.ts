import { Stage } from '../types/blazing';
import { CHARACTERS } from './characters';

export const STORY_STAGES: Stage[] = [
  {
    id: 'prologue_1',
    name: 'The Beginning of the Story',
    difficulty: 'C',
    staminaCost: 10,
    rewards: [
      { type: 'ryo', item: 'ryo', quantity: 1000, dropRate: 100 },
      { type: 'character', item: 'kakashi_basic', quantity: 1, dropRate: 20 }
    ],
    enemies: [
      { ...CHARACTERS.find(c => c.id === 'sasuke_basic')!, level: 10 },
      { ...CHARACTERS.find(c => c.id === 'sakura_basic')!, level: 8 }
    ],
    background: '/src/assets/backgrounds/village.jpg',
    isUnlocked: true
  },
  {
    id: 'land_of_waves_1',
    name: 'Bridge Builder',
    difficulty: 'B',
    staminaCost: 15,
    rewards: [
      { type: 'ryo', item: 'ryo', quantity: 2000, dropRate: 100 },
      { type: 'character', item: 'zabuza_basic', quantity: 1, dropRate: 15 }
    ],
    enemies: [
      { ...CHARACTERS.find(c => c.id === 'itachi_edo')!, level: 15 }
    ],
    background: '/src/assets/backgrounds/bridge.jpg',
    isUnlocked: true
  },
  {
    id: 'chunin_exams_1',
    name: 'Forest of Death',
    difficulty: 'A',
    staminaCost: 20,
    rewards: [
      { type: 'ryo', item: 'ryo', quantity: 3000, dropRate: 100 },
      { type: 'character', item: 'orochimaru_basic', quantity: 1, dropRate: 10 }
    ],
    enemies: [
      { ...CHARACTERS.find(c => c.id === 'madara_six_paths')!, level: 25 }
    ],
    background: '/src/assets/backgrounds/forest.jpg',
    isUnlocked: false
  },
  {
    id: 'sasuke_retrieval_1',
    name: 'Valley of the End',
    difficulty: 'S',
    staminaCost: 25,
    rewards: [
      { type: 'ryo', item: 'ryo', quantity: 5000, dropRate: 100 },
      { type: 'character', item: 'sasuke_cs2', quantity: 1, dropRate: 5 }
    ],
    enemies: [
      { ...CHARACTERS.find(c => c.id === 'sasuke_rinne_sharingan')!, level: 35 }
    ],
    background: '/src/assets/backgrounds/valley.jpg',
    isUnlocked: false
  },
  {
    id: 'shippuden_1',
    name: 'Akatsuki Hunt',
    difficulty: 'S',
    staminaCost: 30,
    rewards: [
      { type: 'ryo', item: 'ryo', quantity: 7500, dropRate: 100 },
      { type: 'character', item: 'pain_basic', quantity: 1, dropRate: 3 }
    ],
    enemies: [
      { ...CHARACTERS.find(c => c.id === 'naruto_six_paths')!, level: 50 }
    ],
    background: '/src/assets/backgrounds/akatsuki.jpg',
    isUnlocked: false
  }
];

export const EMERGENCY_MISSIONS: Stage[] = [
  {
    id: 'rookie_mission',
    name: 'Rookie Mission',
    difficulty: 'C',
    staminaCost: 5,
    rewards: [
      { type: 'ryo', item: 'ryo', quantity: 500, dropRate: 100 },
      { type: 'pills', item: 'health_pill', quantity: 1, dropRate: 50 }
    ],
    enemies: [
      { ...CHARACTERS.find(c => c.id === 'naruto_basic')!, level: 5 }
    ],
    background: '/src/assets/backgrounds/training.jpg',
    isUnlocked: true
  },
  {
    id: 'sage_mode_training',
    name: 'Sage Mode Training',
    difficulty: 'A',
    staminaCost: 40,
    rewards: [
      { type: 'character', item: 'naruto_sage', quantity: 1, dropRate: 100 },
      { type: 'ryo', item: 'ryo', quantity: 10000, dropRate: 100 }
    ],
    enemies: [
      { ...CHARACTERS.find(c => c.id === 'minato_edo')!, level: 80 }
    ],
    background: '/src/assets/backgrounds/mount_myoboku.jpg',
    isUnlocked: false
  }
];
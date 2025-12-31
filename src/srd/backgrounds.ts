import type { Ability } from '@/types/dnd';

export interface Background {
  id: string;
  name: string;
  description: string;
  // En SRD 5.2, los trasfondos sugieren subidas de stats
  abilityBoosts: Array<{ ability: Ability; value: number }>; 
  feat: string; // La dote que regalan
  skills: string[];
}

export const PLAYABLE_BACKGROUNDS: Background[] = [
  {
    id: 'acolyte',
    name: 'Acólito',
    description: 'Has pasado tu vida sirviendo en un templo. Tienes conexión directa con lo divino.',
    abilityBoosts: [{ ability: 'WIS', value: 2 }, { ability: 'INT', value: 1 }],
    feat: 'Magic Initiate (Divine)',
    skills: ['Insight', 'Religion']
  },
  {
    id: 'criminal',
    name: 'Criminal',
    description: 'Tienes un historial de romper la ley y sobrevivir en los bajos fondos.',
    abilityBoosts: [{ ability: 'DEX', value: 2 }, { ability: 'CHA', value: 1 }],
    feat: 'Alert',
    skills: ['Deception', 'Stealth']
  },
  {
    id: 'soldier',
    name: 'Soldado',
    description: 'La guerra ha sido tu vida. Entiendes de táctica, jerarquía y supervivencia.',
    abilityBoosts: [{ ability: 'STR', value: 2 }, { ability: 'CON', value: 1 }],
    feat: 'Savage Attacker',
    skills: ['Athletics', 'Intimidation']
  },
  {
    id: 'sage',
    name: 'Erudito',
    description: 'Has pasado años estudiando el saber del multiverso. Tienes conocimientos oscuros.',
    abilityBoosts: [{ ability: 'INT', value: 2 }, { ability: 'WIS', value: 1 }],
    feat: 'Magic Initiate (Arcane)',
    skills: ['Arcana', 'History']
  }
];
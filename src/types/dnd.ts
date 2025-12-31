// --- CORE MECHANICS ---

export type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export type Skill = 
  | 'Acrobatics' | 'Animal Handling' | 'Arcana' | 'Athletics' 
  | 'Deception' | 'History' | 'Insight' | 'Intimidation' 
  | 'Investigation' | 'Medicine' | 'Nature' | 'Perception' 
  | 'Performance' | 'Persuasion' | 'Religion' | 'Sleight of Hand' 
  | 'Stealth' | 'Survival';

export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

export type Size = 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';

export type Alignment = 
  | 'Lawful Good' | 'Neutral Good' | 'Chaotic Good'
  | 'Lawful Neutral' | 'True Neutral' | 'Chaotic Neutral'
  | 'Lawful Evil' | 'Neutral Evil' | 'Chaotic Evil'
  | 'Unaligned';

// --- CHARACTER STATS ---

export interface AbilityScore {
  base: number;
  modifier: number;
  savingThrow: boolean;
}

export interface StatsBlock {
  STR: AbilityScore;
  DEX: AbilityScore;
  CON: AbilityScore;
  INT: AbilityScore;
  WIS: AbilityScore;
  CHA: AbilityScore;
}

// --- RACE & CLASS DEFINITIONS ---

export interface RacialTrait {
  id: string;
  name: string;
  description: string;
}

export interface Race {
  id: string;
  name: string;
  speed: number;
  size: Size;
  abilityBonuses: Partial<Record<Ability, number>>;
  traits: RacialTrait[];
}

export interface ClassFeature {
  id: string;
  name: string;
  level: number;
  description: string;
}

export interface CharacterClass {
  id: string;
  name: string;
  hitDie: DiceType;
  primaryAbility: Ability[];
  savingThrows: Ability[];
  features: ClassFeature[];
}

// --- THE CHARACTER ENTITY ---

export interface Character {
  id?: number;
  name: string;
  level: number;
  xp: number;
  
  raceId: string;
  classId: string;
  backgroundId: string;
  alignment: Alignment;

  stats: StatsBlock;
  hp: {
    current: number;
    max: number;
    temp: number;
  };
  
  inventory: string[];
  createdAt: Date;
  updatedAt: Date;
}
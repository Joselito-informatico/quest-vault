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
  | 'Unaligned'; // Para bestias, según SRD 5.2

// --- CHARACTER STATS ---

export interface AbilityScore {
  base: number;      // El valor numérico (ej: 15)
  modifier: number;  // El cálculo derivado (ej: +2)
  savingThrow: boolean; // ¿Tiene competencia?
}

export interface StatsBlock {
  STR: AbilityScore;
  DEX: AbilityScore;
  CON: AbilityScore;
  INT: AbilityScore;
  WIS: AbilityScore;
  CHA: AbilityScore;
}

// --- RACE & CLASS DEFINITIONS (Blueprint del SRD) ---

export interface RacialTrait {
  id: string;
  name: string;
  description: string;
}

export interface Race {
  id: string;
  name: string;      // ej: "Human", "Elf"
  speed: number;     // en pies (ft)
  size: Size;
  abilityBonuses: Partial<Record<Ability, number>>; // ej: { DEX: 2, INT: 1 }
  traits: RacialTrait[];
}

export interface ClassFeature {
  id: string;
  name: string;
  level: number;     // Nivel al que se desbloquea
  description: string;
}

export interface CharacterClass {
  id: string;
  name: string;      // ej: "Fighter", "Wizard"
  hitDie: DiceType;  // Dado de golpe
  primaryAbility: Ability[]; // Para cálculo de multiclass/recomendaciones
  savingThrows: Ability[];   // Competencias de salvación
  features: ClassFeature[];  // Features del nivel 1 al 20
}

// --- THE CHARACTER ENTITY (Lo que guardaremos en Dexie) ---

export interface Character {
  id?: number; // Dexie ID (auto-increment)
  name: string;
  level: number;
  xp: number;
  
  // Origins
  raceId: string;
  classId: string;
  backgroundId: string;
  alignment: Alignment;

  // Stats
  stats: StatsBlock;
  hp: {
    current: number;
    max: number;
    temp: number;
  };
  
  inventory: string[]; // TODO: Definir interfaz de Items más adelante
  createdAt: Date;
  updatedAt: Date;
}
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Character, StatsBlock, Ability } from '../../../types/dnd';

// --- UTILS (Lógica de negocio pura) ---
// Fórmula SRD: (Score - 10) / 2, redondeado hacia abajo
export const calculateModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

const initialStats: StatsBlock = {
  STR: { base: 10, modifier: 0, savingThrow: false },
  DEX: { base: 10, modifier: 0, savingThrow: false },
  CON: { base: 10, modifier: 0, savingThrow: false },
  INT: { base: 10, modifier: 0, savingThrow: false },
  WIS: { base: 10, modifier: 0, savingThrow: false },
  CHA: { base: 10, modifier: 0, savingThrow: false },
};

// --- STORE INTERFACE ---
interface CharacterState {
  // El personaje en borrador
  character: Partial<Character>;
  
  // UI State (¿En qué paso del wizard estamos?)
  currentStep: number;
  
  // Actions
  setName: (name: string) => void;
  setRace: (raceId: string) => void;
  setClass: (classId: string) => void;
  updateStat: (ability: Ability, value: number) => void;
  toggleSavingThrow: (ability: Ability) => void;
  resetCharacter: () => void;
}

// --- STORE IMPLEMENTATION ---
export const useCharacterStore = create<CharacterState>()(
  devtools(
    persist(
      (set) => ({
        character: {
          name: '',
          level: 1,
          stats: initialStats,
          hp: { current: 0, max: 0, temp: 0 },
        },
        currentStep: 0,

        setName: (name) => 
          set((state) => ({ 
            character: { ...state.character, name } 
          })),

        setRace: (raceId) => 
          set((state) => ({ 
            character: { ...state.character, raceId } 
          })),

        setClass: (classId) => 
          set((state) => ({ 
            character: { ...state.character, classId } 
          })),

        // LA MAGIA: Actualiza base Y modificador automáticamente
        updateStat: (ability, value) =>
          set((state) => {
            if (!state.character.stats) return state;

            const newStats = { ...state.character.stats };
            newStats[ability] = {
              ...newStats[ability],
              base: value,
              modifier: calculateModifier(value),
            };

            return {
              character: { ...state.character, stats: newStats },
            };
          }),

        toggleSavingThrow: (ability) =>
          set((state) => {
             if (!state.character.stats) return state;
             
             const newStats = { ...state.character.stats };
             newStats[ability] = {
               ...newStats[ability],
               savingThrow: !newStats[ability].savingThrow
             };
             
             return { character: { ...state.character, stats: newStats } };
          }),

        resetCharacter: () => 
          set({ 
            character: { 
              name: '', 
              level: 1, 
              stats: initialStats,
              hp: { current: 0, max: 0, temp: 0 } 
            },
            currentStep: 0 
          }),
      }),
      {
        name: 'quest-vault-draft', // Nombre en LocalStorage
      }
    )
  )
);
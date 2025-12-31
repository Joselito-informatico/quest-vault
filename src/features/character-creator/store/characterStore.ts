import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Character, StatsBlock, Ability } from '@/types/dnd';

// --- UTILS ---
export const calculateModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

const POINT_COST: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};

const initialStats: StatsBlock = {
  STR: { base: 8, modifier: -1, savingThrow: false },
  DEX: { base: 8, modifier: -1, savingThrow: false },
  CON: { base: 8, modifier: -1, savingThrow: false },
  INT: { base: 8, modifier: -1, savingThrow: false },
  WIS: { base: 8, modifier: -1, savingThrow: false },
  CHA: { base: 8, modifier: -1, savingThrow: false },
};

interface CharacterState {
  // Estado
  character: Partial<Character>;
  availablePoints: number;
  currentStep: number;

  // Acciones
  setName: (name: string) => void;
  setRace: (raceId: string) => void;   // <--- ¡AQUÍ ESTÁ LA CLAVE!
  setClass: (classId: string) => void;
  updateStat: (ability: Ability, value: number) => boolean;
  setStep: (step: number) => void;
  resetCharacter: () => void;
}

export const useCharacterStore = create<CharacterState>()(
  devtools(
    persist(
      (set, get) => ({
        character: {
          name: '',
          level: 1,
          stats: initialStats,
          hp: { current: 0, max: 0, temp: 0 },
        },
        availablePoints: 27,
        currentStep: 0,

        setName: (name) => 
          set((state) => ({ character: { ...state.character, name } })),

        // Restauramos esta función perdida
        setRace: (raceId) => 
          set((state) => ({ 
            character: { ...state.character, raceId } 
          })),

        // Y esta también, para el futuro
        setClass: (classId) => 
          set((state) => ({ 
            character: { ...state.character, classId } 
          })),

        setStep: (step) =>
          set({ currentStep: step }),

        updateStat: (ability, newValue) => {
          const state = get();
          const currentStats = state.character.stats;
          if (!currentStats) return false;

          const currentValue = currentStats[ability].base;

          // 1. Validar rangos (8-15)
          if (newValue < 8 || newValue > 15) return false;

          // 2. Calcular costo
          const currentCost = POINT_COST[currentValue];
          const newCost = POINT_COST[newValue];
          const costDiff = newCost - currentCost;

          // 3. Verificar presupuesto
          if (state.availablePoints - costDiff < 0) return false;

          // 4. Aplicar
          const newStats = { ...currentStats };
          newStats[ability] = {
            ...newStats[ability],
            base: newValue,
            modifier: calculateModifier(newValue),
          };

          set({
            character: { ...state.character, stats: newStats },
            availablePoints: state.availablePoints - costDiff,
          });

          return true;
        },

        resetCharacter: () => 
          set({ 
            character: { 
              name: '', 
              level: 1, 
              stats: initialStats, 
            },
            availablePoints: 27,
            currentStep: 0
          }),
      }),
      { 
        name: 'quest-vault-v1', // Mantenemos la versión v1
      }
    )
  )
);
export interface RollResult {
  total: number;
  rolls: number[];
  isCritical: boolean; // Natural 20
  isFumble: boolean;   // Natural 1
}

export const rollDie = (sides: number): number => {
  return Math.floor(Math.random() * sides) + 1;
};

export const rollCheck = (modifier: number): RollResult => {
  const d20 = rollDie(20);
  
  return {
    total: d20 + modifier,
    rolls: [d20],
    isCritical: d20 === 20,
    isFumble: d20 === 1,
  };
};

export const rollDamage = (count: number, sides: number, modifier: number): RollResult => {
  const rolls = Array.from({ length: count }, () => rollDie(sides));
  const sum = rolls.reduce((a, b) => a + b, 0);
  
  return {
    total: sum + modifier,
    rolls,
    isCritical: false, // El daño no suele tener crítico intrínseco en la tirada misma
    isFumble: false,
  };
};
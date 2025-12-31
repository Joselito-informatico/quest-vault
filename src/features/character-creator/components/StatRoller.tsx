import { Minus, Plus, ShieldAlert, ArrowUpCircle } from 'lucide-react';
import { useCharacterStore, calculateModifier } from '../store/characterStore';
import { PLAYABLE_BACKGROUNDS } from '@/srd/backgrounds';
import type { Ability } from '@/types/dnd';
import { cn } from '@/lib/utils';

const ABILITIES: { key: Ability; label: string }[] = [
  { key: 'STR', label: 'Fuerza' },
  { key: 'DEX', label: 'Destreza' },
  { key: 'CON', label: 'Constitución' },
  { key: 'INT', label: 'Inteligencia' },
  { key: 'WIS', label: 'Sabiduría' },
  { key: 'CHA', label: 'Carisma' },
];

export const StatRoller = () => {
  const { character, updateStat, availablePoints } = useCharacterStore();
  
  // 1. Buscamos el Trasfondo seleccionado para leer sus bonos
  const activeBackground = PLAYABLE_BACKGROUNDS.find(b => b.id === character.backgroundId);

  const handleChange = (ability: Ability, delta: number) => {
    const currentVal = character.stats?.[ability].base || 8;
    const targetVal = currentVal + delta;
    updateStat(ability, targetVal);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* HUD: Puntos Disponibles */}
      <div className="mb-8 flex justify-center sticky top-20 z-40">
        <div className={cn(
          "px-6 py-3 rounded-full border-2 font-bold text-xl transition-all shadow-xl backdrop-blur-md flex items-center gap-3",
          availablePoints === 0 
            ? "bg-green-500/20 border-green-500 text-green-500" 
            : "bg-card/90 border-primary text-primary"
        )}>
          <span className="text-sm uppercase tracking-widest hidden sm:inline text-foreground">Puntos Restantes:</span>
          <span className="text-3xl font-black">{availablePoints}</span>
          <span className="text-sm font-normal text-muted-foreground">/ 27</span>
        </div>
      </div>

      {/* Grid de Atributos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {ABILITIES.map(({ key, label }) => {
          // Datos Base (del Store)
          const statBase = character.stats?.[key] || { base: 8, modifier: -1 };
          
          // Datos Derivados (Cálculo en tiempo real)
          // Buscamos si el trasfondo da bono a ESTE atributo
          const bonus = activeBackground?.abilityBoosts.find(b => b.ability === key)?.value || 0;
          
          // La Matemática Final
          const finalScore = statBase.base + bonus;
          const finalModifier = calculateModifier(finalScore);
          
          return (
            <div 
              key={key} 
              className={cn(
                "bg-card border rounded-xl p-4 shadow-sm flex flex-col items-center relative overflow-hidden group transition-all duration-300",
                bonus > 0 ? "border-primary/50 bg-primary/5" : "border-border"
              )}
            >
              {/* Header del Stat */}
              <div className="flex items-center gap-2 mb-2 z-10 w-full justify-between px-2">
                <span className="text-sm font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
                  {key === 'CON' && <ShieldAlert className="w-3 h-3" />}
                  {label}
                </span>
                {bonus > 0 && (
                  <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-bold flex items-center gap-1 animate-pulse">
                    <ArrowUpCircle className="w-3 h-3" />
                    +{bonus} TRASFONDO
                  </span>
                )}
              </div>

              {/* El Número Heroico (MODIFICADOR FINAL) */}
              <div className={cn(
                "text-6xl font-black mb-2 transition-colors z-10 tabular-nums tracking-tighter",
                finalModifier > 0 ? "text-primary" : finalModifier < 0 ? "text-destructive" : "text-foreground"
              )}>
                {finalModifier >= 0 ? '+' : ''}{finalModifier}
              </div>

              {/* Desglose Matemático (Mini Dashboard) */}
              <div className="flex items-center gap-3 z-10 bg-background/50 p-1.5 rounded-full border border-border mb-2">
                <button 
                  onClick={() => handleChange(key, -1)}
                  disabled={statBase.base <= 8}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 active:scale-95 disabled:opacity-30 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <div className="flex flex-col items-center w-16 px-2">
                  <div className="flex items-baseline gap-1 text-lg font-bold leading-none">
                    <span className={cn(bonus > 0 && "text-muted-foreground scale-90")}>{statBase.base}</span>
                    {bonus > 0 && (
                      <>
                        <span className="text-xs text-muted-foreground">+</span>
                        <span className="text-primary">{bonus}</span>
                      </>
                    )}
                  </div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                    {bonus > 0 ? "Base + Bono" : "Puntuación"}
                  </span>
                </div>

                <button 
                  onClick={() => handleChange(key, 1)}
                  disabled={statBase.base >= 15 || availablePoints <= 0}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 active:scale-95 disabled:opacity-30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Puntuación Total Final (Display Pequeño) */}
              <div className="z-10 bg-card border border-border px-3 py-1 rounded text-xs font-mono text-muted-foreground">
                 Total: <strong className="text-foreground">{finalScore}</strong>
              </div>

              {/* Decoración de fondo */}
              <div className="absolute -bottom-4 -right-4 p-4 opacity-[0.03] pointer-events-none">
                <span className="text-9xl font-black text-foreground">{key}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
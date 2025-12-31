import { Minus, Plus, ShieldAlert } from 'lucide-react';
import { useCharacterStore } from '../store/characterStore';
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
  // Extraemos availablePoints del store
  const { character, updateStat, availablePoints } = useCharacterStore();
  
  const handleChange = (ability: Ability, delta: number) => {
    // Si no hay stats definidos, usar base 8 (mínimo de Point Buy)
    const currentVal = character.stats?.[ability].base || 8;
    const targetVal = currentVal + delta;
    
    // Llamamos al store. Si devuelve false (por falta de puntos o límites), no pasa nada.
    updateStat(ability, targetVal);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      
      {/* HUD: Puntos Disponibles */}
      <div className="mb-6 flex justify-center sticky top-20 z-40">
        <div className={cn(
          "px-6 py-3 rounded-full border-2 font-bold text-xl transition-all shadow-xl backdrop-blur-md flex items-center gap-2",
          availablePoints === 0 
            ? "bg-green-500/20 border-green-500 text-green-500" // Éxito: 0 puntos restantes
            : "bg-card/90 border-primary text-primary" // En proceso
        )}>
          <span className="text-sm uppercase tracking-widest hidden sm:inline">Puntos:</span>
          <span className="text-2xl font-black">{availablePoints}</span>
          <span className="text-sm font-normal text-muted-foreground">/ 27</span>
        </div>
      </div>

      {/* Grid de Atributos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {ABILITIES.map(({ key, label }) => {
          const stat = character.stats?.[key] || { base: 8, modifier: -1 };
          const modifier = stat.modifier;
          
          return (
            <div 
              key={key} 
              className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col items-center relative overflow-hidden group select-none"
            >
              {/* Header del Stat */}
              <div className="flex items-center gap-2 mb-2 z-10">
                {key === 'CON' && <ShieldAlert className="w-4 h-4 text-muted-foreground" />}
                <span className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                  {label}
                </span>
              </div>

              {/* El Número Heroico (Modificador) */}
              <div className={cn(
                "text-5xl font-black mb-4 transition-colors z-10 tabular-nums",
                modifier > 0 ? "text-primary" : modifier < 0 ? "text-destructive" : "text-foreground"
              )}>
                {modifier >= 0 ? '+' : ''}{modifier}
              </div>

              {/* Controles de Input */}
              <div className="flex items-center gap-4 z-10 bg-background/50 p-1 rounded-full border border-border">
                <button 
                  onClick={() => handleChange(key, -1)}
                  disabled={stat.base <= 8} // Deshabilitar si llegamos al mínimo
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all text-foreground"
                  aria-label={`Reducir ${label}`}
                >
                  <Minus className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col items-center w-12">
                  <span className="text-xl font-bold leading-none">{stat.base}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Score</span>
                </div>

                <button 
                  onClick={() => handleChange(key, 1)}
                  disabled={stat.base >= 15 || availablePoints <= 0} // Deshabilitar si llegamos al máximo o no hay puntos
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all text-foreground"
                  aria-label={`Aumentar ${label}`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="text-6xl font-black text-foreground">{key}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
import { useCharacterStore, calculateModifier } from '../store/characterStore';
import type { Ability } from '@/types/dnd';
import { cn } from '@/lib/utils';
import { Minus, Plus, ShieldAlert } from 'lucide-react';

const ABILITIES: { key: Ability; label: string }[] = [
  { key: 'STR', label: 'Fuerza' },
  { key: 'DEX', label: 'Destreza' },
  { key: 'CON', label: 'Constitución' },
  { key: 'INT', label: 'Inteligencia' },
  { key: 'WIS', label: 'Sabiduría' },
  { key: 'CHA', label: 'Carisma' },
];

export const StatRoller = () => {
  const { character, updateStat } = useCharacterStore();
  
  // Función auxiliar para manejar el cambio seguro
  const handleChange = (ability: Ability, delta: number) => {
    const currentVal = character.stats?.[ability].base || 10;
    const newVal = Math.min(20, Math.max(1, currentVal + delta)); // Cap 1-20 por ahora
    updateStat(ability, newVal);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {ABILITIES.map(({ key, label }) => {
        const stat = character.stats?.[key] || { base: 10, modifier: 0 };
        const modifier = stat.modifier;
        
        return (
          <div 
            key={key} 
            className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col items-center relative overflow-hidden group"
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
                className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 active:scale-95 transition-all text-foreground"
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
                className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 active:scale-95 transition-all text-foreground"
                aria-label={`Aumentar ${label}`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Decoración de fondo (Efecto "Videojuego") */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
              <span className="text-6xl font-black text-foreground">{key}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
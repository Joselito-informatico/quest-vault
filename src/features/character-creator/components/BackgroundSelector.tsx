import { useCharacterStore } from '../store/characterStore';
import { PLAYABLE_BACKGROUNDS } from '@/srd/backgrounds';
import { cn } from '@/lib/utils';
import { BookOpen, Sword, Crown, Scroll } from 'lucide-react';

export const BackgroundSelector = () => {
  const { character, setBackground } = useCharacterStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-5xl mx-auto">
      {PLAYABLE_BACKGROUNDS.map((bg) => {
        const isSelected = character.backgroundId === bg.id;

        return (
          <div
            key={bg.id}
            onClick={() => setBackground(bg.id)}
            className={cn(
              "cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 relative overflow-hidden group h-full flex flex-col",
              isSelected 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
            )}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <h3 className={cn("text-xl font-bold uppercase tracking-tight flex items-center gap-2", isSelected ? "text-primary" : "text-foreground")}>
                {bg.id === 'acolyte' && <Scroll className="w-5 h-5" />}
                {bg.id === 'soldier' && <Sword className="w-5 h-5" />}
                {bg.id === 'criminal' && <Crown className="w-5 h-5" />}
                {bg.id === 'sage' && <BookOpen className="w-5 h-5" />}
                {bg.name}
              </h3>
              
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  ✓
                </div>
              )}
            </div>

            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              {bg.description}
            </p>

            {/* Bonos Stats (CRÍTICO EN SRD 5.2) */}
            <div className="mt-auto space-y-3">
              <div className="bg-background/50 p-2 rounded border border-border/50">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                  Bonificadores de Atributo
                </span>
                <div className="flex gap-2">
                  {bg.abilityBoosts.map((boost, idx) => (
                    <span key={idx} className={cn(
                      "text-xs font-bold px-2 py-1 rounded border",
                      boost.value === 2 ? "bg-primary/20 text-primary border-primary/20" : "bg-secondary text-foreground border-border"
                    )}>
                      +{boost.value} {boost.ability}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                 <span className="text-muted-foreground">Dote: <strong className="text-foreground">{bg.feat}</strong></span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
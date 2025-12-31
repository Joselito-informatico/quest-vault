import { useCharacterStore } from '../store/characterStore';
import { PLAYABLE_CLASSES } from '@/srd/classes';
import { cn } from '@/lib/utils';
import { Sword, Book, Zap, Shield, Heart } from 'lucide-react';

export const ClassSelector = () => {
  const { character, setClass } = useCharacterStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-5xl mx-auto">
      {PLAYABLE_CLASSES.map((cls) => {
        const isSelected = character.classId === cls.id;

        return (
          <div
            key={cls.id}
            onClick={() => setClass(cls.id)}
            className={cn(
              "cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 relative overflow-hidden group flex flex-col h-full",
              isSelected 
                ? "border-primary bg-primary/5 shadow-md transform scale-[1.02]" 
                : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
            )}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={cn("text-2xl font-black uppercase tracking-tight flex items-center gap-2", isSelected ? "text-primary" : "text-foreground")}>
                  {cls.id === 'fighter' && <Sword className="w-6 h-6" />}
                  {cls.id === 'wizard' && <Book className="w-6 h-6" />}
                  {cls.id === 'cleric' && <Heart className="w-6 h-6" />}
                  {cls.id === 'rogue' && <Zap className="w-6 h-6" />}
                  {cls.name}
                </h3>
                
                <div className="flex gap-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold">Dado de Golpe</span>
                    <span className="text-sm font-mono text-foreground font-bold bg-secondary/50 px-2 py-0.5 rounded border border-border/50 text-center">
                      {cls.hitDie}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold">Salvaciones</span>
                    <span className="text-sm font-mono text-foreground flex gap-1">
                      {cls.savingThrows.map(s => (
                        <span key={s} className="bg-secondary/50 px-1.5 py-0.5 rounded border border-border/50 text-xs">
                          {s}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
              
              {isSelected && (
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg animate-in zoom-in">
                  ✓
                </div>
              )}
            </div>

            {/* Features List */}
            <div className="space-y-3 mt-auto pt-4 border-t border-border/50">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Rasgos de Nivel 1
              </span>
              {cls.features.map((feat) => (
                <div key={feat.id} className="text-sm group-hover:translate-x-1 transition-transform">
                  <span className="font-bold text-foreground/90 block mb-0.5 flex items-center gap-2">
                    <Shield className="w-3 h-3 text-primary" />
                    {feat.name}
                  </span>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none rounded-xl" />
          </div>
        );
      })}
    </div>
  );
};
import { useCharacterStore } from '../store/characterStore';
import { PLAYABLE_RACES } from '@/srd/races';
import { cn } from '@/lib/utils';
import { User, Eye, Shield, Footprints } from 'lucide-react';

export const RaceSelector = () => {
  const { character, setRace } = useCharacterStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-5xl mx-auto">
      {PLAYABLE_RACES.map((race) => {
        const isSelected = character.raceId === race.id;

        return (
          <div
            key={race.id}
            onClick={() => {
              console.log('Click en raza:', race.id); 
              setRace(race.id);
            }}
            className={cn(
              "cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 relative overflow-hidden group",
              isSelected 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
            )}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={cn("text-xl font-bold uppercase tracking-tight", isSelected ? "text-primary" : "text-foreground")}>
                  {race.name}
                </h3>
                <div className="flex gap-3 text-xs text-muted-foreground mt-1 font-mono">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {race.size}
                  </span>
                  <span className="flex items-center gap-1">
                    <Footprints className="w-3 h-3" /> {race.speed} ft.
                  </span>
                </div>
              </div>
              
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  ✓
                </div>
              )}
            </div>

            {/* Traits List */}
            <div className="space-y-3">
              {race.traits.map((trait) => (
                <div key={trait.id} className="text-sm">
                  <span className="font-bold text-foreground/90 block mb-0.5 flex items-center gap-2">
                    {trait.id.includes('vision') && <Eye className="w-3 h-3 text-sky-400" />}
                    {trait.id.includes('resilien') && <Shield className="w-3 h-3 text-orange-400" />}
                    {trait.name}
                  </span>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {trait.description}
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
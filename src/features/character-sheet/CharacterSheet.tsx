import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { calculateModifier } from '@/features/character-creator/store/characterStore';
import { PLAYABLE_RACES } from '@/srd/races';
import { PLAYABLE_CLASSES } from '@/srd/classes';
import { PLAYABLE_BACKGROUNDS } from '@/srd/backgrounds';
import { cn } from '@/lib/utils';
import { ArrowLeft, Heart, Shield, Skull, Activity, Swords } from 'lucide-react';
import { useState } from 'react';

interface CharacterSheetProps {
  characterId: number;
  onBack: () => void;
}

export const CharacterSheet = ({ characterId, onBack }: CharacterSheetProps) => {
  // 1. Hook Reactivo: Si la DB cambia, esto se redibuja solo
  const character = useLiveQuery(() => db.characters.get(characterId), [characterId]);

  // Estado local para animación de daño/cura
  const [hpChange, setHpChange] = useState<number | null>(null);

  if (!character) return <div className="p-8 text-center">Cargando grimorio...</div>;

  // 2. Hydration de datos (IDs -> Textos)
  const race = PLAYABLE_RACES.find(r => r.id === character.raceId);
  const cls = PLAYABLE_CLASSES.find(c => c.id === character.classId);
  const bg = PLAYABLE_BACKGROUNDS.find(b => b.id === character.backgroundId);

  // Helper para Stats
  const getTotalStat = (ability: keyof typeof character.stats) => {
    const base = character.stats[ability].base;
    const bonus = bg?.abilityBoosts.find(b => b.ability === ability)?.value || 0;
    return base + bonus;
  };

  // 3. Función Crítica: Gestión de HP
  const modifyHP = async (amount: number) => {
    if (!character.id) return;
    
    const newCurrent = Math.min(
      character.hp.max, 
      Math.max(0, character.hp.current + amount)
    );

    // Feedback visual breve
    setHpChange(amount);
    setTimeout(() => setHpChange(null), 1000);

    // Guardado automático (Auto-save)
    await db.characters.update(character.id, {
      'hp.current': newCurrent
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      {/* Navbar de Navegación */}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border p-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-secondary rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-none">{character.name}</h1>
          <p className="text-xs text-muted-foreground">Nivel {character.level} {cls?.name} ({race?.name})</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        
        {/* SECCIÓN 1: VITALIDAD (HP & AC) */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Tarjeta de HP Interactiva */}
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-between relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
              <span className="text-sm font-bold text-muted-foreground uppercase">Salud</span>
            </div>
            
            <div className="text-4xl font-black tabular-nums relative z-10">
              {character.hp.current} 
              <span className="text-lg text-muted-foreground font-normal">/{character.hp.max}</span>
            </div>

            {/* Controles Rápidos */}
            <div className="flex gap-4 mt-3 w-full justify-center z-10">
              <button 
                onClick={() => modifyHP(-1)}
                className="w-10 h-10 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center transition-colors active:scale-90"
              >
                <Swords className="w-4 h-4" />
              </button>
              <button 
                onClick={() => modifyHP(1)}
                className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-colors active:scale-90"
              >
                <Activity className="w-4 h-4" />
              </button>
            </div>

            {/* Barra de progreso visual */}
            <div 
              className="absolute bottom-0 left-0 h-1 bg-red-500 transition-all duration-500" 
              style={{ width: `${(character.hp.current / character.hp.max) * 100}%` }}
            />
            
            {/* Feedback de Daño Flotante */}
            {hpChange !== null && (
              <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black animate-out fade-out zoom-out duration-1000",
                hpChange > 0 ? "text-green-500" : "text-red-500"
              )}>
                {hpChange > 0 ? '+' : ''}{hpChange}
              </div>
            )}
          </div>

          {/* Tarjeta de AC */}
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-bold text-muted-foreground uppercase">Defensa</span>
            </div>
            <div className="text-4xl font-black tabular-nums">
              {10 + calculateModifier(getTotalStat('DEX'))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Armor Class</p>
          </div>
        </div>

        {/* SECCIÓN 2: ATRIBUTOS (Core Stats) */}
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(character.stats) as Array<keyof typeof character.stats>).map(key => {
            const total = getTotalStat(key);
            const mod = calculateModifier(total);
            
            return (
              <button 
                key={key}
                className="bg-secondary/30 border border-transparent hover:border-primary/50 hover:bg-secondary/50 rounded-lg p-3 flex flex-col items-center transition-all active:scale-95"
                // Aquí conectaremos el Dice Roller más tarde
                onClick={() => alert(`Tirada de ${key}: 1d20 ${mod >= 0 ? '+' : ''}${mod} = ???`)}
              >
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{key}</span>
                <span className={cn(
                  "text-2xl font-black my-1",
                  mod > 0 ? "text-primary" : mod < 0 ? "text-destructive" : "text-foreground"
                )}>
                  {mod >= 0 ? '+' : ''}{mod}
                </span>
                <span className="text-xs text-muted-foreground bg-background px-1.5 rounded border border-border/50">
                  {total}
                </span>
              </button>
            );
          })}
        </div>

        {/* SECCIÓN 3: RASGOS (Lista simple por ahora) */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h3 className="font-bold text-sm uppercase text-muted-foreground flex items-center gap-2">
            <Activity className="w-4 h-4" /> Rasgos Activos
          </h3>
          <div className="divide-y divide-border/50">
            {race?.traits.map(t => (
              <div key={t.id} className="py-2 first:pt-0 last:pb-0">
                <p className="font-bold text-sm text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
            ))}
            {cls?.features.map(f => (
              <div key={f.id} className="py-2 first:pt-0 last:pb-0">
                <p className="font-bold text-sm text-foreground">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
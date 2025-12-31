import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { calculateModifier } from '@/features/character-creator/store/characterStore';
import { DiceModal } from '@/components/ui/DiceModal';
import { cn } from '@/lib/utils';
import { ArrowLeft, Heart, Shield, Activity, Swords } from 'lucide-react';

// Datos estáticos para hidratar la UI
import { PLAYABLE_RACES } from '@/srd/races';
import { PLAYABLE_CLASSES } from '@/srd/classes';
import { PLAYABLE_BACKGROUNDS } from '@/srd/backgrounds';

interface CharacterSheetProps {
  characterId: number;
  onBack: () => void;
}

export const CharacterSheet = ({ characterId, onBack }: CharacterSheetProps) => {
  // 1. Hook Reactivo: Escucha cambios en la DB en tiempo real
  const character = useLiveQuery(() => db.characters.get(characterId), [characterId]);

  // Estado local para animación de daño/cura
  const [hpChange, setHpChange] = useState<number | null>(null);
  
  // Estado para controlar el Modal de Dados
  const [activeRoll, setActiveRoll] = useState<{ title: string; mod: number } | null>(null);

  if (!character) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground animate-pulse">
      Abriendo grimorio...
    </div>
  );

  // 2. Hydration: Convertir IDs en Datos Reales (Texto, Iconos)
  const race = PLAYABLE_RACES.find(r => r.id === character.raceId);
  const cls = PLAYABLE_CLASSES.find(c => c.id === character.classId);
  const bg = PLAYABLE_BACKGROUNDS.find(b => b.id === character.backgroundId);

  // Helper: Calcular el Stat Total (Base + Bono de Trasfondo)
  const getTotalStat = (ability: keyof typeof character.stats) => {
    const base = character.stats[ability].base;
    const bonus = bg?.abilityBoosts.find(b => b.ability === ability)?.value || 0;
    return base + bonus;
  };

  // 3. Función Crítica: Gestión de HP con Auto-Save
  const modifyHP = async (amount: number) => {
    if (!character.id) return;
    
    const newCurrent = Math.min(
      character.hp.max, 
      Math.max(0, character.hp.current + amount)
    );

    // Feedback visual breve (+5 verde, -5 rojo)
    setHpChange(amount);
    setTimeout(() => setHpChange(null), 1000);

    // Guardado automático en Dexie
    await db.characters.update(character.id, {
      'hp.current': newCurrent
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans">
      
      {/* NAVBAR: Navegación y Resumen */}
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border p-4 flex items-center gap-4 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-secondary rounded-full transition-colors active:scale-90">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-none tracking-tight">{character.name}</h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Nivel {character.level} {cls?.name} <span className="text-border">|</span> {race?.name}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        
        {/* SECCIÓN 1: VITALIDAD (HP & AC) */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Tarjeta de HP Interactiva */}
          <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-between relative overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 mb-2 z-10">
              <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
              <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">Salud</span>
            </div>
            
            <div className="text-5xl font-black tabular-nums relative z-10 tracking-tighter">
              {character.hp.current} 
              <span className="text-lg text-muted-foreground font-medium opacity-50">/{character.hp.max}</span>
            </div>

            {/* Controles Rápidos (+/-) */}
            <div className="flex gap-4 mt-4 w-full justify-center z-10">
              <button 
                onClick={() => modifyHP(-1)}
                className="w-12 h-12 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center transition-all active:scale-90 border border-transparent hover:border-destructive/20"
              >
                <Swords className="w-5 h-5" />
              </button>
              <button 
                onClick={() => modifyHP(1)}
                className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all active:scale-90 border border-transparent hover:border-green-500/20"
              >
                <Activity className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de progreso visual (Fondo) */}
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-secondary">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500 ease-out" 
                style={{ width: `${(character.hp.current / character.hp.max) * 100}%` }}
              />
            </div>
            
            {/* Feedback de Daño Flotante */}
            {hpChange !== null && (
              <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-black animate-out fade-out slide-out-to-top-10 duration-1000 z-50 pointer-events-none drop-shadow-lg",
                hpChange > 0 ? "text-green-500" : "text-red-500"
              )}>
                {hpChange > 0 ? '+' : ''}{hpChange}
              </div>
            )}
          </div>

          {/* Tarjeta de AC (Armor Class) */}
          <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Shield className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">Defensa</span>
            </div>
            <div className="text-5xl font-black tabular-nums tracking-tighter">
              {10 + calculateModifier(getTotalStat('DEX'))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold bg-secondary/50 px-2 py-0.5 rounded">Armor Class</p>
          </div>
        </div>

        {/* SECCIÓN 2: ATRIBUTOS (Core Stats & Dice Roller) */}
        <div>
          <h3 className="text-sm font-bold text-muted-foreground mb-3 px-1 uppercase tracking-wider">Atributos & Tiradas</h3>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(character.stats) as Array<keyof typeof character.stats>).map(key => {
              const total = getTotalStat(key);
              const mod = calculateModifier(total);
              
              return (
                <button 
                  key={key}
                  onClick={() => setActiveRoll({ title: key, mod })}
                  className="bg-card border border-border hover:border-primary/50 hover:bg-secondary/50 rounded-xl p-3 flex flex-col items-center transition-all active:scale-95 shadow-sm group"
                >
                  <span className="text-[10px] font-black text-muted-foreground uppercase group-hover:text-primary transition-colors">{key}</span>
                  <span className={cn(
                    "text-3xl font-black my-1 tracking-tighter",
                    mod > 0 ? "text-primary" : mod < 0 ? "text-destructive" : "text-foreground"
                  )}>
                    {mod >= 0 ? '+' : ''}{mod}
                  </span>
                  <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 rounded border border-border/50 font-mono">
                    {total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN 3: RASGOS ACTIVOS */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-5 shadow-sm">
          <h3 className="font-bold text-sm uppercase text-muted-foreground flex items-center gap-2 border-b border-border/50 pb-2">
            <Activity className="w-4 h-4 text-primary" /> Rasgos & Talentos
          </h3>
          <div className="space-y-4">
            {race?.traits.map(t => (
              <div key={t.id} className="group">
                <div className="flex items-baseline justify-between mb-1">
                  <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{t.name}</p>
                  <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 rounded uppercase">Especie</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
              </div>
            ))}
            {cls?.features.map(f => (
              <div key={f.id} className="group pt-2 border-t border-border/30">
                <div className="flex items-baseline justify-between mb-1">
                  <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{f.name}</p>
                  <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 rounded uppercase">Clase</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
             {bg?.feat && (
               <div className="group pt-2 border-t border-border/30">
                 <div className="flex items-baseline justify-between mb-1">
                   <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{bg.feat}</p>
                   <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 rounded uppercase">Dote</span>
                 </div>
                 <p className="text-xs text-muted-foreground leading-relaxed">Dote otorgada por el trasfondo de {bg.name}.</p>
               </div>
            )}
          </div>
        </div>

      </div>

      {/* MODAL DE DADOS (Portal) */}
      {activeRoll && (
        <DiceModal 
          isOpen={!!activeRoll}
          onClose={() => setActiveRoll(null)}
          title={activeRoll.title}
          modifier={activeRoll.mod}
        />
      )}
    </div>
  );
};
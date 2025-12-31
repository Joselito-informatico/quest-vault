import { useState } from 'react';
import { useCharacterStore, calculateModifier } from '../store/characterStore';
import { saveCharacterToDb } from '@/db/db';
import { PLAYABLE_RACES } from '@/srd/races';
import { PLAYABLE_CLASSES } from '@/srd/classes';
import { PLAYABLE_BACKGROUNDS } from '@/srd/backgrounds';
import { cn } from '@/lib/utils';
import { Heart, Shield, Swords, Save, Loader2 } from 'lucide-react';

export const CharacterSummary = () => {
  const { character, setName, resetCharacter } = useCharacterStore();
  const [isSaving, setIsSaving] = useState(false);

  // 1. Resolver IDs a Objetos Reales
  const race = PLAYABLE_RACES.find(r => r.id === character.raceId);
  const cls = PLAYABLE_CLASSES.find(c => c.id === character.classId);
  const bg = PLAYABLE_BACKGROUNDS.find(b => b.id === character.backgroundId);

  // 2. Calcular Modificadores Finales
  const getScore = (ability: keyof typeof character.stats) => {
    const base = character.stats?.[ability].base || 10;
    const bonus = bg?.abilityBoosts.find(b => b.ability === ability)?.value || 0;
    return base + bonus;
  };

  const getMod = (ability: keyof typeof character.stats) => calculateModifier(getScore(ability));

  // 3. Calcular HP Inicial (Nivel 1 = Max Dado + CON Mod)
  const hitDieValue = cls ? parseInt(cls.hitDie.replace('d', '')) : 8;
  const conMod = getMod('CON');
  const maxHP = Math.max(1, hitDieValue + conMod); // Mínimo 1 HP siempre

  const handleSave = async () => {
    if (!character.name) {
      alert("¡Tu héroe necesita un nombre!");
      return;
    }

    setIsSaving(true);
    try {
      // Preparamos el objeto final con los HP calculados
      const finalCharacter = {
        ...character,
        hp: {
          current: maxHP,
          max: maxHP,
          temp: 0
        },
        // Aquí podríamos guardar los stats ya sumados si quisiéramos, 
        // pero mejor guardar la base y recalcular dinámicamente siempre.
      };

      await saveCharacterToDb(finalCharacter);
      
      // Éxito
      alert("¡Personaje Guardado en la Bóveda!");
      resetCharacter(); // Limpia el formulario para el siguiente
      // AQUÍ: En el futuro redirigiremos al Dashboard
      
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al escribir en el pergamino mágico (DB Error).");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER: Nombre e Identidad */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-lg flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 w-full space-y-2">
          <label className="text-xs uppercase font-bold text-muted-foreground tracking-widest">
            Nombre del Personaje
          </label>
          <input 
            type="text" 
            value={character.name || ''}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Aragorn, Gandalf..."
            className="w-full bg-background border-2 border-border focus:border-primary rounded-lg px-4 py-3 text-2xl font-bold outline-none transition-colors placeholder:text-muted-foreground/20"
            autoFocus
          />
        </div>
        
        <div className="flex gap-4 text-sm font-mono">
          <div className="text-right">
            <span className="block text-muted-foreground text-[10px] uppercase">Raza</span>
            <strong className="text-foreground text-lg">{race?.name}</strong>
          </div>
          <div className="w-px bg-border my-1" />
          <div className="text-right">
            <span className="block text-muted-foreground text-[10px] uppercase">Clase</span>
            <strong className="text-foreground text-lg">{cls?.name}</strong>
          </div>
          <div className="w-px bg-border my-1" />
          <div className="text-right">
            <span className="block text-muted-foreground text-[10px] uppercase">Trasfondo</span>
            <strong className="text-foreground text-lg">{bg?.name}</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUMNA 1: Stats Vitales (Combat) */}
        <div className="space-y-4">
          <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between group hover:border-red-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground">Puntos de Golpe</span>
                <p className="text-xs text-muted-foreground">Nivel 1</p>
              </div>
            </div>
            <span className="text-3xl font-black text-foreground tabular-nums">{maxHP}</span>
          </div>

          <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground">Clase de Armadura</span>
                <p className="text-xs text-muted-foreground">Base (Sin Armadura)</p>
              </div>
            </div>
            {/* AC Base = 10 + DEX Mod */}
            <span className="text-3xl font-black text-foreground tabular-nums">{10 + getMod('DEX')}</span>
          </div>
        </div>

        {/* COLUMNA 2: Atributos Finales (Mini Grid) */}
        <div className="md:col-span-2 grid grid-cols-3 sm:grid-cols-6 gap-2">
          {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const).map(stat => {
            const mod = getMod(stat);
            const score = getScore(stat);
            return (
              <div key={stat} className="bg-background border border-border rounded-lg p-2 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-muted-foreground">{stat}</span>
                <span className={cn(
                  "text-xl font-black my-1",
                  mod > 0 ? "text-primary" : mod < 0 ? "text-destructive" : "text-foreground"
                )}>
                  {mod >= 0 ? '+' : ''}{mod}
                </span>
                <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 rounded">{score}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETALLES: Rasgos y Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card/50 border border-border/50 p-4 rounded-xl">
          <h4 className="font-bold text-sm uppercase text-muted-foreground mb-3 flex items-center gap-2">
            <Swords className="w-4 h-4" /> Rasgos de Clase ({cls?.name})
          </h4>
          <ul className="space-y-2">
            {cls?.features.map(f => (
              <li key={f.id} className="text-sm">
                <strong className="text-foreground">{f.name}: </strong>
                <span className="text-muted-foreground text-xs">{f.description}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card/50 border border-border/50 p-4 rounded-xl">
          <h4 className="font-bold text-sm uppercase text-muted-foreground mb-3 flex items-center gap-2">
             Rasgos de Especie ({race?.name})
          </h4>
          <ul className="space-y-2">
            {race?.traits.map(t => (
              <li key={t.id} className="text-sm">
                <strong className="text-foreground">{t.name}: </strong>
                <span className="text-muted-foreground text-xs">{t.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BOTÓN FINAL */}
      <div className="flex justify-end pt-4 pb-8">
        <button 
          onClick={handleSave}
          disabled={isSaving || !character.name}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 flex items-center gap-3 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Personaje
            </>
          )}
        </button>
      </div>

    </div>
  );
};
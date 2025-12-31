import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { useCharacterStore } from '@/features/character-creator/store/characterStore';
import { Plus, Trash2, User, Sword, Scroll } from 'lucide-react';

// Tipos para mapear IDs a nombres legibles
import { PLAYABLE_RACES } from '@/srd/races';
import { PLAYABLE_CLASSES } from '@/srd/classes';

interface DashboardProps {
  onCreateNew: () => void;
  onSelectCharacter: (id: number) => void; 
}

export const Dashboard = ({ onCreateNew, onSelectCharacter }: DashboardProps) => {
  const { resetCharacter } = useCharacterStore();

  // useLiveQuery escucha cambios en la DB en tiempo real.
  const characters = useLiveQuery(() => db.characters.toArray());

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de que quieres eliminar a este héroe? Esta acción es permanente.')) {
      await db.characters.delete(id);
    }
  };

  const handleCreate = () => {
    resetCharacter();
    onCreateNew();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">QuestVault</h1>
          <p className="text-muted-foreground mt-1">Tu bóveda de héroes.</p>
        </div>
      </div>

      {/* Grid de Personajes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta "Crear Nuevo" */}
        <button 
          onClick={handleCreate}
          className="group flex flex-col items-center justify-center gap-4 min-h-[200px] border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all active:scale-95"
        >
          <div className="w-16 h-16 rounded-full bg-secondary group-hover:bg-primary/20 flex items-center justify-center transition-colors">
            <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
          </div>
          <span className="font-bold text-muted-foreground group-hover:text-primary">Crear Nuevo Personaje</span>
        </button>

        {/* Lista de Personajes Guardados */}
        {characters?.map((char) => {
          const raceName = PLAYABLE_RACES.find(r => r.id === char.raceId)?.name || char.raceId;
          const className = PLAYABLE_CLASSES.find(c => c.id === char.classId)?.name || char.classId;

          return (
            <div 
              key={char.id}
              onClick={() => char.id && onSelectCharacter(char.id)}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative group cursor-pointer active:scale-[0.98]" // Añadimos cursor-pointer
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                  {char.name.charAt(0).toUpperCase()}
                </div>
                <button 
                  onClick={(e) => char.id && handleDelete(e, char.id)}
                  className="text-muted-foreground hover:text-destructive p-2 rounded-full hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-bold truncate mb-1">{char.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">Nivel {char.level} {className}</p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2 bg-secondary/50 p-1.5 rounded">
                  <User className="w-3 h-3" /> {raceName}
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 p-1.5 rounded">
                  <Sword className="w-3 h-3" /> HP: {char.hp.max}
                </div>
              </div>
              
              {/* Decoración fecha */}
              <div className="mt-4 pt-4 border-t border-border/50 text-[10px] text-muted-foreground flex items-center gap-1">
                <Scroll className="w-3 h-3" />
                Actualizado: {char.updatedAt?.toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Empty State */}
      {characters?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No tienes héroes en la bóveda. ¡Crea el primero!</p>
        </div>
      )}
    </div>
  );
};
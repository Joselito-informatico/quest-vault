import Dexie, { type EntityTable } from 'dexie';
import type { Character } from '@/types/dnd';

// Definimos la base de datos extendiendo Dexie
const db = new Dexie('QuestVaultDB') as Dexie & {
  characters: EntityTable<
    Character,
    'id' // primary key "id" (para los tipos de TypeScript)
  >;
};

// Definimos el Esquema (Schema)
// NOTA: Solo mencionamos los campos que queremos indexar para búsquedas.
// No hace falta listar todos los campos del JSON.
db.version(1).stores({
  characters: '++id, name, raceId, classId, updatedAt' 
});

// Hook o función helper para guardar un personaje
export const saveCharacterToDb = async (character: Partial<Character>) => {
  // Aseguramos que tenga fecha de creación/actualización
  const now = new Date();
  
  const characterData = {
    ...character,
    createdAt: character.createdAt || now,
    updatedAt: now,
    // Aseguramos valores por defecto si faltan
    xp: character.xp || 0,
    inventory: character.inventory || [],
    hp: character.hp || { current: 1, max: 1, temp: 0 }
  } as Character;

  // Dexie devuelve el ID del objeto insertado
  const id = await db.characters.put(characterData);
  return id;
};

export { db };
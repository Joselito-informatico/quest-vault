import type { Race } from '@/types/dnd';

export const PLAYABLE_RACES: Race[] = [
  {
    id: 'human',
    name: 'Humano',
    speed: 30,
    size: 'Medium',
    abilityBonuses: {}, // En SRD 5.2, los bonos vienen del Trasfondo
    traits: [
      {
        id: 'resourceful',
        name: 'Ingenioso',
        description: 'Obtienes Inspiración Heroica al finalizar cada Descanso Largo.'
      },
      {
        id: 'versatile',
        name: 'Versátil',
        description: 'Ganas una Dote de Origen a tu elección y competencia en una habilidad extra.'
      }
    ]
  },
  {
    id: 'elf-high',
    name: 'Elfo (Alto)',
    speed: 30,
    size: 'Medium',
    abilityBonuses: {},
    traits: [
      {
        id: 'darkvision',
        name: 'Visión en la Oscuridad',
        description: 'Puedes ver en luz tenue a 18m como si fuera brillante, y en oscuridad como si fuera luz tenue.'
      },
      {
        id: 'keen-senses',
        name: 'Sentidos Agudos',
        description: 'Tienes competencia en la habilidad de Percepción.'
      },
      {
        id: 'fey-ancestry',
        name: 'Linaje Feérico',
        description: 'Ventaja en salvaciones contra hechizos y la magia no puede dormirte.'
      },
      {
        id: 'cantrip',
        name: 'Truco Mágico',
        description: 'Conoces un truco de la lista de Mago (ej: Prestidigitación).'
      }
    ]
  },
  {
    id: 'dwarf',
    name: 'Enano',
    speed: 25, // Un poco más lento
    size: 'Medium',
    abilityBonuses: {},
    traits: [
      {
        id: 'darkvision',
        name: 'Visión en la Oscuridad',
        description: 'Alcance de 36m (superior a otras especies).'
      },
      {
        id: 'dwarven-resilience',
        name: 'Resistencia Enana',
        description: 'Ventaja en salvaciones contra veneno y resistencia al daño de veneno.'
      },
      {
        id: 'stonecunning',
        name: 'Afinidad con la Piedra',
        description: 'Ganas visión de vibraciones (Tremorsense) sobre piedra como acción adicional.'
      }
    ]
  },
  {
    id: 'halfling',
    name: 'Mediano',
    speed: 30,
    size: 'Small',
    abilityBonuses: {},
    traits: [
      {
        id: 'brave',
        name: 'Valiente',
        description: 'Ventaja en tiradas de salvación para no ser asustado.'
      },
      {
        id: 'lucky',
        name: 'Afortunado',
        description: 'Cuando sacas un 1 en ataque, habilidad o salvación, puedes volver a tirar el dado.'
      },
      {
        id: 'nimbleness',
        name: 'Agilidad de Mediano',
        description: 'Puedes moverte a través del espacio de cualquier criatura más grande que tú.'
      }
    ]
  }
];
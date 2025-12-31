import type { CharacterClass } from '@/types/dnd';

export const PLAYABLE_CLASSES: CharacterClass[] = [
  {
    id: 'cleric',
    name: 'Clérigo',
    hitDie: 'd8',
    primaryAbility: ['WIS'],
    savingThrows: ['WIS', 'CHA'],
    features: [
      {
        id: 'spellcasting',
        name: 'Lanzamiento de Conjuros',
        level: 1,
        description: 'Puedes lanzar hechizos divinos. Preparas hechizos diariamente.'
      },
      {
        id: 'divine-domain',
        name: 'Dominio Divino',
        level: 1,
        description: 'Eliges un dominio relacionado con tu deidad (ej: Vida, Luz) que te otorga poderes.'
      }
    ]
  },
  {
    id: 'fighter',
    name: 'Guerrero',
    hitDie: 'd10',
    primaryAbility: ['STR', 'DEX'],
    savingThrows: ['STR', 'CON'],
    features: [
      {
        id: 'fighting-style',
        name: 'Estilo de Combate',
        level: 1,
        description: 'Adoptas un estilo particular de lucha (ej: Arquería, Defensa, Duelo).'
      },
      {
        id: 'second-wind',
        name: 'Segundos Aires',
        level: 1,
        description: 'Puedes usar una acción adicional para recuperar 1d10 + Nivel Puntos de Golpe.'
      }
    ]
  },
  {
    id: 'rogue',
    name: 'Pícaro',
    hitDie: 'd8',
    primaryAbility: ['DEX'],
    savingThrows: ['DEX', 'INT'],
    features: [
      {
        id: 'sneak-attack',
        name: 'Ataque Furtivo',
        level: 1,
        description: 'Haces daño extra (1d6) si tienes ventaja o un aliado cerca del enemigo.'
      },
      {
        id: 'thieves-cant',
        name: 'Jerga de Ladrones',
        level: 1,
        description: 'Conoces el idioma secreto de los bajos fondos.'
      }
    ]
  },
  {
    id: 'wizard',
    name: 'Mago',
    hitDie: 'd6',
    primaryAbility: ['INT'],
    savingThrows: ['INT', 'WIS'],
    features: [
      {
        id: 'spellcasting',
        name: 'Lanzamiento de Conjuros',
        level: 1,
        description: 'Lanzas hechizos arcanos usando tu libro de conjuros.'
      },
      {
        id: 'arcane-recovery',
        name: 'Recuperación Arcana',
        level: 1,
        description: 'Recuperas algunos espacios de conjuro tras un descanso corto.'
      }
    ]
  }
];
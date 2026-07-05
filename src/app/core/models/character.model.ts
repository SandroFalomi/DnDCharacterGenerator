import { AbilityKey, AbilityScores } from './content.model';

// ============================================================
// Modello personaggio (con supporto multiclasse)
// ============================================================

export interface CharacterClassEntry {
  classId: string;
  subclassId: string | null;
  level: number;
}

export interface Attack {
  name: string;
  bonus: string;
  damage: string;
}

export interface CombatStats {
  armorClass: number;
  initiative: number;
  speed: number;
  maxHp: number;
  currentHp: number;
  tempHp: number;
  hitDice: string;
  deathSaveSuccesses: number;
  deathSaveFailures: number;
  inspiration: boolean;
}

export interface CharacterTraits {
  personality: string;
  ideals: string;
  bonds: string;
  flaws: string;
}

export interface Character {
  id?: number;                       // auto-increment Dexie
  name: string;
  raceId: string;
  backgroundId: string;
  classes: CharacterClassEntry[];    // multiclasse: prima voce = classe primaria
  alignment: string;
  experiencePoints: number;
  stats: AbilityScores;
  applyRacialBonuses: boolean;
  customAbilityBonuses: Partial<AbilityScores>;   // usati solo quando applyRacialBonuses = false
  favoriteFeatureIds: string[];               // abilità segnate come preferite dall'utente
  skillProficiencies: string[];              // skill ids con competenza
  savingThrowProficiencies: AbilityKey[];
  // featureId -> skill ids scelte per la Maestria (doppio bonus competenza)
  expertiseSelections: Record<string, string[]>;
  // featureId -> sotto-opzioni scelte (manovre, discipline, invocazioni...)
  featureSelections: Record<string, string[]>;
  knownSpellIds: string[];
  preparedSpellIds: string[];
  spellSlotsUsed: Record<number, number>;    // livello slot -> slot spesi
  combat: CombatStats;
  equipment: string;
  attacks: Attack[];
  traits: CharacterTraits;
  createdAt: number;
  updatedAt: number;
}

export function emptyCharacter(): Character {
  return {
    name: '',
    raceId: '',
    backgroundId: '',
    classes: [],
    alignment: '',
    experiencePoints: 0,
    stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    applyRacialBonuses: true,
    customAbilityBonuses: {},
    favoriteFeatureIds: [],
    skillProficiencies: [],
    savingThrowProficiencies: [],
    expertiseSelections: {},
    featureSelections: {},
    knownSpellIds: [],
    preparedSpellIds: [],
    spellSlotsUsed: {},
    combat: {
      armorClass: 10, initiative: 0, speed: 9,
      maxHp: 10, currentHp: 10, tempHp: 0,
      hitDice: '', deathSaveSuccesses: 0, deathSaveFailures: 0,
      inspiration: false
    },
    equipment: '',
    attacks: [],
    traits: { personality: '', ideals: '', bonds: '', flaws: '' },
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

import { AbilityKey, AbilityScores, ActionType } from './content.model';

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

// ------------------------------------------------------------
// Risorse con utilizzi limitati (ira, ispirazione bardica...)
// ------------------------------------------------------------
export type ResourceRecovery = 'short-rest' | 'long-rest' | 'daily' | 'manual';

export const RECOVERY_LABELS: Record<ResourceRecovery, string> = {
  'short-rest': 'Riposo breve',
  'long-rest': 'Riposo lungo',
  daily: 'Al giorno',
  manual: 'Altro / Manuale'
};

export interface CharacterResource {
  name: string;
  maxUses: number;
  used: number;              // utilizzi già spesi
  recovery: ResourceRecovery;
}

// ------------------------------------------------------------
// Abilità aggiunte manualmente al singolo personaggio
// ------------------------------------------------------------
export type CustomFeatureSource =
  'class' | 'subclass' | 'race' | 'background' | 'feat' | 'homebrew' | 'manual';

export const CUSTOM_SOURCE_LABELS: Record<CustomFeatureSource, string> = {
  class: 'Classe', subclass: 'Sottoclasse', race: 'Razza',
  background: 'Background', feat: 'Talento', homebrew: 'Homebrew', manual: 'Manuale'
};

export interface CustomFeature {
  id: string;
  name: string;
  description: string;
  source: CustomFeatureSource;
  actionType?: ActionType;
  maxUses?: number;              // 0/assente = nessun limite di utilizzi
  recovery?: ResourceRecovery;
}

export interface Character {
  id?: number;                       // auto-increment Dexie
  name: string;
  raceId: string;
  subraceId: string | null;
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
  customFeatures: CustomFeature[];           // abilità aggiunte manualmente
  resources: CharacterResource[];            // risorse con utilizzi limitati
  featIds: string[];                         // talenti assegnati (dal catalogo)
  knownSpellIds: string[];
  preparedSpellIds: string[];
  spellSlotsUsed: Record<number, number>;    // livello slot -> slot spesi
  combat: CombatStats;
  equipment: string[];                       // un oggetto per voce
  attacks: Attack[];
  traits: CharacterTraits;
  createdAt: number;
  updatedAt: number;
}

export function emptyCharacter(): Character {
  return {
    name: '',
    raceId: '',
    subraceId: null,
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
    customFeatures: [],
    resources: [],
    featIds: [],
    knownSpellIds: [],
    preparedSpellIds: [],
    spellSlotsUsed: {},
    combat: {
      armorClass: 10, initiative: 0, speed: 9,
      maxHp: 10, currentHp: 10, tempHp: 0,
      hitDice: '', deathSaveSuccesses: 0, deathSaveFailures: 0,
      inspiration: false
    },
    equipment: [],
    attacks: [],
    traits: { personality: '', ideals: '', bonds: '', flaws: '' },
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

// Mappa dei vecchi id razza (quando le sottorazze erano razze separate)
const LEGACY_RACE_MAP: Record<string, { raceId: string; subraceId: string }> = {
  'elfo-alto': { raceId: 'elfo', subraceId: 'elfo-alto' },
  'nano-colline': { raceId: 'nano', subraceId: 'nano-colline' },
  'halfling-piedelesto': { raceId: 'halfling', subraceId: 'piedelesto' },
  'gnomo-rocce': { raceId: 'gnomo', subraceId: 'gnomo-rocce' }
};

/**
 * Rende retrocompatibili i personaggi salvati con versioni precedenti del
 * modello: aggiunge i campi mancanti, converte l'equipaggiamento da stringa
 * unica a elenco di voci e migra i vecchi id razza al sistema razza+sottorazza.
 */
export function normalizeCharacter(char: Character): Character {
  const legacyEquipment = char.equipment as unknown;
  const equipment = Array.isArray(legacyEquipment)
    ? legacyEquipment
    : typeof legacyEquipment === 'string' && legacyEquipment.trim()
      ? legacyEquipment.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
      : [];
  const legacyRace = LEGACY_RACE_MAP[char.raceId];
  // Gli umani salvati prima dell'introduzione delle varianti ricadono sulla "Standard" (+1 a tutto)
  const legacySubrace = char.raceId === 'umano' && !char.subraceId ? 'standard' : null;
  return {
    ...char,
    equipment,
    raceId: legacyRace?.raceId ?? char.raceId,
    subraceId: char.subraceId ?? legacyRace?.subraceId ?? legacySubrace,
    customAbilityBonuses: char.customAbilityBonuses ?? {},
    favoriteFeatureIds: char.favoriteFeatureIds ?? [],
    expertiseSelections: char.expertiseSelections ?? {},
    featureSelections: char.featureSelections ?? {},
    customFeatures: char.customFeatures ?? [],
    resources: char.resources ?? [],
    featIds: char.featIds ?? [],
    knownSpellIds: char.knownSpellIds ?? [],
    preparedSpellIds: char.preparedSpellIds ?? [],
    spellSlotsUsed: char.spellSlotsUsed ?? {},
    attacks: char.attacks ?? []
  };
}

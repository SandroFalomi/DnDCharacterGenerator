// ============================================================
// Modelli dei contenuti di catalogo (classi, razze, spell...)
// ============================================================

export type AbilityKey = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export const ABILITY_KEYS: AbilityKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  STR: 'Forza', DEX: 'Destrezza', CON: 'Costituzione',
  INT: 'Intelligenza', WIS: 'Saggezza', CHA: 'Carisma'
};

export const ABILITY_SHORT: Record<AbilityKey, string> = {
  STR: 'FOR', DEX: 'DES', CON: 'COS', INT: 'INT', WIS: 'SAG', CHA: 'CAR'
};

export interface AbilityScores {
  STR: number; DEX: number; CON: number;
  INT: number; WIS: number; CHA: number;
}

export interface SkillDef {
  id: string;
  name: string;
  ability: AbilityKey;
}

// ------------------------------------------------------------
// Tipo di utilizzo (economia delle azioni)
// ------------------------------------------------------------
export type ActionType = 'action' | 'bonus' | 'reaction' | 'none';

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  action: 'Azione', bonus: 'Azione Bonus', reaction: 'Reazione', none: 'Passiva / Nessuna azione'
};

export const ACTION_TYPE_ICONS: Record<ActionType, string> = {
  action: '⚔', bonus: '⚡', reaction: '↺', none: '◆'
};

export const ACTION_TYPE_SHORT: Record<ActionType, string> = {
  action: 'Azione', bonus: 'Bonus', reaction: 'Reazione', none: 'Passiva'
};

/** Deriva il tipo di azione di un incantesimo dal tempo di lancio testuale, senza duplicare il dato. */
export function actionTypeFromCastingTime(castingTime: string): ActionType {
  const t = castingTime.toLowerCase();
  if (t.includes('bonus')) return 'bonus';
  if (t.includes('reazione')) return 'reaction';
  if (t.includes('azione')) return 'action';
  return 'none';
}

export interface Trait {
  name: string;
  description: string;
  actionType?: ActionType;   // per i tratti razziali attivabili (es. soffio del dragonide)
}

export interface Subrace {
  id: string;
  name: string;
  description?: string;
  abilityBonuses: Partial<AbilityScores>;   // si sommano a quelli della razza base
  traits: Trait[];                          // si aggiungono ai tratti della razza base
  speed?: number;                           // se presente, sostituisce la velocità base
}

export interface Race {
  id: string;
  name: string;
  description: string;
  abilityBonuses: Partial<AbilityScores>;
  traits: Trait[];
  size: string;
  speed: number;
  languages: string[];
  icon: string;
  subraces?: Subrace[];
}

// ------------------------------------------------------------
// Talenti
// ------------------------------------------------------------
export interface Feat {
  id: string;
  name: string;
  description: string;
  prerequisite?: string;    // es. "Forza 13 o superiore", "Capacità di lanciare incantesimi"
  benefits?: string[];      // elenco puntato dei bonus concessi
}

// ------------------------------------------------------------
// Effetti generici delle abilità di classe (niente hardcoding):
// - 'expertise'        → scelta di abilità a cui raddoppiare il bonus competenza (Maestria)
// - 'half-proficiency' → metà bonus competenza alle abilità senza competenza (Factotum/Tuttofare)
// ------------------------------------------------------------
export type FeatureEffectType = 'expertise' | 'half-proficiency';

export interface ExpertiseTier {
  level: number;   // livello di classe a cui si sblocca la scelta
  count: number;   // quante abilità aggiuntive si possono scegliere a questo livello
}

export interface FeatureEffect {
  type: FeatureEffectType;
  tiers?: ExpertiseTier[];          // solo per 'expertise' (scelte ripetibili a più livelli)
  eligibleSkillIds?: string[];      // vuoto/assente = tutte le abilità in cui si ha competenza
}

// ------------------------------------------------------------
// Sistema generico di sotto-opzioni selezionabili
// (manovre, discipline elementali, invocazioni, metamagia...)
// ------------------------------------------------------------
export interface SelectionUnlock {
  level: number;     // livello di classe
  maxTotal: number;  // numero massimo TOTALE di opzioni selezionabili da quel livello
}

export interface SelectionConfig {
  poolId: string;              // riferimento a un OptionPool
  unlocks: SelectionUnlock[];  // progressione dei massimi per livello
}

export interface SubOption {
  id: string;
  name: string;
  description: string;
  prerequisite?: {
    minLevel?: number;   // livello minimo di classe
    note?: string;       // prerequisito testuale (es. "Deflagrazione Occulta")
  };
}

export interface OptionPool {
  id: string;
  name: string;          // es. "Manovre", "Discipline Elementali"
  description?: string;
  options: SubOption[];
}

export interface ClassFeature {
  id: string;
  name: string;
  description: string;
  level: number;                 // livello di sblocco
  actionType?: ActionType;       // tipo di utilizzo (azione, bonus, reazione, passiva). Default: 'none'
  effect?: FeatureEffect;        // effetto speciale sul calcolo competenze
  selection?: SelectionConfig;   // sotto-opzioni selezionabili
}

export interface ClassResource {
  name: string;         // es. "Ki", "Punti Stregoneria", "Dadi Superiorità"
  description: string;
  level: number;        // livello a cui compare
}

export type SpellProgression = 'full' | 'half' | 'third' | 'pact';

export interface SpellcastingConfig {
  ability: AbilityKey;
  progression: SpellProgression;
  prepares: boolean;      // true = prepara incantesimi (mago, chierico...)
  hasCantrips: boolean;
}

export interface Subclass {
  id: string;
  classId: string;
  name: string;
  description: string;
  features: ClassFeature[];
  spellcasting?: SpellcastingConfig;  // per sottoclassi magiche (Cavaliere Mistico...)
}

export interface DndClass {
  id: string;
  name: string;
  description: string;
  hitDie: number;
  savingThrows: AbilityKey[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  skillChoices: { count: number; from: string[] };
  equipment: string[];
  features: ClassFeature[];
  subclassLevel: number;
  subclassTitle: string;      // es. "Archetipo Marziale"
  resources: ClassResource[];
  spellcasting?: SpellcastingConfig;
  icon: string;
}

export interface Background {
  id: string;
  name: string;
  description: string;
  skillProficiencies: string[];   // skill ids
  toolProficiencies: string[];
  languages: string[];
  equipment: string[];
  feature: Trait;                 // privilegio del background
  icon: string;
}

export const SPELL_SCHOOLS = [
  'Abiurazione', 'Ammaliamento', 'Divinazione', 'Evocazione',
  'Illusione', 'Invocazione', 'Necromanzia', 'Trasmutazione'
] as const;

export interface Spell {
  id: string;
  name: string;
  level: number;          // 0 = trucchetto
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  concentration: boolean;
  ritual?: boolean;
  description: string;
  classIds: string[];     // classi abilitate
  subclassIds: string[];  // sottoclassi abilitate
  notes?: string;
}

export interface StandardArraySet {
  name: string;
  values: number[];
}

export interface PointBuyCost {
  score: number;
  cost: number;
}

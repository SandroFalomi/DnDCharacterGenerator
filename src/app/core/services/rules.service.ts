import { Injectable, inject } from '@angular/core';
import { CUSTOM_SOURCE_LABELS, Character, CharacterClassEntry, CustomFeature } from '../models/character.model';
import {
  ActionType, AbilityKey, AbilityScores, ClassFeature, Race, SelectionConfig, Spell,
  SpellcastingConfig, Subrace, Trait
} from '../models/content.model';
import { ContentService } from './content.service';

/** Dati razziali "effettivi": razza base + eventuale sottorazza già combinate. */
export interface EffectiveRace {
  race: Race;
  subrace?: Subrace;
  name: string;
  abilityBonuses: Partial<AbilityScores>;
  traits: Trait[];
  speed: number;
}

export interface FeatureWithSource {
  feature: ClassFeature;
  source: string;        // es. "Guerriero 3", "Maestro di Battaglia"
  sourceType: 'class' | 'subclass' | 'race' | 'background' | 'custom';
  classEntry?: CharacterClassEntry;
  custom?: CustomFeature;   // presente solo per le abilità aggiunte manualmente
}

export interface ClassFeatureGroup {
  entry: CharacterClassEntry;
  className: string;
  icon: string;
  features: FeatureWithSource[];
}

export interface SlotInfo { level: number; total: number; }

// Tabella slot multiclasse (indice = livello incantatore combinato 1-20)
const FULL_CASTER_SLOTS: number[][] = [
  [], [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2],
  [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]
];

// Magia del patto (warlock): [numero slot, livello slot]
const PACT_SLOTS: [number, number][] = [
  [0, 0], [1, 1], [2, 1], [2, 2], [2, 2], [2, 3], [2, 3], [2, 4], [2, 4],
  [2, 5], [2, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [4, 5], [4, 5], [4, 5], [4, 5]
];

@Injectable({ providedIn: 'root' })
export class RulesService {
  private content = inject(ContentService);

  totalLevel(char: Character): number {
    return char.classes.reduce((sum, c) => sum + c.level, 0) || 1;
  }

  proficiencyBonus(char: Character): number {
    return Math.ceil(this.totalLevel(char) / 4) + 1;
  }

  abilityMod(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  formatMod(value: number): string {
    return value >= 0 ? `+${value}` : `${value}`;
  }

  /** Combina razza base e sottorazza in un unico insieme di bonus, tratti e velocità. */
  effectiveRace(raceId: string, subraceId?: string | null): EffectiveRace | undefined {
    const race = this.content.raceMap().get(raceId);
    if (!race) return undefined;
    const subrace = race.subraces?.find(s => s.id === subraceId);
    const bonuses: Partial<AbilityScores> = { ...race.abilityBonuses };
    for (const key of Object.keys(subrace?.abilityBonuses ?? {}) as AbilityKey[]) {
      bonuses[key] = (bonuses[key] ?? 0) + (subrace!.abilityBonuses[key] ?? 0);
    }
    return {
      race, subrace,
      name: subrace ? `${race.name} (${subrace.name})` : race.name,
      abilityBonuses: bonuses,
      traits: [...race.traits, ...(subrace?.traits ?? [])],
      speed: subrace?.speed ?? race.speed
    };
  }

  effectiveRaceName(char: Character): string {
    return this.effectiveRace(char.raceId, char.subraceId)?.name ?? '—';
  }

  /** Punteggi finali (base + bonus razziali, oppure bonus liberi +2/+1 se i bonus razziali sono disattivati). */
  finalScores(char: Character): AbilityScores {
    const scores = { ...char.stats };
    if (char.applyRacialBonuses) {
      const eff = this.effectiveRace(char.raceId, char.subraceId);
      if (eff) {
        for (const key of Object.keys(eff.abilityBonuses) as AbilityKey[]) {
          scores[key] += eff.abilityBonuses[key] ?? 0;
        }
      }
    } else {
      for (const key of Object.keys(char.customAbilityBonuses ?? {}) as AbilityKey[]) {
        scores[key] += char.customAbilityBonuses[key] ?? 0;
      }
    }
    return scores;
  }

  /** Abilità di classe/sottoclasse sbloccate da una voce multiclasse. */
  featuresForEntry(entry: CharacterClassEntry): FeatureWithSource[] {
    const result: FeatureWithSource[] = [];
    const cls = this.content.classMap().get(entry.classId);
    if (cls) {
      for (const f of cls.features.filter(f => f.level <= entry.level)) {
        result.push({ feature: f, source: `${cls.name} ${f.level}`, sourceType: 'class', classEntry: entry });
      }
    }
    if (entry.subclassId) {
      const sub = this.content.subclassMap().get(entry.subclassId);
      if (sub) {
        for (const f of sub.features.filter(f => f.level <= entry.level)) {
          result.push({ feature: f, source: `${sub.name} ${f.level}`, sourceType: 'subclass', classEntry: entry });
        }
      }
    }
    return result.sort((a, b) => a.feature.level - b.feature.level);
  }

  /** Tutte le abilità del personaggio: razza, background, classi e sottoclassi. */
  allFeatures(char: Character): FeatureWithSource[] {
    const result: FeatureWithSource[] = [];
    const race = this.content.raceMap().get(char.raceId);
    if (race) {
      const eff = this.effectiveRace(char.raceId, char.subraceId);
      for (const t of eff?.traits ?? race.traits) {
        result.push({
          feature: { id: `race-${t.name}`, name: t.name, description: t.description, level: 0, actionType: t.actionType },
          source: eff?.name ?? race.name, sourceType: 'race'
        });
      }
    }
    const bg = this.content.backgroundMap().get(char.backgroundId);
    if (bg) {
      result.push({
        feature: { id: `bg-${bg.id}`, name: bg.feature.name, description: bg.feature.description, level: 0, actionType: bg.feature.actionType },
        source: bg.name, sourceType: 'background'
      });
    }
    for (const entry of char.classes) {
      result.push(...this.featuresForEntry(entry));
    }
    for (const cf of char.customFeatures ?? []) {
      result.push({
        feature: { id: cf.id, name: cf.name, description: cf.description, level: 0, actionType: cf.actionType },
        source: CUSTOM_SOURCE_LABELS[cf.source] ?? 'Personalizzata',
        sourceType: 'custom',
        custom: cf
      });
    }
    return result;
  }

  /**
   * Abilità raggruppate per singola classe del personaggio (una voce per ogni
   * classe in caso di multiclasse), con le abilità della relativa sottoclasse
   * già unite nello stesso gruppo invece che separate.
   */
  classFeatureGroups(char: Character): ClassFeatureGroup[] {
    return char.classes.map(entry => {
      const cls = this.content.classMap().get(entry.classId);
      return {
        entry,
        className: cls?.name ?? entry.classId,
        icon: cls?.icon ?? '⚔',
        features: this.featuresForEntry(entry)
      };
    });
  }

  /** Ordina mettendo per prime le abilità preferite, mantenendo l'ordine relativo tra le altre. */
  sortByFavorite(features: FeatureWithSource[], favoriteIds: string[]): FeatureWithSource[] {
    const fav = new Set(favoriteIds);
    return [...features].sort((a, b) => Number(!fav.has(a.feature.id)) - Number(!fav.has(b.feature.id)));
  }

  /** Vero se un'abilità è compatibile col filtro per tipo di azione (le passive superano sempre il filtro). */
  passesActionFilter(fws: FeatureWithSource, filter: ActionType | null): boolean {
    if (!filter) return true;
    const type = fws.feature.actionType ?? 'none';
    return type === filter || type === 'none';
  }

  // ---------- Maestria / Factotum (effetti generici) ----------

  /** Vero se una qualsiasi abilità attiva applica metà competenza alle prove senza competenza. */
  hasHalfProficiency(char: Character): boolean {
    return this.allFeatures(char).some(f => f.feature.effect?.type === 'half-proficiency');
  }

  /** Abilità attive con effetto Maestria. */
  expertiseFeatures(char: Character): FeatureWithSource[] {
    return this.allFeatures(char).filter(f => f.feature.effect?.type === 'expertise');
  }

  /** Numero massimo di abilità selezionabili per una feature Maestria al livello attuale. */
  expertiseCapacity(feature: ClassFeature, classLevel: number): number {
    const tiers = feature.effect?.tiers ?? [];
    return tiers.filter(t => t.level <= classLevel).reduce((sum, t) => sum + t.count, 0);
  }

  /** Insieme delle abilità con Maestria (doppio bonus competenza). */
  expertiseSkillIds(char: Character): Set<string> {
    const set = new Set<string>();
    for (const fws of this.expertiseFeatures(char)) {
      const chosen = char.expertiseSelections[fws.feature.id] ?? [];
      const cap = this.expertiseCapacity(fws.feature, fws.classEntry?.level ?? 1);
      chosen.slice(0, cap).forEach(id => set.add(id));
    }
    return set;
  }

  /** Bonus totale a una abilità, tenendo conto di competenza, Maestria e Factotum. */
  skillBonus(char: Character, skillId: string): number {
    const skill = this.content.skillMap.get(skillId);
    if (!skill) return 0;
    const mod = this.abilityMod(this.finalScores(char)[skill.ability]);
    const pb = this.proficiencyBonus(char);
    const proficient = char.skillProficiencies.includes(skillId);
    if (proficient) {
      return this.expertiseSkillIds(char).has(skillId) ? mod + pb * 2 : mod + pb;
    }
    return this.hasHalfProficiency(char) ? mod + Math.floor(pb / 2) : mod;
  }

  savingThrowBonus(char: Character, ability: AbilityKey): number {
    const mod = this.abilityMod(this.finalScores(char)[ability]);
    return char.savingThrowProficiencies.includes(ability) ? mod + this.proficiencyBonus(char) : mod;
  }

  passivePerception(char: Character): number {
    return 10 + this.skillBonus(char, 'percezione');
  }

  // ---------- Sotto-opzioni selezionabili (sistema generico) ----------

  /** Numero massimo di sotto-opzioni selezionabili al livello attuale. */
  selectionCapacity(config: SelectionConfig, classLevel: number): number {
    const unlocked = config.unlocks.filter(u => u.level <= classLevel);
    return unlocked.length ? Math.max(...unlocked.map(u => u.maxTotal)) : 0;
  }

  /** Abilità attive che offrono sotto-opzioni selezionabili. */
  selectableFeatures(char: Character): FeatureWithSource[] {
    return this.allFeatures(char).filter(f => !!f.feature.selection);
  }

  // ---------- Incantesimi ----------

  /** Configurazione da incantatore per una voce di classe (classe o sottoclasse magica). */
  spellcastingFor(entry: CharacterClassEntry): SpellcastingConfig | undefined {
    const cls = this.content.classMap().get(entry.classId);
    if (cls?.spellcasting) return cls.spellcasting;
    if (entry.subclassId) {
      const sub = this.content.subclassMap().get(entry.subclassId);
      if (sub?.spellcasting) return sub.spellcasting;
    }
    return undefined;
  }

  isCaster(char: Character): boolean {
    return char.classes.some(e => !!this.spellcastingFor(e));
  }

  /** Livello da incantatore combinato secondo le regole del multiclasse. */
  combinedCasterLevel(char: Character): number {
    let level = 0;
    for (const entry of char.classes) {
      const sc = this.spellcastingFor(entry);
      if (!sc || sc.progression === 'pact') continue;
      if (sc.progression === 'full') level += entry.level;
      else if (sc.progression === 'half') level += Math.floor(entry.level / 2);
      else level += Math.floor(entry.level / 3);
    }
    return Math.min(level, 20);
  }

  /** Slot incantesimo standard (esclusa la magia del patto). */
  spellSlots(char: Character): SlotInfo[] {
    const casterLevel = this.combinedCasterLevel(char);
    if (casterLevel < 1) return [];
    return FULL_CASTER_SLOTS[casterLevel].map((total, i) => ({ level: i + 1, total }));
  }

  /** Slot della magia del patto (warlock). */
  pactSlots(char: Character): { count: number; slotLevel: number } | null {
    const pactLevels = char.classes
      .filter(e => this.spellcastingFor(e)?.progression === 'pact')
      .reduce((sum, e) => sum + e.level, 0);
    if (pactLevels < 1) return null;
    const [count, slotLevel] = PACT_SLOTS[Math.min(pactLevels, 20)];
    return { count, slotLevel };
  }

  /** Incantesimi disponibili per il personaggio (filtrati per classi/sottoclassi). */
  availableSpells(char: Character): Spell[] {
    const ids = new Set<string>();
    const result: Spell[] = [];
    for (const entry of char.classes) {
      if (!this.spellcastingFor(entry)) continue;
      for (const spell of this.content.spellsFor(entry.classId, entry.subclassId)) {
        if (!ids.has(spell.id)) { ids.add(spell.id); result.push(spell); }
      }
    }
    return result.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  }

  /** Vero se qualche classe del personaggio prepara gli incantesimi. */
  hasPreparedCasting(char: Character): boolean {
    return char.classes.some(e => this.spellcastingFor(e)?.prepares);
  }

  classLabel(char: Character): string {
    return char.classes
      .map(e => {
        const cls = this.content.classMap().get(e.classId);
        return cls ? `${cls.name} ${e.level}` : '';
      })
      .filter(Boolean)
      .join(' / ') || '—';
  }
}

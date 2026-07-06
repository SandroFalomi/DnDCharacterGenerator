import { Injectable, computed, signal } from '@angular/core';
import { Table } from 'dexie';
import { db } from '../db/app-db';
import {
  Background, DndClass, Feat, OptionPool, Race, SkillDef, Spell, Subclass
} from '../models/content.model';
import { CLASSES } from '../../data/classes';
import { SUBCLASSES } from '../../data/subclasses';
import { BACKGROUNDS } from '../../data/backgrounds';
import { SPELLS } from '../../data/spells';
import { OPTION_POOLS } from '../../data/option-pools';
import { RACES } from '../../data/races';
import { FEATS } from '../../data/feats';
import { SKILLS } from '../../data/skills';

const SEED_KEY = 'content-seed-version';
const SEED_VERSION = 5;

// Vecchi id razza sostituiti dal sistema razza + sottorazza
const LEGACY_RACE_IDS = ['elfo-alto', 'nano-colline', 'halfling-piedelesto', 'gnomo-rocce'];

// ============================================================
// Repository dei contenuti di catalogo.
// I dati statici vengono seminati in IndexedDB al primo avvio;
// da lì in poi la sezione Developer li gestisce liberamente.
// L'API del servizio è astratta: in futuro può essere sostituita
// da chiamate REST verso un back-end senza toccare i componenti.
// ============================================================
@Injectable({ providedIn: 'root' })
export class ContentService {
  readonly classes = signal<DndClass[]>([]);
  readonly subclasses = signal<Subclass[]>([]);
  readonly backgrounds = signal<Background[]>([]);
  readonly spells = signal<Spell[]>([]);
  readonly optionPools = signal<OptionPool[]>([]);
  readonly races = signal<Race[]>([]);
  readonly feats = signal<Feat[]>([]);
  readonly skills: SkillDef[] = SKILLS;
  readonly ready = signal(false);

  readonly classMap = computed(() => new Map(this.classes().map(c => [c.id, c])));
  readonly subclassMap = computed(() => new Map(this.subclasses().map(s => [s.id, s])));
  readonly backgroundMap = computed(() => new Map(this.backgrounds().map(b => [b.id, b])));
  readonly spellMap = computed(() => new Map(this.spells().map(s => [s.id, s])));
  readonly poolMap = computed(() => new Map(this.optionPools().map(p => [p.id, p])));
  readonly raceMap = computed(() => new Map(this.races().map(r => [r.id, r])));
  readonly featMap = computed(() => new Map(this.feats().map(f => [f.id, f])));
  readonly skillMap = new Map(SKILLS.map(s => [s.id, s]));

  async init(): Promise<void> {
    const seeded = await db.meta.get(SEED_KEY);
    if (!seeded || (seeded.value as number) < SEED_VERSION) {
      await this.seedAll();
      // Migrazione: normalizza i campi mancanti (vecchi import) ed elimina i doppioni
      await this.cleanupCatalog();
      await db.meta.put({ key: SEED_KEY, value: SEED_VERSION });
    }
    await this.reloadAll();
    this.ready.set(true);
  }

  private async seedAll(): Promise<void> {
    await db.transaction('rw', [db.classes, db.subclasses, db.backgrounds, db.spells, db.optionPools, db.races, db.feats], async () => {
      await db.classes.bulkPut(CLASSES);
      await db.subclasses.bulkPut(SUBCLASSES);
      await db.backgrounds.bulkPut(BACKGROUNDS);
      await db.spells.bulkPut(SPELLS);
      await db.optionPools.bulkPut(OPTION_POOLS);
      await db.races.bulkPut(RACES);
      await db.feats.bulkPut(FEATS);
    });
  }

  /**
   * Svuota il catalogo contenuti e lo ripopola con i dati predefiniti.
   * I personaggi salvati non vengono toccati.
   */
  async resetCatalog(): Promise<void> {
    await db.transaction('rw', [db.classes, db.subclasses, db.backgrounds, db.spells, db.optionPools, db.races, db.feats, db.meta], async () => {
      await Promise.all([
        db.classes.clear(), db.subclasses.clear(), db.backgrounds.clear(),
        db.spells.clear(), db.optionPools.clear(), db.races.clear(), db.feats.clear()
      ]);
      await db.classes.bulkPut(CLASSES);
      await db.subclasses.bulkPut(SUBCLASSES);
      await db.backgrounds.bulkPut(BACKGROUNDS);
      await db.spells.bulkPut(SPELLS);
      await db.optionPools.bulkPut(OPTION_POOLS);
      await db.races.bulkPut(RACES);
      await db.feats.bulkPut(FEATS);
      await db.meta.put({ key: SEED_KEY, value: SEED_VERSION });
    });
    await this.reloadAll();
  }

  /**
   * Bonifica del catalogo: ripara gli incantesimi senza classIds/subclassIds
   * (creati da vecchi import) ed elimina i doppioni con lo stesso nome ma id
   * diverso, preferendo la versione ufficiale del seed.
   */
  private async cleanupCatalog(): Promise<void> {
    const spells = await db.spells.toArray();
    const repaired = spells.map(s => ({
      ...s,
      classIds: Array.isArray(s.classIds) ? s.classIds : [],
      subclassIds: Array.isArray(s.subclassIds) ? s.subclassIds : [],
      concentration: !!s.concentration
    }));
    await db.spells.bulkPut(repaired);

    // Rimuove le vecchie razze ora rappresentate come sottorazze
    await db.races.bulkDelete(LEGACY_RACE_IDS);

    await this.dedupeTable(db.spells, s => s.name, new Set(SPELLS.map(s => s.id)));
    await this.dedupeTable(db.backgrounds, b => b.name, new Set(BACKGROUNDS.map(b => b.id)));
    await this.dedupeTable(db.classes, c => c.name, new Set(CLASSES.map(c => c.id)));
    await this.dedupeTable(db.subclasses, s => `${s.classId}|${s.name}`, new Set(SUBCLASSES.map(s => s.id)));
    await this.dedupeTable(db.optionPools, p => p.name, new Set(OPTION_POOLS.map(p => p.id)));
    await this.dedupeTable(db.races, r => r.name, new Set(RACES.map(r => r.id)));
    await this.dedupeTable(db.feats, f => f.name, new Set(FEATS.map(f => f.id)));
  }

  private async dedupeTable<T extends { id: string; name: string }>(
    table: Table<T, string>,
    keyOf: (item: T) => string,
    seedIds: Set<string>
  ): Promise<void> {
    const items = await table.toArray();
    const groups = new Map<string, T[]>();
    for (const item of items) {
      const key = keyOf(item).trim().toLowerCase();
      const group = groups.get(key) ?? [];
      group.push(item);
      groups.set(key, group);
    }
    const toDelete: string[] = [];
    for (const group of groups.values()) {
      if (group.length < 2) continue;
      const keep = group.find(i => seedIds.has(i.id)) ?? group[0];
      for (const item of group) {
        if (item.id !== keep.id) toDelete.push(item.id);
      }
    }
    if (toDelete.length) await table.bulkDelete(toDelete);
  }

  async reloadAll(): Promise<void> {
    const [classes, subclasses, backgrounds, spells, pools, races, feats] = await Promise.all([
      db.classes.toArray(), db.subclasses.toArray(), db.backgrounds.toArray(),
      db.spells.toArray(), db.optionPools.toArray(), db.races.toArray(), db.feats.toArray()
    ]);
    this.classes.set(classes.sort((a, b) => a.name.localeCompare(b.name)));
    this.subclasses.set(subclasses.sort((a, b) => a.name.localeCompare(b.name)));
    this.backgrounds.set(backgrounds.sort((a, b) => a.name.localeCompare(b.name)));
    this.spells.set(spells.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name)));
    this.optionPools.set(pools.sort((a, b) => a.name.localeCompare(b.name)));
    this.races.set(races.sort((a, b) => a.name.localeCompare(b.name)));
    this.feats.set(feats.sort((a, b) => a.name.localeCompare(b.name)));
  }

  subclassesOf(classId: string): Subclass[] {
    return this.subclasses().filter(s => s.classId === classId);
  }

  /** Incantesimi utilizzabili da una certa classe/sottoclasse (robusto verso dati incompleti). */
  spellsFor(classId: string, subclassId?: string | null): Spell[] {
    return this.spells().filter(s =>
      (s.classIds ?? []).includes(classId) ||
      (subclassId ? (s.subclassIds ?? []).includes(subclassId) : false)
    );
  }

  // ---------- CRUD (API REST-like sul repository locale) ----------
  async saveClass(c: DndClass): Promise<void> { await db.classes.put(c); await this.reloadAll(); }
  async deleteClass(id: string): Promise<void> {
    await db.transaction('rw', [db.classes, db.subclasses], async () => {
      await db.classes.delete(id);
      await db.subclasses.where('classId').equals(id).delete();
    });
    await this.reloadAll();
  }
  async saveSubclass(s: Subclass): Promise<void> { await db.subclasses.put(s); await this.reloadAll(); }
  async deleteSubclass(id: string): Promise<void> { await db.subclasses.delete(id); await this.reloadAll(); }
  async saveBackground(b: Background): Promise<void> { await db.backgrounds.put(b); await this.reloadAll(); }
  async deleteBackground(id: string): Promise<void> { await db.backgrounds.delete(id); await this.reloadAll(); }
  async saveSpell(s: Spell): Promise<void> { await db.spells.put(s); await this.reloadAll(); }
  async deleteSpell(id: string): Promise<void> { await db.spells.delete(id); await this.reloadAll(); }
  async savePool(p: OptionPool): Promise<void> { await db.optionPools.put(p); await this.reloadAll(); }
  async deletePool(id: string): Promise<void> { await db.optionPools.delete(id); await this.reloadAll(); }
  async saveRace(r: Race): Promise<void> { await db.races.put(r); await this.reloadAll(); }
  async deleteRace(id: string): Promise<void> { await db.races.delete(id); await this.reloadAll(); }
  async saveFeat(f: Feat): Promise<void> { await db.feats.put(f); await this.reloadAll(); }
  async deleteFeat(id: string): Promise<void> { await db.feats.delete(id); await this.reloadAll(); }

  async bulkImport(payload: {
    classes?: DndClass[]; subclasses?: Subclass[]; backgrounds?: Background[];
    spells?: Spell[]; optionPools?: OptionPool[]; feats?: Feat[];
  }): Promise<void> {
    await db.transaction('rw', [db.classes, db.subclasses, db.backgrounds, db.spells, db.optionPools, db.feats], async () => {
      if (payload.classes?.length) await db.classes.bulkPut(payload.classes);
      if (payload.subclasses?.length) await db.subclasses.bulkPut(payload.subclasses);
      if (payload.backgrounds?.length) await db.backgrounds.bulkPut(payload.backgrounds);
      if (payload.spells?.length) await db.spells.bulkPut(payload.spells);
      if (payload.optionPools?.length) await db.optionPools.bulkPut(payload.optionPools);
      if (payload.feats?.length) await db.feats.bulkPut(payload.feats);
    });
    await this.reloadAll();
  }
}

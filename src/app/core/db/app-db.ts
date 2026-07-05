import Dexie, { Table } from 'dexie';
import { Character } from '../models/character.model';
import { Background, DndClass, OptionPool, Race, Spell, Subclass } from '../models/content.model';

// ============================================================
// Database IndexedDB via Dexie.js
// - characters: dati utente
// - tabelle contenuti: catalogo modificabile dalla sezione Developer
// ============================================================
export class AppDB extends Dexie {
  characters!: Table<Character, number>;
  classes!: Table<DndClass, string>;
  subclasses!: Table<Subclass, string>;
  backgrounds!: Table<Background, string>;
  spells!: Table<Spell, string>;
  optionPools!: Table<OptionPool, string>;
  races!: Table<Race, string>;
  meta!: Table<{ key: string; value: unknown }, string>;

  constructor() {
    super('dnd-characters-db');
    this.version(1).stores({
      characters: '++id, name',
      classes: 'id, name',
      subclasses: 'id, classId',
      backgrounds: 'id, name',
      spells: 'id, name, level, school',
      optionPools: 'id, name',
      races: 'id, name',
      meta: 'key'
    });
  }
}

export const db = new AppDB();

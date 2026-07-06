import { Injectable, signal } from '@angular/core';
import { db } from '../db/app-db';
import { Character, normalizeCharacter } from '../models/character.model';

@Injectable({ providedIn: 'root' })
export class CharacterService {
  readonly characters = signal<Character[]>([]);
  readonly loading = signal(false);

  async loadAll(): Promise<void> {
    this.loading.set(true);
    try {
      const list = await db.characters.toArray();
      this.characters.set(list.map(normalizeCharacter).sort((a, b) => b.updatedAt - a.updatedAt));
    } finally {
      this.loading.set(false);
    }
  }

  async get(id: number): Promise<Character | undefined> {
    const char = await db.characters.get(id);
    return char ? normalizeCharacter(char) : undefined;
  }

  async add(character: Character): Promise<number> {
    character.createdAt = Date.now();
    character.updatedAt = Date.now();
    const id = await db.characters.add(character);
    await this.loadAll();
    return id;
  }

  async update(id: number, patch: Partial<Character>): Promise<void> {
    await db.characters.update(id, { ...patch, updatedAt: Date.now() });
  }

  async remove(id: number): Promise<void> {
    await db.characters.delete(id);
    await this.loadAll();
  }
}

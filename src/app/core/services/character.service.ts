import { Injectable, signal } from '@angular/core';
import { db } from '../db/app-db';
import { Character } from '../models/character.model';

@Injectable({ providedIn: 'root' })
export class CharacterService {
  readonly characters = signal<Character[]>([]);
  readonly loading = signal(false);

  async loadAll(): Promise<void> {
    this.loading.set(true);
    try {
      const list = await db.characters.toArray();
      this.characters.set(list.sort((a, b) => b.updatedAt - a.updatedAt));
    } finally {
      this.loading.set(false);
    }
  }

  get(id: number): Promise<Character | undefined> {
    return db.characters.get(id);
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

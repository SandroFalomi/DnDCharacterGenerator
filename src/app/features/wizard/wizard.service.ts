import { Injectable, computed, inject, signal } from '@angular/core';
import { Character, CharacterClassEntry, emptyCharacter } from '../../core/models/character.model';
import { AbilityScores } from '../../core/models/content.model';
import { ContentService } from '../../core/services/content.service';
import { RulesService } from '../../core/services/rules.service';

export type StatMethod = 'array' | 'pointbuy' | 'manual';

@Injectable({ providedIn: 'root' })
export class WizardService {
  private content = inject(ContentService);
  private rules = inject(RulesService);

  readonly name = signal('');
  readonly raceId = signal('');
  readonly backgroundId = signal('');
  readonly classes = signal<CharacterClassEntry[]>([]);
  readonly alignment = signal('');
  readonly applyRacialBonuses = signal(true);
  readonly racialChoiceMade = signal(false);
  readonly statMethod = signal<StatMethod>('array');
  readonly stats = signal<AbilityScores>({ STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 });
  readonly customAbilityBonuses = signal<Partial<AbilityScores>>({});
  readonly chosenSkills = signal<string[]>([]);          // scelte di classe
  readonly expertiseSelections = signal<Record<string, string[]>>({});
  readonly featureSelections = signal<Record<string, string[]>>({});
  readonly knownSpellIds = signal<string[]>([]);

  /** Personaggio "provvisorio" per i calcoli condivisi con RulesService. */
  readonly draft = computed<Character>(() => {
    const char = emptyCharacter();
    char.name = this.name();
    char.raceId = this.raceId();
    char.backgroundId = this.backgroundId();
    char.classes = this.classes();
    char.alignment = this.alignment();
    char.applyRacialBonuses = this.applyRacialBonuses();
    char.stats = this.stats();
    char.customAbilityBonuses = this.customAbilityBonuses();
    char.skillProficiencies = this.allSkillProficiencies();
    char.expertiseSelections = this.expertiseSelections();
    char.featureSelections = this.featureSelections();
    char.knownSpellIds = this.knownSpellIds();
    return char;
  });

  /** Competenze abilità dal background. */
  backgroundSkills(): string[] {
    return this.content.backgroundMap().get(this.backgroundId())?.skillProficiencies ?? [];
  }

  allSkillProficiencies(): string[] {
    return [...new Set([...this.backgroundSkills(), ...this.chosenSkills()])];
  }

  primaryClass() {
    const entry = this.classes()[0];
    return entry ? this.content.classMap().get(entry.classId) : undefined;
  }

  reset(): void {
    this.name.set('');
    this.raceId.set('');
    this.backgroundId.set('');
    this.classes.set([]);
    this.alignment.set('');
    this.applyRacialBonuses.set(true);
    this.racialChoiceMade.set(false);
    this.statMethod.set('array');
    this.stats.set({ STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 });
    this.customAbilityBonuses.set({});
    this.chosenSkills.set([]);
    this.expertiseSelections.set({});
    this.featureSelections.set({});
    this.knownSpellIds.set([]);
  }

  /** Costruisce il personaggio finale da salvare. */
  build(): Character {
    const char = this.draft();
    const primary = this.primaryClass();
    char.savingThrowProficiencies = primary?.savingThrows ?? [];

    // Punti ferita: massimo al 1° livello della classe primaria, media per i successivi
    const scores = this.rules.finalScores(char);
    const conMod = this.rules.abilityMod(scores.CON);
    let hp = 0;
    const hitDice: string[] = [];
    this.classes().forEach((entry, index) => {
      const cls = this.content.classMap().get(entry.classId);
      if (!cls) return;
      hitDice.push(`${entry.level}d${cls.hitDie}`);
      let levels = entry.level;
      if (index === 0) {
        hp += cls.hitDie + conMod;
        levels -= 1;
      }
      hp += levels * (Math.floor(cls.hitDie / 2) + 1 + conMod);
    });
    char.combat.maxHp = Math.max(hp, 1);
    char.combat.currentHp = char.combat.maxHp;
    char.combat.hitDice = hitDice.join(' + ');
    char.combat.initiative = this.rules.abilityMod(scores.DEX);
    char.combat.armorClass = 10 + this.rules.abilityMod(scores.DEX);
    const race = this.content.raceMap().get(char.raceId);
    char.combat.speed = race?.speed ?? 9;
    const bg = this.content.backgroundMap().get(char.backgroundId);
    char.equipment = [...(primary?.equipment ?? []), ...(bg?.equipment ?? [])].join(', ');
    return char;
  }
}

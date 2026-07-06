import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CUSTOM_SOURCE_LABELS, Character, CharacterClassEntry, CustomFeature, CustomFeatureSource,
  RECOVERY_LABELS, ResourceRecovery
} from '../../core/models/character.model';
import {
  ABILITY_KEYS, ABILITY_LABELS, ABILITY_SHORT, ACTION_TYPE_ICONS, ACTION_TYPE_SHORT, ActionType, AbilityKey,
  SPELL_SCHOOLS, Spell, actionTypeFromCastingTime
} from '../../core/models/content.model';
import { CharacterService } from '../../core/services/character.service';
import { ContentService } from '../../core/services/content.service';
import { ClassFeatureGroup, FeatureWithSource, RulesService } from '../../core/services/rules.service';
import { ModalComponent } from '../../shared/components/modal';

@Component({
  selector: 'app-character-sheet',
  standalone: true,
  imports: [FormsModule, ModalComponent, NgTemplateOutlet],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.scss'
})
export class CharacterSheetComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private characters = inject(CharacterService);
  readonly content = inject(ContentService);
  readonly rules = inject(RulesService);

  readonly keys = ABILITY_KEYS;
  readonly labels = ABILITY_LABELS;
  readonly short = ABILITY_SHORT;
  readonly schools = SPELL_SCHOOLS;
  readonly actionIcons = ACTION_TYPE_ICONS;
  readonly actionLabels = ACTION_TYPE_SHORT;
  readonly actionFilters: ActionType[] = ['action', 'bonus', 'reaction'];
  readonly recoveryLabels = RECOVERY_LABELS;
  readonly recoveryKeys: ResourceRecovery[] = ['short-rest', 'long-rest', 'daily', 'manual'];
  readonly customSourceLabels = CUSTOM_SOURCE_LABELS;
  readonly customSourceKeys: CustomFeatureSource[] = ['class', 'subclass', 'race', 'background', 'feat', 'homebrew', 'manual'];

  readonly char = signal<Character | null>(null);
  readonly loading = signal(true);

  // Stato modali
  readonly featuresModal = signal(false);
  readonly spellsModal = signal(false);
  readonly classesModal = signal(false);
  readonly featureDetail = signal<FeatureWithSource | null>(null);
  readonly spellDetail = signal<Spell | null>(null);
  readonly expandedFeature = signal('');
  readonly actionFilter = signal<ActionType | null>(null);
  readonly raceModal = signal(false);
  readonly bgModal = signal(false);
  readonly newRaceId = signal('');
  readonly newBgId = signal('');
  readonly addFeatureModal = signal(false);

  // Form abilità personalizzata
  featureForm: CustomFeature = this.emptyFeatureForm();
  catalogKind: 'class' | 'subclass' | 'race' | 'background' = 'class';
  catalogEntityId = '';
  catalogFeatureId = '';

  // Filtri modale incantesimi
  spellLevelFilter: number | null = null;
  spellSchoolFilter = '';
  spellSearch = '';
  spellClassFilter = '';

  readonly allFeatures = computed<FeatureWithSource[]>(() => {
    const c = this.char();
    return c ? this.rules.allFeatures(c) : [];
  });

  readonly favoriteIds = computed<string[]>(() => this.char()?.favoriteFeatureIds ?? []);

  readonly compactFeatures = computed(() =>
    this.rules.sortByFavorite(this.allFeatures(), this.favoriteIds()).slice(0, 6)
  );

  readonly raceFeatures = computed(() => this.allFeatures().filter(f => f.sourceType === 'race'));
  readonly backgroundFeatures = computed(() => this.allFeatures().filter(f => f.sourceType === 'background'));

  readonly classGroups = computed<ClassFeatureGroup[]>(() => {
    const c = this.char();
    return c ? this.rules.classFeatureGroups(c) : [];
  });

  readonly isCaster = computed(() => {
    const c = this.char();
    return c ? this.rules.isCaster(c) : false;
  });

  readonly knownSpells = computed<Spell[]>(() => {
    const c = this.char();
    if (!c) return [];
    return c.knownSpellIds
      .map(id => this.content.spellMap().get(id))
      .filter((s): s is Spell => !!s)
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  });

  readonly availableSpells = computed<Spell[]>(() => {
    const c = this.char();
    return c ? this.rules.availableSpells(c) : [];
  });

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const char = await this.characters.get(id);
    if (!char) {
      void this.router.navigate(['/']);
      return;
    }
    this.char.set(char);
    this.loading.set(false);
  }

  goHome(): void {
    void this.router.navigate(['/']);
  }

  /** Aggiorna il personaggio e salva su IndexedDB. */
  patch(fn: (c: Character) => void): void {
    const c = this.char();
    if (!c) return;
    const copy: Character = structuredClone(c);
    fn(copy);
    this.char.set(copy);
    if (copy.id != null) void this.characters.update(copy.id, copy);
  }

  /** Imposta un campo tramite percorso puntato (es. "traits.ideals"). */
  patchPath(path: string, value: unknown): void {
    this.patch(c => {
      const parts = path.split('.');
      let target = c as unknown as Record<string, unknown>;
      for (const part of parts.slice(0, -1)) target = target[part] as Record<string, unknown>;
      target[parts[parts.length - 1]] = value;
    });
  }

  patchNum(path: string, value: unknown): void {
    this.patchPath(path, Number(value) || 0);
  }

  togglePath(path: string): void {
    this.patch(c => {
      const parts = path.split('.');
      let target = c as unknown as Record<string, unknown>;
      for (const part of parts.slice(0, -1)) target = target[part] as Record<string, unknown>;
      const key = parts[parts.length - 1];
      target[key] = !target[key];
    });
  }

  setDeathSave(kind: 'deathSaveSuccesses' | 'deathSaveFailures', value: number): void {
    this.patch(c => {
      c.combat[kind] = c.combat[kind] >= value ? value - 1 : value;
    });
  }

  patchAttack(index: number, field: 'name' | 'bonus' | 'damage', value: string): void {
    this.patch(c => { c.attacks[index][field] = value; });
  }

  // ---------- Header ----------
  raceName(): string { return this.content.raceMap().get(this.char()?.raceId ?? '')?.name ?? '—'; }
  backgroundName(): string { return this.content.backgroundMap().get(this.char()?.backgroundId ?? '')?.name ?? '—'; }
  className(id: string): string { return this.content.classMap().get(id)?.name ?? id; }
  subclassName(id: string): string { return this.content.subclassMap().get(id)?.name ?? id; }
  skillName(id: string): string { return this.content.skillMap.get(id)?.name ?? id; }

  // ---------- Caratteristiche ----------
  finalScore(key: AbilityKey): number {
    const c = this.char();
    return c ? this.rules.finalScores(c)[key] : 10;
  }

  setBaseScore(key: AbilityKey, value: number): void {
    this.patch(c => { c.stats[key] = Number(value) || 0; });
  }

  modOf(key: AbilityKey): string {
    return this.rules.formatMod(this.rules.abilityMod(this.finalScore(key)));
  }

  // ---------- Abilità / TS ----------
  skillBonus(skillId: string): string {
    const c = this.char();
    return c ? this.rules.formatMod(this.rules.skillBonus(c, skillId)) : '+0';
  }

  isProficient(skillId: string): boolean {
    return this.char()?.skillProficiencies.includes(skillId) ?? false;
  }

  isExpertiseSkill(skillId: string): boolean {
    const c = this.char();
    return c ? this.rules.expertiseSkillIds(c).has(skillId) : false;
  }

  toggleSkill(skillId: string): void {
    this.patch(c => {
      c.skillProficiencies = c.skillProficiencies.includes(skillId)
        ? c.skillProficiencies.filter(id => id !== skillId)
        : [...c.skillProficiencies, skillId];
    });
  }

  saveBonus(key: AbilityKey): string {
    const c = this.char();
    return c ? this.rules.formatMod(this.rules.savingThrowBonus(c, key)) : '+0';
  }

  hasSaveProf(key: AbilityKey): boolean {
    return this.char()?.savingThrowProficiencies.includes(key) ?? false;
  }

  toggleSaveProf(key: AbilityKey): void {
    this.patch(c => {
      c.savingThrowProficiencies = c.savingThrowProficiencies.includes(key)
        ? c.savingThrowProficiencies.filter(k => k !== key)
        : [...c.savingThrowProficiencies, key];
    });
  }

  hasHalfProf(): boolean {
    const c = this.char();
    return c ? this.rules.hasHalfProficiency(c) : false;
  }

  halfProfBonus(): number {
    const c = this.char();
    return c ? Math.floor(this.rules.proficiencyBonus(c) / 2) : 0;
  }

  // ---------- Tipo di azione / Preferiti ----------
  actionTypeOf(fws: FeatureWithSource): ActionType {
    return fws.feature.actionType ?? 'none';
  }

  spellActionType(spell: Spell): ActionType {
    return actionTypeFromCastingTime(spell.castingTime);
  }

  passesFilter(fws: FeatureWithSource): boolean {
    return this.rules.passesActionFilter(fws, this.actionFilter());
  }

  sortFav(features: FeatureWithSource[]): FeatureWithSource[] {
    return this.rules.sortByFavorite(features, this.favoriteIds());
  }

  isFavorite(fws: FeatureWithSource): boolean {
    return this.favoriteIds().includes(fws.feature.id);
  }

  toggleFavorite(fws: FeatureWithSource, event?: Event): void {
    event?.stopPropagation();
    const id = fws.feature.id;
    this.patch(c => {
      const current = c.favoriteFeatureIds ?? [];
      c.favoriteFeatureIds = current.includes(id)
        ? current.filter(f => f !== id)
        : [...current, id];
    });
  }

  // ---------- Multiclasse ----------
  addClassEntry(): void {
    const c = this.char();
    if (!c) return;
    const used = new Set(c.classes.map(e => e.classId));
    const free = this.content.classes().find(cls => !used.has(cls.id));
    if (!free) return;
    this.patch(ch => ch.classes.push({ classId: free.id, subclassId: null, level: 1 }));
  }

  removeClassEntry(index: number): void {
    this.patch(c => c.classes.splice(index, 1));
  }

  setEntryClass(index: number, classId: string): void {
    this.patch(c => {
      c.classes[index].classId = classId;
      c.classes[index].subclassId = null;
    });
  }

  setEntryLevel(index: number, level: number): void {
    const clamped = Math.max(1, Math.min(20, Number(level) || 1));
    this.patch(c => {
      c.classes[index].level = clamped;
      const cls = this.content.classMap().get(c.classes[index].classId);
      if (cls && clamped < cls.subclassLevel) c.classes[index].subclassId = null;
    });
  }

  setEntrySubclass(index: number, subclassId: string | null): void {
    this.patch(c => { c.classes[index].subclassId = subclassId; });
  }

  subclassesFor(classId: string) {
    return this.content.subclassesOf(classId);
  }

  isClassUsed(classId: string, exceptIndex: number): boolean {
    return this.char()?.classes.some((e, i) => i !== exceptIndex && e.classId === classId) ?? false;
  }

  canPickSubclass(entry: CharacterClassEntry): boolean {
    const cls = this.content.classMap().get(entry.classId);
    return !!cls && entry.level >= cls.subclassLevel && this.subclassesFor(entry.classId).length > 0;
  }

  subclassLevelOf(classId: string): number {
    return this.content.classMap().get(classId)?.subclassLevel ?? 1;
  }

  /** Vero se la classe non è di per sé incantatrice: eventuali incantesimi arrivano solo da una sottoclasse magica. */
  grantsSpellsOnlyViaSubclass(classId: string): boolean {
    const cls = this.content.classMap().get(classId);
    if (!cls || cls.spellcasting) return false;
    return this.subclassesFor(classId).some(s => !!s.spellcasting);
  }

  // ---------- Sotto-opzioni ----------
  selectionCap(fws: FeatureWithSource): number {
    return fws.feature.selection
      ? this.rules.selectionCapacity(fws.feature.selection, fws.classEntry?.level ?? 1)
      : 0;
  }

  selectedOptions(fws: FeatureWithSource): string[] {
    return this.char()?.featureSelections[fws.feature.id] ?? [];
  }

  selectedOptionNames(fws: FeatureWithSource): string[] {
    const pool = this.content.poolMap().get(fws.feature.selection?.poolId ?? '');
    return this.selectedOptions(fws).map(id => pool?.options.find(o => o.id === id)?.name ?? id);
  }

  poolOptions(fws: FeatureWithSource) {
    return this.content.poolMap().get(fws.feature.selection?.poolId ?? '')?.options ?? [];
  }

  optionAllowed(fws: FeatureWithSource, optionId: string): boolean {
    const opt = this.poolOptions(fws).find(o => o.id === optionId);
    return (fws.classEntry?.level ?? 1) >= (opt?.prerequisite?.minLevel ?? 0);
  }

  toggleOption(fws: FeatureWithSource, optionId: string): void {
    this.patch(c => {
      const current = c.featureSelections[fws.feature.id] ?? [];
      c.featureSelections[fws.feature.id] = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
    });
  }

  // ---------- Maestria (dalla scheda) ----------
  expertiseFeatures(): FeatureWithSource[] {
    const c = this.char();
    return c ? this.rules.expertiseFeatures(c) : [];
  }

  expertiseCap(fws: FeatureWithSource): number {
    return this.rules.expertiseCapacity(fws.feature, fws.classEntry?.level ?? 1);
  }

  expertiseChosen(fws: FeatureWithSource): string[] {
    return this.char()?.expertiseSelections[fws.feature.id] ?? [];
  }

  eligibleExpertiseSkills(fws: FeatureWithSource): string[] {
    const c = this.char();
    if (!c) return [];
    const eligible = fws.feature.effect?.eligibleSkillIds;
    return eligible?.length
      ? eligible.filter(id => c.skillProficiencies.includes(id))
      : c.skillProficiencies;
  }

  toggleExpertise(fws: FeatureWithSource, skillId: string): void {
    this.patch(c => {
      const current = c.expertiseSelections[fws.feature.id] ?? [];
      c.expertiseSelections[fws.feature.id] = current.includes(skillId)
        ? current.filter(id => id !== skillId)
        : [...current, skillId];
    });
  }

  // ---------- Attacchi ----------
  addAttack(): void {
    this.patch(c => c.attacks.push({ name: '', bonus: '', damage: '' }));
  }

  removeAttack(index: number): void {
    this.patch(c => c.attacks.splice(index, 1));
  }

  // ---------- Incantesimi ----------
  slots(): { level: number; total: number }[] {
    const c = this.char();
    return c ? this.rules.spellSlots(c) : [];
  }

  pact(): { count: number; slotLevel: number } | null {
    const c = this.char();
    return c ? this.rules.pactSlots(c) : null;
  }

  slotsUsed(level: number): number {
    return this.char()?.spellSlotsUsed[level] ?? 0;
  }

  adjustSlot(level: number, delta: number, max: number): void {
    this.patch(c => {
      const used = Math.max(0, Math.min(max, (c.spellSlotsUsed[level] ?? 0) + delta));
      c.spellSlotsUsed[level] = used;
    });
  }

  isKnownSpell(id: string): boolean {
    return this.char()?.knownSpellIds.includes(id) ?? false;
  }

  toggleKnownSpell(id: string): void {
    this.patch(c => {
      if (c.knownSpellIds.includes(id)) {
        c.knownSpellIds = c.knownSpellIds.filter(s => s !== id);
        c.preparedSpellIds = c.preparedSpellIds.filter(s => s !== id);
      } else {
        c.knownSpellIds = [...c.knownSpellIds, id];
      }
    });
  }

  isPrepared(id: string): boolean {
    return this.char()?.preparedSpellIds.includes(id) ?? false;
  }

  togglePrepared(id: string): void {
    this.patch(c => {
      c.preparedSpellIds = c.preparedSpellIds.includes(id)
        ? c.preparedSpellIds.filter(s => s !== id)
        : [...c.preparedSpellIds, id];
    });
  }

  hasPreparedCasting(): boolean {
    const c = this.char();
    return c ? this.rules.hasPreparedCasting(c) : false;
  }

  filteredAvailableSpells(): Spell[] {
    return this.availableSpells().filter(s =>
      (this.spellLevelFilter === null || s.level === this.spellLevelFilter) &&
      (!this.spellSchoolFilter || s.school === this.spellSchoolFilter) &&
      (!this.spellClassFilter || (s.classIds ?? []).includes(this.spellClassFilter) || (s.subclassIds ?? []).some(sub => this.subclassBelongsTo(sub, this.spellClassFilter))) &&
      (!this.spellSearch || s.name.toLowerCase().includes(this.spellSearch.toLowerCase()))
    );
  }

  private subclassBelongsTo(subclassId: string, classId: string): boolean {
    return this.content.subclassMap().get(subclassId)?.classId === classId;
  }

  cantrips(): Spell[] {
    return this.knownSpells().filter(s => s.level === 0);
  }

  leveledSpells(): Spell[] {
    return this.knownSpells().filter(s => s.level > 0);
  }

  // ---------- Background ----------
  background() {
    return this.content.backgroundMap().get(this.char()?.backgroundId ?? '');
  }

  race() {
    return this.content.raceMap().get(this.char()?.raceId ?? '');
  }

  // ---------- Equipaggiamento a elenco ----------
  addEquipmentItem(): void {
    this.patch(c => c.equipment.push(''));
  }

  removeEquipmentItem(index: number): void {
    this.patch(c => c.equipment.splice(index, 1));
  }

  patchEquipmentItem(index: number, value: string): void {
    this.patch(c => { c.equipment[index] = value; });
  }

  // ---------- Cambio razza (con avviso conseguenze) ----------
  openRaceModal(): void {
    this.newRaceId.set(this.char()?.raceId ?? '');
    this.raceModal.set(true);
  }

  newRace() {
    return this.content.raceMap().get(this.newRaceId());
  }

  raceChanged(): boolean {
    return !!this.newRaceId() && this.newRaceId() !== this.char()?.raceId;
  }

  bonusLabel(bonuses: Partial<Record<AbilityKey, number>> | undefined): string {
    if (!bonuses) return '—';
    const parts = (Object.keys(bonuses) as AbilityKey[])
      .filter(k => (bonuses[k] ?? 0) !== 0)
      .map(k => `+${bonuses[k]} ${this.short[k]}`);
    return parts.length ? parts.join(', ') : '—';
  }

  traitNames(raceId: string): string {
    const race = this.content.raceMap().get(raceId);
    return race?.traits.map(t => t.name).join(', ') || '—';
  }

  confirmRaceChange(): void {
    const newRace = this.newRace();
    if (!newRace || !this.raceChanged()) return;
    this.patch(c => {
      c.raceId = newRace.id;
      c.combat.speed = newRace.speed;
    });
    this.raceModal.set(false);
  }

  // ---------- Cambio background (con avviso conseguenze) ----------
  openBgModal(): void {
    this.newBgId.set(this.char()?.backgroundId ?? '');
    this.bgModal.set(true);
  }

  newBg() {
    return this.content.backgroundMap().get(this.newBgId());
  }

  bgChanged(): boolean {
    return !!this.newBgId() && this.newBgId() !== this.char()?.backgroundId;
  }

  bgSkillNames(bgId: string): string {
    const bg = this.content.backgroundMap().get(bgId);
    return bg?.skillProficiencies.map(id => this.skillName(id)).join(', ') || '—';
  }

  confirmBgChange(): void {
    const newBg = this.newBg();
    if (!newBg || !this.bgChanged()) return;
    const oldBg = this.background();
    this.patch(c => {
      // rimuove le competenze del vecchio background e applica quelle del nuovo
      const oldSkills = new Set(oldBg?.skillProficiencies ?? []);
      c.skillProficiencies = c.skillProficiencies.filter(id => !oldSkills.has(id));
      for (const id of newBg.skillProficiencies) {
        if (!c.skillProficiencies.includes(id)) c.skillProficiencies.push(id);
      }
      c.backgroundId = newBg.id;
    });
    this.bgModal.set(false);
  }

  // ---------- Risorse con utilizzi limitati ----------
  addResource(): void {
    this.patch(c => c.resources.push({ name: '', maxUses: 1, used: 0, recovery: 'long-rest' }));
  }

  removeResource(index: number): void {
    this.patch(c => c.resources.splice(index, 1));
  }

  patchResourceName(index: number, value: string): void {
    this.patch(c => { c.resources[index].name = value; });
  }

  patchResourceMax(index: number, value: number): void {
    this.patch(c => {
      const max = Math.max(0, Number(value) || 0);
      c.resources[index].maxUses = max;
      c.resources[index].used = Math.min(c.resources[index].used, max);
    });
  }

  patchResourceRecovery(index: number, value: ResourceRecovery): void {
    this.patch(c => { c.resources[index].recovery = value; });
  }

  adjustResourceUsed(index: number, delta: number): void {
    this.patch(c => {
      const res = c.resources[index];
      res.used = Math.max(0, Math.min(res.maxUses, res.used + delta));
    });
  }

  /** Riposo breve: recupera le risorse a riposo breve. Riposo lungo: tutte tranne quelle manuali. */
  rest(kind: 'short' | 'long'): void {
    this.patch(c => {
      for (const res of c.resources) {
        if (kind === 'short' && res.recovery === 'short-rest') res.used = 0;
        if (kind === 'long' && res.recovery !== 'manual') res.used = 0;
      }
      if (kind === 'long') c.spellSlotsUsed = {};
    });
  }

  // ---------- Abilità personalizzate ----------
  private emptyFeatureForm(): CustomFeature {
    return { id: '', name: '', description: '', source: 'manual', actionType: 'none', maxUses: 0, recovery: 'long-rest' };
  }

  openAddFeature(): void {
    this.featureForm = this.emptyFeatureForm();
    this.catalogKind = 'class';
    this.catalogEntityId = '';
    this.catalogFeatureId = '';
    this.addFeatureModal.set(true);
  }

  catalogEntities(): { id: string; name: string }[] {
    switch (this.catalogKind) {
      case 'class': return this.content.classes();
      case 'subclass': return this.content.subclasses();
      case 'race': return this.content.races();
      case 'background': return this.content.backgrounds();
    }
  }

  catalogFeatures(): { id: string; name: string; description: string; actionType?: ActionType }[] {
    const id = this.catalogEntityId;
    if (!id) return [];
    switch (this.catalogKind) {
      case 'class': return this.content.classMap().get(id)?.features ?? [];
      case 'subclass': return this.content.subclassMap().get(id)?.features ?? [];
      case 'race': return (this.content.raceMap().get(id)?.traits ?? []).map((t, i) => ({ id: `${id}-trait-${i}`, name: t.name, description: t.description, actionType: t.actionType }));
      case 'background': {
        const bg = this.content.backgroundMap().get(id);
        return bg ? [{ id: `${id}-priv`, name: bg.feature.name, description: bg.feature.description, actionType: bg.feature.actionType }] : [];
      }
    }
  }

  applyCatalogPick(): void {
    const picked = this.catalogFeatures().find(f => f.id === this.catalogFeatureId);
    if (!picked) return;
    this.featureForm = {
      ...this.featureForm,
      name: picked.name,
      description: picked.description,
      actionType: picked.actionType ?? 'none',
      source: this.catalogKind
    };
  }

  saveCustomFeature(): void {
    if (!this.featureForm.name.trim()) return;
    const feature: CustomFeature = {
      ...this.featureForm,
      id: `custom-${Date.now()}`,
      maxUses: Number(this.featureForm.maxUses) || 0
    };
    if (!feature.maxUses) {
      delete feature.maxUses;
      delete feature.recovery;
    }
    this.patch(c => c.customFeatures.push(feature));
    this.addFeatureModal.set(false);
  }

  deleteCustomFeature(fws: FeatureWithSource, event?: Event): void {
    event?.stopPropagation();
    const id = fws.custom?.id;
    if (!id) return;
    this.patch(c => {
      c.customFeatures = c.customFeatures.filter(f => f.id !== id);
      c.favoriteFeatureIds = c.favoriteFeatureIds.filter(f => f !== id);
    });
    if (this.featureDetail()?.custom?.id === id) this.featureDetail.set(null);
  }

  customFeaturesList(): FeatureWithSource[] {
    return this.allFeatures().filter(f => f.sourceType === 'custom');
  }

  usesBadge(fws: FeatureWithSource): string {
    const cf = fws.custom;
    if (!cf?.maxUses) return '';
    return `${cf.maxUses}× / ${this.recoveryLabels[cf.recovery ?? 'long-rest']}`;
  }
}

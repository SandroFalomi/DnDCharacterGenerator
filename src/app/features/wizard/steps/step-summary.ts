import { Component, computed, inject } from '@angular/core';
import { WizardService } from '../wizard.service';
import { ContentService } from '../../../core/services/content.service';
import { RulesService } from '../../../core/services/rules.service';
import { ABILITY_KEYS, ABILITY_SHORT } from '../../../core/models/content.model';

@Component({
  selector: 'app-step-summary',
  standalone: true,
  template: `
    <h2 class="mb-2">Riepilogo dell'Eroe</h2>
    <div class="summary-grid">
      <section class="card card-ornate">
        <h3 class="mb-1">⚜ Identità</h3>
        <p class="big-name">{{ wizard.name() || '—' }}</p>
        <div class="stat-chips">
          <span class="badge">{{ raceName() }}</span>
          <span class="badge">{{ backgroundName() }}</span>
          @if (wizard.alignment()) { <span class="badge badge-lvl">{{ wizard.alignment() }}</span> }
        </div>
        <h3 class="mt-2 mb-1">⚔ Classi</h3>
        @for (entry of wizard.classes(); track entry.classId) {
          <p class="small">
            <strong>{{ className(entry.classId) }}</strong> livello {{ entry.level }}
            @if (entry.subclassId) { — {{ subclassName(entry.subclassId) }} }
          </p>
        }
      </section>

      <section class="card card-ornate">
        <h3 class="mb-1">◈ Caratteristiche {{ bonusLabel() }}</h3>
        <div class="scores">
          @for (key of keys; track key) {
            <div class="score-box">
              <span class="score-label">{{ short[key] }}</span>
              <span class="score-value">{{ finalScores()[key] }}</span>
              <span class="score-mod">{{ rules.formatMod(rules.abilityMod(finalScores()[key])) }}</span>
            </div>
          }
        </div>
        <h3 class="mt-2 mb-1">☰ Competenze</h3>
        <div class="stat-chips">
          @for (skillId of wizard.allSkillProficiencies(); track skillId) {
            <span class="badge">{{ skillName(skillId) }}</span>
          }
        </div>
        @if (expertiseList().length > 0) {
          <p class="small muted mt-1">Maestria: {{ expertiseList().join(', ') }}</p>
        }
      </section>

      @if (selectionRecap().length > 0) {
        <section class="card card-ornate">
          <h3 class="mb-1">✦ Scelte Speciali</h3>
          @for (group of selectionRecap(); track group.title) {
            <div class="trait-row">
              <div class="trait-name">{{ group.title }}</div>
              <div class="trait-desc">{{ group.items.join(', ') || 'Nessuna selezione' }}</div>
            </div>
          }
        </section>
      }

      @if (wizard.knownSpellIds().length > 0) {
        <section class="card card-ornate">
          <h3 class="mb-1">✨ Incantesimi</h3>
          <div class="stat-chips">
            @for (id of wizard.knownSpellIds(); track id) {
              <span class="badge badge-arcane">{{ spellName(id) }}</span>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; @media (max-width: 820px) { grid-template-columns: 1fr; } }
    .big-name { font-family: var(--font-deco); font-size: 1.6rem; color: var(--gold-bright); margin-bottom: 8px; }
    .scores { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; @media (max-width: 640px) { grid-template-columns: repeat(3, 1fr); } }
    .score-box {
      display: flex; flex-direction: column; align-items: center; padding: 8px 4px;
      border: 1px solid rgba(201, 168, 76, 0.3); border-radius: 8px; background: rgba(10,10,16,0.5);
    }
    .score-label { font-family: var(--font-title); font-size: 0.7rem; color: var(--gold); }
    .score-value { font-family: var(--font-title); font-size: 1.3rem; color: var(--parchment); }
    .score-mod { font-size: 0.8rem; color: var(--parchment-dim); }
  `]
})
export class StepSummaryComponent {
  readonly wizard = inject(WizardService);
  readonly content = inject(ContentService);
  readonly rules = inject(RulesService);
  readonly keys = ABILITY_KEYS;
  readonly short = ABILITY_SHORT;

  readonly finalScores = computed(() => this.rules.finalScores(this.wizard.draft()));

  bonusLabel(): string {
    if (this.wizard.applyRacialBonuses()) return '(con bonus razziali)';
    return Object.keys(this.wizard.customAbilityBonuses()).length > 0 ? '(con bonus liberi)' : '';
  }

  raceName(): string { return this.rules.effectiveRace(this.wizard.raceId(), this.wizard.subraceId())?.name ?? '—'; }
  backgroundName(): string { return this.content.backgroundMap().get(this.wizard.backgroundId())?.name ?? '—'; }
  className(id: string): string { return this.content.classMap().get(id)?.name ?? id; }
  subclassName(id: string): string { return this.content.subclassMap().get(id)?.name ?? id; }
  skillName(id: string): string { return this.content.skillMap.get(id)?.name ?? id; }
  spellName(id: string): string { return this.content.spellMap().get(id)?.name ?? id; }

  expertiseList(): string[] {
    return Object.values(this.wizard.expertiseSelections()).flat().map(id => this.skillName(id));
  }

  selectionRecap(): { title: string; items: string[] }[] {
    const result: { title: string; items: string[] }[] = [];
    for (const fws of this.rules.selectableFeatures(this.wizard.draft())) {
      const pool = this.content.poolMap().get(fws.feature.selection!.poolId);
      const chosen = this.wizard.featureSelections()[fws.feature.id] ?? [];
      result.push({
        title: fws.feature.name,
        items: chosen.map(id => pool?.options.find(o => o.id === id)?.name ?? id)
      });
    }
    return result;
  }
}

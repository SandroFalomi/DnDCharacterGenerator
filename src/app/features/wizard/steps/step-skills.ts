import { Component, computed, inject } from '@angular/core';
import { WizardService } from '../wizard.service';
import { ContentService } from '../../../core/services/content.service';
import { RulesService, FeatureWithSource } from '../../../core/services/rules.service';
import { ABILITY_SHORT } from '../../../core/models/content.model';

@Component({
  selector: 'app-step-skills',
  standalone: true,
  template: `
    <h2 class="mb-2">Competenze nelle Abilità</h2>

    @if (primaryClass(); as cls) {
      <div class="card flex-between mb-2 counter-bar">
        <span>Scelte di classe ({{ cls.name }}): <strong class="gold">{{ wizard.chosenSkills().length }}</strong> / {{ cls.skillChoices.count }}</span>
        <span class="small muted">Le abilità del background sono già assegnate</span>
      </div>
    }

    <div class="skills-grid">
      @for (skill of content.skills; track skill.id) {
        <label class="skill-row card"
               [class.locked]="isFromBackground(skill.id)"
               [class.unavailable]="!canChoose(skill.id) && !isChosen(skill.id) && !isFromBackground(skill.id)">
          <input type="checkbox"
                 [checked]="isFromBackground(skill.id) || isChosen(skill.id)"
                 [disabled]="isFromBackground(skill.id) || (!isChosen(skill.id) && !canChoose(skill.id))"
                 (change)="toggle(skill.id)" />
          <span class="skill-name">{{ skill.name }}</span>
          <span class="badge badge-lvl">{{ short[skill.ability] }}</span>
          @if (isFromBackground(skill.id)) { <span class="badge">Background</span> }
        </label>
      }
    </div>

    <!-- Maestria: scelta guidata delle abilità con doppio bonus competenza -->
    @for (fws of expertiseFeatures(); track fws.feature.id) {
      <section class="card card-ornate mt-3">
        <h3>✦ {{ fws.feature.name }} <span class="muted small">({{ fws.source }})</span></h3>
        <p class="small muted mb-2">{{ fws.feature.description }}</p>
        <p class="small mb-1">
          Selezionate: <strong class="gold">{{ expertiseCount(fws) }}</strong>
          / {{ expertiseCap(fws) }}
        </p>
        <div class="skills-grid">
          @for (skillId of eligibleExpertise(fws); track skillId) {
            <label class="skill-row card">
              <input type="checkbox"
                     [checked]="isExpertise(fws.feature.id, skillId)"
                     [disabled]="!isExpertise(fws.feature.id, skillId) && expertiseCount(fws) >= expertiseCap(fws)"
                     (change)="toggleExpertise(fws.feature.id, skillId)" />
              <span class="skill-name">{{ skillName(skillId) }}</span>
              <span class="badge">×2 competenza</span>
            </label>
          }
        </div>
        @if (eligibleExpertise(fws).length === 0) {
          <p class="small muted">Prima seleziona le competenze: la Maestria si applica alle abilità in cui hai già competenza.</p>
        }
      </section>
    }

    <!-- Sistema generico: sotto-opzioni selezionabili (manovre, discipline...) -->
    @for (fws of selectableFeatures(); track fws.feature.id) {
      <section class="card card-ornate mt-3 selectable-box">
        <h3>✦ {{ fws.feature.name }} <span class="muted small">({{ fws.source }})</span></h3>
        <p class="small muted mb-2">{{ fws.feature.description }}</p>
        <p class="small mb-1">
          Selezionate: <strong class="gold">{{ optionCount(fws) }}</strong>
          / {{ selectionCap(fws) }}
        </p>
        <div class="options-grid">
          @for (opt of poolOptions(fws); track opt.id) {
            <label class="skill-row card" [class.unavailable]="!optionAllowed(fws, opt.id)">
              <input type="checkbox"
                     [checked]="isOption(fws.feature.id, opt.id)"
                     [disabled]="!isOption(fws.feature.id, opt.id) && (!optionAllowed(fws, opt.id) || optionCount(fws) >= selectionCap(fws))"
                     (change)="toggleOption(fws.feature.id, opt.id)" />
              <span class="opt-body">
                <span class="skill-name">{{ opt.name }}</span>
                <span class="small muted">{{ opt.description }}</span>
                @if (opt.prerequisite?.minLevel) { <span class="badge badge-lvl">Liv. {{ opt.prerequisite?.minLevel }}+</span> }
              </span>
            </label>
          }
        </div>
      </section>
    }
  `,
  styles: [`
    .counter-bar { padding: 12px 18px; }
    .gold { color: var(--gold-bright); }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 8px; }
    .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; @media (max-width: 720px) { grid-template-columns: 1fr; } }
    .skill-row {
      display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer;
      transition: border-color 0.2s;
    }
    .skill-row:hover { border-color: var(--gold-dim); }
    .skill-row.locked { opacity: 0.85; border-color: rgba(74, 124, 89, 0.5); }
    .skill-row.unavailable { opacity: 0.45; }
    .skill-name { font-family: var(--font-title); font-size: 0.88rem; flex: 1; }
    .opt-body { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .selectable-box { border-color: rgba(109, 90, 158, 0.45); }
  `]
})
export class StepSkillsComponent {
  readonly wizard = inject(WizardService);
  readonly content = inject(ContentService);
  private rules = inject(RulesService);
  readonly short = ABILITY_SHORT;

  readonly primaryClass = computed(() => this.wizard.primaryClass());

  readonly expertiseFeatures = computed(() => this.rules.expertiseFeatures(this.wizard.draft()));
  readonly selectableFeatures = computed(() => this.rules.selectableFeatures(this.wizard.draft()));

  isFromBackground(skillId: string): boolean {
    return this.wizard.backgroundSkills().includes(skillId);
  }

  isChosen(skillId: string): boolean {
    return this.wizard.chosenSkills().includes(skillId);
  }

  canChoose(skillId: string): boolean {
    const cls = this.primaryClass();
    if (!cls) return false;
    if (!cls.skillChoices.from.includes(skillId)) return false;
    return this.isChosen(skillId) || this.wizard.chosenSkills().length < cls.skillChoices.count;
  }

  toggle(skillId: string): void {
    if (this.isFromBackground(skillId)) return;
    this.wizard.chosenSkills.update(list =>
      list.includes(skillId) ? list.filter(id => id !== skillId) : [...list, skillId]
    );
  }

  skillName(id: string): string {
    return this.content.skillMap.get(id)?.name ?? id;
  }

  // ---------- Maestria ----------
  expertiseCount(fws: FeatureWithSource): number {
    return (this.wizard.expertiseSelections()[fws.feature.id] ?? []).length;
  }

  optionCount(fws: FeatureWithSource): number {
    return (this.wizard.featureSelections()[fws.feature.id] ?? []).length;
  }

  expertiseCap(fws: FeatureWithSource): number {
    return this.rules.expertiseCapacity(fws.feature, fws.classEntry?.level ?? 1);
  }

  eligibleExpertise(fws: FeatureWithSource): string[] {
    const eligible = fws.feature.effect?.eligibleSkillIds;
    const proficient = this.wizard.allSkillProficiencies();
    return eligible?.length ? eligible.filter(id => proficient.includes(id)) : proficient;
  }

  isExpertise(featureId: string, skillId: string): boolean {
    return (this.wizard.expertiseSelections()[featureId] ?? []).includes(skillId);
  }

  toggleExpertise(featureId: string, skillId: string): void {
    this.wizard.expertiseSelections.update(map => {
      const current = map[featureId] ?? [];
      const next = current.includes(skillId) ? current.filter(id => id !== skillId) : [...current, skillId];
      return { ...map, [featureId]: next };
    });
  }

  // ---------- Sotto-opzioni ----------
  selectionCap(fws: FeatureWithSource): number {
    return fws.feature.selection
      ? this.rules.selectionCapacity(fws.feature.selection, fws.classEntry?.level ?? 1)
      : 0;
  }

  poolOptions(fws: FeatureWithSource) {
    const pool = this.content.poolMap().get(fws.feature.selection?.poolId ?? '');
    return pool?.options ?? [];
  }

  optionAllowed(fws: FeatureWithSource, optionId: string): boolean {
    const opt = this.poolOptions(fws).find(o => o.id === optionId);
    const minLevel = opt?.prerequisite?.minLevel ?? 0;
    return (fws.classEntry?.level ?? 1) >= minLevel;
  }

  isOption(featureId: string, optionId: string): boolean {
    return (this.wizard.featureSelections()[featureId] ?? []).includes(optionId);
  }

  toggleOption(featureId: string, optionId: string): void {
    this.wizard.featureSelections.update(map => {
      const current = map[featureId] ?? [];
      const next = current.includes(optionId) ? current.filter(id => id !== optionId) : [...current, optionId];
      return { ...map, [featureId]: next };
    });
  }
}

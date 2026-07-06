import { Component, computed, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { WizardService } from '../wizard.service';
import { ContentService } from '../../../core/services/content.service';
import { RulesService } from '../../../core/services/rules.service';
import { ABILITY_SHORT, AbilityKey } from '../../../core/models/content.model';

@Component({
  selector: 'app-step-race',
  standalone: true,
  animations: [
    trigger('raceTransition', [
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(0.96)' }),
        animate('260ms cubic-bezier(0.2, 0.8, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ],
  template: `
    <h2 class="mb-2">Scegli la tua Razza</h2>
    <div class="list-detail">
      <aside class="select-list">
        @for (race of content.races(); track race.id) {
          <button type="button" class="select-item" [class.selected]="wizard.raceId() === race.id" (click)="selectRace(race.id)">
            <span class="icon">{{ race.icon }}</span> {{ race.name }}
            @if (race.subraces?.length) { <span class="badge badge-lvl" style="margin-left:auto">{{ race.subraces?.length }} var.</span> }
          </button>
        }
      </aside>
      @if (selected(); as race) {
        <section class="detail-panel card card-ornate" [@raceTransition]="race.id + (wizard.subraceId() ?? '')">
          <div class="detail-hero">
            <div class="hero-icon">{{ race.icon }}</div>
            <div>
              <h2>{{ effective()?.name ?? race.name }}</h2>
              <p class="sub">{{ race.description }}</p>
            </div>
          </div>

          @if (race.subraces?.length) {
            <div class="subrace-picker">
              <span class="picker-label">Sottorazza:</span>
              @for (sub of race.subraces ?? []; track sub.id) {
                <button type="button" class="subrace-chip" [class.selected]="wizard.subraceId() === sub.id"
                        (click)="wizard.subraceId.set(sub.id)">
                  {{ sub.name }}
                </button>
              }
            </div>
            @if (!wizard.subraceId()) {
              <p class="small warning-note">⚠ Scegli una sottorazza per continuare.</p>
            } @else if (subraceDescription()) {
              <p class="small muted sub-desc">{{ subraceDescription() }}</p>
            }
          }

          <div class="stat-chips">
            @for (bonus of bonuses(); track bonus.key) {
              <span class="badge">+{{ bonus.value }} {{ short[bonus.key] }}</span>
            }
            <span class="badge badge-lvl">Taglia {{ race.size }}</span>
            <span class="badge badge-lvl">Velocità {{ effective()?.speed ?? race.speed }} m</span>
          </div>
          <p class="small muted mb-2">Lingue: {{ race.languages.join(', ') }}</p>
          @for (trait of effective()?.traits ?? race.traits; track trait.name) {
            <div class="trait-row">
              <div class="trait-name">{{ trait.name }}</div>
              <div class="trait-desc">{{ trait.description }}</div>
            </div>
          }
        </section>
      } @else {
        <div class="detail-panel card empty-state"><span class="rune">🧝</span>Seleziona una razza per scoprirne i segreti.</div>
      }
    </div>
  `,
  styles: [`
    .subrace-picker {
      display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;
      padding: 10px 12px; border: 1px dashed rgba(109, 90, 158, 0.5); border-radius: 8px;
      background: rgba(109, 90, 158, 0.07);
    }
    .picker-label { font-family: var(--font-title); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #b3a1e0; }
    .subrace-chip {
      font-family: var(--font-title); font-size: 0.85rem; padding: 6px 14px; border-radius: 20px; cursor: pointer;
      background: rgba(26, 26, 46, 0.6); border: 1px solid rgba(201, 168, 76, 0.25); color: var(--parchment);
      transition: all 0.2s;
    }
    .subrace-chip:hover { border-color: var(--gold-dim); }
    .subrace-chip.selected {
      border-color: var(--gold); color: var(--gold-bright);
      background: rgba(201, 168, 76, 0.12); box-shadow: 0 0 10px rgba(201, 168, 76, 0.2);
    }
    .warning-note { color: #e8b34a; margin-bottom: 8px; }
    .sub-desc { font-style: italic; margin-bottom: 8px; }
  `]
})
export class StepRaceComponent {
  readonly wizard = inject(WizardService);
  readonly content = inject(ContentService);
  private rules = inject(RulesService);
  readonly short = ABILITY_SHORT;

  readonly selected = computed(() => this.content.raceMap().get(this.wizard.raceId()));
  readonly effective = computed(() => this.rules.effectiveRace(this.wizard.raceId(), this.wizard.subraceId()));

  selectRace(raceId: string): void {
    if (this.wizard.raceId() !== raceId) this.wizard.subraceId.set(null);
    this.wizard.raceId.set(raceId);
  }

  subraceDescription(): string {
    return this.effective()?.subrace?.description ?? '';
  }

  readonly bonuses = computed(() => {
    const eff = this.effective();
    if (!eff) return [];
    return (Object.keys(eff.abilityBonuses) as AbilityKey[])
      .map(key => ({ key, value: eff.abilityBonuses[key] ?? 0 }))
      .filter(b => b.value !== 0);
  });
}

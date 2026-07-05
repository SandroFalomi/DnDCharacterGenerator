import { Component, computed, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { WizardService } from '../wizard.service';
import { ContentService } from '../../../core/services/content.service';
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
          <button type="button" class="select-item" [class.selected]="wizard.raceId() === race.id" (click)="wizard.raceId.set(race.id)">
            <span class="icon">{{ race.icon }}</span> {{ race.name }}
          </button>
        }
      </aside>
      @if (selected(); as race) {
        <section class="detail-panel card card-ornate" [@raceTransition]="race.id">
          <div class="detail-hero">
            <div class="hero-icon">{{ race.icon }}</div>
            <div>
              <h2>{{ race.name }}</h2>
              <p class="sub">{{ race.description }}</p>
            </div>
          </div>
          <div class="stat-chips">
            @for (bonus of bonuses(); track bonus.key) {
              <span class="badge">+{{ bonus.value }} {{ short[bonus.key] }}</span>
            }
            <span class="badge badge-lvl">Taglia {{ race.size }}</span>
            <span class="badge badge-lvl">Velocità {{ race.speed }} m</span>
          </div>
          <p class="small muted mb-2">Lingue: {{ race.languages.join(', ') }}</p>
          @for (trait of race.traits; track trait.name) {
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
  `
})
export class StepRaceComponent {
  readonly wizard = inject(WizardService);
  readonly content = inject(ContentService);
  readonly short = ABILITY_SHORT;

  readonly selected = computed(() => this.content.raceMap().get(this.wizard.raceId()));

  readonly bonuses = computed(() => {
    const race = this.selected();
    if (!race) return [];
    return (Object.keys(race.abilityBonuses) as AbilityKey[])
      .map(key => ({ key, value: race.abilityBonuses[key] ?? 0 }))
      .filter(b => b.value !== 0);
  });
}

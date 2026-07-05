import { Component, computed, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { WizardService } from '../wizard.service';
import { ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-step-background',
  standalone: true,
  animations: [
    trigger('bgTransition', [
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(0.96)' }),
        animate('260ms cubic-bezier(0.2, 0.8, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ],
  template: `
    <h2 class="mb-2">Scegli il tuo Background</h2>
    <div class="list-detail">
      <aside class="select-list">
        @for (bg of content.backgrounds(); track bg.id) {
          <button type="button" class="select-item" [class.selected]="wizard.backgroundId() === bg.id" (click)="wizard.backgroundId.set(bg.id)">
            <span class="icon">{{ bg.icon }}</span> {{ bg.name }}
          </button>
        }
      </aside>
      @if (selected(); as bg) {
        <section class="detail-panel card card-ornate" [@bgTransition]="bg.id">
          <div class="detail-hero">
            <div class="hero-icon">{{ bg.icon }}</div>
            <div>
              <h2>{{ bg.name }}</h2>
              <p class="sub">{{ bg.description }}</p>
            </div>
          </div>
          <div class="stat-chips">
            @for (skillId of bg.skillProficiencies; track skillId) {
              <span class="badge">{{ skillName(skillId) }}</span>
            }
            @for (tool of bg.toolProficiencies; track tool) { <span class="badge badge-lvl">{{ tool }}</span> }
            @for (lang of bg.languages; track lang) { <span class="badge badge-arcane">{{ lang }}</span> }
          </div>
          <div class="trait-row">
            <div class="trait-name">{{ bg.feature.name }}</div>
            <div class="trait-desc">{{ bg.feature.description }}</div>
          </div>
          <div class="trait-row">
            <div class="trait-name">Equipaggiamento</div>
            <div class="trait-desc">{{ bg.equipment.join(', ') }}</div>
          </div>
        </section>
      } @else {
        <div class="detail-panel card empty-state"><span class="rune">📜</span>Seleziona un background per conoscerne la storia.</div>
      }
    </div>
  `
})
export class StepBackgroundComponent {
  readonly wizard = inject(WizardService);
  readonly content = inject(ContentService);

  readonly selected = computed(() => this.content.backgroundMap().get(this.wizard.backgroundId()));

  skillName(id: string): string {
    return this.content.skillMap.get(id)?.name ?? id;
  }
}

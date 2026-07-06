import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { WizardService } from './wizard.service';
import { RulesService } from '../../core/services/rules.service';
import { CharacterService } from '../../core/services/character.service';
import { ContentService } from '../../core/services/content.service';
import { StepNameComponent } from './steps/step-name';
import { StepRaceComponent } from './steps/step-race';
import { StepBackgroundComponent } from './steps/step-background';
import { StepClassComponent } from './steps/step-class';
import { StepStatsComponent } from './steps/step-stats';
import { StepSkillsComponent } from './steps/step-skills';
import { StepSpellsComponent } from './steps/step-spells';
import { StepSummaryComponent } from './steps/step-summary';

type StepId = 'name' | 'race' | 'background' | 'class' | 'stats' | 'skills' | 'spells' | 'summary';

const STEP_LABELS: Record<StepId, string> = {
  name: 'Nome', race: 'Razza', background: 'Background', class: 'Classe',
  stats: 'Caratteristiche', skills: 'Abilità', spells: 'Incantesimi', summary: 'Riepilogo'
};

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [
    StepNameComponent, StepRaceComponent, StepBackgroundComponent, StepClassComponent,
    StepStatsComponent, StepSkillsComponent, StepSpellsComponent, StepSummaryComponent
  ],
  animations: [
    trigger('stepTransition', [
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(0.98) translateY(10px)' }),
        animate('300ms cubic-bezier(0.2, 0.8, 0.3, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="page">
      <div class="wizard-progress">
        @for (step of steps(); track step; let i = $index) {
          <div class="progress-step"
               [class.done]="i < currentIndex()"
               [class.current]="i === currentIndex()">
            <span class="dot">{{ i < currentIndex() ? '✓' : i + 1 }}</span>
            <span class="label">{{ labels[step] }}</span>
          </div>
          @if (i < steps().length - 1) { <div class="progress-line" [class.done]="i < currentIndex()"></div> }
        }
      </div>

      <div class="step-container" [@stepTransition]="current()">
        @switch (current()) {
          @case ('name') { <app-step-name /> }
          @case ('race') { <app-step-race /> }
          @case ('background') { <app-step-background /> }
          @case ('class') { <app-step-class /> }
          @case ('stats') { <app-step-stats /> }
          @case ('skills') { <app-step-skills /> }
          @case ('spells') { <app-step-spells /> }
          @case ('summary') { <app-step-summary /> }
        }
      </div>

      <div class="wizard-nav">
        <button type="button" class="btn btn-ghost" (click)="back()">
          {{ currentIndex() === 0 ? '✕ Annulla' : '← Indietro' }}
        </button>
        @if (current() !== 'summary') {
          <button type="button" class="btn btn-primary" [disabled]="!stepValid()" (click)="next()">Avanti →</button>
        } @else {
          <button type="button" class="btn btn-primary" [disabled]="creating()" (click)="create()">✓ Crea Personaggio</button>
        }
      </div>
    </div>
  `,
  styles: [`
    .wizard-progress { display: flex; align-items: center; justify-content: center; margin: 10px 0 30px; flex-wrap: wrap; gap: 2px; }
    .progress-step { display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 78px; }
    .dot {
      width: 34px; height: 34px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-title); font-size: 0.9rem;
      border: 1px solid rgba(201, 168, 76, 0.3); color: var(--ink);
      background: var(--bg-panel); transition: all 0.3s;
    }
    .progress-step.current .dot {
      border-color: var(--gold); color: var(--gold-bright);
      box-shadow: 0 0 16px rgba(201, 168, 76, 0.4);
      animation: glowPulse 2.4s infinite;
    }
    .progress-step.done .dot { border-color: var(--success); color: #9fd0ae; background: rgba(74, 124, 89, 0.15); }
    .label { font-family: var(--font-title); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink); }
    .progress-step.current .label { color: var(--gold-bright); }
    .progress-step.done .label { color: #9fd0ae; }
    .progress-line { flex: 0 0 26px; height: 1px; background: rgba(201, 168, 76, 0.25); margin-bottom: 18px; }
    .progress-line.done { background: var(--success); }
    .step-container { min-height: 420px; }
    .wizard-nav { display: flex; justify-content: space-between; margin-top: 26px; }
  `]
})
export class WizardComponent implements OnInit {
  readonly wizard = inject(WizardService);
  private rules = inject(RulesService);
  private content = inject(ContentService);
  private characters = inject(CharacterService);
  private router = inject(Router);

  readonly labels = STEP_LABELS;
  readonly currentIndex = signal(0);
  readonly creating = signal(false);

  readonly steps = computed<StepId[]>(() => {
    const base: StepId[] = ['name', 'race', 'background', 'class', 'stats', 'skills'];
    if (this.rules.isCaster(this.wizard.draft())) base.push('spells');
    base.push('summary');
    return base;
  });

  readonly current = computed<StepId>(() => this.steps()[Math.min(this.currentIndex(), this.steps().length - 1)]);

  readonly stepValid = computed<boolean>(() => {
    const w = this.wizard;
    switch (this.current()) {
      case 'name': return w.name().trim().length > 0;
      case 'race': {
        if (!w.raceId()) return false;
        const race = this.wizardContentRace();
        return !race?.subraces?.length || !!w.subraceId();
      }
      case 'background': return !!w.backgroundId();
      case 'class': return w.classes().length > 0 && w.classes().every(c => c.level >= 1 && !!c.classId);
      case 'stats': return w.racialChoiceMade();
      case 'skills': {
        const primary = w.primaryClass();
        if (!primary) return true;
        return w.chosenSkills().length === primary.skillChoices.count;
      }
      default: return true;
    }
  });

  ngOnInit(): void {
    this.wizard.reset();
  }

  private wizardContentRace() {
    return this.content.raceMap().get(this.wizard.raceId());
  }

  next(): void {
    if (this.currentIndex() < this.steps().length - 1) this.currentIndex.update(i => i + 1);
  }

  back(): void {
    if (this.currentIndex() === 0) {
      void this.router.navigate(['/']);
    } else {
      this.currentIndex.update(i => i - 1);
    }
  }

  async create(): Promise<void> {
    this.creating.set(true);
    try {
      const char = this.wizard.build();
      const id = await this.characters.add(char);
      void this.router.navigate(['/character', id]);
    } finally {
      this.creating.set(false);
    }
  }
}

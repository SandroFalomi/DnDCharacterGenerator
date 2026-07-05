import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WizardService } from '../wizard.service';
import { ContentService } from '../../../core/services/content.service';
import { RulesService } from '../../../core/services/rules.service';
import { SPELL_SCHOOLS, Spell } from '../../../core/models/content.model';

@Component({
  selector: 'app-step-spells',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2 class="mb-2">Scegli gli Incantesimi</h2>
    <p class="muted small mb-2">Sono mostrati solo gli incantesimi disponibili per le classi e sottoclassi scelte.</p>

    <div class="filters card mb-2">
      <div class="form-field">
        <label>Livello</label>
        <select [(ngModel)]="levelFilter">
          <option [ngValue]="null">Tutti</option>
          <option [ngValue]="0">Trucchetti</option>
          @for (lvl of [1,2,3,4,5,6,7,8,9]; track lvl) { <option [ngValue]="lvl">Livello {{ lvl }}</option> }
        </select>
      </div>
      <div class="form-field">
        <label>Scuola</label>
        <select [(ngModel)]="schoolFilter">
          <option value="">Tutte</option>
          @for (school of schools; track school) { <option [value]="school">{{ school }}</option> }
        </select>
      </div>
      <div class="form-field">
        <label>Cerca</label>
        <input type="text" [(ngModel)]="search" placeholder="Nome incantesimo…" />
      </div>
      <div class="counter">
        <span class="badge">Conosciuti: {{ wizard.knownSpellIds().length }}</span>
      </div>
    </div>

    @if (filtered().length === 0) {
      <div class="empty-state card"><span class="rune">✨</span>Nessun incantesimo corrisponde ai filtri.</div>
    }
    <div class="spell-list">
      @for (spell of filtered(); track spell.id) {
        <div class="spell-row card" [class.known]="isKnown(spell.id)">
          <label class="spell-main">
            <input type="checkbox" [checked]="isKnown(spell.id)" (change)="toggleSpell(spell.id)" />
            <span class="spell-name">{{ spell.name }}</span>
            <span class="badge badge-lvl">{{ spell.level === 0 ? 'Trucchetto' : 'Liv. ' + spell.level }}</span>
            <span class="badge badge-arcane">{{ spell.school }}</span>
            @if (spell.concentration) { <span class="badge">Conc.</span> }
          </label>
          <button type="button" class="btn btn-ghost btn-sm" (click)="expanded.set(expanded() === spell.id ? '' : spell.id)">
            {{ expanded() === spell.id ? 'Chiudi' : 'Dettagli' }}
          </button>
        </div>
        @if (expanded() === spell.id) {
          <div class="spell-detail card fade-in">
            <div class="stat-chips">
              <span class="badge badge-lvl">Lancio: {{ spell.castingTime }}</span>
              <span class="badge badge-lvl">Gittata: {{ spell.range }}</span>
              <span class="badge badge-lvl">Componenti: {{ spell.components }}</span>
              <span class="badge badge-lvl">Durata: {{ spell.duration }}</span>
            </div>
            <p class="small">{{ spell.description }}</p>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .filters { display: grid; grid-template-columns: 1fr 1fr 2fr auto; gap: 14px; align-items: end; padding: 16px;
      @media (max-width: 780px) { grid-template-columns: 1fr 1fr; } }
    .filters .form-field { margin-bottom: 0; }
    .counter { padding-bottom: 8px; }
    .spell-list { display: flex; flex-direction: column; gap: 8px; }
    .spell-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; }
    .spell-row.known { border-color: var(--gold); box-shadow: 0 0 12px rgba(201, 168, 76, 0.15); }
    .spell-main { display: flex; align-items: center; gap: 10px; cursor: pointer; flex-wrap: wrap; }
    .spell-name { font-family: var(--font-title); }
    .spell-detail { margin: -4px 0 4px; padding: 12px 18px; border-color: rgba(109, 90, 158, 0.4); }
  `]
})
export class StepSpellsComponent {
  readonly wizard = inject(WizardService);
  readonly content = inject(ContentService);
  private rules = inject(RulesService);

  readonly schools = SPELL_SCHOOLS;
  levelFilter: number | null = null;
  schoolFilter = '';
  search = '';
  readonly expanded = signal('');

  readonly available = computed<Spell[]>(() => this.rules.availableSpells(this.wizard.draft()));

  filtered(): Spell[] {
    return this.available().filter(s =>
      (this.levelFilter === null || s.level === this.levelFilter) &&
      (!this.schoolFilter || s.school === this.schoolFilter) &&
      (!this.search || s.name.toLowerCase().includes(this.search.toLowerCase()))
    );
  }

  isKnown(id: string): boolean {
    return this.wizard.knownSpellIds().includes(id);
  }

  toggleSpell(id: string): void {
    this.wizard.knownSpellIds.update(list =>
      list.includes(id) ? list.filter(s => s !== id) : [...list, id]
    );
  }
}

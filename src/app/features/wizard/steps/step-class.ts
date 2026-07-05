import { Component, computed, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { WizardService } from '../wizard.service';
import { ContentService } from '../../../core/services/content.service';
import { ABILITY_SHORT } from '../../../core/models/content.model';
import { CharacterClassEntry } from '../../../core/models/character.model';

@Component({
  selector: 'app-step-class',
  standalone: true,
  imports: [FormsModule],
  animations: [
    trigger('classTransition', [
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(0.96)' }),
        animate('260ms cubic-bezier(0.2, 0.8, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ],
  template: `
    <h2 class="mb-2">Scegli la tua Classe</h2>
    <div class="list-detail">
      <aside class="select-list">
        @for (cls of content.classes(); track cls.id) {
          <button type="button" class="select-item" [class.selected]="primaryId() === cls.id" (click)="selectPrimary(cls.id)">
            <span class="icon">{{ cls.icon }}</span> {{ cls.name }}
          </button>
        }
      </aside>

      <div>
        @if (primary(); as cls) {
          <section class="detail-panel card card-ornate" [@classTransition]="cls.id">
            <div class="detail-hero">
              <div class="hero-icon">{{ cls.icon }}</div>
              <div>
                <h2>{{ cls.name }}</h2>
                <p class="sub">{{ cls.description }}</p>
              </div>
            </div>
            <div class="stat-chips">
              <span class="badge">Dado Vita d{{ cls.hitDie }}</span>
              <span class="badge">TS: {{ savingThrows(cls.savingThrows) }}</span>
              @if (cls.spellcasting) { <span class="badge badge-arcane">Incantatore</span> }
            </div>
            <p class="small muted">Competenze: {{ [cls.armorProficiencies.join(', '), cls.weaponProficiencies.join(', ')].join(' · ') || '—' }}</p>
            <p class="small muted mb-2">Equipaggiamento: {{ cls.equipment.join(', ') }}</p>

            <div class="grid-2">
              <div class="form-field">
                <label>Livello di {{ cls.name }}</label>
                <input type="number" min="1" max="20" [ngModel]="entries()[0].level" (ngModelChange)="setLevel(0, $event)" />
              </div>
              @if (subclassesFor(cls.id).length > 0) {
                <div class="form-field">
                  <label>{{ cls.subclassTitle }} <span class="muted">(dal liv. {{ cls.subclassLevel }})</span></label>
                  <select [ngModel]="entries()[0].subclassId" (ngModelChange)="setSubclass(0, $event)"
                          [disabled]="entries()[0].level < cls.subclassLevel">
                    <option [ngValue]="null">— Nessuna —</option>
                    @for (sub of subclassesFor(cls.id); track sub.id) {
                      <option [ngValue]="sub.id">{{ sub.name }}</option>
                    }
                  </select>
                  @if (entries()[0].level < cls.subclassLevel) {
                    <span class="hint lock-hint">🔒 Si sblocca al livello {{ cls.subclassLevel }}
                      @if (grantsSpellsOnlyViaSubclass(cls.id)) { — anche gli eventuali incantesimi arrivano da lì }
                    </span>
                  }
                </div>
              }
            </div>

            <div class="trait-row">
              <div class="trait-name">Abilità al 1° livello</div>
              @for (feature of firstLevelFeatures(cls.id); track feature.id) {
                <div class="trait-desc"><strong>{{ feature.name }}</strong> — {{ feature.description }}</div>
              }
            </div>
          </section>

          <section class="card mt-2 multiclass-box">
            <div class="flex-between mb-1">
              <h3>⚔ Multiclasse</h3>
              <button type="button" class="btn btn-ghost btn-sm" (click)="addSecondary()">+ Aggiungi Classe Secondaria</button>
            </div>
            @if (entries().length === 1) {
              <p class="muted small">Nessuna classe secondaria. Puoi aggiungerne una o più per creare un personaggio multiclasse.</p>
            }
            @for (entry of entries(); track $index; let i = $index) {
              @if (i > 0) {
                <div class="secondary-row">
                  <div class="form-field">
                    <label>Classe</label>
                    <select [ngModel]="entry.classId" (ngModelChange)="setClass(i, $event)">
                      @for (c of content.classes(); track c.id) {
                        <option [value]="c.id" [disabled]="isUsed(c.id, i)">{{ c.name }}</option>
                      }
                    </select>
                  </div>
                  <div class="form-field">
                    <label>Livello</label>
                    <input type="number" min="1" max="20" [ngModel]="entry.level" (ngModelChange)="setLevel(i, $event)" />
                  </div>
                  <div class="form-field">
                    <label>Sottoclasse</label>
                    <select [ngModel]="entry.subclassId" (ngModelChange)="setSubclass(i, $event)"
                            [disabled]="!canPickSubclass(entry)">
                      <option [ngValue]="null">— Nessuna —</option>
                      @for (sub of subclassesFor(entry.classId); track sub.id) {
                        <option [ngValue]="sub.id">{{ sub.name }}</option>
                      }
                    </select>
                    @if (!canPickSubclass(entry) && subclassesFor(entry.classId).length > 0) {
                      <span class="hint lock-hint">🔒 Si sblocca al livello {{ subclassLevelOf(entry.classId) }}
                        @if (grantsSpellsOnlyViaSubclass(entry.classId)) { — anche gli eventuali incantesimi arrivano da lì }
                      </span>
                    }
                  </div>
                  <button type="button" class="btn btn-danger btn-sm remove-btn" (click)="removeSecondary(i)">✕</button>
                </div>
              }
            }
            @if (entries().length > 1) {
              <p class="small muted">Livello totale del personaggio: <strong class="gold">{{ totalLevel() }}</strong></p>
            }
          </section>
        } @else {
          <div class="detail-panel card empty-state"><span class="rune">⚔</span>Seleziona una classe per scoprirne il potere.</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .multiclass-box { border-color: rgba(109, 90, 158, 0.45); }
    .secondary-row {
      display: grid; grid-template-columns: 2fr 1fr 2fr auto; gap: 12px; align-items: center;
      padding: 10px; border: 1px dashed rgba(109, 90, 158, 0.4); border-radius: 8px; margin-bottom: 10px;
    }
    .secondary-row .form-field { margin-bottom: 0; }
    .remove-btn { align-self: center; margin-top: 18px; }
    .gold { color: var(--gold-bright); }
    .lock-hint { display: block; margin-top: 4px; color: #b3a1e0; }
    @media (max-width: 720px) { .secondary-row { grid-template-columns: 1fr; } }
  `]
})
export class StepClassComponent {
  readonly wizard = inject(WizardService);
  readonly content = inject(ContentService);

  readonly entries = computed(() => this.wizard.classes());
  readonly primaryId = computed(() => this.entries()[0]?.classId ?? '');
  readonly primary = computed(() => this.content.classMap().get(this.primaryId()));

  selectPrimary(classId: string): void {
    const rest = this.entries().slice(1).filter(e => e.classId !== classId);
    const current = this.entries()[0];
    const level = current?.classId === classId ? current.level : 1;
    this.wizard.classes.set([{ classId, subclassId: null, level }, ...rest]);
    this.wizard.chosenSkills.set([]);
    this.wizard.expertiseSelections.set({});
    this.wizard.featureSelections.set({});
    this.wizard.knownSpellIds.set([]);
  }

  addSecondary(): void {
    const used = new Set(this.entries().map(e => e.classId));
    const free = this.content.classes().find(c => !used.has(c.id));
    if (!free) return;
    this.wizard.classes.update(list => [...list, { classId: free.id, subclassId: null, level: 1 }]);
  }

  removeSecondary(index: number): void {
    this.wizard.classes.update(list => list.filter((_, i) => i !== index));
  }

  setClass(index: number, classId: string): void {
    this.updateEntry(index, e => ({ ...e, classId, subclassId: null }));
  }

  setLevel(index: number, level: number): void {
    const clamped = Math.max(1, Math.min(20, Number(level) || 1));
    this.updateEntry(index, e => {
      const cls = this.content.classMap().get(e.classId);
      const subclassId = cls && clamped < cls.subclassLevel ? null : e.subclassId;
      return { ...e, level: clamped, subclassId };
    });
  }

  setSubclass(index: number, subclassId: string | null): void {
    this.updateEntry(index, e => ({ ...e, subclassId }));
  }

  private updateEntry(index: number, fn: (e: CharacterClassEntry) => CharacterClassEntry): void {
    this.wizard.classes.update(list => list.map((e, i) => (i === index ? fn(e) : e)));
  }

  subclassesFor(classId: string) {
    return this.content.subclassesOf(classId);
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

  isUsed(classId: string, exceptIndex: number): boolean {
    return this.entries().some((e, i) => i !== exceptIndex && e.classId === classId);
  }

  firstLevelFeatures(classId: string) {
    return this.content.classMap().get(classId)?.features.filter(f => f.level === 1) ?? [];
  }

  savingThrows(keys: readonly string[]): string {
    return keys.map(k => ABILITY_SHORT[k as keyof typeof ABILITY_SHORT]).join(', ');
  }

  totalLevel(): number {
    return this.entries().reduce((sum, e) => sum + e.level, 0);
  }
}

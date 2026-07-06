import { Component, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ABILITY_KEYS, ABILITY_SHORT, AbilityKey, AbilityScores, Race, Subrace, Trait } from '../../core/models/content.model';
import { ContentService } from '../../core/services/content.service';
import { ModalComponent } from '../../shared/components/modal';
import { slugify } from '../../shared/utils/slug';

// ============================================================
// Editor di razze e sottorazze: ogni razza può avere sottorazze
// annidate con propri bonus, tratti e velocità.
// ============================================================
@Component({
  selector: 'app-race-editor',
  standalone: true,
  imports: [FormsModule, ModalComponent, NgTemplateOutlet],
  template: `
    <div class="editor-layout">
      <aside>
        <button type="button" class="btn btn-primary btn-sm mb-1" style="width:100%" (click)="createNew()">+ Nuova Razza</button>
        <div class="select-list">
          @for (race of content.races(); track race.id) {
            <button type="button" class="select-item" [class.selected]="working()?.id === race.id" (click)="edit(race)">
              <span class="icon">{{ race.icon }}</span>
              <span>
                {{ race.name }}
                @if (race.subraces?.length) { <br /><span class="tiny-src">{{ race.subraces?.length }} sottorazze</span> }
              </span>
            </button>
          }
        </div>
      </aside>

      @if (working(); as w) {
        <section class="card editor-form">
          <div class="flex-between mb-2">
            <h3>{{ isNew() ? 'Nuova Razza' : 'Modifica: ' + w.name }}</h3>
            <div class="flex">
              @if (!isNew()) {
                <button type="button" class="btn btn-danger btn-sm" (click)="confirmDelete.set(true)">Elimina</button>
              }
              <button type="button" class="btn btn-primary btn-sm" [disabled]="!w.name" (click)="save()">💾 Salva</button>
            </div>
          </div>
          @if (saved()) { <p class="saved-note fade-in">✓ Salvato</p> }

          <div class="grid-3">
            <div class="form-field">
              <label>Nome</label>
              <input [(ngModel)]="w.name" />
            </div>
            <div class="form-field">
              <label>Icona (emoji)</label>
              <input [(ngModel)]="w.icon" maxlength="4" />
            </div>
            <div class="form-field">
              <label>Taglia</label>
              <select [(ngModel)]="w.size">
                <option value="Piccola">Piccola</option>
                <option value="Media">Media</option>
              </select>
            </div>
          </div>
          <div class="form-field">
            <label>Descrizione</label>
            <textarea rows="2" [(ngModel)]="w.description"></textarea>
          </div>
          <div class="grid-2">
            <div class="form-field">
              <label>Velocità (metri)</label>
              <input type="number" min="0" step="1.5" [(ngModel)]="w.speed" />
            </div>
            <div class="form-field">
              <label>Lingue (una per riga)</label>
              <textarea rows="2" [ngModel]="w.languages.join('\\n')" (ngModelChange)="w.languages = lines($event)"></textarea>
            </div>
          </div>

          <div class="form-field">
            <label>Bonus caratteristica della razza base</label>
            <div class="bonus-grid">
              @for (key of keys; track key) {
                <label class="bonus-cell">
                  <span>{{ short[key] }}</span>
                  <input type="number" min="-2" max="4"
                         [ngModel]="w.abilityBonuses[key] ?? 0"
                         (ngModelChange)="setBonus(w.abilityBonuses, key, $event)" />
                </label>
              }
            </div>
          </div>

          <ng-container *ngTemplateOutlet="traitEditor; context: { traits: w.traits, title: 'Tratti della razza base' }" />

          <hr class="divider" />
          <div class="flex-between mb-1">
            <h4>Sottorazze ({{ w.subraces?.length ?? 0 }})</h4>
            <button type="button" class="btn btn-ghost btn-sm" (click)="addSubrace(w)">+ Sottorazza</button>
          </div>
          <p class="small muted mb-1">I bonus e i tratti delle sottorazze si sommano a quelli della razza base.</p>
          @for (sub of w.subraces ?? []; track $index; let i = $index) {
            <div class="subrace-box">
              <div class="flex-between mb-1">
                <strong class="gold">{{ sub.name || 'Nuova sottorazza' }}</strong>
                <button type="button" class="btn btn-danger btn-sm" (click)="removeSubrace(w, i)">✕</button>
              </div>
              <div class="grid-2">
                <div class="form-field">
                  <label>Nome</label>
                  <input [(ngModel)]="sub.name" (blur)="ensureSubId(sub)" />
                </div>
                <div class="form-field">
                  <label>Velocità (vuoto = quella base)</label>
                  <input type="number" min="0" step="1.5" [ngModel]="sub.speed ?? null" (ngModelChange)="setSubSpeed(sub, $event)" />
                </div>
              </div>
              <div class="form-field">
                <label>Descrizione</label>
                <input [ngModel]="sub.description ?? ''" (ngModelChange)="sub.description = $event || undefined" />
              </div>
              <div class="form-field">
                <label>Bonus caratteristica aggiuntivi</label>
                <div class="bonus-grid">
                  @for (key of keys; track key) {
                    <label class="bonus-cell">
                      <span>{{ short[key] }}</span>
                      <input type="number" min="-2" max="4"
                             [ngModel]="sub.abilityBonuses[key] ?? 0"
                             (ngModelChange)="setBonus(sub.abilityBonuses, key, $event)" />
                    </label>
                  }
                </div>
              </div>
              <ng-container *ngTemplateOutlet="traitEditor; context: { traits: sub.traits, title: 'Tratti della sottorazza' }" />
            </div>
          }
        </section>
      } @else {
        <div class="card empty-state"><span class="rune">🧬</span>Seleziona una razza o creane una nuova.</div>
      }
    </div>

    <ng-template #traitEditor let-traits="traits" let-title="title">
      <div class="flex-between mb-1">
        <h4 class="trait-title">{{ title }} ({{ traits.length }})</h4>
        <button type="button" class="btn btn-ghost btn-sm" (click)="addTrait(traits)">+ Tratto</button>
      </div>
      @for (trait of traits; track $index; let t = $index) {
        <div class="trait-edit-row">
          <input placeholder="Nome tratto" [(ngModel)]="trait.name" />
          <select [ngModel]="trait.actionType ?? 'none'" (ngModelChange)="setTraitAction(trait, $event)">
            <option value="none">◆ Passiva</option>
            <option value="action">⚔ Azione</option>
            <option value="bonus">⚡ Bonus</option>
            <option value="reaction">↺ Reazione</option>
          </select>
          <button type="button" class="btn btn-danger btn-sm" (click)="traits.splice(t, 1)">✕</button>
          <textarea rows="2" placeholder="Descrizione" [(ngModel)]="trait.description"></textarea>
        </div>
      }
    </ng-template>

    @if (confirmDelete()) {
      <app-modal title="Eliminare la razza?" width="480px" [hasFooter]="true" (closed)="confirmDelete.set(false)">
        <p>Verranno eliminate anche tutte le sue sottorazze. I personaggi con questa razza mostreranno "—". L'operazione non è reversibile.</p>
        <div footer>
          <button type="button" class="btn btn-ghost" (click)="confirmDelete.set(false)">Annulla</button>
          <button type="button" class="btn btn-danger" (click)="remove()">Elimina</button>
        </div>
      </app-modal>
    }
  `,
  styles: [`
    :host { display: block; }
    .editor-layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; @media (max-width: 860px) { grid-template-columns: 1fr; } }
    .editor-form { padding: 22px; }
    .saved-note { color: #9fd0ae; font-size: 0.85rem; margin-bottom: 8px; }
    .tiny-src { font-size: 0.7rem; color: var(--ink); font-family: var(--font-body); }
    .divider { border: none; border-top: 1px solid rgba(201, 168, 76, 0.25); margin: 20px 0; }
    .gold { color: var(--gold-bright); font-family: var(--font-title); }
    .bonus-grid { display: flex; flex-wrap: wrap; gap: 10px; }
    .bonus-cell {
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      font-family: var(--font-title); font-size: 0.7rem; color: var(--gold);
      input { width: 54px; text-align: center; padding: 5px 4px; }
    }
    .subrace-box {
      border: 1px dashed rgba(109, 90, 158, 0.5); border-radius: 8px;
      padding: 14px; margin-bottom: 12px; background: rgba(109, 90, 158, 0.06);
    }
    .trait-title { font-size: 0.85rem; }
    .trait-edit-row {
      display: grid; grid-template-columns: 2fr 1.2fr auto; gap: 8px; margin-bottom: 10px;
      textarea { grid-column: 1 / -1; }
      @media (max-width: 720px) { grid-template-columns: 1fr; }
    }
  `]
})
export class RaceEditorComponent {
  readonly content = inject(ContentService);
  readonly keys = ABILITY_KEYS;
  readonly short = ABILITY_SHORT;

  readonly working = signal<Race | null>(null);
  readonly isNew = signal(false);
  readonly confirmDelete = signal(false);
  readonly saved = signal(false);

  createNew(): void {
    this.working.set({
      id: '', name: '', description: '', icon: '🧬',
      abilityBonuses: {}, traits: [], size: 'Media', speed: 9,
      languages: ['Comune'], subraces: []
    });
    this.isNew.set(true);
  }

  edit(race: Race): void {
    const copy = structuredClone(race);
    copy.subraces = copy.subraces ?? [];
    this.working.set(copy);
    this.isNew.set(false);
  }

  lines(value: string): string[] {
    return value.split('\n').map(s => s.trim()).filter(Boolean);
  }

  setBonus(bonuses: Partial<AbilityScores>, key: AbilityKey, value: number): void {
    const num = Number(value) || 0;
    if (num === 0) delete bonuses[key];
    else bonuses[key] = num;
  }

  addTrait(traits: Trait[]): void {
    traits.push({ name: '', description: '' });
  }

  setTraitAction(trait: Trait, value: string): void {
    trait.actionType = value === 'none' ? undefined : value as Trait['actionType'];
  }

  addSubrace(w: Race): void {
    w.subraces = w.subraces ?? [];
    w.subraces.push({ id: '', name: '', abilityBonuses: {}, traits: [] });
  }

  removeSubrace(w: Race, index: number): void {
    w.subraces?.splice(index, 1);
  }

  ensureSubId(sub: Subrace): void {
    if (!sub.id && sub.name) sub.id = slugify(sub.name);
  }

  setSubSpeed(sub: Subrace, value: number | null): void {
    const num = Number(value);
    sub.speed = num > 0 ? num : undefined;
  }

  async save(): Promise<void> {
    const w = this.working();
    if (!w) return;
    if (!w.id) w.id = slugify(w.name);
    w.subraces?.forEach(s => { if (!s.id) s.id = slugify(s.name); });
    if (!w.subraces?.length) delete w.subraces;
    await this.content.saveRace(w);
    if (w.subraces === undefined) w.subraces = [];
    this.isNew.set(false);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  async remove(): Promise<void> {
    const w = this.working();
    if (w?.id) await this.content.deleteRace(w.id);
    this.confirmDelete.set(false);
    this.working.set(null);
  }
}

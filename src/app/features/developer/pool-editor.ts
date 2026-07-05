import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OptionPool } from '../../core/models/content.model';
import { ContentService } from '../../core/services/content.service';
import { ModalComponent } from '../../shared/components/modal';
import { slugify } from '../../shared/utils/slug';

// ============================================================
// Editor dei pool di sotto-abilità selezionabili
// (manovre, discipline elementali, invocazioni, metamagia...)
// ============================================================
@Component({
  selector: 'app-pool-editor',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  template: `
    <div class="editor-layout">
      <aside>
        <button type="button" class="btn btn-primary btn-sm mb-1" style="width:100%" (click)="createNew()">+ Nuovo Pool</button>
        <div class="select-list">
          @for (pool of content.optionPools(); track pool.id) {
            <button type="button" class="select-item" [class.selected]="working()?.id === pool.id" (click)="edit(pool)">
              <span>{{ pool.name }} <span class="count">({{ pool.options.length }})</span></span>
            </button>
          }
        </div>
      </aside>

      @if (working(); as w) {
        <section class="card editor-form">
          <div class="flex-between mb-2">
            <h3>{{ isNew() ? 'Nuovo Pool' : 'Modifica: ' + w.name }}</h3>
            <div class="flex">
              @if (!isNew()) {
                <button type="button" class="btn btn-danger btn-sm" (click)="confirmDelete.set(true)">Elimina</button>
              }
              <button type="button" class="btn btn-primary btn-sm" [disabled]="!w.name" (click)="save()">💾 Salva</button>
            </div>
          </div>
          @if (saved()) { <p class="saved-note fade-in">✓ Salvato</p> }

          <div class="grid-2">
            <div class="form-field">
              <label>Nome del pool (es. "Manovre")</label>
              <input [(ngModel)]="w.name" />
            </div>
            <div class="form-field">
              <label>Descrizione</label>
              <input [(ngModel)]="w.description" />
            </div>
          </div>

          <div class="flex-between mb-1">
            <h4>Opzioni ({{ w.options.length }})</h4>
            <button type="button" class="btn btn-ghost btn-sm" (click)="addOption(w)">+ Opzione</button>
          </div>
          @for (opt of w.options; track $index; let i = $index) {
            <div class="option-box">
              <div class="option-head">
                <input placeholder="Nome" [(ngModel)]="opt.name" (blur)="ensureOptId(opt)" />
                <label class="small flex">Liv. min.
                  <input type="number" min="0" max="20" class="lvl-input"
                         [ngModel]="opt.prerequisite?.minLevel ?? 0" (ngModelChange)="setMinLevel(opt, $event)" />
                </label>
                <input placeholder="Prerequisito testuale (opzionale)" [ngModel]="opt.prerequisite?.note ?? ''" (ngModelChange)="setNote(opt, $event)" />
                <button type="button" class="btn btn-danger btn-sm" (click)="w.options.splice(i, 1)">✕</button>
              </div>
              <textarea rows="2" placeholder="Descrizione" [(ngModel)]="opt.description"></textarea>
            </div>
          }
        </section>
      } @else {
        <div class="card empty-state"><span class="rune">✧</span>Seleziona un pool di sotto-abilità o creane uno nuovo.</div>
      }
    </div>

    @if (confirmDelete()) {
      <app-modal title="Eliminare il pool?" width="460px" [hasFooter]="true" (closed)="confirmDelete.set(false)">
        <p>Le abilità che usano questo pool non mostreranno più opzioni selezionabili.</p>
        <div footer>
          <button type="button" class="btn btn-ghost" (click)="confirmDelete.set(false)">Annulla</button>
          <button type="button" class="btn btn-danger" (click)="remove()">Elimina</button>
        </div>
      </app-modal>
    }
  `,
  styles: [`
    :host { display: block; }
    .editor-layout { display: grid; grid-template-columns: 250px 1fr; gap: 20px; @media (max-width: 860px) { grid-template-columns: 1fr; } }
    .editor-form { padding: 22px; }
    .count { color: var(--ink); font-size: 0.8rem; }
    .option-box {
      border: 1px solid rgba(201, 168, 76, 0.2); border-radius: 8px;
      padding: 12px; margin-bottom: 10px; background: rgba(10, 10, 16, 0.4);
      textarea { width: 100%; margin-top: 8px; }
    }
    .option-head { display: grid; grid-template-columns: 1.5fr auto 1.5fr auto; gap: 10px; align-items: center;
      @media (max-width: 720px) { grid-template-columns: 1fr; } }
    .lvl-input { width: 60px; margin-left: 6px; padding: 4px 8px; }
    .saved-note { color: #9fd0ae; font-size: 0.85rem; margin-bottom: 8px; }
  `]
})
export class PoolEditorComponent {
  readonly content = inject(ContentService);
  readonly working = signal<OptionPool | null>(null);
  readonly isNew = signal(false);
  readonly confirmDelete = signal(false);
  readonly saved = signal(false);

  createNew(): void {
    this.working.set({ id: '', name: '', description: '', options: [] });
    this.isNew.set(true);
  }

  edit(pool: OptionPool): void {
    this.working.set(structuredClone(pool));
    this.isNew.set(false);
  }

  addOption(w: OptionPool): void {
    w.options.push({ id: '', name: '', description: '' });
  }

  ensureOptId(opt: { id: string; name: string }): void {
    if (!opt.id && opt.name) opt.id = slugify(opt.name);
  }

  setMinLevel(opt: { prerequisite?: { minLevel?: number; note?: string } }, value: number): void {
    const minLevel = Number(value) || 0;
    if (minLevel > 0) {
      opt.prerequisite = { ...(opt.prerequisite ?? {}), minLevel };
    } else if (opt.prerequisite) {
      delete opt.prerequisite.minLevel;
      if (!opt.prerequisite.note) delete opt.prerequisite;
    }
  }

  setNote(opt: { prerequisite?: { minLevel?: number; note?: string } }, value: string): void {
    if (value) {
      opt.prerequisite = { ...(opt.prerequisite ?? {}), note: value };
    } else if (opt.prerequisite) {
      delete opt.prerequisite.note;
      if (!opt.prerequisite.minLevel) delete opt.prerequisite;
    }
  }

  async save(): Promise<void> {
    const w = this.working();
    if (!w) return;
    if (!w.id) w.id = slugify(w.name);
    w.options.forEach(o => { if (!o.id) o.id = slugify(o.name); });
    await this.content.savePool(w);
    this.isNew.set(false);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  async remove(): Promise<void> {
    const w = this.working();
    if (w?.id) await this.content.deletePool(w.id);
    this.confirmDelete.set(false);
    this.working.set(null);
  }
}

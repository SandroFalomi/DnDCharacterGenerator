import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Feat } from '../../core/models/content.model';
import { ContentService } from '../../core/services/content.service';
import { ModalComponent } from '../../shared/components/modal';
import { slugify } from '../../shared/utils/slug';

@Component({
  selector: 'app-feat-editor',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  template: `
    <div class="editor-layout">
      <aside>
        <button type="button" class="btn btn-primary btn-sm mb-1" style="width:100%" (click)="createNew()">+ Nuovo Talento</button>
        <div class="select-list">
          @for (feat of content.feats(); track feat.id) {
            <button type="button" class="select-item" [class.selected]="working()?.id === feat.id" (click)="edit(feat)">
              <span>
                {{ feat.name }}
                @if (feat.prerequisite) { <br /><span class="tiny-src">prereq: {{ feat.prerequisite }}</span> }
              </span>
            </button>
          }
        </div>
      </aside>

      @if (working(); as w) {
        <section class="card editor-form">
          <div class="flex-between mb-2">
            <h3>{{ isNew() ? 'Nuovo Talento' : 'Modifica: ' + w.name }}</h3>
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
              <label>Nome</label>
              <input [(ngModel)]="w.name" />
            </div>
            <div class="form-field">
              <label>Prerequisiti (opzionale)</label>
              <input [ngModel]="w.prerequisite ?? ''" (ngModelChange)="w.prerequisite = $event || undefined"
                     placeholder="Es. Forza 13 o superiore" />
            </div>
          </div>
          <div class="form-field">
            <label>Descrizione</label>
            <textarea rows="3" [(ngModel)]="w.description"></textarea>
          </div>
          <div class="form-field">
            <label>Bonus concessi (uno per riga)</label>
            <textarea rows="5" [ngModel]="(w.benefits ?? []).join('\\n')" (ngModelChange)="w.benefits = lines($event)"
                      placeholder="+1 a Forza (massimo 20)&#10;Vantaggio ai TS su..."></textarea>
            <span class="hint">Ogni riga diventa un punto dell'elenco dei bonus.</span>
          </div>
        </section>
      } @else {
        <div class="card empty-state"><span class="rune">🎖</span>Seleziona un talento o creane uno nuovo.</div>
      }
    </div>

    @if (confirmDelete()) {
      <app-modal title="Eliminare il talento?" width="460px" [hasFooter]="true" (closed)="confirmDelete.set(false)">
        <p>I personaggi che lo hanno assegnato non lo vedranno più. L'operazione non è reversibile.</p>
        <div footer>
          <button type="button" class="btn btn-ghost" (click)="confirmDelete.set(false)">Annulla</button>
          <button type="button" class="btn btn-danger" (click)="remove()">Elimina</button>
        </div>
      </app-modal>
    }
  `,
  styles: [`
    :host { display: block; }
    .editor-layout { display: grid; grid-template-columns: 270px 1fr; gap: 20px; @media (max-width: 860px) { grid-template-columns: 1fr; } }
    .editor-form { padding: 22px; }
    .saved-note { color: #9fd0ae; font-size: 0.85rem; margin-bottom: 8px; }
    .tiny-src { font-size: 0.7rem; color: var(--ink); font-family: var(--font-body); }
  `]
})
export class FeatEditorComponent {
  readonly content = inject(ContentService);
  readonly working = signal<Feat | null>(null);
  readonly isNew = signal(false);
  readonly confirmDelete = signal(false);
  readonly saved = signal(false);

  createNew(): void {
    this.working.set({ id: '', name: '', description: '', benefits: [] });
    this.isNew.set(true);
  }

  edit(feat: Feat): void {
    this.working.set(structuredClone(feat));
    this.isNew.set(false);
  }

  lines(value: string): string[] {
    return value.split('\n').map(s => s.trim()).filter(Boolean);
  }

  async save(): Promise<void> {
    const w = this.working();
    if (!w) return;
    if (!w.id) w.id = slugify(w.name);
    await this.content.saveFeat(w);
    this.isNew.set(false);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  async remove(): Promise<void> {
    const w = this.working();
    if (w?.id) await this.content.deleteFeat(w.id);
    this.confirmDelete.set(false);
    this.working.set(null);
  }
}

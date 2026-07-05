import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Background } from '../../core/models/content.model';
import { ContentService } from '../../core/services/content.service';
import { ModalComponent } from '../../shared/components/modal';
import { slugify } from '../../shared/utils/slug';

@Component({
  selector: 'app-background-editor',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  template: `
    <div class="editor-layout">
      <aside>
        <button type="button" class="btn btn-primary btn-sm mb-1" style="width:100%" (click)="createNew()">+ Nuovo Background</button>
        <div class="select-list">
          @for (bg of content.backgrounds(); track bg.id) {
            <button type="button" class="select-item" [class.selected]="working()?.id === bg.id" (click)="edit(bg)">
              <span class="icon">{{ bg.icon }}</span> {{ bg.name }}
            </button>
          }
        </div>
      </aside>

      @if (working(); as w) {
        <section class="card editor-form">
          <div class="flex-between mb-2">
            <h3>{{ isNew() ? 'Nuovo Background' : 'Modifica: ' + w.name }}</h3>
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
              <label>Icona (emoji)</label>
              <input [(ngModel)]="w.icon" maxlength="4" />
            </div>
          </div>
          <div class="form-field">
            <label>Descrizione</label>
            <textarea rows="2" [(ngModel)]="w.description"></textarea>
          </div>

          <div class="grid-2">
            <div class="form-field">
              <label>Competenze nelle abilità</label>
              <select multiple size="7" [(ngModel)]="w.skillProficiencies">
                @for (skill of content.skills; track skill.id) { <option [value]="skill.id">{{ skill.name }}</option> }
              </select>
              <span class="hint">Ctrl+click per selezioni multiple. Applicate automaticamente alla creazione del personaggio.</span>
            </div>
            <div>
              <div class="form-field">
                <label>Competenze negli strumenti (una per riga)</label>
                <textarea rows="2" [ngModel]="w.toolProficiencies.join('\\n')" (ngModelChange)="w.toolProficiencies = lines($event)"></textarea>
              </div>
              <div class="form-field">
                <label>Lingue (una per riga)</label>
                <textarea rows="2" [ngModel]="w.languages.join('\\n')" (ngModelChange)="w.languages = lines($event)"></textarea>
              </div>
            </div>
          </div>

          <div class="form-field">
            <label>Equipaggiamento (uno per riga)</label>
            <textarea rows="3" [ngModel]="w.equipment.join('\\n')" (ngModelChange)="w.equipment = lines($event)"></textarea>
          </div>

          <div class="grid-2">
            <div class="form-field">
              <label>Privilegio: nome</label>
              <input [(ngModel)]="w.feature.name" />
            </div>
            <div class="form-field">
              <label>Privilegio: descrizione</label>
              <textarea rows="2" [(ngModel)]="w.feature.description"></textarea>
            </div>
          </div>
        </section>
      } @else {
        <div class="card empty-state"><span class="rune">📜</span>Seleziona un background o creane uno nuovo.</div>
      }
    </div>

    @if (confirmDelete()) {
      <app-modal title="Eliminare il background?" width="460px" [hasFooter]="true" (closed)="confirmDelete.set(false)">
        <p>L'operazione non è reversibile.</p>
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
    .saved-note { color: #9fd0ae; font-size: 0.85rem; margin-bottom: 8px; }
  `]
})
export class BackgroundEditorComponent {
  readonly content = inject(ContentService);
  readonly working = signal<Background | null>(null);
  readonly isNew = signal(false);
  readonly confirmDelete = signal(false);
  readonly saved = signal(false);

  createNew(): void {
    this.working.set({
      id: '', name: '', description: '', icon: '📜',
      skillProficiencies: [], toolProficiencies: [], languages: [], equipment: [],
      feature: { name: '', description: '' }
    });
    this.isNew.set(true);
  }

  edit(bg: Background): void {
    this.working.set(structuredClone(bg));
    this.isNew.set(false);
  }

  lines(value: string): string[] {
    return value.split('\n').map(s => s.trim()).filter(Boolean);
  }

  async save(): Promise<void> {
    const w = this.working();
    if (!w) return;
    if (!w.id) w.id = slugify(w.name);
    await this.content.saveBackground(w);
    this.isNew.set(false);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  async remove(): Promise<void> {
    const w = this.working();
    if (w?.id) await this.content.deleteBackground(w.id);
    this.confirmDelete.set(false);
    this.working.set(null);
  }
}

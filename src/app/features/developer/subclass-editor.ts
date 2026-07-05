import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ABILITY_KEYS, ABILITY_LABELS, Subclass } from '../../core/models/content.model';
import { ContentService } from '../../core/services/content.service';
import { ModalComponent } from '../../shared/components/modal';
import { FeatureListEditorComponent } from './feature-list-editor';
import { slugify } from '../../shared/utils/slug';

@Component({
  selector: 'app-subclass-editor',
  standalone: true,
  imports: [FormsModule, ModalComponent, FeatureListEditorComponent],
  template: `
    <div class="editor-layout">
      <aside>
        <button type="button" class="btn btn-primary btn-sm mb-1" style="width:100%" (click)="createNew()">+ Nuova Sottoclasse</button>
        <div class="select-list">
          @for (sub of content.subclasses(); track sub.id) {
            <button type="button" class="select-item" [class.selected]="working()?.id === sub.id" (click)="edit(sub)">
              <span>
                {{ sub.name }}
                <br /><span class="tiny-src">{{ className(sub.classId) }}</span>
              </span>
            </button>
          }
        </div>
      </aside>

      @if (working(); as w) {
        <section class="card editor-form">
          <div class="flex-between mb-2">
            <h3>{{ isNew() ? 'Nuova Sottoclasse' : 'Modifica: ' + w.name }}</h3>
            <div class="flex">
              @if (!isNew()) {
                <button type="button" class="btn btn-danger btn-sm" (click)="confirmDelete.set(true)">Elimina</button>
              }
              <button type="button" class="btn btn-primary btn-sm" [disabled]="!w.name || !w.classId" (click)="save()">💾 Salva</button>
            </div>
          </div>
          @if (saved()) { <p class="saved-note fade-in">✓ Salvato</p> }

          <div class="grid-2">
            <div class="form-field">
              <label>Nome</label>
              <input [(ngModel)]="w.name" />
            </div>
            <div class="form-field">
              <label>Classe di appartenenza</label>
              <select [(ngModel)]="w.classId">
                <option value="">— Scegli —</option>
                @for (cls of content.classes(); track cls.id) { <option [value]="cls.id">{{ cls.icon }} {{ cls.name }}</option> }
              </select>
            </div>
          </div>
          <div class="form-field">
            <label>Descrizione</label>
            <textarea rows="2" [(ngModel)]="w.description"></textarea>
          </div>

          <div class="form-field">
            <label class="flex"><input type="checkbox" [checked]="!!w.spellcasting" (change)="toggleSpellcasting(w)" /> Sottoclasse magica (es. Cavaliere Mistico)</label>
          </div>
          @if (w.spellcasting; as sc) {
            <div class="grid-3">
              <div class="form-field">
                <label>Caratteristica</label>
                <select [(ngModel)]="sc.ability">
                  @for (key of keys; track key) { <option [value]="key">{{ labels[key] }}</option> }
                </select>
              </div>
              <div class="form-field">
                <label>Progressione</label>
                <select [(ngModel)]="sc.progression">
                  <option value="third">A un terzo</option>
                  <option value="half">A metà</option>
                  <option value="full">Completa</option>
                </select>
              </div>
              <div class="form-field">
                <label>Opzioni</label>
                <label class="flex small"><input type="checkbox" [(ngModel)]="sc.prepares" /> Prepara</label>
                <label class="flex small"><input type="checkbox" [(ngModel)]="sc.hasCantrips" /> Trucchetti</label>
              </div>
            </div>
          }

          <hr class="divider" />
          <app-feature-list-editor [features]="w.features" />
        </section>
      } @else {
        <div class="card empty-state"><span class="rune">✦</span>Seleziona una sottoclasse o creane una nuova.</div>
      }
    </div>

    @if (confirmDelete()) {
      <app-modal title="Eliminare la sottoclasse?" width="460px" [hasFooter]="true" (closed)="confirmDelete.set(false)">
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
    .editor-layout { display: grid; grid-template-columns: 270px 1fr; gap: 20px; @media (max-width: 860px) { grid-template-columns: 1fr; } }
    .editor-form { padding: 22px; }
    .divider { border: none; border-top: 1px solid rgba(201, 168, 76, 0.25); margin: 20px 0; }
    .saved-note { color: #9fd0ae; font-size: 0.85rem; margin-bottom: 8px; }
    .tiny-src { font-size: 0.7rem; color: var(--ink); font-family: var(--font-body); }
  `]
})
export class SubclassEditorComponent {
  readonly content = inject(ContentService);
  readonly keys = ABILITY_KEYS;
  readonly labels = ABILITY_LABELS;

  readonly working = signal<Subclass | null>(null);
  readonly isNew = signal(false);
  readonly confirmDelete = signal(false);
  readonly saved = signal(false);

  className(id: string): string {
    return this.content.classMap().get(id)?.name ?? id;
  }

  createNew(): void {
    this.working.set({ id: '', classId: '', name: '', description: '', features: [] });
    this.isNew.set(true);
  }

  edit(sub: Subclass): void {
    this.working.set(structuredClone(sub));
    this.isNew.set(false);
  }

  toggleSpellcasting(w: Subclass): void {
    w.spellcasting = w.spellcasting
      ? undefined
      : { ability: 'INT', progression: 'third', prepares: false, hasCantrips: true };
  }

  async save(): Promise<void> {
    const w = this.working();
    if (!w) return;
    if (!w.id) w.id = slugify(w.name);
    w.features.forEach(f => { if (!f.id) f.id = `${w.id}-${slugify(f.name)}`; });
    await this.content.saveSubclass(w);
    this.isNew.set(false);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  async remove(): Promise<void> {
    const w = this.working();
    if (w?.id) await this.content.deleteSubclass(w.id);
    this.confirmDelete.set(false);
    this.working.set(null);
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SPELL_SCHOOLS, Spell } from '../../core/models/content.model';
import { ContentService } from '../../core/services/content.service';
import { ModalComponent } from '../../shared/components/modal';
import { slugify } from '../../shared/utils/slug';

@Component({
  selector: 'app-spell-editor',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  template: `
    <div class="editor-layout">
      <aside>
        <button type="button" class="btn btn-primary btn-sm mb-1" style="width:100%" (click)="createNew()">+ Nuovo Incantesimo</button>
        <input type="text" placeholder="Filtra…" [(ngModel)]="filter" class="mb-1" style="width:100%" />
        <div class="select-list">
          @for (spell of filtered(); track spell.id) {
            <button type="button" class="select-item" [class.selected]="working()?.id === spell.id" (click)="edit(spell)">
              <span>
                {{ spell.name }}
                <br /><span class="tiny-src">{{ spell.level === 0 ? 'Trucchetto' : 'Liv. ' + spell.level }} · {{ spell.school }}</span>
              </span>
            </button>
          }
        </div>
      </aside>

      @if (working(); as w) {
        <section class="card editor-form">
          <div class="flex-between mb-2">
            <h3>{{ isNew() ? 'Nuovo Incantesimo' : 'Modifica: ' + w.name }}</h3>
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
              <label>Livello (0 = trucchetto)</label>
              <input type="number" min="0" max="9" [(ngModel)]="w.level" />
            </div>
            <div class="form-field">
              <label>Scuola di magia</label>
              <select [(ngModel)]="w.school">
                @for (school of schools; track school) { <option [value]="school">{{ school }}</option> }
              </select>
            </div>
          </div>
          <div class="grid-2">
            <div class="form-field">
              <label>Tempo di lancio</label>
              <input [(ngModel)]="w.castingTime" placeholder="1 azione" />
            </div>
            <div class="form-field">
              <label>Gittata</label>
              <input [(ngModel)]="w.range" placeholder="18 metri" />
            </div>
          </div>
          <div class="grid-2">
            <div class="form-field">
              <label>Componenti</label>
              <input [(ngModel)]="w.components" placeholder="V, S, M" />
            </div>
            <div class="form-field">
              <label>Durata</label>
              <input [(ngModel)]="w.duration" placeholder="Istantanea" />
            </div>
          </div>
          <div class="flex mb-1">
            <label class="flex small"><input type="checkbox" [(ngModel)]="w.concentration" /> Concentrazione</label>
            <label class="flex small"><input type="checkbox" [(ngModel)]="w.ritual" /> Rituale</label>
          </div>
          <div class="form-field">
            <label>Descrizione</label>
            <textarea rows="3" [(ngModel)]="w.description"></textarea>
          </div>

          <div class="grid-2">
            <div class="form-field">
              <label>Classi abilitate</label>
              <div class="check-col">
                @for (cls of content.classes(); track cls.id) {
                  <label class="flex small">
                    <input type="checkbox" [checked]="w.classIds.includes(cls.id)" (change)="toggleClass(w, cls.id)" />
                    {{ cls.icon }} {{ cls.name }}
                  </label>
                }
              </div>
            </div>
            <div class="form-field">
              <label>Sottoclassi abilitate</label>
              <div class="check-col">
                @for (sub of content.subclasses(); track sub.id) {
                  <label class="flex small">
                    <input type="checkbox" [checked]="w.subclassIds.includes(sub.id)" (change)="toggleSubclass(w, sub.id)" />
                    {{ sub.name }} <span class="tiny-src">({{ className(sub.classId) }})</span>
                  </label>
                }
              </div>
            </div>
          </div>

          <div class="form-field">
            <label>Restrizioni o note aggiuntive</label>
            <textarea rows="2" [ngModel]="w.notes ?? ''" (ngModelChange)="w.notes = $event || undefined"></textarea>
          </div>
        </section>
      } @else {
        <div class="card empty-state"><span class="rune">✨</span>Seleziona un incantesimo o creane uno nuovo.</div>
      }
    </div>

    @if (confirmDelete()) {
      <app-modal title="Eliminare l'incantesimo?" width="460px" [hasFooter]="true" (closed)="confirmDelete.set(false)">
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
    .saved-note { color: #9fd0ae; font-size: 0.85rem; margin-bottom: 8px; }
    .tiny-src { font-size: 0.7rem; color: var(--ink); font-family: var(--font-body); }
    .check-col {
      display: flex; flex-direction: column; gap: 5px; max-height: 260px; overflow-y: auto;
      border: 1px solid rgba(201, 168, 76, 0.2); border-radius: 6px; padding: 10px;
      label { cursor: pointer; }
    }
  `]
})
export class SpellEditorComponent {
  readonly content = inject(ContentService);
  readonly schools = SPELL_SCHOOLS;

  readonly working = signal<Spell | null>(null);
  readonly isNew = signal(false);
  readonly confirmDelete = signal(false);
  readonly saved = signal(false);
  filter = '';

  filtered(): Spell[] {
    const term = this.filter.toLowerCase();
    return this.content.spells().filter(s => !term || s.name.toLowerCase().includes(term));
  }

  className(id: string): string {
    return this.content.classMap().get(id)?.name ?? id;
  }

  createNew(): void {
    this.working.set({
      id: '', name: '', level: 1, school: 'Invocazione',
      castingTime: '1 azione', range: '18 metri', components: 'V, S', duration: 'Istantanea',
      concentration: false, description: '', classIds: [], subclassIds: []
    });
    this.isNew.set(true);
  }

  edit(spell: Spell): void {
    this.working.set(structuredClone(spell));
    this.isNew.set(false);
  }

  toggleClass(w: Spell, id: string): void {
    w.classIds = w.classIds.includes(id) ? w.classIds.filter(c => c !== id) : [...w.classIds, id];
  }

  toggleSubclass(w: Spell, id: string): void {
    w.subclassIds = w.subclassIds.includes(id) ? w.subclassIds.filter(s => s !== id) : [...w.subclassIds, id];
  }

  async save(): Promise<void> {
    const w = this.working();
    if (!w) return;
    if (!w.id) w.id = slugify(w.name);
    await this.content.saveSpell(w);
    this.isNew.set(false);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  async remove(): Promise<void> {
    const w = this.working();
    if (w?.id) await this.content.deleteSpell(w.id);
    this.confirmDelete.set(false);
    this.working.set(null);
  }
}

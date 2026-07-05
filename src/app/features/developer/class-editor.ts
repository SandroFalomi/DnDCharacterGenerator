import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ABILITY_KEYS, ABILITY_LABELS, DndClass } from '../../core/models/content.model';
import { ContentService } from '../../core/services/content.service';
import { ModalComponent } from '../../shared/components/modal';
import { FeatureListEditorComponent } from './feature-list-editor';
import { slugify } from '../../shared/utils/slug';

@Component({
  selector: 'app-class-editor',
  standalone: true,
  imports: [FormsModule, ModalComponent, FeatureListEditorComponent],
  template: `
    <div class="editor-layout">
      <aside>
        <button type="button" class="btn btn-primary btn-sm mb-1" style="width:100%" (click)="createNew()">+ Nuova Classe</button>
        <div class="select-list">
          @for (cls of content.classes(); track cls.id) {
            <button type="button" class="select-item" [class.selected]="working()?.id === cls.id" (click)="edit(cls)">
              <span class="icon">{{ cls.icon }}</span> {{ cls.name }}
            </button>
          }
        </div>
      </aside>

      @if (working(); as w) {
        <section class="card editor-form">
          <div class="flex-between mb-2">
            <h3>{{ isNew() ? 'Nuova Classe' : 'Modifica: ' + w.name }}</h3>
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
              <label>Dado Vita</label>
              <select [(ngModel)]="w.hitDie">
                @for (die of [4,6,8,10,12]; track die) { <option [ngValue]="die">d{{ die }}</option> }
              </select>
            </div>
          </div>
          <div class="form-field">
            <label>Descrizione</label>
            <textarea rows="2" [(ngModel)]="w.description"></textarea>
          </div>

          <div class="grid-2">
            <div class="form-field">
              <label>Tiri Salvezza</label>
              <div class="check-row">
                @for (key of keys; track key) {
                  <label class="flex small">
                    <input type="checkbox" [checked]="w.savingThrows.includes(key)" (change)="toggleSave(w, key)" />
                    {{ labels[key] }}
                  </label>
                }
              </div>
            </div>
            <div>
              <div class="form-field">
                <label>Livello sottoclasse</label>
                <input type="number" min="1" max="20" [(ngModel)]="w.subclassLevel" />
              </div>
              <div class="form-field">
                <label>Titolo sottoclassi (es. "Archetipo Marziale")</label>
                <input [(ngModel)]="w.subclassTitle" />
              </div>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-field">
              <label>Competenze armature (una per riga)</label>
              <textarea rows="2" [ngModel]="w.armorProficiencies.join('\\n')" (ngModelChange)="w.armorProficiencies = lines($event)"></textarea>
            </div>
            <div class="form-field">
              <label>Competenze armi (una per riga)</label>
              <textarea rows="2" [ngModel]="w.weaponProficiencies.join('\\n')" (ngModelChange)="w.weaponProficiencies = lines($event)"></textarea>
            </div>
          </div>
          <div class="grid-2">
            <div class="form-field">
              <label>Strumenti (uno per riga)</label>
              <textarea rows="2" [ngModel]="w.toolProficiencies.join('\\n')" (ngModelChange)="w.toolProficiencies = lines($event)"></textarea>
            </div>
            <div class="form-field">
              <label>Equipaggiamento iniziale (uno per riga)</label>
              <textarea rows="2" [ngModel]="w.equipment.join('\\n')" (ngModelChange)="w.equipment = lines($event)"></textarea>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-field">
              <label>Abilità selezionabili al 1° livello</label>
              <select multiple size="7" [(ngModel)]="w.skillChoices.from">
                @for (skill of content.skills; track skill.id) { <option [value]="skill.id">{{ skill.name }}</option> }
              </select>
            </div>
            <div>
              <div class="form-field">
                <label>Numero di abilità da scegliere</label>
                <input type="number" min="0" max="6" [(ngModel)]="w.skillChoices.count" />
              </div>
              <div class="form-field">
                <label class="flex"><input type="checkbox" [checked]="!!w.spellcasting" (change)="toggleSpellcasting(w)" /> Classe incantatrice</label>
              </div>
              @if (w.spellcasting; as sc) {
                <div class="form-field">
                  <label>Caratteristica da incantatore</label>
                  <select [(ngModel)]="sc.ability">
                    @for (key of keys; track key) { <option [value]="key">{{ labels[key] }}</option> }
                  </select>
                </div>
                <div class="form-field">
                  <label>Progressione slot</label>
                  <select [(ngModel)]="sc.progression">
                    <option value="full">Completa (mago, chierico…)</option>
                    <option value="half">A metà (paladino, ranger)</option>
                    <option value="third">A un terzo (sottoclassi)</option>
                    <option value="pact">Magia del patto (warlock)</option>
                  </select>
                </div>
                <label class="flex small mb-1"><input type="checkbox" [(ngModel)]="sc.prepares" /> Prepara gli incantesimi</label>
                <label class="flex small"><input type="checkbox" [(ngModel)]="sc.hasCantrips" /> Conosce trucchetti</label>
              }
            </div>
          </div>

          <div class="flex-between mb-1 mt-2">
            <h4>Risorse speciali (ki, punti stregoneria…)</h4>
            <button type="button" class="btn btn-ghost btn-sm" (click)="w.resources.push({ name: '', description: '', level: 1 })">+ Risorsa</button>
          </div>
          @for (res of w.resources; track $index; let i = $index) {
            <div class="resource-row">
              <input placeholder="Nome" [(ngModel)]="res.name" />
              <input type="number" min="1" max="20" [(ngModel)]="res.level" title="Livello" />
              <input placeholder="Descrizione" [(ngModel)]="res.description" />
              <button type="button" class="btn btn-danger btn-sm" (click)="w.resources.splice(i, 1)">✕</button>
            </div>
          }

          <hr class="divider" />
          <app-feature-list-editor [features]="w.features" />
        </section>
      } @else {
        <div class="card empty-state"><span class="rune">⚒</span>Seleziona una classe da modificare o creane una nuova.</div>
      }
    </div>

    @if (confirmDelete()) {
      <app-modal title="Eliminare la classe?" width="480px" [hasFooter]="true" (closed)="confirmDelete.set(false)">
        <p>Verranno eliminate anche tutte le sue sottoclassi. L'operazione non è reversibile.</p>
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
    .check-row { display: flex; flex-direction: column; gap: 6px; }
    .resource-row { display: grid; grid-template-columns: 1fr 70px 2fr auto; gap: 8px; margin-bottom: 8px; }
    .divider { border: none; border-top: 1px solid rgba(201, 168, 76, 0.25); margin: 20px 0; }
    .saved-note { color: #9fd0ae; font-size: 0.85rem; margin-bottom: 8px; }
  `]
})
export class ClassEditorComponent {
  readonly content = inject(ContentService);
  readonly keys = ABILITY_KEYS;
  readonly labels = ABILITY_LABELS;

  readonly working = signal<DndClass | null>(null);
  readonly isNew = signal(false);
  readonly confirmDelete = signal(false);
  readonly saved = signal(false);

  createNew(): void {
    this.working.set({
      id: '', name: '', description: '', icon: '⚔️', hitDie: 8,
      savingThrows: [], armorProficiencies: [], weaponProficiencies: [], toolProficiencies: [],
      skillChoices: { count: 2, from: [] }, equipment: [], features: [],
      subclassLevel: 3, subclassTitle: 'Sottoclasse', resources: []
    });
    this.isNew.set(true);
  }

  edit(cls: DndClass): void {
    this.working.set(structuredClone(cls));
    this.isNew.set(false);
  }

  lines(value: string): string[] {
    return value.split('\n').map(s => s.trim()).filter(Boolean);
  }

  toggleSave(w: DndClass, key: (typeof ABILITY_KEYS)[number]): void {
    w.savingThrows = w.savingThrows.includes(key)
      ? w.savingThrows.filter(k => k !== key)
      : [...w.savingThrows, key];
  }

  toggleSpellcasting(w: DndClass): void {
    w.spellcasting = w.spellcasting
      ? undefined
      : { ability: 'INT', progression: 'full', prepares: false, hasCantrips: true };
  }

  async save(): Promise<void> {
    const w = this.working();
    if (!w) return;
    if (!w.id) w.id = slugify(w.name);
    w.features.forEach(f => { if (!f.id) f.id = `${w.id}-${slugify(f.name)}`; });
    await this.content.saveClass(w);
    this.isNew.set(false);
    this.flashSaved();
  }

  async remove(): Promise<void> {
    const w = this.working();
    if (w?.id) await this.content.deleteClass(w.id);
    this.confirmDelete.set(false);
    this.working.set(null);
  }

  flashSaved(): void {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }
}

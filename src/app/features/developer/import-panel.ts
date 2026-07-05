import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImportResult, ImportService } from '../../core/services/import.service';
import { ContentService } from '../../core/services/content.service';
import { ModalComponent } from '../../shared/components/modal';

@Component({
  selector: 'app-import-panel',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  template: `
    <div class="grid-2 import-grid">
      <section class="card">
        <h3 class="mb-1">📥 Importa contenuti da JSON</h3>
        <p class="small muted mb-2">
          Carica un file JSON (o incolla il contenuto) con una o più sezioni tra:
          <code>classes</code>, <code>subclasses</code>, <code>backgrounds</code>, <code>spells</code>, <code>optionPools</code>.
          Il file viene validato prima dell'importazione: gli elementi con id già esistente vengono aggiornati.
        </p>

        <div class="form-field">
          <label>File JSON</label>
          <input type="file" accept=".json,application/json" (change)="onFile($event)" />
        </div>
        <div class="form-field">
          <label>Oppure incolla il JSON</label>
          <textarea rows="14" [(ngModel)]="jsonText" spellcheck="false" placeholder='{\n  "spells": [ ... ],\n  "backgrounds": [ ... ]\n}'></textarea>
        </div>
        <div class="flex">
          <button type="button" class="btn btn-primary" [disabled]="!jsonText.trim()" (click)="validate()">Valida</button>
          <button type="button" class="btn btn-ghost" (click)="loadExample()">Carica esempio</button>
        </div>

        @if (result(); as r) {
          <div class="mt-2">
            @if (r.errors.length > 0) {
              <div class="error-box">
                <strong>❌ {{ r.valid ? 'Avvisi' : 'Errori di validazione' }} ({{ r.errors.length }})</strong>
                <ul>
                  @for (err of r.errors; track $index) { <li>{{ err }}</li> }
                </ul>
              </div>
            }
            @if (r.valid) {
              <div class="ok-box">
                <strong>✓ File valido.</strong> Contenuti trovati:
                <ul>
                  @for (s of r.summary; track s.kind) { <li>{{ s.kind }}: {{ s.count }}</li> }
                </ul>
                <button type="button" class="btn btn-primary mt-1" [disabled]="importing()" (click)="doImport()">
                  {{ importing() ? 'Importazione…' : '⬇ Importa nel catalogo' }}
                </button>
              </div>
            }
            @if (imported()) { <p class="ok-note fade-in mt-1">✓ Importazione completata. I contenuti sono ora disponibili in tutta l'app.</p> }
          </div>
        }
      </section>

      <section class="card">
        <h3 class="mb-1">🌐 API esterne</h3>
        <p class="small muted">
          È possibile recuperare dati SRD (in inglese) da API pubbliche come
          <a href="https://www.dnd5eapi.co" target="_blank" rel="noopener">dnd5eapi.co</a> oppure
          <a href="https://open5e.com" target="_blank" rel="noopener">Open5e</a>.
          Questo progetto è volutamente offline-first: converti i dati nel formato JSON documentato qui sotto e importali da questa pagina.
        </p>
        <h4 class="mt-2 mb-1">Formato del file</h4>
        <pre class="schema">{{ schemaExample }}</pre>

        <h4 class="mt-2 mb-1">🧹 Manutenzione</h4>
        <p class="small muted">
          Se il catalogo contiene doppioni o dati corrotti (per esempio da vecchi import),
          puoi riportarlo allo stato predefinito. I personaggi salvati non vengono toccati.
        </p>
        <button type="button" class="btn btn-danger btn-sm mt-1" (click)="confirmReset.set(true)">
          ↺ Ripristina catalogo predefinito
        </button>
        @if (resetDone()) { <p class="ok-note fade-in mt-1">✓ Catalogo ripristinato ai contenuti predefiniti.</p> }
      </section>
    </div>

    @if (confirmReset()) {
      <app-modal title="Ripristinare il catalogo?" width="520px" [hasFooter]="true" (closed)="confirmReset.set(false)">
        <p>
          Tutte le classi, sottoclassi, background, incantesimi e pool di opzioni torneranno
          allo stato predefinito. <strong>Le modifiche e i contenuti personalizzati andranno persi.</strong>
          I personaggi salvati non vengono toccati.
        </p>
        <div footer>
          <button type="button" class="btn btn-ghost" (click)="confirmReset.set(false)">Annulla</button>
          <button type="button" class="btn btn-danger" [disabled]="resetting()" (click)="doReset()">
            {{ resetting() ? 'Ripristino…' : 'Ripristina' }}
          </button>
        </div>
      </app-modal>
    }
  `,
  styles: [`
    :host { display: block; }
    .import-grid { align-items: start; }
    code { color: var(--gold-bright); background: rgba(201,168,76,0.1); padding: 1px 5px; border-radius: 4px; font-size: 0.85em; }
    textarea { font-family: 'Consolas', monospace; font-size: 0.82rem; }
    .error-box {
      border: 1px solid rgba(183, 28, 28, 0.5); border-radius: 8px; padding: 12px 16px;
      background: rgba(139, 0, 0, 0.1); color: #e8a0a0; font-size: 0.85rem;
      ul { margin: 8px 0 0 18px; max-height: 220px; overflow-y: auto; }
    }
    .ok-box {
      border: 1px solid rgba(74, 124, 89, 0.6); border-radius: 8px; padding: 12px 16px;
      background: rgba(74, 124, 89, 0.1); color: #9fd0ae; font-size: 0.9rem; margin-top: 10px;
      ul { margin: 6px 0 0 18px; }
    }
    .ok-note { color: #9fd0ae; }
    .schema {
      font-size: 0.72rem; color: var(--parchment-dim); background: rgba(10, 10, 16, 0.6);
      border: 1px solid rgba(201, 168, 76, 0.2); border-radius: 8px; padding: 14px;
      overflow-x: auto; white-space: pre;
    }
  `]
})
export class ImportPanelComponent {
  private importService = inject(ImportService);
  private content = inject(ContentService);

  jsonText = '';
  readonly result = signal<ImportResult | null>(null);
  readonly importing = signal(false);
  readonly imported = signal(false);
  readonly confirmReset = signal(false);
  readonly resetting = signal(false);
  readonly resetDone = signal(false);

  async doReset(): Promise<void> {
    this.resetting.set(true);
    try {
      await this.content.resetCatalog();
      this.resetDone.set(true);
      this.result.set(null);
      setTimeout(() => this.resetDone.set(false), 4000);
    } finally {
      this.resetting.set(false);
      this.confirmReset.set(false);
    }
  }

  readonly schemaExample = `{
  "classes": [{
    "id": "artefice", "name": "Artefice", "description": "...",
    "hitDie": 8, "savingThrows": ["CON", "INT"],
    "armorProficiencies": [], "weaponProficiencies": [], "toolProficiencies": [],
    "skillChoices": { "count": 2, "from": ["arcano", "storia"] },
    "equipment": [], "subclassLevel": 3, "subclassTitle": "Specializzazione",
    "resources": [], "icon": "🔧",
    "features": [{
      "id": "artefice-infusioni", "name": "Infusioni", "level": 2,
      "description": "...",
      "selection": { "poolId": "infusioni", "unlocks": [{ "level": 2, "maxTotal": 4 }] }
    }]
  }],
  "subclasses": [{ "id": "...", "classId": "artefice", "name": "...",
                   "description": "...", "features": [] }],
  "backgrounds": [{ "id": "...", "name": "...", "description": "...",
                    "skillProficiencies": ["arcano"], "toolProficiencies": [],
                    "languages": [], "equipment": [],
                    "feature": { "name": "...", "description": "..." }, "icon": "🎯" }],
  "spells": [{ "id": "...", "name": "...", "level": 1, "school": "Invocazione",
               "castingTime": "1 azione", "range": "18 metri", "components": "V, S",
               "duration": "Istantanea", "concentration": false, "description": "...",
               "classIds": ["mago"], "subclassIds": [] }],
  "optionPools": [{ "id": "infusioni", "name": "Infusioni",
                    "options": [{ "id": "...", "name": "...", "description": "..." }] }]
}`;

  onFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.jsonText = String(reader.result ?? '');
      this.validate();
    };
    reader.readAsText(file);
  }

  validate(): void {
    this.imported.set(false);
    this.result.set(this.importService.validate(this.jsonText));
  }

  async doImport(): Promise<void> {
    const r = this.result();
    if (!r?.valid || !r.payload) return;
    this.importing.set(true);
    try {
      await this.importService.import(r.payload);
      this.imported.set(true);
    } finally {
      this.importing.set(false);
    }
  }

  loadExample(): void {
    this.jsonText = JSON.stringify({
      spells: [{
        id: 'onda-tonante', name: 'Onda Tonante', level: 1, school: 'Invocazione',
        castingTime: '1 azione', range: 'Incantatore (cubo 4,5 m)', components: 'V, S',
        duration: 'Istantanea', concentration: false,
        description: 'Un\'ondata di forza tonante: 2d8 danni da tuono e spinta di 3 metri (TS su Costituzione).',
        classIds: ['bardo', 'druido', 'stregone', 'mago'], subclassIds: []
      }]
    }, null, 2);
    this.validate();
  }
}

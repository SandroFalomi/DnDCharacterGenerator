import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClassFeature } from '../../core/models/content.model';
import { ContentService } from '../../core/services/content.service';
import { slugify } from '../../shared/utils/slug';

// ============================================================
// Editor generico delle abilità di classe/sottoclasse:
// gestisce livello di sblocco, effetti speciali (Maestria,
// mezza competenza) e sotto-opzioni selezionabili con
// progressione dei massimi e prerequisiti.
// ============================================================
@Component({
  selector: 'app-feature-list-editor',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="flex-between mb-1">
      <h4>Abilità ({{ features.length }})</h4>
      <button type="button" class="btn btn-ghost btn-sm" (click)="addFeature()">+ Abilità</button>
    </div>

    @for (feature of features; track $index; let i = $index) {
      <div class="feature-box">
        <div class="flex-between">
          <strong class="gold">{{ feature.name || 'Nuova abilità' }}</strong>
          <button type="button" class="btn btn-danger btn-sm" (click)="features.splice(i, 1)">✕</button>
        </div>
        <div class="grid-3">
          <div class="form-field">
            <label>Nome</label>
            <input [(ngModel)]="feature.name" (blur)="ensureId(feature)" />
          </div>
          <div class="form-field">
            <label>Livello di sblocco</label>
            <input type="number" min="1" max="20" [(ngModel)]="feature.level" />
          </div>
          <div class="form-field">
            <label>Tipo di utilizzo</label>
            <select [ngModel]="feature.actionType ?? 'none'" (ngModelChange)="feature.actionType = $event">
              <option value="none">◆ Passiva / Nessuna azione</option>
              <option value="action">⚔ Azione</option>
              <option value="bonus">⚡ Azione Bonus</option>
              <option value="reaction">↺ Reazione</option>
            </select>
          </div>
        </div>
        <div class="form-field">
          <label>Effetto speciale</label>
          <select [ngModel]="feature.effect?.type ?? ''" (ngModelChange)="setEffect(feature, $event)">
            <option value="">Nessuno</option>
            <option value="expertise">Maestria (doppio bonus competenza)</option>
            <option value="half-proficiency">Metà competenza alle abilità senza competenza</option>
          </select>
        </div>
        <div class="form-field">
          <label>Descrizione</label>
          <textarea rows="2" [(ngModel)]="feature.description"></textarea>
        </div>

        @if (feature.effect?.type === 'expertise') {
          <div class="sub-config">
            <div class="flex-between mb-1">
              <span class="config-title">Scelte Maestria per livello</span>
              <button type="button" class="btn btn-ghost btn-sm" (click)="addTier(feature)">+ Livello</button>
            </div>
            @for (tier of feature.effect!.tiers ?? []; track $index; let t = $index) {
              <div class="unlock-row">
                <label class="small">Al livello <input type="number" min="1" max="20" [(ngModel)]="tier.level" /></label>
                <label class="small">abilità aggiuntive <input type="number" min="1" max="10" [(ngModel)]="tier.count" /></label>
                <button type="button" class="btn btn-danger btn-sm" (click)="feature.effect!.tiers!.splice(t, 1)">✕</button>
              </div>
            }
            <div class="form-field mt-1">
              <label>Abilità valide (vuoto = tutte quelle con competenza)</label>
              <select multiple size="5" [(ngModel)]="feature.effect!.eligibleSkillIds">
                @for (skill of content.skills; track skill.id) { <option [value]="skill.id">{{ skill.name }}</option> }
              </select>
              <span class="hint">Ctrl+click per selezioni multiple.</span>
            </div>
          </div>
        }

        <div class="sub-config">
          <label class="flex small config-title">
            <input type="checkbox" [checked]="!!feature.selection" (change)="toggleSelection(feature)" />
            Sotto-opzioni selezionabili (manovre, discipline, invocazioni…)
          </label>
          @if (feature.selection; as sel) {
            <div class="form-field mt-1">
              <label>Pool di opzioni</label>
              <select [(ngModel)]="sel.poolId">
                <option value="">— Scegli un pool —</option>
                @for (pool of content.optionPools(); track pool.id) { <option [value]="pool.id">{{ pool.name }}</option> }
              </select>
            </div>
            <div class="flex-between mb-1">
              <span class="config-title">Progressione delle scelte</span>
              <button type="button" class="btn btn-ghost btn-sm" (click)="sel.unlocks.push({ level: 1, maxTotal: 1 })">+ Soglia</button>
            </div>
            @for (unlock of sel.unlocks; track $index; let u = $index) {
              <div class="unlock-row">
                <label class="small">Dal livello <input type="number" min="1" max="20" [(ngModel)]="unlock.level" /></label>
                <label class="small">max totale <input type="number" min="1" max="20" [(ngModel)]="unlock.maxTotal" /></label>
                <button type="button" class="btn btn-danger btn-sm" (click)="sel.unlocks.splice(u, 1)">✕</button>
              </div>
            }
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .feature-box {
      border: 1px solid rgba(201, 168, 76, 0.2); border-radius: 8px;
      padding: 14px; margin-bottom: 12px; background: rgba(10, 10, 16, 0.4);
    }
    .gold { color: var(--gold-bright); font-family: var(--font-title); }
    .sub-config {
      border-left: 2px solid rgba(109, 90, 158, 0.4);
      padding: 8px 0 8px 12px; margin-top: 8px;
    }
    .config-title { font-family: var(--font-title); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #b3a1e0; }
    .unlock-row {
      display: flex; align-items: center; gap: 14px; margin: 6px 0;
      input { width: 70px; padding: 4px 8px; margin-left: 6px; }
    }
  `]
})
export class FeatureListEditorComponent {
  @Input({ required: true }) features!: ClassFeature[];
  readonly content = inject(ContentService);

  addFeature(): void {
    this.features.push({ id: '', name: '', description: '', level: 1 });
  }

  ensureId(feature: ClassFeature): void {
    if (!feature.id && feature.name) feature.id = slugify(feature.name);
  }

  setEffect(feature: ClassFeature, type: string): void {
    if (!type) {
      delete feature.effect;
    } else if (type === 'expertise') {
      feature.effect = { type: 'expertise', tiers: [{ level: feature.level, count: 2 }], eligibleSkillIds: [] };
    } else {
      feature.effect = { type: 'half-proficiency' };
    }
  }

  addTier(feature: ClassFeature): void {
    feature.effect!.tiers = feature.effect!.tiers ?? [];
    feature.effect!.tiers.push({ level: 10, count: 2 });
  }

  toggleSelection(feature: ClassFeature): void {
    if (feature.selection) {
      delete feature.selection;
    } else {
      feature.selection = { poolId: '', unlocks: [{ level: feature.level, maxTotal: 2 }] };
    }
  }
}

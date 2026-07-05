import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { WizardService, StatMethod } from '../wizard.service';
import { ContentService } from '../../../core/services/content.service';
import { RulesService } from '../../../core/services/rules.service';
import { ModalComponent } from '../../../shared/components/modal';
import { ABILITY_KEYS, ABILITY_LABELS, ABILITY_SHORT, AbilityKey } from '../../../core/models/content.model';
import { POINT_BUY_BUDGET, POINT_BUY_COSTS, STANDARD_ARRAYS } from '../../../data/standard-arrays';

@Component({
  selector: 'app-step-stats',
  standalone: true,
  imports: [FormsModule, ModalComponent, CdkDropListGroup, CdkDropList, CdkDrag],
  template: `
    @if (!wizard.racialChoiceMade()) {
      <app-modal title="Modificatori Razziali" width="520px" [hasFooter]="true" (closed)="chooseRacial(false)">
        <p>Vuoi applicare i modificatori di razza <strong>{{ raceName() }}</strong> ai punteggi caratteristica?</p>
        <div class="stat-chips mt-1">
          @for (b of racialBonuses(); track b.key) { <span class="badge">+{{ b.value }} {{ short[b.key] }}</span> }
        </div>
        <div footer>
          <button type="button" class="btn btn-ghost" (click)="chooseRacial(false)">No, ignora</button>
          <button type="button" class="btn btn-primary" (click)="chooseRacial(true)">Sì, applica</button>
        </div>
      </app-modal>
    }

    <h2 class="mb-2">Distribuisci i Punteggi Caratteristica</h2>

    <div class="tabs">
      <button type="button" class="tab" [class.active]="method() === 'array'" (click)="setMethod('array')">Array Standard</button>
      <button type="button" class="tab" [class.active]="method() === 'pointbuy'" (click)="setMethod('pointbuy')">Point Buy</button>
      <button type="button" class="tab" [class.active]="method() === 'manual'" (click)="setMethod('manual')">Manuale</button>
    </div>

    @switch (method()) {
      @case ('array') {
        <div class="form-field" style="max-width: 320px;">
          <label>Array di partenza</label>
          <select [ngModel]="arrayIndex()" (ngModelChange)="pickArray($event)">
            @for (arr of arrays; track arr.name; let i = $index) {
              <option [ngValue]="i">{{ arr.name }} ({{ arr.values.join(', ') }})</option>
            }
          </select>
          <span class="hint">Trascina i valori sulle caratteristiche.</span>
        </div>
        <div cdkDropListGroup class="dnd-area">
          <div class="pool card">
            <h4 class="mb-1">Valori</h4>
            <div class="pool-list" cdkDropList [cdkDropListData]="pool()" (cdkDropListDropped)="dropToPool($event)">
              @for (value of pool(); track $index) {
                <div class="value-chip" cdkDrag>{{ value }}</div>
              }
              @if (pool().length === 0) { <p class="small muted">Tutti i valori assegnati ✓</p> }
            </div>
          </div>
          <div class="targets">
            @for (key of keys; track key) {
              <div class="target card">
                <span class="target-label">{{ labels[key] }}</span>
                <div class="target-slot" cdkDropList [cdkDropListData]="slotOf(key)" (cdkDropListDropped)="dropToSlot($event, key)">
                  @for (value of slotOf(key); track $index) {
                    <div class="value-chip assigned" cdkDrag>{{ value }}</div>
                  }
                  @if (slotOf(key).length === 0) { <span class="placeholder">—</span> }
                </div>
                <span class="mod">{{ modLabel(key) }}</span>
              </div>
            }
          </div>
        </div>
      }
      @case ('pointbuy') {
        <div class="flex-between mb-2 budget-bar card">
          <span>Punti spesi: <strong [class.over]="spent() > budget">{{ spent() }}</strong> / {{ budget }}</span>
          <span class="small muted">Punteggi da 8 a 15</span>
        </div>
        <div class="pb-grid">
          @for (key of keys; track key) {
            <div class="card pb-box">
              <span class="target-label">{{ labels[key] }}</span>
              <div class="pb-controls">
                <button type="button" class="btn btn-ghost btn-sm" (click)="pbAdjust(key, -1)" [disabled]="stats()[key] <= 8">−</button>
                <span class="pb-score">{{ stats()[key] }}</span>
                <button type="button" class="btn btn-ghost btn-sm" (click)="pbAdjust(key, 1)" [disabled]="stats()[key] >= 15 || spent() + nextCost(key) > budget">+</button>
              </div>
              <span class="mod">{{ modLabel(key) }}</span>
              <span class="small muted">costo {{ costOf(stats()[key]) }}</span>
            </div>
          }
        </div>
        <details class="mt-2 cost-table">
          <summary class="muted small">Tabella dei costi</summary>
          <table class="dnd-table" style="max-width: 300px;">
            <thead><tr><th>Punteggio</th><th>Costo</th></tr></thead>
            <tbody>
              @for (c of costs; track c.score) { <tr><td>{{ c.score }}</td><td>{{ c.cost }}</td></tr> }
            </tbody>
          </table>
        </details>
      }
      @case ('manual') {
        <div class="pb-grid">
          @for (key of keys; track key) {
            <div class="card pb-box">
              <span class="target-label">{{ labels[key] }}</span>
              <input type="number" min="1" max="30" class="manual-input"
                     [ngModel]="stats()[key]" (ngModelChange)="setManual(key, $event)" />
              <span class="mod">{{ modLabel(key) }}</span>
            </div>
          }
        </div>
        @if (outOfStandard()) {
          <p class="warning mt-2">⚠ Alcuni valori sono fuori dallo standard (3–18). Puoi comunque procedere.</p>
        }
      }
    }

    @if (!wizard.applyRacialBonuses()) {
      <div class="card mt-2 custom-bonus-box">
        <h4 class="mb-1">Bonus Caratteristica Liberi</h4>
        <p class="small muted mb-1">Poiché non usi i bonus razziali fissi, assegna liberamente un bonus <strong>+2</strong> a una caratteristica e un bonus <strong>+1</strong> a un'altra.</p>
        <div class="grid-2">
          <div class="form-field">
            <label>Bonus +2</label>
            <select [ngModel]="plus2Key()" (ngModelChange)="setPlus2($event)">
              <option [ngValue]="null">— Nessuna —</option>
              @for (key of keys; track key) { <option [ngValue]="key" [disabled]="key === plus1Key()">{{ labels[key] }}</option> }
            </select>
          </div>
          <div class="form-field">
            <label>Bonus +1</label>
            <select [ngModel]="plus1Key()" (ngModelChange)="setPlus1($event)">
              <option [ngValue]="null">— Nessuna —</option>
              @for (key of keys; track key) { <option [ngValue]="key" [disabled]="key === plus2Key()">{{ labels[key] }}</option> }
            </select>
          </div>
        </div>
      </div>
    }

    @if ((wizard.applyRacialBonuses() && racialBonuses().length > 0) || (!wizard.applyRacialBonuses() && hasCustomBonus())) {
      <div class="card mt-2 racial-recap">
        <h4 class="mb-1">Totali con bonus {{ wizard.applyRacialBonuses() ? 'razziali' : 'liberi' }}</h4>
        <div class="stat-chips">
          @for (key of keys; track key) {
            <span class="badge badge-lvl">{{ short[key] }} {{ stats()[key] }} {{ bonusOf(key) > 0 ? '+ ' + bonusOf(key) : '' }} = <strong>{{ finalOf(key) }}</strong></span>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .dnd-area { display: grid; grid-template-columns: 220px 1fr; gap: 20px; @media (max-width: 780px) { grid-template-columns: 1fr; } }
    .pool-list { display: flex; flex-wrap: wrap; gap: 8px; min-height: 60px; }
    .value-chip {
      width: 52px; height: 52px; display: flex; align-items: center; justify-content: center;
      font-family: var(--font-title); font-size: 1.25rem; font-weight: 700;
      background: linear-gradient(160deg, #3a2f14, #2a220f);
      border: 1px solid var(--gold-dim); border-radius: 8px; color: var(--gold-bright);
      cursor: grab;
    }
    .value-chip.assigned { border-color: var(--gold); box-shadow: 0 0 12px rgba(201,168,76,0.3); }
    .targets { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); } }
    .target { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 14px; }
    .target-label { font-family: var(--font-title); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--gold); }
    .target-slot {
      width: 64px; height: 64px; border-radius: 10px;
      border: 2px dashed rgba(201, 168, 76, 0.35);
      display: flex; align-items: center; justify-content: center;
    }
    .placeholder { color: var(--ink); font-size: 1.4rem; }
    .mod { font-family: var(--font-title); color: var(--parchment-dim); }
    .budget-bar { padding: 12px 18px; }
    .budget-bar .over { color: var(--blood-bright); }
    .pb-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); } }
    .pb-box { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; }
    .pb-controls { display: flex; align-items: center; gap: 12px; }
    .pb-score { font-family: var(--font-title); font-size: 1.5rem; color: var(--gold-bright); min-width: 34px; text-align: center; }
    .manual-input { width: 80px; text-align: center; font-size: 1.2rem; font-family: var(--font-title); }
    .warning { color: #e8b34a; }
    .racial-recap { border-color: rgba(109, 90, 158, 0.4); }
    .cost-table summary { cursor: pointer; }
  `]
})
export class StepStatsComponent {
  readonly wizard = inject(WizardService);
  private content = inject(ContentService);
  private rules = inject(RulesService);

  readonly keys = ABILITY_KEYS;
  readonly labels = ABILITY_LABELS;
  readonly short = ABILITY_SHORT;
  readonly arrays = STANDARD_ARRAYS;
  readonly costs = POINT_BUY_COSTS;
  readonly budget = POINT_BUY_BUDGET;

  readonly method = computed(() => this.wizard.statMethod());
  readonly stats = computed(() => this.wizard.stats());
  readonly arrayIndex = signal(0);
  readonly pool = signal<number[]>([...STANDARD_ARRAYS[0].values]);
  private slots = signal<Record<AbilityKey, number[]>>({ STR: [], DEX: [], CON: [], INT: [], WIS: [], CHA: [] });

  raceName(): string {
    return this.content.raceMap().get(this.wizard.raceId())?.name ?? '';
  }

  racialBonuses() {
    const race = this.content.raceMap().get(this.wizard.raceId());
    if (!race) return [];
    return (Object.keys(race.abilityBonuses) as AbilityKey[])
      .map(key => ({ key, value: race.abilityBonuses[key] ?? 0 }))
      .filter(b => b.value !== 0);
  }

  chooseRacial(apply: boolean): void {
    this.wizard.applyRacialBonuses.set(apply);
    this.wizard.racialChoiceMade.set(true);
  }

  setMethod(method: StatMethod): void {
    this.wizard.statMethod.set(method);
    if (method === 'array') this.pickArray(this.arrayIndex());
    if (method === 'pointbuy') {
      const next = { ...this.wizard.stats() };
      for (const key of this.keys) next[key] = Math.max(8, Math.min(15, next[key]));
      this.wizard.stats.set(next);
    }
  }

  // ---------- Array standard (drag & drop) ----------
  pickArray(index: number): void {
    this.arrayIndex.set(index);
    this.pool.set([...this.arrays[index].values]);
    this.slots.set({ STR: [], DEX: [], CON: [], INT: [], WIS: [], CHA: [] });
    this.syncFromSlots();
  }

  slotOf(key: AbilityKey): number[] {
    return this.slots()[key];
  }

  dropToSlot(event: CdkDragDrop<number[]>, key: AbilityKey): void {
    if (event.previousContainer === event.container) return;
    const value = event.previousContainer.data[event.previousIndex];
    event.previousContainer.data.splice(event.previousIndex, 1);
    const current = this.slots()[key];
    if (current.length > 0) this.pool.update(p => [...p, current[0]]);
    this.slots.update(s => ({ ...s, [key]: [value] }));
    this.pool.update(p => [...p]);
    this.syncFromSlots();
  }

  dropToPool(event: CdkDragDrop<number[]>): void {
    if (event.previousContainer === event.container) return;
    const value = event.previousContainer.data[event.previousIndex];
    event.previousContainer.data.splice(event.previousIndex, 1);
    this.pool.update(p => [...p, value]);
    this.slots.update(s => ({ ...s }));
    this.syncFromSlots();
  }

  private syncFromSlots(): void {
    const next = { ...this.wizard.stats() };
    for (const key of this.keys) {
      next[key] = this.slots()[key][0] ?? 8;
    }
    this.wizard.stats.set(next);
  }

  // ---------- Point buy ----------
  costOf(score: number): number {
    return this.costs.find(c => c.score === score)?.cost ?? 0;
  }

  spent(): number {
    return this.keys.reduce((sum, key) => sum + this.costOf(this.stats()[key]), 0);
  }

  nextCost(key: AbilityKey): number {
    return this.costOf(this.stats()[key] + 1) - this.costOf(this.stats()[key]);
  }

  pbAdjust(key: AbilityKey, delta: number): void {
    const next = { ...this.stats() };
    next[key] = Math.max(8, Math.min(15, next[key] + delta));
    this.wizard.stats.set(next);
  }

  // ---------- Manuale ----------
  setManual(key: AbilityKey, value: number): void {
    const next = { ...this.stats() };
    next[key] = Number(value) || 0;
    this.wizard.stats.set(next);
  }

  outOfStandard(): boolean {
    return this.keys.some(key => this.stats()[key] < 3 || this.stats()[key] > 18);
  }

  // ---------- Riepilogo ----------
  modLabel(key: AbilityKey): string {
    return this.rules.formatMod(this.rules.abilityMod(this.finalOf(key)));
  }

  bonusOf(key: AbilityKey): number {
    if (!this.wizard.applyRacialBonuses()) return this.wizard.customAbilityBonuses()[key] ?? 0;
    const race = this.content.raceMap().get(this.wizard.raceId());
    return race?.abilityBonuses[key] ?? 0;
  }

  finalOf(key: AbilityKey): number {
    return this.stats()[key] + this.bonusOf(key);
  }

  // ---------- Bonus liberi (+2/+1) ----------
  hasCustomBonus(): boolean {
    return Object.keys(this.wizard.customAbilityBonuses()).length > 0;
  }

  plus2Key(): AbilityKey | null {
    const entry = Object.entries(this.wizard.customAbilityBonuses()).find(([, v]) => v === 2);
    return (entry?.[0] as AbilityKey) ?? null;
  }

  plus1Key(): AbilityKey | null {
    const entry = Object.entries(this.wizard.customAbilityBonuses()).find(([, v]) => v === 1);
    return (entry?.[0] as AbilityKey) ?? null;
  }

  setPlus2(key: AbilityKey | null): void {
    const current: Partial<Record<AbilityKey, number>> = { ...this.wizard.customAbilityBonuses() };
    for (const k of Object.keys(current) as AbilityKey[]) if (current[k] === 2) delete current[k];
    if (key) current[key] = 2;
    this.wizard.customAbilityBonuses.set(current);
  }

  setPlus1(key: AbilityKey | null): void {
    const current: Partial<Record<AbilityKey, number>> = { ...this.wizard.customAbilityBonuses() };
    for (const k of Object.keys(current) as AbilityKey[]) if (current[k] === 1) delete current[k];
    if (key) current[key] = 1;
    this.wizard.customAbilityBonuses.set(current);
  }
}

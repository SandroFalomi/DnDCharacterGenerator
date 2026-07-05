import { Component, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ContentService } from '../../core/services/content.service';
import { ABILITY_SHORT, ClassFeature, DndClass, OptionPool, Subclass } from '../../core/models/content.model';

// ============================================================
// Sezione Home: consultazione di classi, sottoclassi,
// abilità per livello e sotto-abilità selezionabili.
// ============================================================
@Component({
  selector: 'app-class-browser',
  standalone: true,
  animations: [
    trigger('detailTransition', [
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(0.97) translateY(8px)' }),
        animate('280ms cubic-bezier(0.2, 0.8, 0.3, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="list-detail">
      <aside>
        <div class="select-list">
          @for (cls of content.classes(); track cls.id) {
            <button type="button" class="select-item" [class.selected]="selectedId() === cls.id" (click)="selectedId.set(cls.id)">
              <span class="icon">{{ cls.icon }}</span>
              <span>{{ cls.name }}</span>
              @if (cls.spellcasting) { <span class="badge badge-arcane" style="margin-left:auto">✦</span> }
            </button>
          }
        </div>
      </aside>

      @if (selected(); as cls) {
        <section class="detail-panel card card-ornate" [@detailTransition]="cls.id">
          <div class="detail-hero">
            <div class="hero-icon">{{ cls.icon }}</div>
            <div>
              <h2>{{ cls.name }}</h2>
              <p class="sub">{{ cls.description }}</p>
            </div>
          </div>

          <div class="stat-chips">
            <span class="badge">Dado Vita: d{{ cls.hitDie }}</span>
            <span class="badge">TS: {{ savingThrows(cls) }}</span>
            @if (cls.spellcasting) { <span class="badge badge-arcane">Incantatore ({{ progressionLabel(cls.spellcasting.progression) }})</span> }
            @for (res of cls.resources; track res.name) {
              <span class="badge badge-blood" [title]="res.description">{{ res.name }} (liv. {{ res.level }})</span>
            }
          </div>

          <h3 class="section-title">Abilità di Classe</h3>
          @for (feature of sortedFeatures(cls); track feature.id) {
            <div class="accordion-item">
              <button type="button" class="accordion-header" [class.open]="isOpen('f-' + feature.id)" (click)="toggle('f-' + feature.id)">
                <span class="flex">
                  <span class="badge badge-lvl">Liv. {{ feature.level }}</span>
                  {{ feature.name }}
                  @if (feature.selection) { <span class="badge badge-arcane">Scelte</span> }
                  @if (feature.effect?.type === 'expertise') { <span class="badge">Maestria</span> }
                  @if (feature.effect?.type === 'half-proficiency') { <span class="badge">½ Competenza</span> }
                </span>
                <span class="chev">❯</span>
              </button>
              @if (isOpen('f-' + feature.id)) {
                <div class="accordion-body">
                  <p>{{ feature.description }}</p>
                  @if (feature.selection; as sel) {
                    <ng-container *ngTemplateOutlet="poolDetail; context: { sel }" />
                  }
                </div>
              }
            </div>
          }

          <h3 class="section-title">{{ cls.subclassTitle }} <span class="muted small">(dal livello {{ cls.subclassLevel }})</span></h3>
          @if (subclasses().length === 0) {
            <p class="muted small">Nessuna sottoclasse registrata per questa classe.</p>
          }
          @for (sub of subclasses(); track sub.id) {
            <div class="accordion-item subclass-item">
              <button type="button" class="accordion-header" [class.open]="isOpen('s-' + sub.id)" (click)="toggle('s-' + sub.id)">
                <span class="flex">
                  <strong>{{ sub.name }}</strong>
                  @if (sub.spellcasting) { <span class="badge badge-arcane">Magica</span> }
                </span>
                <span class="chev">❯</span>
              </button>
              @if (isOpen('s-' + sub.id)) {
                <div class="accordion-body">
                  <p class="mb-1"><em>{{ sub.description }}</em></p>
                  @for (feature of sub.features; track feature.id) {
                    <div class="trait-row">
                      <div class="trait-name flex">
                        <span class="badge badge-lvl">Liv. {{ feature.level }}</span> {{ feature.name }}
                        @if (feature.selection) { <span class="badge badge-arcane">Scelte</span> }
                      </div>
                      <div class="trait-desc">{{ feature.description }}</div>
                      @if (feature.selection; as sel) {
                        <ng-container *ngTemplateOutlet="poolDetail; context: { sel }" />
                      }
                    </div>
                  }
                </div>
              }
            </div>
          }
        </section>
      }
    </div>

    <ng-template #poolDetail let-sel="sel">
      @if (pool(sel.poolId); as p) {
        <div class="pool-box">
          <div class="flex-between">
            <strong class="pool-title">✦ {{ p.name }}</strong>
            <span class="small muted">{{ unlockLabel(sel) }}</span>
          </div>
          @for (opt of p.options; track opt.id) {
            <div class="trait-row">
              <div class="trait-name small">
                {{ opt.name }}
                @if (opt.prerequisite?.minLevel) { <span class="badge badge-lvl">Liv. {{ opt.prerequisite?.minLevel }}+</span> }
                @if (opt.prerequisite?.note) { <span class="badge">{{ opt.prerequisite?.note }}</span> }
              </div>
              <div class="trait-desc small">{{ opt.description }}</div>
            </div>
          }
        </div>
      }
    </ng-template>
  `,
  imports: [NgTemplateOutlet],
  styles: [`
    .subclass-item { border-color: rgba(109, 90, 158, 0.4); }
    .pool-box {
      margin-top: 10px; padding: 12px 14px;
      border: 1px dashed rgba(109, 90, 158, 0.5); border-radius: 8px;
      background: rgba(109, 90, 158, 0.07);
    }
    .pool-title { font-family: var(--font-title); color: #b3a1e0; }
  `]
})
export class ClassBrowserComponent {
  readonly content = inject(ContentService);
  readonly selectedId = signal<string>('');
  private openItems = signal<Set<string>>(new Set());

  readonly selected = computed<DndClass | undefined>(() => {
    const id = this.selectedId() || this.content.classes()[0]?.id;
    return this.content.classMap().get(id);
  });

  readonly subclasses = computed<Subclass[]>(() => {
    const cls = this.selected();
    return cls ? this.content.subclassesOf(cls.id) : [];
  });

  sortedFeatures(cls: DndClass): ClassFeature[] {
    return [...cls.features].sort((a, b) => a.level - b.level);
  }

  savingThrows(cls: DndClass): string {
    return cls.savingThrows.map(k => ABILITY_SHORT[k]).join(', ');
  }

  progressionLabel(progression: string): string {
    return { full: 'completo', half: 'a metà', third: 'a un terzo', pact: 'patto' }[progression] ?? progression;
  }

  pool(id: string): OptionPool | undefined {
    return this.content.poolMap().get(id);
  }

  unlockLabel(sel: { unlocks: { level: number; maxTotal: number }[] }): string {
    return sel.unlocks.map(u => `liv. ${u.level}: max ${u.maxTotal}`).join(' · ');
  }

  isOpen(key: string): boolean {
    return this.openItems().has(key);
  }

  toggle(key: string): void {
    const set = new Set(this.openItems());
    set.has(key) ? set.delete(key) : set.add(key);
    this.openItems.set(set);
  }
}

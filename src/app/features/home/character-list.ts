import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Character, emptyCharacter } from '../../core/models/character.model';
import { CharacterService } from '../../core/services/character.service';
import { ContentService } from '../../core/services/content.service';
import { RulesService } from '../../core/services/rules.service';
import { ModalComponent } from '../../shared/components/modal';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [ModalComponent],
  template: `
    <div class="flex-between mb-2">
      <p class="muted small">{{ characters.characters().length }} personaggi custoditi nel grimorio</p>
      <button type="button" class="btn btn-primary" (click)="createOpen.set(true)">+ Crea Nuovo Personaggio</button>
    </div>

    @if (characters.loading()) {
      <div class="spinner"></div>
    } @else if (characters.characters().length === 0) {
      <div class="empty-state card card-ornate">
        <span class="rune">☠</span>
        Nessun eroe ancora forgiato. Il destino attende…
      </div>
    } @else {
      <div class="char-grid">
        @for (char of characters.characters(); track char.id) {
          <article class="char-card card card-ornate" (click)="open(char)">
            <div class="char-icon">{{ raceIcon(char) }}</div>
            <h3 class="char-name">{{ char.name }}</h3>
            <p class="char-meta">{{ raceName(char) }} · {{ rules.classLabel(char) }}</p>
            <div class="stat-chips">
              <span class="badge badge-lvl">Livello {{ rules.totalLevel(char) }}</span>
              @if (char.classes.length > 1) { <span class="badge badge-arcane">Multiclasse</span> }
            </div>
            <div class="char-actions">
              <button type="button" class="btn btn-ghost btn-sm" (click)="open(char); $event.stopPropagation()">Modifica</button>
              <button type="button" class="btn btn-danger btn-sm" (click)="askDelete(char); $event.stopPropagation()">Elimina</button>
            </div>
          </article>
        }
      </div>
    }

    @if (createOpen()) {
      <app-modal title="Crea Nuovo Personaggio" width="560px" (closed)="createOpen.set(false)">
        <p class="muted mb-2">Come vuoi dare vita al tuo eroe?</p>
        <div class="grid-2">
          <button type="button" class="choice-card" (click)="startWizard()">
            <span class="choice-icon">🧭</span>
            <strong>Creazione Guidata</strong>
            <span class="small muted">Un percorso passo passo tra razze, classi, background e caratteristiche.</span>
          </button>
          <button type="button" class="choice-card" (click)="startFree()">
            <span class="choice-icon">✒️</span>
            <strong>Creazione Libera</strong>
            <span class="small muted">Apri una scheda vuota e compila ogni campo a mano.</span>
          </button>
        </div>
      </app-modal>
    }

    @if (toDelete(); as char) {
      <app-modal title="Eliminare il personaggio?" width="480px" [hasFooter]="true" (closed)="toDelete.set(null)">
        <p><strong class="danger-name">{{ char.name }}</strong> sarà cancellato per sempre dal grimorio. Questa azione non può essere annullata.</p>
        <div footer>
          <button type="button" class="btn btn-ghost" (click)="toDelete.set(null)">Annulla</button>
          <button type="button" class="btn btn-danger" (click)="confirmDelete()">Elimina</button>
        </div>
      </app-modal>
    }
  `,
  styles: [`
    .char-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 18px; }
    .char-card {
      cursor: pointer; text-align: center;
      transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    }
    .char-card:hover {
      transform: translateY(-5px);
      border-color: var(--gold);
      box-shadow: 0 14px 34px rgba(0,0,0,0.6), 0 0 24px rgba(201, 168, 76, 0.18);
    }
    .char-icon {
      font-size: 2.4rem; width: 72px; height: 72px; margin: 4px auto 10px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, rgba(201,168,76,0.25), rgba(139,0,0,0.12) 60%, rgba(10,10,16,0.9));
      border: 2px solid var(--gold-dim);
      box-shadow: inset 0 0 16px rgba(0,0,0,0.5);
    }
    .char-name { font-family: var(--font-deco); font-size: 1.15rem; margin-bottom: 4px; }
    .char-meta { color: var(--parchment-dim); font-size: 0.88rem; font-style: italic; }
    .stat-chips { justify-content: center; }
    .char-actions { display: flex; justify-content: center; gap: 10px; margin-top: 12px; }
    .choice-card {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 24px 16px; border-radius: 10px; cursor: pointer;
      background: rgba(26, 26, 46, 0.6);
      border: 1px solid rgba(201, 168, 76, 0.25);
      color: var(--parchment); font-family: var(--font-body); text-align: center;
      transition: all 0.22s;
    }
    .choice-card:hover { border-color: var(--gold); background: rgba(201, 168, 76, 0.08); transform: translateY(-2px); }
    .choice-card strong { font-family: var(--font-title); color: var(--gold-bright); }
    .choice-icon { font-size: 2rem; }
    .danger-name { color: var(--blood-bright); }
  `]
})
export class CharacterListComponent implements OnInit {
  readonly characters = inject(CharacterService);
  readonly rules = inject(RulesService);
  private content = inject(ContentService);
  private router = inject(Router);

  readonly createOpen = signal(false);
  readonly toDelete = signal<Character | null>(null);

  ngOnInit(): void {
    void this.characters.loadAll();
  }

  raceName(char: Character): string {
    return this.rules.effectiveRace(char.raceId, char.subraceId)?.name ?? 'Origine ignota';
  }

  raceIcon(char: Character): string {
    return this.content.raceMap().get(char.raceId)?.icon ?? '❓';
  }

  open(char: Character): void {
    void this.router.navigate(['/character', char.id]);
  }

  startWizard(): void {
    this.createOpen.set(false);
    void this.router.navigate(['/wizard']);
  }

  async startFree(): Promise<void> {
    this.createOpen.set(false);
    const char = emptyCharacter();
    char.name = 'Eroe Senza Nome';
    const id = await this.characters.add(char);
    void this.router.navigate(['/character', id]);
  }

  askDelete(char: Character): void {
    this.toDelete.set(char);
  }

  async confirmDelete(): Promise<void> {
    const char = this.toDelete();
    if (char?.id != null) await this.characters.remove(char.id);
    this.toDelete.set(null);
  }
}

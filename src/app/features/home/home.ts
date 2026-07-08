import { Component, signal } from '@angular/core';
import { CharacterListComponent } from './character-list';
import { ClassBrowserComponent } from './class-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CharacterListComponent, ClassBrowserComponent],
  template: `
    <div class="page">
      <section class="hero">
        <h1 class="hero-title">Grimorio degli Eroi</h1>
        <p class="hero-sub">Forgia leggende, consulta i sentieri delle classi e custodisci le tue schede personaggio.</p>
      </section>

      <div class="tabs">
        <button type="button" class="tab" [class.active]="tab() === 'characters'" (click)="tab.set('characters')">⚔ I Tuoi Personaggi</button>
        <button type="button" class="tab" [class.active]="tab() === 'classes'" (click)="tab.set('classes')">📖 Compendio delle Classi</button>
      </div>

      @if (tab() === 'characters') {
        <app-character-list class="fade-in" />
      } @else {
        <app-class-browser class="fade-in" />
      }
    </div>
  `,
  styles: [`
    .hero { text-align: center; padding: 34px 0 10px; }
    .hero-title {
      font-family: var(--font-deco); font-size: 2.6rem;
      background: linear-gradient(180deg, var(--gold-bright), var(--gold-dim));
      -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
      text-shadow: 0 0 40px rgba(201, 168, 76, 0.25);
      margin-bottom: 8px;
    }
    .hero-sub { color: var(--parchment-dim); font-style: italic; margin-bottom: 26px; }
    @media (max-width: 640px) {
      .hero { padding: 16px 0 4px; }
      .hero-title { font-size: 1.65rem; }
      .hero-sub { font-size: 0.85rem; margin-bottom: 16px; }
    }
  `]
})
export class HomeComponent {
  readonly tab = signal<'characters' | 'classes'>('characters');
}

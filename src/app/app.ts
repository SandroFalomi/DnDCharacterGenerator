import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <a routerLink="/" class="brand">
        <span class="brand-rune">⚜</span>
        <span class="brand-text">Grimorio</span>
        <span class="brand-sub">Schede Personaggio D&D 5e</span>
      </a>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
        <a routerLink="/developer" routerLinkActive="active">Gestione Contenuti</a>
      </nav>
    </header>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-header {
      position: sticky; top: 0; z-index: 50;
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 28px;
      background: linear-gradient(180deg, rgba(10, 10, 16, 0.97), rgba(18, 18, 28, 0.92));
      border-bottom: 1px solid rgba(201, 168, 76, 0.3);
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
    }
    .brand { display: flex; align-items: baseline; gap: 10px; }
    .brand-rune { font-size: 1.6rem; color: var(--gold); text-shadow: 0 0 14px rgba(201, 168, 76, 0.6); }
    .brand-text { font-family: var(--font-deco); font-size: 1.4rem; font-weight: 700; color: var(--gold-bright); letter-spacing: 0.06em; }
    .brand-sub { font-family: var(--font-body); font-style: italic; font-size: 0.8rem; color: var(--parchment-dim); }
    nav { display: flex; gap: 6px; }
    nav a {
      font-family: var(--font-title); font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--parchment-dim); padding: 8px 16px; border-radius: 6px;
      border: 1px solid transparent; transition: all 0.2s;
    }
    nav a:hover { color: var(--parchment); background: rgba(201, 168, 76, 0.07); }
    nav a.active { color: var(--gold-bright); border-color: rgba(201, 168, 76, 0.35); background: rgba(201, 168, 76, 0.08); }
    @media (max-width: 640px) {
      .brand-sub { display: none; }
      .app-header { padding: 10px 12px; }
      .brand-rune { font-size: 1.25rem; }
      .brand-text { font-size: 1.1rem; }
      nav { gap: 2px; }
      nav a { padding: 8px 9px; font-size: 0.7rem; letter-spacing: 0.04em; }
    }
  `]
})
export class App {}

import { Component, signal } from '@angular/core';
import { ClassEditorComponent } from './class-editor';
import { SubclassEditorComponent } from './subclass-editor';
import { PoolEditorComponent } from './pool-editor';
import { BackgroundEditorComponent } from './background-editor';
import { SpellEditorComponent } from './spell-editor';
import { ImportPanelComponent } from './import-panel';

type DevTab = 'classes' | 'subclasses' | 'pools' | 'backgrounds' | 'spells' | 'import';

@Component({
  selector: 'app-developer',
  standalone: true,
  imports: [ClassEditorComponent, SubclassEditorComponent, PoolEditorComponent, BackgroundEditorComponent, SpellEditorComponent, ImportPanelComponent],
  template: `
    <div class="page">
      <h1 class="mb-1">⚒ Gestione Contenuti</h1>
      <p class="muted mb-2">Sezione Developer: gestisci classi, sottoclassi, abilità, background, incantesimi e pool di opzioni. Le modifiche sono salvate nel repository dei contenuti.</p>

      <div class="tabs">
        <button type="button" class="tab" [class.active]="tab() === 'classes'" (click)="tab.set('classes')">Classi</button>
        <button type="button" class="tab" [class.active]="tab() === 'subclasses'" (click)="tab.set('subclasses')">Sottoclassi</button>
        <button type="button" class="tab" [class.active]="tab() === 'pools'" (click)="tab.set('pools')">Sotto-abilità</button>
        <button type="button" class="tab" [class.active]="tab() === 'backgrounds'" (click)="tab.set('backgrounds')">Background</button>
        <button type="button" class="tab" [class.active]="tab() === 'spells'" (click)="tab.set('spells')">Incantesimi</button>
        <button type="button" class="tab" [class.active]="tab() === 'import'" (click)="tab.set('import')">Importa JSON</button>
      </div>

      @switch (tab()) {
        @case ('classes') { <app-class-editor class="fade-in" /> }
        @case ('subclasses') { <app-subclass-editor class="fade-in" /> }
        @case ('pools') { <app-pool-editor class="fade-in" /> }
        @case ('backgrounds') { <app-background-editor class="fade-in" /> }
        @case ('spells') { <app-spell-editor class="fade-in" /> }
        @case ('import') { <app-import-panel class="fade-in" /> }
      }
    </div>
  `
})
export class DeveloperComponent {
  readonly tab = signal<DevTab>('classes');
}

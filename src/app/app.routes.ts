import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then(m => m.HomeComponent) },
  { path: 'wizard', loadComponent: () => import('./features/wizard/wizard').then(m => m.WizardComponent) },
  { path: 'character/:id', loadComponent: () => import('./features/character-sheet/character-sheet').then(m => m.CharacterSheetComponent) },
  { path: 'developer', loadComponent: () => import('./features/developer/developer').then(m => m.DeveloperComponent) },
  { path: '**', redirectTo: '' }
];

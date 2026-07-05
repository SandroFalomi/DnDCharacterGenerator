import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { WizardService } from '../wizard.service';
import { ALIGNMENTS } from '../../../data/standard-arrays';

@Component({
  selector: 'app-step-name',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="card card-ornate name-card">
      <h2 class="mb-2">Come si chiama il tuo eroe?</h2>
      <div class="form-field">
        <label for="char-name">Nome del personaggio</label>
        <input id="char-name" type="text" [formControl]="nameCtrl" placeholder="Es. Kaelen Ombraferro" autocomplete="off" />
        @if (nameCtrl.touched && nameCtrl.hasError('required')) {
          <span class="error">Il nome è obbligatorio: ogni leggenda inizia da un nome.</span>
        }
      </div>
      <div class="form-field">
        <label for="char-align">Allineamento (opzionale)</label>
        <select id="char-align" [formControl]="alignCtrl">
          <option value="">— Da decidere —</option>
          @for (a of alignments; track a) { <option [value]="a">{{ a }}</option> }
        </select>
      </div>
    </div>
  `,
  styles: [`
    .name-card { max-width: 560px; margin: 40px auto; padding: 34px; }
    input { font-size: 1.15rem; font-family: var(--font-title); }
  `]
})
export class StepNameComponent {
  private wizard = inject(WizardService);
  readonly alignments = ALIGNMENTS;

  readonly nameCtrl = new FormControl(this.wizard.name(), { nonNullable: true, validators: [Validators.required] });
  readonly alignCtrl = new FormControl(this.wizard.alignment(), { nonNullable: true });

  constructor() {
    this.nameCtrl.valueChanges.subscribe(v => this.wizard.name.set(v.trim()));
    this.alignCtrl.valueChanges.subscribe(v => this.wizard.alignment.set(v));
  }
}

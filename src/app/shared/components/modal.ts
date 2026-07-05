import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div class="modal-backdrop" (click)="onBackdrop($event)">
      <div class="modal" [style.max-width]="width">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button type="button" class="modal-close" (click)="closed.emit()" aria-label="Chiudi">×</button>
        </div>
        <div class="modal-body">
          <ng-content />
        </div>
        @if (hasFooter) {
          <div class="modal-footer">
            <ng-content select="[footer]" />
          </div>
        }
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() title = '';
  @Input() width = '720px';
  @Input() hasFooter = false;
  @Output() closed = new EventEmitter<void>();

  onBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closed.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }
}

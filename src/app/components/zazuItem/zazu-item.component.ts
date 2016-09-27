import {Zazu} from '../../models/zazu.model';
import {Input, Output, EventEmitter, Component} from '@angular/core';

@Component({
  selector: 'zazu-item',
  templateUrl: './zazu-item.html'
})
export class ZazuItemComponent {
  @Input() zazu: Zazu;
  @Input() isSelected: boolean;
  @Output() onUpdateChecked = new EventEmitter<{id: string, checked: boolean}>();
  @Output() onUpdateLabel = new EventEmitter<{id: string, label: string, keyCode: number}>();
  @Output() onOutViewport = new EventEmitter<number>();

  /**
   * If element is not in viewport then scroll to its offsetTop.
   * @param {boolean} inViewport True if element is in viewport, false otherwise.
   * @param {number} offset The offsetTop of element.
   */
  scroll (inViewport: boolean, offset: number) {
    if (inViewport) {
      return;
    }
    this.onOutViewport.emit(offset);
  }

  private updateLabel (zazu: Zazu, keyCode: number) {
    this.onUpdateLabel.emit({id: zazu.id, label: zazu.label, keyCode: keyCode});
  }

  private getZazuItemForAttribute (zazu: Zazu): string {
    return `zazu-checked-${zazu.id}`;
  }
}

import {Zazu} from '../../models/zazu.model';
import {Input, Output, EventEmitter, Component} from '@angular/core';
import {InViewportData} from '../../directives/in-viewport.directive';

@Component({
  selector: 'zazu-item',
  templateUrl: './zazu-item.html'
})
export class ZazuItemComponent {
  @Input() zazu: Zazu;
  @Input() isSelected: boolean;
  @Output() onUpdateLabel = new EventEmitter<{id: string, label: string, keyCode: number}>();
  @Output() onOutViewport = new EventEmitter<number>();

  /**
   * If element is not in viewport then scroll to its offsetTop.
   */
  scroll (data: InViewportData) {
    if (data.inViewport) {
      return;
    }
    this.onOutViewport.emit(data.offset);
  }

  private updateLabel (zazu: Zazu, keyCode: number) {
    this.onUpdateLabel.emit({id: zazu.id, label: zazu.label, keyCode: keyCode});
  }

  private getZazuItemForAttribute (zazu: Zazu): string {
    return `zazu-checked-${zazu.id}`;
  }
}

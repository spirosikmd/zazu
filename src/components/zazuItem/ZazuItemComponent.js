import {ZazuItemController} from './ZazuItemController';
import template from './zazuItem.html';

/**
 * ZazuItem component.
 */
export const ZazuItemComponent = {
  template: template,
  controller: ZazuItemController,
  bindings: {
    zazu: '<',
    isSelected: '<',
    onUpdateChecked: '&',
    onUpdateLabel: '&',
    onOutViewport: '&'
  }
};

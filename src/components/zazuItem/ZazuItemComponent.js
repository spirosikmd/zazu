import {ZazuItemController} from './ZazuItemController';
import templateUrl from './zazuItem.html';

/**
 * ZazuItem component.
 */
export const ZazuItemComponent = {
  templateUrl: templateUrl,
  controller: ZazuItemController,
  bindings: {
    zazu: '<',
    isSelected: '<',
    onUpdateChecked: '&',
    onUpdateLabel: '&'
  }
};

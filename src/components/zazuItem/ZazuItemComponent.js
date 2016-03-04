import {ZazuItemController} from './ZazuItemController';

/**
 * ZazuItem component.
 */
export const ZazuItemComponent = {
  templateUrl: '../src/components/zazuItem/zazuItem.html',
  controller: ZazuItemController,
  bindings: {
    zazu: '<',
    isSelected: '<',
    onUpdateChecked: '&',
    onUpdateLabel: '&'
  }
};

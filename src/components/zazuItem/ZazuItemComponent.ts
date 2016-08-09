import {ZazuItemController} from './ZazuItemController';

const template = require('./zazuItem.html');

/**
 * ZazuItem component.
 */
export const ZazuItemComponent: angular.IComponentOptions = {
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

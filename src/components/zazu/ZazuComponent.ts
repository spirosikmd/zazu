import {ZazuController} from './ZazuController';

const template = require('./zazu.html');

/**
 * Zazu component.
 */
export const ZazuComponent: angular.IComponentOptions = {
  template: template,
  controller: ZazuController
};

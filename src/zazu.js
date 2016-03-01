import angular from 'angular';
import hotkeys from 'angular-hotkeys';

import StorageService from './services/StorageService';
import ZazuService from './services/ZazuService';
import ZazuController from './controllers/ZazuController';
import FocusDirective from './directives/FocusDirective';

export default angular.module('zazu', ['cfp.hotkeys'])
  .service('StorageService', StorageService)
  .service('ZazuService', ZazuService)
  .controller('ZazuController', ZazuController)
  .directive('focus', FocusDirective)
  .name;

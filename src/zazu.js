import angular from 'angular';
import hotkeys from 'angular-hotkeys';

import {ZazuService} from './services/ZazuService';
import {ZazuController} from './controllers/ZazuController';
import {FocusDirective} from './directives/FocusDirective';

angular.module('zazu', ['cfp.hotkeys'])
  .service('ZazuService', ZazuService)
  .controller('ZazuController', ZazuController)
  .directive('focus', FocusDirective);

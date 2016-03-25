import angular from 'angular';
import hotkeys from 'angular-hotkeys';

import {StorageService} from './services/StorageService';
import {ZazuService} from './services/ZazuService';
import {FlagService} from './services/FlagService';
import {FocusDirective} from './directives/FocusDirective';
import {ElasticInputDirective} from './directives/ElasticInputDirective';
import {InViewportDirective} from './directives/InViewportDirective';
import {ZazuComponent} from './components/zazu/ZazuComponent';
import {ZazuItemComponent} from './components/zazuItem/ZazuItemComponent';
import config from './zazu.config';

export default angular.module('zazuApp', ['cfp.hotkeys', config.name])
  .service('StorageService', StorageService)
  .service('ZazuService', ZazuService)
  .service('FlagService', FlagService)
  .component('zazu', ZazuComponent)
  .component('zazuItem', ZazuItemComponent)
  .directive('focus', FocusDirective)
  .directive('elasticInput', ElasticInputDirective)
  .directive('inViewport', InViewportDirective)
  .name;

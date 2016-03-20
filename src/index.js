import angular from 'angular';
import hotkeys from 'angular-hotkeys';

import {StorageService} from './services/StorageService';
import {ZazuService} from './services/ZazuService';
import {FocusDirective} from './directives/FocusDirective';
import {ElasticInputDirective} from './directives/ElasticInputDirective';
import {InViewportDirective} from './directives/InViewportDirective';
import {ZazuComponent} from './components/zazu/ZazuComponent';
import {ZazuItemComponent} from './components/zazuItem/ZazuItemComponent';

export default angular.module('zazuApp', ['cfp.hotkeys'])
  .service('StorageService', StorageService)
  .service('ZazuService', ZazuService)
  .component('zazu', ZazuComponent)
  .component('zazuItem', ZazuItemComponent)
  .directive('focus', FocusDirective)
  .directive('elasticInput', ElasticInputDirective)
  .directive('inViewport', InViewportDirective)
  .name;

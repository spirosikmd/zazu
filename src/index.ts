require('./polyfill');
require('./vendor');
require('./env');

import {UpgradeAdapter} from '@angular/upgrade';
import {StorageService} from './services/StorageService';
import {ZazuService} from './services/ZazuService';
import {FlagService} from './services/FlagService';
import {ConfigService} from './services/config.service';
import {FocusDirective} from './directives/FocusDirective';
import {ElasticInputDirective} from './directives/ElasticInputDirective';
import {InViewportDirective} from './directives/InViewportDirective';
import {ZazuComponent} from './components/zazu/ZazuComponent';
import {ZazuItemComponent} from './components/zazuItem/ZazuItemComponent';

let upgradeAdapter = new UpgradeAdapter();

upgradeAdapter.addProvider(ConfigService);
upgradeAdapter.addProvider(StorageService);
upgradeAdapter.addProvider(FlagService);

export default angular.module('zazuApp', ['cfp.hotkeys'])
  .factory('ConfigService', upgradeAdapter.downgradeNg2Provider(ConfigService))
  .factory('StorageService', upgradeAdapter.downgradeNg2Provider(StorageService))
  .service('ZazuService', ZazuService)
  .factory('FlagService', upgradeAdapter.downgradeNg2Provider(FlagService))
  .component('zazu', ZazuComponent)
  .component('zazuItem', ZazuItemComponent)
  .directive('focus', FocusDirective)
  .directive('elasticInput', ElasticInputDirective)
  .directive('inViewport', InViewportDirective)
  .name;

upgradeAdapter.bootstrap(document.documentElement, ['zazuApp']);

import angular from 'angular';
import hotkeys from 'angular-hotkeys';

import {TodoService} from './services/TodoService';
import {TodoController} from './controllers/TodoController';
import {FocusDirective} from './directives/FocusDirective';

angular.module('app', ['cfp.hotkeys'])
  .service('TodoService', TodoService)
  .controller('TodoController', TodoController)
  .directive('focus', FocusDirective);

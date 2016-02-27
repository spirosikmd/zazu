(function (angular) {
  angular.module('app', ['cfp.hotkeys'])
    .service('TodoService', function () {
      var todos = [{
        id: 1,
        checked: true,
        label: 'Todo item one'
      }, {
        id: 2,
        checked: false,
        label: 'Todo item two'
      }];

      function get () {
        return angular.copy(todos);
      }

      function create (todo) {
        todo.id = todos.length + 1;
        todos.push(todo);
      }

      function update (id, key, value) {
        for (var index = 0; index < todos.length; index++) {
          var current = todos[index];
          if (current.id === id) {
            current[key] = value;
            break;
          }
        }
      }

      return {
        get: get,
        create: create,
        update: update
      };
    })
    .controller('TodoController', function ($scope, TodoService, hotkeys) {
      var context = this;
      var defaultTodo = {
        label: '',
        checked: false
      };
      context.todos = [];
      context.todo = null;
      context.modes = {
        create: false
      };

      context.setMode = function setMode (mode, state) {
        context.modes[mode] = state;
      };

      context.refresh = function () {
        context.todos = TodoService.get();
      };

      context.reset = function () {
        context.todo = angular.copy(defaultTodo);
      };

      context.create = function (todo) {
        if (todo.label.trim().length === 0) {
          return;
        }
        TodoService.create(angular.copy(todo));
        context.refresh();
        context.reset();
      };

      context.updateChecked = function check (id, checked) {
        TodoService.update(id, 'checked', checked);
      };

      context.refresh();
      context.reset();

      hotkeys.bindTo($scope)
        .add({
          combo: 'mod+n',
          description: 'Create new todo',
          callback: function (event) {
            event.preventDefault();
            context.setMode('create', true);
          }
        })
        .add({
          combo: 'esc',
          description: 'Default state',
          allowIn: ['INPUT'],
          callback: function (event) {
            event.preventDefault();
            context.setMode('create', false);
          }
        });
    })
    .directive('focus', function ($timeout) {
      return {
        link: function (scope, element, attributes) {
          scope.$watch(attributes.focus, function (value) {
            if (value === true) {
              $timeout(function () {
                element[0].focus();
              });
            }
          });
        }
      }
    });
})(angular);

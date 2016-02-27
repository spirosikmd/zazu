(function (angular) {
  angular.module('app', [])
    .service('TodoService', function () {
      var todos = [{
        checked: true,
        label: 'Todo item one'
      }, {
        checked: false,
        label: 'Todo item two'
      }];

      function get () {
        return angular.copy(todos);
      }

      function create (todo) {
        todos.push(todo);
      }

      return {
        get: get,
        create: create
      };
    })
    .controller('TodoController', function (TodoService) {
      const defaultTodo = {
        label: '',
        checked: false
      };
      this.todos = [];
      this.todo = null;

      this.refresh = function () {
        this.todos = TodoService.get();
      };

      this.reset = function () {
        this.todo = angular.copy(defaultTodo);
      };

      this.create = function (todo) {
        TodoService.create(angular.copy(todo));
        this.refresh();
        this.reset();
      };

      this.refresh();
      this.reset();
    });
})(angular);

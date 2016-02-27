export class TodoController {
  constructor ($scope, TodoService, hotkeys) {
    this.$scope = $scope;
    this.TodoService = TodoService;
    this.hotkeys = hotkeys;
    this.defaultTodo = {
      label: '',
      checked: false
    };
    this.todos = [];
    this.todo = null;
    this.modes = {
      create: false
    };

    this.refresh();
    this.reset();
    this.setupHotkeys();
  }

  setMode (mode, state) {
    this.modes[mode] = state;
  };

  refresh () {
    this.todos = this.TodoService.get();
  };

  reset () {
    this.todo = angular.copy(this.defaultTodo);
  };

  create (todo) {
    if (todo.label.trim().length === 0) {
      return;
    }
    this.TodoService.create(angular.copy(todo));
    this.refresh();
    this.reset();
  };

  updateChecked (id, checked) {
    this.TodoService.update(id, 'checked', checked);
  };

  setupHotkeys () {
    this.hotkeys.bindTo(this.$scope)
      .add({
        combo: 'mod+n',
        description: 'Create new todo',
        callback: (event) => {
          event.preventDefault();
          this.setMode('create', true);
        }
      })
      .add({
        combo: 'esc',
        description: 'Default state',
        allowIn: ['INPUT'],
        callback: (event) => {
          event.preventDefault();
          this.setMode('create', false);
        }
      });
  }
}

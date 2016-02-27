export class TodoService {
  constructor () {
    this.todos = [{
      id: 1,
      checked: true,
      label: 'Todo item one'
    }, {
      id: 2,
      checked: false,
      label: 'Todo item two'
    }];
  }

  get () {
    return angular.copy(this.todos);
  }

  create (todo) {
    todo.id = this.todos.length + 1;
    this.todos.push(todo);
  }

  update (id, key, value) {
    for (var index = 0; index < this.todos.length; index++) {
      var current = this.todos[index];
      if (current.id === id) {
        current[key] = value;
        break;
      }
    }
  }
}

export default function createProject({
  id = null,
  name = "Default",
  todos = [],
} = {}) {
  const ID = id || "proj_" + Date.now().toString();

  return {
    id: ID,
    name,
    todos: todos.slice(),
    addToDo(todo) {
      this.todos.push(todo);
    },
    removeTodo(todoId) {
      this.todos = this.todos.filter((t) => t.id !== todoId);
    },
    findTodo(todoId) {
      return this.todos.find((t) => t.id === todoId);
    },
  };
}

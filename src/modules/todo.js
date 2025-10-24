export default function createToDo({id = null, title = '', description = '', dueDate = null, priority = 'low', completed = false} = {}) {
    const ID = id || Date.now().toString();
    return {id: ID, title, description, dueDate, priority, completed,
    toggleComplete() {this.completed = !this.completed;},
    update(fields = {}) {Object.assign(this, fields)}
    };
}

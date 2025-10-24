import createProject  from './project';
import createToDo from './todo';
import * as storage from './storage';

let projects = [];
let activeProjectId = null;

export function initApp() {
    const loaded = storage.loadProjects();
    if (loaded && loaded.length) {
        projects = loaded;
        activeProjectId = projects[0].id;
    } else {
        const p = createProject({name: 'Default'});
        projects = [p];
        activeProjectId = p.id;
        storage.saveProjects(projects);
    }
}

export function getProjects() {return projects};

export function getActiveProject() {return projects.find(p => p.id === activeProjectId)};
export function setActiveProject(id) {
    if (projects.find(p => p.id === id)) {
        activeProjectId = id;
    }
}

export function createNewProject(name) {
    const p = createProject({name});
    projects.push(p);
    storage.saveProjects(projects);
    return p;
}

export function createNewToDo( projectId, todoData) {
    const p = projects.find(x => x.id === projectId);
    if (!p) throw new Error('Project not found');
    const todo  = createToDo(todoData);
    p.addToDo(todo);
    storage.saveProjects(projects);
    return todo;
}

export function deleteTodo(projectId, todoId) {
    const p = projects.find(x => x.id === projectId);
    if (!p) return;
    p.removeTodo(todoId);
    storage.saveProjects(projects);
}

export function toggleTodoComplete(projectId, todoId) {
    const p = projects.find(x => x.id === projectId);
    if (!p) return;
    const t = p.findTodo(todoId);
    if (!t) return;
    t.toggleComplete();
    storage.saveProjects(projects);
}

export function editTodo(projectId, todoId, fields) {
    const p = projects.find(x => x.id === projectId);
    if (!p) return;
    const t = p.findTodo(todoId);
    if (!t) return;
    t.update(fields);
    storage.saveProjects(projects);
}

export function deleteProject(projectId) {
    projects = projects.filter(p => p.id !== projectId);
    if(!projects.length) {
        const fallback = createProject({name: "default"});
        projects.push(fallback);
        activeProjectId = fallback.id;
    } else if (!projects.find(p => p.id === activeProjectId)) {
        activeProjectId = projects[0].id;
    }
    storage.saveProjects(projects);
}
import createProject from "./project";
import createToDo from "./todo";

const STORAGE_KEY = "Listiq_to_do_projects";

export function saveProjects(projects) {
  const serial = projects.map((p) => ({
    id: p.id,
    name: p.name,
    todos: p.todos.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      priority: t.priority,
      completed: t.completed,
    })),
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(serial));
}

export function loadProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  const parsed = JSON.parse(raw);

  //rebuild projects and todos to attach methods back to them
  return parsed.map((p) => {
    const todos = (p.todos || []).map((t) => createToDo(t));
    return createProject({ id: p.id, name: p.name, todos });
  });
}

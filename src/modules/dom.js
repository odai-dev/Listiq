import * as logic from "./logic";


const projectListEl = document.querySelector(".projects-list");
const activeProjectNameEl = document.querySelector("#activeProjectTitle");
const todosContainer = document.querySelector(".todos");

const newProjectForm = document.querySelector(".new-project-form");
const newProjectBtn = document.querySelector("#createProjectBtn");
const newProjectInput = document.querySelector("#newProjectInput");

const newTodoForm = document.querySelector(".new-todo-form");
const todoTitle = document.querySelector("#todoTitle");
const todoDescription = document.querySelector("#todoDescription");
const todoDueDate = document.querySelector("#todoDueDate");
const todoPriority = document.querySelector("#todoPriority");
const createTodoBtn = document.querySelector("#createTodoBtn");

export default function renderApp() {
    
}

function renderProjects(projects, activeProjectId) {
    projectListEl.innerHTML = "";
    projects.forEach(project => {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = project.name;
        if (project.id === activeProjectId) {
            a.classList.add("active");
        }
        a.addEventListener('click', () => {
            logic.setActiveProject(project.id);
            renderProjects(logic.getProjects(), project.id);
            renderTasks(logic.getActiveProject());
        });

        projectListEl.appendChild(a)

    });
}


newProjectBtn.addEventListener('click', ()=>{
    const name = newProjectInput.value.trim();
    if (!name) return;

    const project = logic.createNewProject(name);
    renderProjects(logic.getProjects(), project.id);
    // renderTasks(project);

    newProjectInput.value = ' ';
})

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
    hamburgerAndOverlaySidbar();
    priorityBtnsController();
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

function hamburgerAndOverlaySidbar() {
// sidebar overlay toggle
const btn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');

if (btn && sidebar) {
  const backdrop = document.createElement('div');
  backdrop.className = 'overlay-backdrop';

  backdrop.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 90;
    opacity: 0;
    pointer-events: none;
    transition: opacity .2s ease;
  `;

  function openSidebar() {
    sidebar.classList.add('aside--open');
    document.body.appendChild(backdrop);
    requestAnimationFrame(() => {
      backdrop.style.opacity = '1';
      backdrop.style.pointerEvents = 'auto';
    });
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('aside--open');
    backdrop.style.opacity = '0';
    backdrop.style.pointerEvents = 'none';
    setTimeout(() => backdrop.remove(), 200);
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    sidebar.classList.contains('aside--open') ? closeSidebar() : openSidebar();
  });

  backdrop.addEventListener('click', closeSidebar);

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeSidebar();
  });
}
}


function priorityBtnsController() {
    const picker = document.querySelector('.priority-picker');
    const hidden = document.getElementById('todoPriority');
    if (!picker || !hidden) return;
  
    picker.addEventListener('click', (e) => {
      const btn = e.target.closest('.prio');
      if (!btn) return;
      picker.querySelectorAll('.prio').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      hidden.value = btn.dataset.priority;
    });
};
  
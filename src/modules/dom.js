import * as logic from "./logic";


const projectListEl = document.querySelector(".projects-list");
const activeProjectNameEl = document.querySelector("#activeProjectTitle");
const todosContainer = document.querySelector(".todos");

const newProjectForm = document.querySelector(".new-project-form");
const newProjectBtn = document.querySelector("#createProjectBtn");
const newProjectInput = document.querySelector("#newProjectInput");

const newTodoForm = document.querySelector(".new-todo-form");


export default function renderApp() {
    renderProjects(logic.getProjects(), logic.getActiveProject());
    renderTodos(logic.getActiveProject());
    hamburgerAndOverlaySidbar();
    priorityBtnsController();
    newTodoFormController();
}

function renderProjects(projects, activeProjectId) {
    projectListEl.innerHTML = "";
    console.log("projects is:", projects);
    console.log("type:", typeof projects);
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
            renderTodos(logic.getActiveProject());
        });

        projectListEl.appendChild(a)

    });
}


newProjectBtn.addEventListener('click', ()=>{
    const name = newProjectInput.value.trim();
    if (!name) return;

    const project = logic.createNewProject(name);
    renderProjects(logic.getProjects(), project.id);
    renderTasks(project);

    newProjectInput.value = ' ';
})

function renderTodos(activeProject) {
    const todosEL = document.querySelector('.todos');
    if(!document.querySelector(".todo-list")) {
        const todosList = document.createElement("div");
        todosList.classList.add("todos-list");
        todosEL.appendChild(todosList);
    }

    const todos = activeProject.todos;
    todos.forEach(todo  => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        const Checkbox = document.createElement("input");
        Checkbox.classList.add("todo-checkbox");
        Checkbox.type = "checkbox";
        const content  = document.createElement("div");
        content.classList.add("todo-content");
        const title = document.createElement("p");
        title.classList.add("todo-title");
        const dueDate = document.createElement("p");
        dueDate.classList.add("todo-date");
        content.appendChild(title);
        content.appendChild(dueDate);
        const priority = document.createElement("div");
        priority.classList.add("todo-priority");
        todoDiv.appendChild(Checkbox);
        todoDiv.appendChild(content);
        todoDiv.appendChild(priority);
        console.log("todo", todo);        
    })

    console.log(todos);
}

function newTodoFormController() {
    const createTodoBtn = document.querySelector("#createTodoBtn");


    createTodoBtn.addEventListener('click', ()=> {
        const hiddenForm = document.querySelector(".todo-form");
        hiddenForm.classList.remove("hidden");
        createTodoBtn.remove();
    
        const addTodoBtn = document.createElement('button');
        addTodoBtn.classList.add("btn");
        addTodoBtn.classList.add("btn-primary");
        addTodoBtn.textContent = "Add Todo";
        addTodoBtn.id = "addTodoBtn";
    
        newTodoForm.appendChild(addTodoBtn);
    
    
        addTodoBtn.addEventListener('click', () => {
            const todoTitle = document.querySelector("#todoTitle");
            const todoDescription = document.querySelector("#todoDescription");
            const todoDueDate = document.querySelector("#todoDueDate");
            const todoPriority = document.querySelector("#todoPriority");
           
            if (
                !todoTitle.value ||
                !todoDescription.value ||
                !todoDueDate.value ||
                !todoPriority.value
                ) {
                    console.log("missng required fields");
                    return;
                }

            //reset form
            logic.createNewToDo(logic.getActiveProject().id, {title: todoTitle.value, description: todoDescription.value, dueDate: todoDueDate.value, priority: todoPriority.value});
            todoTitle.value = '';
            todoDescription.value = '';
            todoDueDate.value = '';


            hiddenForm.classList.add("hidden");
            addTodoBtn.remove();
            createNewTodoBtn(newTodoForm);
        })
        
    })
    
    
    function createNewTodoBtn(form) {
        const btn =  document.createElement('button');
        btn.classList.add('btn');
        btn.classList.add('btn-primary');
        btn.id = 'createTodoBtn';
        btn.textContent = "New Todo";
        form.appendChild(btn);
        newTodoFormController();

    }
     
}


function hamburgerAndOverlaySidbar() {
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
  
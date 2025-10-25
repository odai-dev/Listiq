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
    initTodoForm();
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
    const activeProjectNameHeader = document.querySelector('#activeProjectName');
    activeProjectNameHeader.textContent =  logic.getActiveProject().name;

}


newProjectBtn.addEventListener('click', () => {
    const name = newProjectInput.value.trim();
    if (!name) return;

    const project = logic.createNewProject(name);
    renderProjects(logic.getProjects(), project.id);
    renderTodos(project);

    newProjectInput.value = ' ';
})

function renderTodos(activeProject) {
    const todosEL = document.querySelector('.todos');

   
    let todosList = document.querySelector(".todos-list"); 
    if (!todosList) {
        todosList = document.createElement("div");
        todosList.classList.add("todos-list");
        todosEL.appendChild(todosList);
    } else {
        todosList.innerHTML = '';
    }

   
    const todos = activeProject.todos;
    todos.forEach(todo => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");

        const Checkbox = document.createElement("input");
        Checkbox.classList.add("todo-checkbox");
        Checkbox.type = "checkbox";
        todoDiv.appendChild(Checkbox);
        
        const content = document.createElement("div");
        content.classList.add("todo-content");
        
        const title = document.createElement("p");
        title.classList.add("todo-title");
        content.appendChild(title);

        const description = document.createElement("p");
        description.classList.add('todo-desc');
        content.appendChild(description);

        const dueDate = document.createElement("p");
        dueDate.classList.add("todo-date");
        content.appendChild(dueDate);

        todoDiv.appendChild(content);

        const deleteTodoBtn = document.createElement("button");
        deleteTodoBtn.textContent = 'Delete';
        deleteTodoBtn.classList.add('btn');
        deleteTodoBtn.classList.add('red');
        deleteTodoBtn.id = 'deleteTodoBtn';
        todoDiv.appendChild(deleteTodoBtn);

        deleteTodoBtn.addEventListener('click', ()=> {
            logic.deleteTodo(activeProject.id, todo.id);
            renderTodos(activeProject);
        })

        const editTodoBtn = document.createElement("button");
        editTodoBtn.textContent = 'Edit';
        editTodoBtn.classList.add('btn');
        editTodoBtn.classList.add('btn-primary');
        editTodoBtn.id = 'editTodoBtn';
        todoDiv.appendChild(editTodoBtn);

        editTodoBtn.addEventListener('click', () => openTodoForm(todo));

        const priority = document.createElement("div");
        priority.classList.add("todo-priority");
        todoDiv.appendChild(priority);

        fillTodo(todo, title, description, dueDate, priority);
        todosList.appendChild(todoDiv);
    })

    console.log(todos);
}

function fillTodo(todo, titleEl, descriptionEl, dueDateEl, priorityEl) {
    titleEl.textContent = todo.title;
    dueDateEl.textContent = todo.dueDate;
    descriptionEl.textContent = todo.description;
    let priorityColor = '';
    switch (todo.priority) {
        case "low":
            priorityColor = 'green';
            break;
        case 'medium':
            priorityColor = 'yellow';
            break;
        case 'high':
            priorityColor = 'red';
            break;
        default:
            priorityColor = 'green'
            break;
    }
    priorityEl.classList.add(priorityColor);
}



function initTodoForm() {
    const createTodoBtn = document.querySelector("#createTodoBtn");
    if (!createTodoBtn) return;

    createTodoBtn.addEventListener('click', () => openTodoForm());
    priorityBtnsController();
}


function openTodoForm(todo = null) {
    const hiddenForm = document.querySelector(".todo-form");
    const newTodoBtn = document.querySelector("#createTodoBtn");

    hiddenForm.classList.remove("hidden");

    if (newTodoBtn) newTodoBtn.style.display = "none";

    // Remove any existing action buttons
    document.querySelector("#addTodoBtn")?.remove();
    document.querySelector("#saveTodoBtn")?.remove();

    const actionBtn = document.createElement('button');
    actionBtn.classList.add('btn', 'btn-primary');

    if (todo) {
        actionBtn.id = "saveTodoBtn";
        actionBtn.textContent = "Save Changes";

        const todoTitle = document.querySelector("#todoTitle");
        const todoDescription = document.querySelector("#todoDescription");
        const todoDueDate = document.querySelector("#todoDueDate");
        const todoPriority = document.querySelector("#todoPriority");

        todoTitle.value = todo.title;
        todoDescription.value = todo.description;
        todoDueDate.value = todo.dueDate;
        todoPriority.value = todo.priority;

        actionBtn.addEventListener('click', () => {
            if (!todoTitle.value || !todoDescription.value || !todoDueDate.value || !todoPriority.value) return;

            logic.editTodo(logic.getActiveProject().id, todo.id, {
                title: todoTitle.value,
                description: todoDescription.value,
                dueDate: todoDueDate.value,
                priority: todoPriority.value
            });

            closeTodoForm();
            renderTodos(logic.getActiveProject());
        });

    } else {
        actionBtn.id = "addTodoBtn";
        actionBtn.textContent = "Add Todo";

        const todoTitle = document.querySelector("#todoTitle");
        const todoDescription = document.querySelector("#todoDescription");
        const todoDueDate = document.querySelector("#todoDueDate");
        const todoPriority = document.querySelector("#todoPriority");

        todoTitle.value = "";
        todoDescription.value = "";
        todoDueDate.value = "";
        todoPriority.value = "";

        actionBtn.addEventListener('click', () => {
            if (!todoTitle.value || !todoDescription.value || !todoDueDate.value || !todoPriority.value) return;

            logic.createNewToDo(logic.getActiveProject().id, {
                title: todoTitle.value,
                description: todoDescription.value,
                dueDate: todoDueDate.value,
                priority: todoPriority.value
            });

            closeTodoForm();
            renderTodos(logic.getActiveProject());
        });
    }

    newTodoForm.appendChild(actionBtn);
}


function closeTodoForm() {
    const hiddenForm = document.querySelector(".todo-form");
    hiddenForm.classList.add("hidden");

    document.querySelector("#addTodoBtn")?.remove();
    document.querySelector("#saveTodoBtn")?.remove();

    const newTodoBtn = document.querySelector("#createTodoBtn");
    if (newTodoBtn) newTodoBtn.style.display = "inline-block"; 
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


function priorityBtnsController () {
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
}


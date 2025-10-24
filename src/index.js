import createProject from './modules/project';
import createToDo from './modules/todo';
import './styles.css';


const p = createProject({name: "Coding"});
console.log(p);

const t = createToDo({title: "Finish The Odin Project to-do-list project", dueDate: "Today"});
console.log(t);

p.addToDo(t);
console.log(p);


// TODO LIST APP
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

todoForm.addEventListener("submit", addTask);

document.addEventListener("DOMContentLoaded", loadTasks);

function loadTasks() {
  // getting old tasks from local storage
  const tasks = getTaskfromLocalstorage();
  tasks.forEach((task) => {
    addTaskDom(task);
  });
}

function addTask(event) {
  event.preventDefault();

  taskTaxt = todoInput.value.trim();

  // console.log(new Date(Date.now()).getMilliseconds(), taskTaxt);

  if (taskTaxt !== "") {
    const task = {
      id: Date.now(), // make an ID
      text: taskTaxt,
      completed: false,
    };
    addTaskDom(task);
    saveTaskTolocalStorage(task);
    todoInput.value = "";
  }
}

function addTaskDom(task) {
  const li = document.createElement("li");
  li.className = `todo-item${task.completed ? " completed" : ""}`;
  li.dataset.id = task.id;
  li.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${
              task.completed ? "checked" : ""
            }>
            <span class="task">${task.text}</span>
            <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>`;
  todoList.appendChild(li);

  attacheventListeners(li, task);
}

function attacheventListeners(li, task) {
  const deleteBtn = li.querySelector(".delete-btn");
  const editBtn = li.querySelector(".edit-btn");
  const checkbox = li.querySelector(".complete-checkbox");

  deleteBtn.addEventListener("click", function () {
    handleDelete(task.id, li);
  });

  editBtn.addEventListener("click", function () {
    handleEdit(task.id, li);
  });
  checkbox.addEventListener("change", function () {
    console.log("Checked", checkbox.checked);
    toggleTaskCompletion(task.id, li, checkbox.checked);
  });
}

function handleDelete(id, li) {
  let tasks = getTaskfromLocalstorage();
  tasks = tasks.filter((task) => task.id != id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  li.remove();
}

function handleEdit(taskID, li) {
  const taskSpan = li.querySelector(".task");

  const newTasktext = prompt("Edit your Task", taskSpan.textContent);

  if (newTasktext !== null && newTasktext.trim() !== "") {
    // update local storage
    updateTask(taskID, newTasktext);
    // Update the DOM
    taskSpan.textContent = newTasktext;
  }
}

function updateTask(id, newTasktext) {
  const tasks = getTaskfromLocalstorage();
  const task = tasks.find((task) => task.id == id);
  if (task) {
    task.text = newTasktext;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

function toggleTaskCompletion(taskId, li, isCompleted) {
  const tasks = getTaskfromLocalstorage();
  const task = tasks.find((task) => task.id == taskId);
  if (task) {
    task.completed = isCompleted;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    li.classList.toggle("completed", isCompleted);
  }
}

function saveTaskTolocalStorage(task) {
  const oldTasks = getTaskfromLocalstorage();

  oldTasks.push(task);

  localStorage.setItem("tasks", JSON.stringify(oldTasks));
}

function getTaskfromLocalstorage() {
  const oldTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  return oldTasks;
}

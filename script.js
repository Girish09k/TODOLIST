const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const priorityCheckbox = document.getElementById("priorityCheckbox");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");

document.addEventListener("DOMContentLoaded", renderTasks);
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTask();
});

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  const isImportant = priorityCheckbox.checked;
  const date = dateInput.value;
  const time = timeInput.value;

  if (!text || !date || !time) {
    alert("Please fill in task, date, and time.");
    return;
  }

  const task = {
    text: text,
    important: isImportant,
    date: date,
    time: time,
    completed: false
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);

  taskInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
  priorityCheckbox.checked = false;

  renderTasks();
}

function toggleTask(index) {
  const tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  renderTasks();
}

function deleteTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks();
}

function renderTasks() {
  const tasks = getTasks();
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");

    const title = document.createElement("span");
    title.className = "title";
    title.textContent = task.text;
    title.onclick = () => toggleTask(index);

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `Due: ${task.date} at ${task.time}`;

    if (task.important) {
      const priority = document.createElement("div");
      priority.className = "priority";
      priority.innerHTML = "⭐";
      li.appendChild(priority);
    }

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTask(index);

    li.appendChild(title);
    li.appendChild(meta);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

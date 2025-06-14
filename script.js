// DOM Elements
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const taskPriority = document.getElementById('taskPriority');
const addBtn = document.getElementById('addBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const lowList = document.getElementById('lowList');
const mediumList = document.getElementById('mediumList');
const highList = document.getElementById('highList');

// Task array to store all tasks
let tasks = [];

// Edit task function
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  taskInput.value = task.text;
  taskPriority.value = task.priority;
  
  // Remove the task being edited
  tasks = tasks.filter(t => t.id !== id);
  
  // Focus on input for quick editing
  taskInput.focus();
}

// Add task function
function addTask() {
  const taskText = taskInput.value.trim();
  const priority = taskPriority.value;
  
  if (taskText === '' || priority === '') {
    alert('Please enter a task and select priority');
    return;
  }
  
  const task = {
    id: Date.now(),
    text: taskText,
    priority: priority,
    completed: false,
    date: taskDate.value || new Date().toLocaleDateString()
  };
  
  tasks.push(task);
  renderTasks();
  taskInput.value = '';
  taskPriority.value = '';
}

// Render tasks based on priority
function renderTasks(filter = 'all') {
  // Clear all lists
  lowList.innerHTML = '';
  mediumList.innerHTML = '';
  highList.innerHTML = '';
  
  // Filter tasks based on the selected filter
  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.priority === filter);
  
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.priority}`;
    
    li.innerHTML = `
      <div>
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span>${task.text}</span>
        <small>Due: ${task.date}</small>
      </div>
      <button class="edit-btn" data-id="${task.id}">Edit</button>
      <button class="delete-btn" data-id="${task.id}">Delete</button>
    `;
    
    // Add to correct priority list
    if (task.priority === 'low') lowList.appendChild(li);
    else if (task.priority === 'medium') mediumList.appendChild(li);
    else if (task.priority === 'high') highList.appendChild(li);
    
    // Add event listeners
    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      li.style.opacity = task.completed ? '0.6' : '1';
    });
    
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      renderTasks();
    });
    
    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
      editTask(task.id);
    });
  });
}

// Filter tasks by priority
function filterTasks(filter) {
  // Update active button
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  
  // Show/hide priority sections
  const showAll = filter === 'all';
  document.querySelectorAll('.tasks-wrapper h2').forEach(h2 => {
    h2.style.display = showAll ? 'block' : 'none';
  });
  
  // Render filtered tasks
  renderTasks(filter);
}

// Event listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterTasks(btn.dataset.filter);
  });
});

// Initialize
renderTasks();
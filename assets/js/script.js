let tasks = [];

function generateId() {
  let lastId = parseInt(localStorage.getItem('lastTaskId')) || 0;
  lastId++;
  localStorage.setItem('lastTaskId', lastId.toString());
  return lastId;
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    return JSON.parse(storedTasks);
  }
  return [
    { id: 1, text: 'Hacer mercado', completed: true },
    { id: 2, text: 'Estudiar para la prueba', completed: false },
    { id: 3, text: 'Sacar a pasear a Tobby', completed: false }
  ];
}

function initializeIdCounter() {
  const storedLastId = parseInt(localStorage.getItem('lastTaskId')) || 0;
  const maxExistingId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
  const lastId = Math.max(storedLastId, maxExistingId);
  localStorage.setItem('lastTaskId', lastId.toString());
}

function renderTasks() {
  const tbody = document.getElementById('taskList');
  tbody.innerHTML = '';

  tasks.forEach(task => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${task.id}</td>
      <td class="d-flex align-items-center gap-2">
        <input 
          type="checkbox" 
          class="form-check-input" 
          ${task.completed ? 'checked' : ''}
          onchange="toggleTask(${task.id})"
        />
        <span 
          class="${task.completed ? 'text-decoration-line-through text-muted' : ''}"
          style="cursor: pointer;"
          onclick="toggleTask(${task.id})"
        >
          ${task.text}
        </span>
        <button 
          class="btn btn-sm btn-danger ms-auto" 
          onclick="deleteTask(${task.id})"
        >
          <i class="fas fa-times"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateStatistics();
}

function updateStatistics() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  
  document.getElementById('totalTasks').textContent = total;
  document.getElementById('completedTasks').textContent = completed;
}

function addTask() {
  const input = document.getElementById('newTask');
  const text = input.value.trim();

  if (text === '') {
    alert('Por favor, ingrese una tarea');
    return;
  }

  const newTask = {
    id: generateId(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  input.value = '';
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addButton').addEventListener('click', addTask);

  document.getElementById('newTask').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });

  tasks = loadTasks();
  initializeIdCounter();
  renderTasks();
});

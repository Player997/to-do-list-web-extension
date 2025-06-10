document.addEventListener('DOMContentLoaded', function () {
  const taskInput = document.getElementById('taskInput');
  const addTask = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');

  // Load saved tasks
  chrome.storage.local.get('tasks', (result) => {
    if (result.tasks) {
      result.tasks.forEach(task => addTaskToDOM(task.text, task.completed));
    }
  });

  // Add task
  addTask.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text === '') return;

    addTaskToDOM(text);
    saveTasks();
    taskInput.value = '';
  });

  // Add task to UI
  function addTaskToDOM(text, completed = false) {
    const li = document.createElement('li');
    li.textContent = text;
    if (completed) li.classList.add('completed');

    li.addEventListener('click', () => {
      li.classList.toggle('completed');
      saveTasks();
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.addEventListener('click', () => {
      li.remove();
      saveTasks();
    });

    li.appendChild(delBtn);
    taskList.appendChild(li);
  }

  // Save tasks
  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
      tasks.push({
        text: li.childNodes[0].nodeValue.trim(),
        completed: li.classList.contains('completed')
      });
    });
    chrome.storage.local.set({ tasks });
  }
});

//Enter key to add task
// Trigger add task when pressing Enter
taskInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask.click();
  }
});

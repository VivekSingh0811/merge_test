document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const taskCountDisplay = document.getElementById('task-count');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const dateDisplay = document.getElementById('date-display');

    // Display current date
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);

    // State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Initialize UI
    renderTasks();

    // Event Listeners
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    clearCompletedBtn.addEventListener('click', clearCompleted);

    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            const newTask = {
                id: Date.now().toString(),
                text: text,
                completed: false
            };
            tasks.push(newTask);
            saveAndRender();
            taskInput.value = '';
        }
    }

    function toggleTask(id) {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveAndRender();
    }

    function deleteTask(id) {
        const taskElement = document.getElementById(`task-${id}`);
        
        taskElement.style.opacity = '0';
        taskElement.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== id);
            saveAndRender();
        }, 300);
    }

    function clearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        let activeCount = 0;

        tasks.forEach(task => {
            if (!task.completed) activeCount++;

            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.id = `task-${task.id}`;

            li.innerHTML = `
                <div class="task-content">
                    <div class="checkbox" role="checkbox" aria-checked="${task.completed}" tabindex="0"></div>
                    <span class="task-text">${escapeHTML(task.text)}</span>
                </div>
                <button class="delete-btn" aria-label="Delete Task">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;

            li.querySelector('.checkbox').addEventListener('click', () => toggleTask(task.id));
            li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(li);
        });

        taskCountDisplay.textContent = activeCount;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag])
        );
    }
});

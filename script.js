document.addEventListener("DOMContentLoaded", () => {
    const newTodoInput = document.getElementById('new-todo');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const filterButtons = document.querySelectorAll('.filters button');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const renderTodos = () => {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = todo.completed ? 'completed' : '';
            li.dataset.id = todo.id;
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''} />
                <span contenteditable="true">${todo.text}</span>
                <button class="delete">✖</button>
            `;
            li.querySelector('input').addEventListener('click', () => toggleComplete(todo.id));
            li.querySelector('.delete').addEventListener('click', () => deleteTodo(todo.id));
            li.querySelector('span').addEventListener('blur', (e) => updateTodoText(todo.id, e.target.textContent));
            todoList.appendChild(li);
        });
        updateItemsLeft();
        saveTodos();
    };

    const addTodo = (text) => {
        const todo = {
            id: Date.now(),
            text,
            completed: false
        };
        todos.push(todo);
        renderTodos();
    };

    const toggleComplete = (id) => {
        todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
        renderTodos();
    };

    const deleteTodo = (id) => {
        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
    };

    const clearCompleted = () => {
        todos = todos.filter(todo => !todo.completed);
        renderTodos();
    };

    const updateTodoText = (id, text) => {
        todos = todos.map(todo => todo.id === id ? { ...todo, text } : todo);
        saveTodos();
    };

    const updateItemsLeft = () => {
        const activeTodos = todos.filter(todo => !todo.completed);
        itemsLeft.textContent = `${activeTodos.length} items left`;
    };

    const filterTodos = (filter) => {
        document.querySelectorAll('li').forEach(li => {
            li.style.display = 'flex';
            const completed = li.classList.contains('completed');
            if (filter === 'active' && completed) li.style.display = 'none';
            if (filter === 'completed' && !completed) li.style.display = 'none';
        });
        filterButtons.forEach(button => button.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    };

    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && newTodoInput.value.trim()) {
            addTodo(newTodoInput.value.trim());
            newTodoInput.value = '';
        }
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => filterTodos(button.dataset.filter));
    });

    // Initial render
    renderTodos();
});

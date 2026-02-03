// CLASS
// Parent class: Task
class Task {
    constructor(text, priority) {
        this.text = text;           // Property 1: task text
        this.priority = priority;   // Property 2: priority level
        this.completed = false;     // Property 3: completion status
    }

    // Method 1: Toggle completion status
    toggleComplete() {
        this.completed = !this.completed;
    }

    // Method 2: Get display text (can be overridden by child classes)
    getDisplayText() {
        return this.text;
    }
}

// Child class 1: RegularTask extends Task
class RegularTask extends Task {
    constructor(text, category) {
        super(text, "regular");     // Call parent constructor
        this.category = category;   // Property 4: category for regular tasks
    }

    // Method: Get category
    getCategory() {
        return this.category;
    }

    // Override: Add category to display text
    getDisplayText() {
        if (this.category) {   // Check if anything was written
            return this.text + " [" + this.category + "]";
        }
        return this.text;
    }
}

// Child class 2: UrgentTask extends Task
class UrgentTask extends Task {
    constructor(text, deadline) {
        super(text, "urgent");
        this.deadline = deadline;   // Property 4: deadline for urgent tasks
    }

    // Override: Add deadline and warning emoji to display text
    getDisplayText() {
        if (this.deadline) {
            return this.text + " ⚠️ Due: " + this.deadline;
        }
        return this.text + " ⚠️";
    }
}

// TodoList
class TodoList {
    constructor() {
        this.tasks = [];  // Property: array to store all tasks
    }

    // Method 1: Add new task to the list
    addTask(task) {
        this.tasks.push(task);
        this.render();
    }

    // Method 2: Delete a task by index
    deleteTask(index) {
        // Create new array to hold the tasks left
        let newTasks = [];
        // Loop through all existing tasks, if this is NOT the task to delete, add it to newTasks
        for (let i = 0; i < this.tasks.length; i++) {
            if (i !== index) {
                newTasks.push(this.tasks[i]);
            }
        }
        // Replace the old array with the new array
        this.tasks = newTasks;
        this.render();
    }

    // Method 3: Toggle task completion
    toggleTask(index) {
        this.tasks[index].toggleComplete();
        this.render();
    }

    // Method 4: Render all tasks to the page
    render() {
        const container = document.getElementById('task-list');
        container.innerHTML = '';  // Clear existing tasks

        // If no tasks, show empty message
        if (this.tasks.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-message';
            emptyDiv.textContent = 'No tasks yet. Add one above!';
            container.appendChild(emptyDiv);
            return;
        }

        // Loop through all tasks and create elements
        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];

            // Create list item
            const li = document.createElement('li');
            li.className = 'task-item ' + task.priority;
            if (task.completed) {
                li.className = li.className + ' completed';
            }

            // Create task content container
            const contentDiv = document.createElement('div');
            contentDiv.className = 'task-content';

            // Create checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.dataset.index = i;  // Store index for later use

            // Create task text span
            const textSpan = document.createElement('span');
            textSpan.className = 'task-text';
            textSpan.textContent = task.getDisplayText();

            // Append checkbox and text to content div
            contentDiv.appendChild(checkbox);
            contentDiv.appendChild(textSpan);

            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-button';
            deleteBtn.textContent = 'Delete';
            deleteBtn.dataset.index = i;  // Store index for later use

            // Append content and delete button to list item
            li.appendChild(contentDiv);
            li.appendChild(deleteBtn);

            // Append list item to container
            container.appendChild(li);
        }
    }
}

// Create new TodoList instance
const myTodoList = new TodoList();

// Use getElementById
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const categoryInput = document.getElementById('category-input');
const deadlineInput = document.getElementById('deadline-input');

// Use querySelector
const regularRadio = document.querySelector('#regular-radio');
const urgentRadio = document.querySelector('#urgent-radio');

// Use getElementById for containers
const categoryContainer = document.getElementById('category-input-container');
const deadlineContainer = document.getElementById('deadline-input-container');

// EVENT LISTENERS
// Event 1: Toggle between showing category or deadline input based on priority selection
regularRadio.addEventListener('change', function () {
    categoryContainer.classList.remove('hidden');
    deadlineContainer.classList.add('hidden');
});

urgentRadio.addEventListener('change', function () {
    categoryContainer.classList.add('hidden');
    deadlineContainer.classList.remove('hidden');
});

// Event 2: Add task when button is clicked (DOM update + event object usage)
addButton.addEventListener('click', function (evt) {
    // Use event object to prevent default form submission (if in a form)
    evt.preventDefault();

    const taskText = taskInput.value.trim();

    // Validate input
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    // Create appropriate task type based on priority selection
    let newTask;
    if (regularRadio.checked) {
        const category = categoryInput.value.trim();
        newTask = new RegularTask(taskText, category);
    } else {
        const deadline = deadlineInput.value.trim();
        newTask = new UrgentTask(taskText, deadline);
    }

    // Add task to list
    myTodoList.addTask(newTask);

    // Clear inputs
    taskInput.value = '';
    categoryInput.value = '';
    deadlineInput.value = '';

    // Focus back on task input
    taskInput.focus();
});

// Event 3: Handle checkbox and delete button clicks using event delegation
// Use querySelectorAll to get the task list container
document.getElementById('task-list').addEventListener('click', function (evt) {
    // Use evt.target to determine what was clicked
    const target = evt.target;

    // If checkbox was clicked
    if (target.className === 'task-checkbox') {
        const index = parseInt(target.dataset.index);
        myTodoList.toggleTask(index);
    }

    // If delete button was clicked
    if (target.className === 'delete-button') {
        const index = parseInt(target.dataset.index);
        myTodoList.deleteTask(index);
    }
});

// Event 4: Allow adding task by pressing Enter key
taskInput.addEventListener('keypress', function (evt) {
    // Use event object to check which key was pressed
    if (evt.key === 'Enter') {
        evt.preventDefault();
        addButton.click();  // Trigger the add button click
    }
});

// Render empty state on page load
myTodoList.render();

//Array Declaration
let tasks = [];

//Get HTML Elements
const taskForm = document.getElementById("taskForm");
const taskTableBody = document.getElementById("taskTableBody");

const filterTask = document.getElementById("filterTask");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

//LIsten for Submit
taskForm.addEventListener("submit", function (event) {

    event.preventDefault();



    //Read the Form Values
    const taskName = document.getElementById("taskName").value;

    const priority = document.getElementById("priority").value;

    const dueDate = document.getElementById("dueDate").value;

    //Create a Task Object
    const task = {

        name: taskName,

        priority: priority,

        dueDate: dueDate,

        completed: false

    };

    tasks.push(task);

    displayTasks();

    taskForm.reset();

});

//Display Task
function displayTasks() {

    taskTableBody.innerHTML = "";

    tasks.forEach(function (task, index) {

        const row = document.createElement("tr");

        const status = task.completed ? "Completed" : "Pending";

        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.priority}</td>
            <td>${task.dueDate}</td>
            <td>${status}</td>
            <td>
                <button onclick="completeTask(${index})">Complete</button>
                <button onclick="editTask(${index})">Edit</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </td>
        `;

        taskTableBody.appendChild(row);

    });

}


// Delete Task
function deleteTask(index) {

    tasks.splice(index, 1);

    displayTasks();

}

// Complete Task

function completeTask(index) {

    tasks[index].completed = true;

    displayTasks();

}

// Edit Task

function editTask(index) {

    const updatedTask = prompt("Edit Task Name", tasks[index].name);

    if (updatedTask !== null && updatedTask.trim() !== "") {

        tasks[index].name = updatedTask;

        displayTasks();

    }

}

// Filter Tasks
filterTask.addEventListener("change", function () {

    const selectedFilter = filterTask.value;

    if (selectedFilter === "All") {

        displayTasks();

    }
    else if (selectedFilter === "Completed") {

        const completedTasks = tasks.filter(function (task) {

            return task.completed;

        });

        displayTasks(completedTasks);

    }
    else {

        const pendingTasks = tasks.filter(function (task) {

            return !task.completed;

        });

        displayTasks(pendingTasks);

    }

});

// Update Counts
function updateCounts() {

    totalCount.textContent = tasks.length;

    const completed = tasks.filter(function (task) {

        return task.completed;

    }).length;

    const pending = tasks.filter(function (task) {

        return !task.completed;

    }).length;

    completedCount.textContent = completed;

    pendingCount.textContent = pending;

}

// Save Tasks
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// Load Tasks When Page Opens

displayTasks();
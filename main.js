document.addEventListener("DOMContentLoaded", renderTodos);

function addTodo() {
  let pic = document.getElementById('pic');
  let date = document.getElementById('date');
  let task = document.getElementById('task');
  let priorityLevel = document.getElementById('priorityLevel');

  let picValue = pic.value.trim();
  let dateValue = date.value.trim();
  let taskValue = task.value.trim();
  let priorityValue = priorityLevel.value.trim();

  if (!picValue || !dateValue || !taskValue || !priorityValue) {
    alert("Please fill in all fields before submitting.");
    return;
  }

  let todo = {
    id: Date.now(),
    pic: picValue,
    date: dateValue,
    task: taskValue,
    priorityLevel: priorityValue,
    completed: false
  };
  
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  todos.push(todo)
  localStorage.setItem("todos", JSON.stringify(todos))
  
  alert("Task added successfully!");
  
  document.getElementById("todo_form").reset(); 
  renderTodos();
}
  

function toggleStatusTask(id) {
  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos = todos.map(todo => {
    if (todo.id == id) {
      return {
        ...todo, completed: !todo.completed
      }
    }
    return todo
  })
  
  localStorage.setItem("todos", JSON.stringify(todos))
  renderTodos();
}

function deleteTask(id) {
  if (!confirm("Are you sure you want to delete?")) return;

  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos = todos.filter(todo => todo.id !== id);
  localStorage.setItem("todos", JSON.stringify(todos));

  renderTodos();
}

function renderTodos() {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let taskList = document.getElementById('taskList')
  let taskDone = document.getElementById('taskDone');
  
  taskList.innerHTML = "";
  taskDone.innerHTML = "";
  
  todos.forEach((todo, index) => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let taskDate = new Date(todo.date);
    taskDate.setHours(0, 0, 0, 0);

    let dueDate = taskDate.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    let isOverdue = taskDate < today;
    
    let taskCard = document.createElement("div");
    taskCard.className = "card card-compact bg-base-200 shadow-md border border-gray-200 p-2 md:p-3 w-full";
    taskCard.innerHTML = `
      <div class="card-body p-3">
        <div class="flex flex-wrap items-center justify-between text-sm gap-2">
          <input type="checkbox" class="checkbox checkbox-primary mr-2" onclick="toggleStatusTask(${todo.id})" ${todo.completed ? "checked" : ""}>

          <div class="flex-1 min-w-0 w-auto">
            <p class="font-semibold truncate ${todo.completed ? "line-through" : ""}">${todo.task}</p>
            <p class="text-xs text-gray-600 ${todo.completed ? "line-through" : ""}">${todo.pic}</p>
            <p class="text-xs text-gray-500">Due Date: ${dueDate}</p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <div class="hidden md:block">
              ${isOverdue ? `<span class="badge badge-error text-xs px-2 py-1 text-white">Overdue</span>` : ""}
              <span class="badge ${getPriorityBadge(todo.priorityLevel)} text-xs px-2 py-1 text-white">${todo.priorityLevel}</span>
            </div>
            <button class="p-0 text-white" onclick="deleteTask(${todo.id})">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 30 30">
                <path d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-center gap-2 md:hidden">
          ${isOverdue ? `<span class="badge badge-error text-xs px-2 py-1 text-white">Overdue</span>` : ""}
          <span class="badge ${getPriorityBadge(todo.priorityLevel)} text-xs px-2 py-1 text-white">${todo.priorityLevel}</span>
        </div>
      </div>
    `;
    
    if (todo.completed) {
      taskDone.appendChild(taskCard);
    } else {
      taskList.appendChild(taskCard);
    }

  });
}

function getPriorityBadge(priority) {
  if (priority === "Low") return "badge-success";
  if (priority === "Medium") return "badge-warning";
  if (priority === "High") return "badge-error";
  return "badge-gray";
}

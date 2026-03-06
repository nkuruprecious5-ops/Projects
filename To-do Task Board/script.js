// Author: Nkurunziza Precious
const STORAGE_KEY = "precious_todo_board";

const titleInput = document.getElementById("taskTitle");
const descInput = document.getElementById("taskDescription");
const addBtn = document.getElementById("addBtn");

const todoList = document.getElementById("todoList");
const doneList = document.getElementById("doneList");

const todoCount = document.getElementById("todoCount");
const doneCount = document.getElementById("doneCount");

let tasks = loadTasks();
document.getElementById("year").textContent = new Date().getFullYear();
let draggingId = null;

renderTasks();
wireEvents();

function wireEvents() {
  addBtn.addEventListener("click", addTask);

  titleInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  });

  document.querySelectorAll(".column").forEach(function (column) {
    const status = column.dataset.status;

    column.addEventListener("dragover", function (e) {
      e.preventDefault();
      column.classList.add("drag-over");
    });

    column.addEventListener("dragleave", function () {
      column.classList.remove("drag-over");
    });

    column.addEventListener("drop", function () {
      column.classList.remove("drag-over");
      if (!draggingId) return;
      setStatus(draggingId, status);
    });
  });
}

function addTask() {
  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (!title) {
    titleInput.focus();
    return;
  }

  tasks.unshift({
    id: Date.now().toString(),
    title: title,
    description: description,
    status: "todo",
    createdAt: new Date().toISOString(),
  });

  titleInput.value = "";
  descInput.value = "";
  titleInput.focus();

  saveTasks();
  renderTasks();
}

function renderTasks() {
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  tasks.forEach(function (task) {
    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;

    card.addEventListener("dragstart", function () {
      draggingId = task.id;
      card.classList.add("dragging");
    });

    card.addEventListener("dragend", function () {
      draggingId = null;
      card.classList.remove("dragging");
    });

    const title = document.createElement("h3");
    title.textContent = task.title;

    const desc = document.createElement("p");
    desc.textContent = task.description || "No description";

    const date = document.createElement("small");
    date.textContent = formatDate(task.createdAt);

    const actions = document.createElement("div");
    actions.className = "actions";

    const doneBtn = document.createElement("button");
    doneBtn.className = "done-btn";
    doneBtn.textContent = task.status === "done" ? "Undo" : "Done";
    doneBtn.addEventListener("click", function () {
      setStatus(task.id, task.status === "done" ? "todo" : "done");
    });

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", function () {
      editTask(task.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    actions.appendChild(doneBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(date);
    card.appendChild(actions);

    if (task.status === "done") {
      doneList.appendChild(card);
    } else {
      todoList.appendChild(card);
    }
  });

  updateCounts();
}

function setStatus(taskId, status) {
  const task = tasks.find(function (item) {
    return item.id === taskId;
  });

  if (!task) return;
  task.status = status;

  saveTasks();
  renderTasks();
}

function editTask(taskId) {
  const task = tasks.find(function (item) {
    return item.id === taskId;
  });

  if (!task) return;

  const newTitle = prompt("Edit title:", task.title);
  if (newTitle === null) return;

  const cleanTitle = newTitle.trim();
  if (!cleanTitle) return;

  const newDesc = prompt("Edit description:", task.description || "");
  if (newDesc === null) return;

  task.title = cleanTitle;
  task.description = newDesc.trim();

  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter(function (task) {
    return task.id !== taskId;
  });

  saveTasks();
  renderTasks();
}

function updateCounts() {
  const todo = tasks.filter(function (task) {
    return task.status === "todo";
  }).length;

  const done = tasks.filter(function (task) {
    return task.status === "done";
  }).length;

  todoCount.textContent = todo;
  doneCount.textContent = done;
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map(function (item) {
      return {
        id: item.id,
        title: item.title || "Untitled Task",
        description: item.description || "",
        status: item.status === "done" ? "done" : "todo",
        createdAt: item.createdAt || new Date().toISOString(),
      };
    });
  } catch (error) {
    return [];
  }
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleString();
}

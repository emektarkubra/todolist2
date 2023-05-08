const addInputForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#add-todo");
const todoList = document.querySelector(".list-groups");
const alertBox = document.querySelector(".alert");
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filterInput = document.querySelector("#filter-todo");
const clearButton = document.querySelector("#clear-todos");

events();

function events() {
    addInputForm.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadTodo);
    secondCardBody.addEventListener("click", removeTodo);
    filterInput.addEventListener("keyup", filterTodo);
    clearButton.addEventListener("click", removeAllTodos);
    todoList.addEventListener("click", editTodos);
}

function createTodo(value) {
    const li = document.createElement("li");
    li.className = "list-group-item";

    const form = document.createElement("form");
    form.action = "#";
    form.id = "item-form";

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = "item-input";
    textInput.disabled = "disabled";
    textInput.value = value;

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa fa-close";
    deleteIcon.style.fontSize = "18px";

    const editIcon = document.createElement("i");
    editIcon.className = "fa fa-edit";
    editIcon.style.fontSize = "18px";

    const list = todoList.appendChild(li).appendChild(form);
    list.appendChild(textInput);
    list.appendChild(deleteIcon);
    list.appendChild(editIcon);
}

function createAlert(message) {
    alertBox.textContent = message;

    setTimeout(() => {
        alertBox.textContent = "";
    }, 1500)
}

function addTodo(e) {

    if (todoInput.value.trim() === "" || todoInput.value === null) {
        // adding alert
        createAlert("Please, enter a task!");
    } else {
        // adding to Ui
        createTodo(todoInput.value.trim());
        // adding to storage
        if (localStorage.getItem("todoList") === null) {
            const todoList = [];
            todoList.push(todoInput.value.trim());
            localStorage.setItem("todoList", JSON.stringify(todoList));
        } else {
            const todoList = JSON.parse(localStorage.getItem("todoList"));
            todoList.push(todoInput.value.trim());
            localStorage.setItem("todoList", JSON.stringify(todoList));
        }
    }
    todoInput.value = "";
    e.preventDefault();

}

function loadTodo(e) {
    // for todos in Ui
    const todoList = JSON.parse(localStorage.getItem("todoList"));
    todoList.forEach(todo => {
        createTodo(todo);
    });
}

function removeTodo(e) {

    if (e.target.className === "fa fa-close") {
        // remove from Ui
        e.target.parentElement.parentElement.remove();

        // remove from storage
        const todoList = JSON.parse(localStorage.getItem("todoList"));
        let index = todoList.indexOf(e.target.previousElementSibling.value);
        todoList.splice(index, 1);
        localStorage.setItem("todoList", JSON.stringify(todoList));
    }

}

function filterTodo(e) {
    
    const filterValue = e.target.value.toLocaleLowerCase().trim();
    const todos = document.querySelectorAll(".list-group-item");
    todos.forEach((todo) => {
        const todoValue = todo.children[0].children[0].value.toLocaleLowerCase().trim();

        if (todoValue.includes(filterValue)) {
            todo.setAttribute("style", "display:block");
        } else {
            todo.setAttribute("style", "display:none");
        }
    })
}

function removeAllTodos(e) {

    // remove from Ui
    const todos = document.querySelectorAll(".list-group-item");
    todos.forEach((todo) => {
        todo.remove();
    })
    createAlert("Removed all tasks!")

    // remove from storage
    const todoList = JSON.parse(localStorage.getItem("todoList"));
    todoList.splice(0, todoList.length);
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

function editTodos(e) {
    // editing in Ui
    if (e.target.className === "fa fa-edit") {
        let textInput = e.target.previousElementSibling.previousElementSibling;
        // 1.step : focusing todo input
        textInput.removeAttribute("disabled");
        textInput.style.textShadow = "0 0 2px aliceblue";
        textInput.focus();


        const textForm = e.target.parentElement;
        //3.step : get todoList from storage and get index 
        let todoList = JSON.parse(localStorage.getItem("todoList"));
        let index = todoList.indexOf(e.target.previousElementSibling.previousElementSibling.value);

        textForm.addEventListener("submit", (e) => {
            //2.step : blurred todo input
            textInput.setAttribute("disabled", "disabled:disabled");
            textInput.removeAttribute("style", "textShadow:none");
            textInput.blur();

            // 4.step : send new value to storage

            todoList.splice(index, 1, e.target.children[0].value);
            localStorage.setItem("todoList", JSON.stringify(todoList));
        })
    }
}
class Todo {
    title;
    constructor(item) {
        this.title = item;
    }
}

class TodoTemplate {
    isEditMode = false;
    addTodo(item) {
        const todoList = document.getElementById('todo-list');

        // create element with card className;
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <div class="input-inline">
                <div class="content">
                    <select name="status" id="todo-status" onclick="todoTemplate.onSelectTodo(event)">
                        <option selected disabled>Choose Status</option>
                        <option value="100">Processing</option>
                        <option value="500">Pending</option>
                        <option value="300">Complete</option>
                    </select>
                    <p class="description" id="todo-description">${item}</p>
                    <input type="text" id="edit-todo-input" hidden/>
                 </div>
                <div class="btn-group">
                    <div class="btn-group none">
                        <button class="cancel-btn" id="cancel" onclick="todoTemplate.onCancelTodo(event.target)">Cancel</button>
                        <button class="change-btn" id="change" onclick="todoTemplate.onChangeTodo(event.target)">Change</button>
                    </div>
                    <button class="edit-btn" id="edit" onclick="todoTemplate.onEditTodo(event.target)">Edit</button>
                    <button class="del-btn" id="delete" onclick="todoTemplate.onRemoveTodo(event.target)">Delete</button>
                </div>
            </div>
            `
        todoList.prepend(cardElement);


        if (document.getElementsByClassName('card').length) {
            document.getElementById('no-data').classList.add('none');
        }

        this.onShowMessage('Successful!!', 'success');
        document.getElementById('todo-input').value = '';
    }

    onSelectTodo(event) {
        if (this.isEditMode && !event.which) {
            this.onCancelTodo(event.target.parentElement.parentElement.querySelector('#cancel'));
        }

        switch(event.target.options.selectedIndex) {
            case 1:
                event.target.parentElement.parentElement.parentElement.classList.add('card-status-100');
                event.target.parentElement.parentElement.parentElement.classList.remove('card-status-300');
                event.target.parentElement.parentElement.parentElement.classList.remove('card-status-500');
                event.target.nextElementSibling.classList.remove('check');
                if (!this.isEditMode && event.target.parentElement.parentElement.querySelector('#edit').style.display === 'none') {
                    event.target.parentElement.parentElement.querySelector('#edit').style.display = 'block';
                }
                break;
            case 2:
                event.target.parentElement.parentElement.parentElement.classList.add('card-status-500');
                event.target.parentElement.parentElement.parentElement.classList.remove('card-status-300');
                event.target.parentElement.parentElement.parentElement.classList.remove('card-status-100');
                event.target.nextElementSibling.classList.remove('check');
                if (!this.isEditMode && event.target.parentElement.parentElement.querySelector('#edit').style.display === 'none') {
                    event.target.parentElement.parentElement.querySelector('#edit').style.display = 'block';
                }
                break;
            case 3:
                event.target.parentElement.parentElement.parentElement.classList.add('card-status-300');
                event.target.parentElement.parentElement.parentElement.classList.remove('card-status-500');
                event.target.parentElement.parentElement.parentElement.classList.remove('card-status-100');
                event.target.nextElementSibling.classList.add('check');
                event.target.parentElement.parentElement.querySelector('#edit').style.display = 'none';
                break;
            default:
            // nothing
        }
    }

    onEditTodo(target) {
        if (target) {
            this.isEditMode = true;
        }
        target.parentElement.querySelector('.btn-group').classList.remove('none');
        const previousElementSibling = target.parentElement.previousElementSibling;
        previousElementSibling.querySelector('.description').style.display = 'none';
        const editTodoInput = previousElementSibling.querySelector('#edit-todo-input');
        editTodoInput.removeAttribute('hidden');
        editTodoInput.value =  previousElementSibling.querySelector('.description').innerText;
        target.style.display = 'none';
    }

    onCancelTodo(target) {
        const previousElementSibling = target.parentElement.parentElement.previousElementSibling;
        previousElementSibling.querySelector('.description').style.display = 'block';
        const editTodoInput = previousElementSibling.querySelector('#edit-todo-input');
        editTodoInput.setAttribute('hidden', 'true');
        target.parentElement.classList.add('none');
        target.parentElement.parentElement.querySelector('#edit').style.display = 'block';
    }

    onChangeTodo(target) {
        const previousElementSibling = target.parentElement.parentElement.previousElementSibling;
        const editTodoInput = previousElementSibling.querySelector('#edit-todo-input');
        previousElementSibling.querySelector('.description').style.display = 'block';
        previousElementSibling.querySelector('.description').innerText = editTodoInput.value;
        editTodoInput.setAttribute('hidden', 'true');
        target.parentElement.classList.add('none');
        target.parentElement.parentElement.querySelector('#edit').style.display = 'block';

        this.onShowMessage(`Changed!!`, 'success')
    }

    onRemoveTodo(target) {
        target.parentElement.parentElement.parentElement.remove();
        if (!document.getElementsByClassName('card').length) {
            document.getElementById('no-data').classList.remove('none');
        }
    }

    onShowMessage(msg, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-alert';
        messageDiv.innerHTML = `<progress id="progress" value="0" max="100"></progress><div>${msg}</div>`;
        document.querySelector('body').prepend(messageDiv);
        const progress = document.getElementById('progress');
        messageDiv.classList.add(`${type}-alert`);
        progress.classList.add(`${type}-progress`);

        const progressingInterval = setInterval(() => {
            progress.value += 1;
        }, 20)
        if (progress.value === 100) {
            clearInterval(progressingInterval);
        }
        setTimeout(() => {
            messageDiv.remove();
        }, 2000)

        return messageDiv;
    }
}

    // Instance
    const todoTemplate = new TodoTemplate();
    // When click add button, listen the event
    document.getElementById('add').addEventListener('click', (event) => {
        const todoInput = document.getElementById('todo-input');
        if (todoInput.value === '') {
            todoTemplate.onShowMessage('Required!!', 'error');
            return;
        }
        if (todoInput.value.split('').length < 3) {
            todoTemplate.onShowMessage('Greater than 3 character!!', 'error');
            return;
        }
        const todo = new Todo(todoInput.value);
        // Add todo
        todoTemplate.addTodo(todo.title);
    })

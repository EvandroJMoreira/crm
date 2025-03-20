document.addEventListener("DOMContentLoaded", function () {
    const board = document.querySelector(".board");
    const addColumnButton = document.querySelector(".add-column");

    let draggedTask = null;
    let draggedColumn = null;

    // Função para habilitar arrastar e soltar para tarefas
    function enableDragAndDrop(task) {
        task.addEventListener("dragstart", function (e) {
            draggedTask = task;
            setTimeout(() => (task.style.display = "none"), 0);
            e.stopPropagation(); // Impede a propagação do evento para a coluna
        });

        task.addEventListener("dragend", function () {
            setTimeout(() => (task.style.display = "block"), 0);
            draggedTask = null;
        });
    }

    // Função para habilitar edição de tarefas
    function enableEditTask(task) {
        const editButton = task.querySelector(".edit-task");
        const taskText = task.querySelector(".task-text");
        const taskDescription = task.querySelector(".task-description");

        editButton.addEventListener("click", function () {
            const newText = prompt("Editar tarefa:", taskText.textContent);
            if (newText) {
                taskText.textContent = newText;
            }

            const newDescription = prompt("Editar descrição (opcional):", taskDescription.textContent);
            if (newDescription !== null) { // Permite descrição vazia
                taskDescription.textContent = newDescription;
            }
        });
    }

    // Função para exibir/ocultar a descrição ao clicar na tarefa
    function enableTaskDescription(task) {
        task.addEventListener("click", function () {
            task.classList.toggle("active"); // Alterna a classe "active"
        });
    }

    // Função para habilitar deletar tarefas
    function enableDeleteTask(task) {
        const deleteButton = task.querySelector(".delete-task");
        deleteButton.addEventListener("click", function () {
            const confirmDelete = confirm("Tem certeza que deseja excluir esta tarefa?");
            if (confirmDelete) {
                task.remove();
            }
        });
    }

    // Função para adicionar uma nova coluna
    function addColumn() {
        const columnName = prompt("Digite o nome da nova coluna:");
        if (columnName) {
            const newColumn = document.createElement("div");
            newColumn.classList.add("column");
            newColumn.setAttribute("draggable", "true"); // Tornar a coluna arrastável
            newColumn.innerHTML = `
                <div class="column-header">
                    <h3 contenteditable="true">${columnName}</h3>
                    <button class="delete-column">🗑️</button>
                </div>
                <button class="add-task">+ Adicionar Tarefa</button>
            `;

            // Adicionar a nova coluna ao board
            board.insertBefore(newColumn, addColumnButton.nextSibling);

            // Habilitar funcionalidades para a nova coluna
            enableColumnFunctionalities(newColumn);
            enableColumnDragAndDrop(newColumn); // Habilitar arrastar e soltar para a coluna
        }
    }

    // Função para habilitar funcionalidades de uma coluna
    function enableColumnFunctionalities(column) {
        // Deletar coluna (com confirmação)
        column.querySelector(".delete-column").addEventListener("click", function () {
            const confirmDelete = confirm("Tem certeza que deseja excluir esta coluna?");
            if (confirmDelete) {
                column.remove();
            }
        });

        // Adicionar tarefa
        column.querySelector(".add-task").addEventListener("click", function () {
            const taskText = prompt("Digite o nome da nova tarefa:");

            if (taskText) {
                const newTask = document.createElement("div");
                newTask.classList.add("task");
                newTask.setAttribute("draggable", "true");
                newTask.innerHTML = `
                    <span class="task-text">${taskText}</span>
                    <button class="edit-task">✏️</button>
                    <button class="delete-task">🗑️</button>
                    <div class="task-description"></div>
                `;

                enableDragAndDrop(newTask); // Habilitar arrastar e soltar
                enableEditTask(newTask); // Habilitar edição
                enableTaskDescription(newTask); // Habilitar descrição
                enableDeleteTask(newTask); // Habilitar deletar tarefa

                // Inserir a nova tarefa **abaixo** do botão "Adicionar"
                column.insertBefore(newTask, column.querySelector(".add-task").nextSibling);
            }
        });

        // Permitir soltar tarefas na coluna
        column.addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        column.addEventListener("drop", function () {
            if (draggedTask) {
                column.insertBefore(draggedTask, column.querySelector(".add-task").nextSibling);
            }
        });
    }

    // Função para habilitar arrastar e soltar para colunas
    function enableColumnDragAndDrop(column) {
        column.addEventListener("dragstart", function (e) {
            draggedColumn = column;
            setTimeout(() => column.classList.add("dragging"), 0);
            e.stopPropagation(); // Impede a propagação do evento para as tarefas
        });

        column.addEventListener("dragend", function () {
            setTimeout(() => column.classList.remove("dragging"), 0);
            draggedColumn = null;
        });
    }

    // Permitir soltar colunas no board
    board.addEventListener("dragover", function (e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(board, e.clientX);
        const columnBeingDragged = document.querySelector(".column.dragging");

        if (afterElement == null) {
            board.appendChild(columnBeingDragged);
        } else {
            board.insertBefore(columnBeingDragged, afterElement);
        }
    });

    // Função para determinar a posição de soltar a coluna
    function getDragAfterElement(container, x) {
        const draggableElements = [...container.querySelectorAll(".column:not(.dragging)")];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Adicionar eventos para colunas existentes
    document.querySelectorAll(".column").forEach(column => {
        enableColumnFunctionalities(column);
        enableColumnDragAndDrop(column); // Habilitar arrastar e soltar para colunas existentes
        column.setAttribute("draggable", "true"); // Tornar colunas nativas arrastáveis
    });

    // Adicionar nova coluna
    addColumnButton.addEventListener("click", addColumn);

    // Habilitar funcionalidades para tarefas nativas
    document.querySelectorAll(".task").forEach(task => {
        enableDragAndDrop(task);
        enableEditTask(task);
        enableTaskDescription(task);
        enableDeleteTask(task); // Habilitar deletar tarefas nativas
    });
});
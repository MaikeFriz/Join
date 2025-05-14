// Deletes a task and all related data, then transitions back to the board view
async function deleteTask(taskId) {
    try {
        const isGuest = JSON.parse(localStorage.getItem("isGuest"));

        if (isGuest) {
            deleteSubtasksForGuest(taskId);
            deleteTaskFromLocalStorage(taskId);
            deleteTaskFromCategoriesForGuest(taskId);
            deleteTaskFromAssigneesForGuest(taskId);
        } else {
            // Eingeloggter Benutzer: Löschen aus der Datenbank
            await waitForDatabaseOperations(taskId);
            const taskResponse = await fetch(`${BASE_URL}tasks/${taskId}.json`);
            if (!taskResponse.ok) {
                throw new Error('Task could not be fetched.');
            }

            const taskData = await taskResponse.json();
            if (!taskData) throw new Error('Task not found.');

            const { assignees, subtasks } = taskData;

            await deleteTaskFromDatabase(taskId);
            await deleteSubtasks(subtasks);
            await deleteTaskFromCategories(taskId);
            await deleteTaskFromAssignees(taskId, assignees);
        }

        closeConfirmDialog();
        await backToBoardTable();
    } catch (error) {
        console.error(`Error during task deletion: ${error.message}`);
    }
}

// Deletes the task from localStorage and kanbanData for guest users
function deleteTaskFromLocalStorage(taskId) {
    const guestData = JSON.parse(localStorage.getItem("guestKanbanData"));
    if (guestData && guestData.tasks) {
        console.log("Vor dem Löschen im LocalStorage:", JSON.stringify(guestData.tasks, null, 2)); // Debugging-Ausgabe
        delete guestData.tasks[taskId]; // Löscht nur den spezifischen Task
        console.log("Nach dem Löschen im LocalStorage:", JSON.stringify(guestData.tasks, null, 2)); // Debugging-Ausgabe
        localStorage.setItem("guestKanbanData", JSON.stringify(guestData));
    }

    if (kanbanData.tasks) {
        delete kanbanData.tasks[taskId]; // Löscht nur den spezifischen Task
    }
}

// Deletes all subtasks for a task in localStorage and kanbanData for guest users
function deleteSubtasksForGuest(taskId) {
    const guestData = JSON.parse(localStorage.getItem("guestKanbanData"));
    if (guestData && guestData.tasks && guestData.tasks[taskId] && guestData.tasks[taskId].subtasks) {
        console.log("Vor dem Löschen der Subtasks:", JSON.stringify(guestData.tasks[taskId].subtasks, null, 2)); // Debugging-Ausgabe

        const subtaskRefs = guestData.tasks[taskId].subtasks;
        for (const subtaskId in subtaskRefs) {
            if (subtaskRefs[subtaskId]) {
                delete guestData.subtasks[subtaskId];
            }
        }

        delete guestData.tasks[taskId].subtasks;

        console.log("Nach dem Löschen der Subtasks:", JSON.stringify(guestData.tasks, null, 2)); // Debugging-Ausgabe

        localStorage.setItem("guestKanbanData", JSON.stringify(guestData));
    }

    if (kanbanData.tasks && kanbanData.tasks[taskId] && kanbanData.tasks[taskId].subtasks) {
        // Extrahiere die Subtask-IDs aus der Verknüpfung im Task
        const subtaskRefs = kanbanData.tasks[taskId].subtasks;

        for (const subtaskId in subtaskRefs) {
            if (subtaskRefs[subtaskId]) {
                // Lösche den Subtask aus kanbanData.subtasks
                if (kanbanData.subtasks && kanbanData.subtasks[subtaskId]) {
                    delete kanbanData.subtasks[subtaskId];
                }
            }
        }

        // Entferne die Subtask-Verknüpfung aus dem Task
        delete kanbanData.tasks[taskId].subtasks;
    }
}

// Deletes all subtasks related to the task from the database
async function deleteSubtasks(subtasks) {
    const subtaskIds = Object.keys(subtasks);
    for (let subtaskIndex = 0; subtaskIndex < subtaskIds.length; subtaskIndex++) {
        const subtaskId = subtaskIds[subtaskIndex];
        try {
            const deleteSubtaskResponse = await fetch(`${BASE_URL}subtasks/${subtaskId}.json`, { method: 'DELETE' });
            if (!deleteSubtaskResponse.ok) {
                throw new Error(`Error deleting subtask ${subtaskId}.`);
            }
        } catch (error) {
            console.error(`Error deleting subtask ${subtaskId}: ${error.message}`);
        }
    }
}

// Deletes the task from categories in localStorage and kanbanData for guest users
function deleteTaskFromCategoriesForGuest(taskId) {
    // Lade die aktuellste Version von guestKanbanData
    const guestData = JSON.parse(localStorage.getItem("guestKanbanData"));

    if (guestData && guestData.users && guestData.users.guest && guestData.users.guest.assignedTasks) {
        const assignedTasks = guestData.users.guest.assignedTasks;

        console.log("Vor dem Löschen:", JSON.stringify(assignedTasks, null, 2)); // Debugging-Ausgabe

        // Lösche nur den spezifischen Task
        for (const categoryId in assignedTasks) {
            if (assignedTasks[categoryId] && assignedTasks[categoryId][taskId]) {
                console.log(`Lösche Task ${taskId} aus Kategorie ${categoryId}`); // Debugging-Ausgabe
                delete assignedTasks[categoryId][taskId];
            }
        }

        console.log("Nach dem Löschen:", JSON.stringify(assignedTasks, null, 2)); // Debugging-Ausgabe

        // Aktualisiere das localStorage mit den geänderten Daten
        localStorage.setItem("guestKanbanData", JSON.stringify(guestData));
    } else {
        console.error("guestKanbanData oder assignedTasks nicht gefunden.");
    }
}

// Deletes the task from categories in the database
async function deleteTaskFromCategories(taskId) {
    const response = await fetch(`${BASE_URL}categories.json`);
    const categories = await response.json();
    for (const categoryId in categories) {
        const tasks = categories[categoryId].tasks || [];
        if (tasks.includes(taskId)) {
            const url = `${BASE_URL}categories/${categoryId}/tasks/${taskId}.json`;
            await fetch(url, { method: 'DELETE' });
        }
    }
}

// Deletes a task from all assignees in localStorage and kanbanData for guest users
function deleteTaskFromAssigneesForGuest(taskId) {
    const guestData = JSON.parse(localStorage.getItem("guestKanbanData"));
    if (guestData && guestData.users && guestData.users.guest && guestData.users.guest.assignedTasks) {
        console.log("Vor dem Löschen aus Assignees:", JSON.stringify(guestData.users.guest.assignedTasks, null, 2)); // Debugging-Ausgabe

        for (const userId in guestData.users.guest.assignedTasks) {
            const tasks = guestData.users.guest.assignedTasks[userId];
            if (tasks && tasks[taskId]) {
                delete tasks[taskId];
            }
        }

        console.log("Nach dem Löschen aus Assignees:", JSON.stringify(guestData.users.guest.assignedTasks, null, 2)); // Debugging-Ausgabe

        localStorage.setItem("guestKanbanData", JSON.stringify(guestData));
    }
}

// Deletes a task from all assignees in the database
async function deleteTaskFromAssignees(taskId, assignees) {
    for (const userId of assignees) {
        const url = `${BASE_URL}users/${userId}/assignedTasks/${taskId}.json`;
        await fetch(url, { method: 'DELETE' });
    }
}

// Deletes the task from the database
async function deleteTaskFromDatabase(taskId) {
    const deleteTaskResponse = await fetch(`${BASE_URL}tasks/${taskId}.json`, { method: 'DELETE' });
    if (!deleteTaskResponse.ok) {
        throw new Error('Error deleting task.');
    }
}

// Waits for all pending database operations to complete
async function waitForDatabaseOperations(taskId) {
    try {
        const response = await fetch(`${BASE_URL}tasks/${taskId}/status.json`);
        if (!response.ok) {
            throw new Error(`Error checking database status.`);
        }

        const status = await response.json();
        if (status && status.pendingOperations > 0) {
            return new Promise(resolve => setTimeout(() => resolve(waitForDatabaseOperations(taskId)), 1000));
        }
    } catch (error) {
        console.error(`Error while waiting for database operations: ${error.message}`);
        throw error;
    }
}


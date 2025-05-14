// Deletes a task and all related data, then transitions back to the board view
async function deleteTask(taskId) {
    try {
        const isGuest = JSON.parse(localStorage.getItem("isGuest"));

        if (isGuest) {
            // Synchronisiere die Daten nach Drag-and-Drop
            kanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
            console.log("Guest kanbanData before deletion:", kanbanData);

            // Lösche Subtasks und Task aus localStorage und kanbanData
            deleteSubtasksForGuest(taskId);
            deleteTaskFromLocalStorage(taskId);
            deleteTaskFromCategoriesForGuest(taskId);
            deleteTaskFromAssigneesForGuest(taskId);

            // Synchronisiere erneut nach dem Löschen
            kanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
            console.log("Guest kanbanData after deletion:", kanbanData);
        } else {
            await waitForDatabaseOperations(taskId);

            const category = await getTaskCategoryForUser(taskId);
            if (category) {
                await deleteTaskFromUserAssignedTasks(taskId, category);
            }

            const taskResponse = await fetch(`${BASE_URL}tasks/${taskId}.json`);
            if (!taskResponse.ok) {
                throw new Error('Task could not be fetched.');
            }

            const taskData = await taskResponse.json();
            if (!taskData) return;

            const { subtasks } = taskData;

            if (subtasks) {
                await deleteSubtasks(subtasks);
            }

            await deleteTaskFromCategories(taskId);
            await deleteTaskFromDatabase(taskId);
        }

        await waitForDatabaseOperations(taskId);

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
        delete guestData.tasks[taskId];
        localStorage.setItem("guestKanbanData", JSON.stringify(guestData));
    }

    if (kanbanData.tasks) {
        delete kanbanData.tasks[taskId];
    }
}

// Deletes all subtasks for a task in localStorage and kanbanData for guest users
function deleteSubtasksForGuest(taskId) {
    const guestData = JSON.parse(localStorage.getItem("guestKanbanData"));
    if (guestData && guestData.tasks && guestData.tasks[taskId] && guestData.tasks[taskId].subtasks) {
        const subtaskRefs = guestData.tasks[taskId].subtasks;
        for (const subtaskId in subtaskRefs) {
            if (subtaskRefs[subtaskId]) {
                delete guestData.subtasks[subtaskId];
            }
        }

        delete guestData.tasks[taskId].subtasks;
        localStorage.setItem("guestKanbanData", JSON.stringify(guestData));
    }

    if (kanbanData.tasks && kanbanData.tasks[taskId] && kanbanData.tasks[taskId].subtasks) {
        const subtaskRefs = kanbanData.tasks[taskId].subtasks;

        for (const subtaskId in subtaskRefs) {
            if (subtaskRefs[subtaskId]) {
                if (kanbanData.subtasks && kanbanData.subtasks[subtaskId]) {
                    delete kanbanData.subtasks[subtaskId];
                }
            }
        }

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
    const guestData = JSON.parse(localStorage.getItem("guestKanbanData"));

    if (guestData && guestData.users && guestData.users.guest && guestData.users.guest.assignedTasks) {
        const assignedTasks = guestData.users.guest.assignedTasks;

        for (const categoryId in assignedTasks) {
            if (assignedTasks[categoryId] && assignedTasks[categoryId][taskId]) {
                delete assignedTasks[categoryId][taskId];
            }
        }

        localStorage.setItem("guestKanbanData", JSON.stringify(guestData));
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
    if (!guestData || !guestData.tasks || !guestData.tasks[taskId] || !guestData.tasks[taskId].assignees) {
        return;
    }

    const assignees = guestData.tasks[taskId].assignees;

    for (const userId in assignees) {
        if (assignees[userId] && guestData.users && guestData.users[userId] && guestData.users[userId].assignedTasks) {
            delete guestData.users[userId].assignedTasks[taskId];
        }
    }

    localStorage.setItem("guestKanbanData", JSON.stringify(guestData));
}

// Deletes a task from all assignees in the database
async function deleteTaskFromAssignees(taskId) {
    const taskResponse = await fetch(`${BASE_URL}tasks/${taskId}.json`);
    if (!taskResponse.ok) {
        throw new Error('Task could not be fetched.');
    }

    const taskData = await taskResponse.json();
    if (!taskData || !taskData.assignees) {
        return;
    }

    for (const userId in taskData.assignees) {
        if (taskData.assignees[userId]) {
            const url = `${BASE_URL}users/${userId}/assignedTasks/${taskId}.json`;
            await fetch(url, { method: 'DELETE' });
        }
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
            throw new Error(`Error checking database status for task ${taskId}.`);
        }

        const status = await response.json();

        if (status && status.pendingOperations > 0) {
            return new Promise(resolve => setTimeout(() => resolve(waitForDatabaseOperations(taskId)), 1000));
        }
    } catch (error) {
        throw error;
    }
}

// Deletes a task from the logged-in user's assigned tasks in a specific category
async function deleteTaskFromUserAssignedTasks(taskId, category) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || !loggedInUser.userId) {
        throw new Error("No logged-in user found.");
    }

    const url = `${BASE_URL}users/${loggedInUser.userId}/assignedTasks/${category}/${taskId}.json`;

    try {
        const response = await fetch(url, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Failed to delete task ${taskId} from user ${loggedInUser.userId} in category ${category}.`);
        }
    } catch (error) {
        console.error(`Error deleting task ${taskId} from user ${loggedInUser.userId}: ${error.message}`);
    }
}

// Retrieves the category of a task for the logged-in user
async function getTaskCategoryForUser(taskId) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || !loggedInUser.userId) {
        throw new Error("No logged-in user found.");
    }

    const url = `${BASE_URL}users/${loggedInUser.userId}/assignedTasks.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch assigned tasks for user ${loggedInUser.userId}.`);
        }

        const assignedTasks = await response.json();
        for (const category in assignedTasks) {
            if (assignedTasks[category] && assignedTasks[category][taskId]) {
                return category;
            }
        }

        return null;
    } catch (error) {
        return null;
    }
}


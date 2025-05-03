// Deletes a task and all related data, then transitions back to the board view
async function deleteTask(taskId) {
    try {
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
        await getUsersTasks(taskId);
        await deleteTaskFromAssignees(taskId);

        closeConfirmDialog();
        await backToBoardTable();
    } catch (error) {
        console.error(`Error during task deletion: ${error.message}`);
    }
}

// Deletes the task from the database
async function deleteTaskFromDatabase(taskId) {
    const deleteTaskResponse = await fetch(`${BASE_URL}tasks/${taskId}.json`, { method: 'DELETE' });
    if (!deleteTaskResponse.ok) {
        throw new Error('Error deleting task.');
    }
}

// Deletes all subtasks related to the task
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

// Deletes a task from a specific category for a user
async function deleteTaskFromCategory(userId, taskId, category) {
    const deleteUserTaskResponse = await fetch(`${BASE_URL}users/${userId}/assignedTasks/${category}/${taskId}.json`, { method: 'DELETE' });
    if (!deleteUserTaskResponse.ok) {
        console.error(`Error deleting task from ${category} for user ${userId}.`);
        return;
    }
}

// Deletes a task from all assignees for a specific user
async function deleteTaskFromAssignees(userId, taskId) {
    const deleteAssigneeResponse = await fetch(`${BASE_URL}users/${userId}/assignedTasks/${taskId}.json`, { method: 'DELETE' });
    if (!deleteAssigneeResponse.ok) {
        console.error(`Error deleting task from assignees for user ${userId}.`);
        return;
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

// Updates the task in the database based on user type (guest or registered).
function updateTaskInDatabase(taskId, updatedTaskData) {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    if (isGuest) {
        return updateTaskForGuest(taskId, updatedTaskData);
    } else {
        return updateTaskForRegisteredUser(taskId, updatedTaskData);
    }
}


// Updates the task for a guest user in localStorage.
function updateTaskForGuest(taskId, updatedTaskData) {
    return new Promise((resolve, reject) => {
        try {
            let data = JSON.parse(localStorage.getItem("guestKanbanData"));
            if (!data.tasks[taskId]) {
                return reject(new Error(`Task ${taskId} not found for guest user.`));
            }
            data.tasks[taskId] = updatedTaskData;
            updateGuestSubtasks(data, updatedTaskData);
            localStorage.setItem("guestKanbanData", JSON.stringify(data));
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}


// Updates subtasks for a guest user in localStorage.
function updateGuestSubtasks(data, updatedTaskData) {
    Object.keys(updatedTaskData.subtasks).forEach((subtaskId) => {
        if (!data.subtasks[subtaskId]) {
            const subtaskTitle = kanbanData.subtasks[subtaskId]?.title || "Untitled Subtask";
            data.subtasks[subtaskId] = {
                title: subtaskTitle,
                completed: false,
            };
        }
    });
}


// Updates the task for a registered user in the database.
function updateTaskForRegisteredUser(taskId, updatedTaskData) {
    return fetch(`${BASE_URL}tasks/${taskId}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTaskData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to update task ${taskId}`);
            }
            return updateRegisteredSubtasks(updatedTaskData);
        });
}


// Updates subtasks for a registered user in the database.
function updateRegisteredSubtasks(updatedTaskData) {
    const subtaskPromises = Object.keys(updatedTaskData.subtasks).map((subtaskId) => {
        if (!kanbanData.subtasks[subtaskId]) {
            const subtaskTitle = updatedTaskData.subtasks[subtaskId]?.title || "Untitled Subtask";
            kanbanData.subtasks[subtaskId] = {
                title: subtaskTitle,
                completed: false,
            };
        }
        return uploadSubtaskToDatabase(subtaskId, kanbanData.subtasks[subtaskId]);
    });
    return Promise.all(subtaskPromises);
}
// Main function to delete a task and all related data (subtasks, users, assignees)
async function deleteTask(taskId) {
    try {
        const taskResponse = await fetch(`${BASE_URL}tasks/${taskId}.json`);
        if (!taskResponse.ok) {
            console.error(`Error fetching task. Status: ${taskResponse.status}`);
            throw new Error('Task could not be fetched.');
        }

        const taskData = await taskResponse.json();
        if (!taskData) throw new Error('Task not found.');

        const { assignees, subtasks } = taskData;

        await deleteTaskFromDatabase(taskId);
        await getSubtasks(subtasks);
        await getUsersTasks(taskId);  // Call to getUsersTasks instead
        await deleteTaskFromAssignees(taskId);

        console.log(`Task ${taskId} and related data successfully deleted.`);
    } catch (error) {
        console.error(`Error deleting task: ${error.message}`);
    }
}


// Delete the task from the database
async function deleteTaskFromDatabase(taskId) {
    const deleteTaskResponse = await fetch(`${BASE_URL}tasks/${taskId}.json`, { method: 'DELETE' });
    if (!deleteTaskResponse.ok) {
        console.error(`Error deleting task. Status: ${deleteTaskResponse.status}`);
        throw new Error('Error deleting task.');
    }
    console.log(`Task ${taskId} deleted from the database.`);
}

// Retrieve and delete all subtasks related to the task
async function getSubtasks(subtasks) {
    const subtaskIds = Object.keys(subtasks);
    for (let subtaskIndex = 0; subtaskIndex < subtaskIds.length; subtaskIndex++) {
        const subtaskId = subtaskIds[subtaskIndex];
        try {
            if (subtasks[subtaskId]) {
                await deleteSubtasks(subtaskId);
            }
        } catch (error) {
            console.error(`Error deleting subtask ${subtaskId}: ${error.message}`);
        }
    }
}

// Delete a specific subtask by its ID
async function deleteSubtasks(subtaskId) {
    const deleteSubtaskResponse = await fetch(`${BASE_URL}subtasks/${subtaskId}.json`,
        { method: 'DELETE' });
    if (!deleteSubtaskResponse.ok) {
        console.error(`Error deleting subtask ${subtaskId}. Status: ${deleteSubtaskResponse.status}`);
        throw new Error(`Error deleting subtask ${subtaskId}.`);
    }
    console.log(`Subtask ${subtaskId} deleted.`);
}

// Fetch all user data from the database
async function getUsers() {
    const userResponse = await fetch(`${BASE_URL}users.json`);
    if (!userResponse.ok) {
        return Promise.reject(`Error fetching user data. Status: ${userResponse.status}`);
    }
    return userResponse.json();
}

// Retrieve and process all tasks assigned to users, then remove the task from them
async function getUsersTasks(taskId) {
    const usersData = await getUsers().catch(error => {
        console.error(`Error fetching user data: ${error}`);
        return null;
    });
    if (!usersData) return;

    const userIds = Object.keys(usersData);

    for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
        const userId = userIds[userIndex];
        const userTasks = usersData[userId].assignedTasks;
        if (userTasks) {
            await getCategory(userId, taskId, userTasks);
        }
    }
}

// Retrieve and process each category of assigned tasks for the user
async function getCategory(userId, taskId, userTasks) {
    const categories = Object.keys(userTasks);

    for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
        const category = categories[categoryIndex];
        if (userTasks[category]?.[taskId]) {
            await deleteTaskFromCategory(userId, taskId, category);
        }
    }
}

// Delete a task from a specific category for a user
async function deleteTaskFromCategory(userId, taskId, category) {
    const deleteUserTaskResponse = await fetch(`${BASE_URL}users/${userId}/assignedTasks/${category}/${taskId}.json`,
        { method: 'DELETE' });
    if (!deleteUserTaskResponse.ok) {
        console.error(`Error deleting task from ${category} for user ${userId}. Status: ${deleteUserTaskResponse.status}`);
        return;
    }
    console.log(`Task ${taskId} removed from ${category} for user ${userId}.`);
}

// Fetch all assigned user data from the database
async function getAssignedData() {
    const userResponse = await fetch(`${BASE_URL}users.json`);
    if (!userResponse.ok) {
        return Promise.reject(`Error fetching user data. Status: ${userResponse.status}`);
    }
    return userResponse.json();
}

// Retrieve and remove the task from all assignees' lists
async function getAssigneesTasks(taskId) {
    const usersData = await getAssignedData().catch(error => {
        console.error(`Error fetching user data: ${error}`);
        return null;
    });

    if (!usersData) return;

    const userIds = Object.keys(usersData);

    for (let assigneeIndex = 0; assigneeIndex < userIds.length; assigneeIndex++) {
        const userId = userIds[assigneeIndex];
        const assignees = usersData[userId].assignedTasks;
        if (assignees && assignees[taskId]) {
            await deleteTaskFromAssignees(userId, taskId);
        }
    }
}

// Delete a task from all assignees for a specific user
async function deleteTaskFromAssignees(userId, taskId) {
    const deleteAssigneeResponse = await fetch(`${BASE_URL}users/${userId}/assignedTasks/${taskId}.json`, { method: 'DELETE' });
    if (!deleteAssigneeResponse.ok) {
        console.error(`Error deleting task from assignees for user ${userId}. Status: ${deleteAssigneeResponse.status}`);
        return;
    }
    console.log(`Task ${taskId} removed from assignees of user ${userId}.`);
}

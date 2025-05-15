// Saves the edited task by collecting data, updating the database, and transitioning back to the board view
async function saveEditedTask(taskId) {
    try {
        const taskContent = getTaskContent(taskId, kanbanData);
        const existingSubtasks = taskContent?.subtasks || {};
        const updatedTaskData = collectTaskData(taskId, existingSubtasks);
        const removedSubtasks = identifyRemovedSubtasks(existingSubtasks, updatedTaskData.subtasks);

        await updateTaskInDatabase(taskId, updatedTaskData);
        await deleteRemovedSubtasks(removedSubtasks);
        await waitForDatabaseSaveOperations(taskId);
        await fromFocusedTaskToBoard();
    } catch (error) {
        console.error("Error updating task or subtasks:", error);
    }
}

// Collects all task data from the edit modal and prepares it for saving
function collectTaskData(taskId, existingSubtasks) {
    const title = document.getElementById("edit_input_title").value.trim();
    const description = document.getElementById("edit_input_description").value.trim();
    const dueDate = document.querySelector("input[type='date']").value;
    const priority = document.querySelector(".priority-buttons-div .active p").textContent.toLowerCase();
    const assignees = getAssignedUsersFromEdit();
    const category = document.querySelector(".edit-selected-categories .category-label")?.textContent || "";
    const createdAt = new Date(dueDate).toISOString();
    const currentSubtasks = collectSubtasks(taskId, existingSubtasks);

    return {
        title,
        description,
        createdAt,
        priority,
        assignees,
        label: category,
        createdBy: kanbanData.tasks[taskId]?.createdBy || "unknown",
        subtasks: currentSubtasks,
        updatedAt: new Date().toISOString(),
    };
}

// Collects subtasks from the edit modal and identifies new or existing ones
function collectSubtasks(taskId, existingSubtasks) {
    const subtaskElements = document.querySelectorAll("#display_subtasks .edit-subtask-item");
    const currentSubtasks = {};

    for (let subtaskIndex = 0; subtaskIndex < subtaskElements.length; subtaskIndex++) {
        const item = subtaskElements[subtaskIndex];
        const subtaskTitle = item.textContent.trim();
        const isExisting = Object.keys(existingSubtasks).some((subtaskId) => {
            return kanbanData.subtasks[subtaskId]?.title === subtaskTitle;
        });

        if (isExisting) {
            const subtaskId = Object.keys(existingSubtasks).find((id) => kanbanData.subtasks[id]?.title === subtaskTitle);
            currentSubtasks[subtaskId] = true;
        } else {
            const nextSubtaskId = generateNextSubtaskId();
            kanbanData.subtasks[nextSubtaskId] = {
                title: subtaskTitle,
                [taskId]: true,
                completed: false,
            };
            currentSubtasks[nextSubtaskId] = true;
        }
    }

    return currentSubtasks;
}

// Identifies subtasks that were removed in the edit modal
function identifyRemovedSubtasks(existingSubtasks, currentSubtasks) {
    return Object.keys(existingSubtasks).filter((subtaskId) => {
        const subtaskTitle = kanbanData.subtasks[subtaskId]?.title;
        return subtaskTitle && !Object.keys(currentSubtasks).includes(subtaskId);
    });
}

// Deletes subtasks that were removed from the task
function deleteRemovedSubtasks(removedSubtasks) {
    const subtaskDeletePromises = removedSubtasks.map((subtaskId) => {
        return deleteSubtaskFromDatabase(subtaskId);
    });
    return Promise.all(subtaskDeletePromises);
}

// Generates the next subtask ID based on the highest existing ID
function generateNextSubtaskId() {
    const allSubtaskIds = Object.keys(kanbanData.subtasks);
    let maxId = allSubtaskIds.reduce((max, id) => {
        const num = parseInt(id.replace("subtask", ""), 10);
        return num > max ? num : max;
    }, 0);
    return `subtask${maxId + 1}`;
}

// Waits for all pending save operations in the database to complete
async function waitForDatabaseSaveOperations(taskId) {
    try {
        const response = await fetch(`${BASE_URL}tasks/${taskId}/status.json`);
        if (!response.ok) {
            throw new Error(`Error checking database save status. Status: ${response.status}`);
        }

        const status = await response.json();
        if (status && status.pendingSaveOperations > 0) {
            return new Promise(resolve => setTimeout(() => resolve(waitForDatabaseSaveOperations(taskId)), 1000));
        }
    } catch (error) {
        console.error(`Error while waiting for database save operations: ${error.message}`);
        throw error;
    }
}

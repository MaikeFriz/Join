/**
 * Returns context for a given task (existing subtasks and guest mode).
 * @param {string} taskId - The task ID.
 * @returns {Object} An object with existingSubtasks and isGuest flag.
 */
function getTaskContext(taskId) {
    const taskContent = getTaskContent(taskId, kanbanData);
    const existingSubtasks = taskContent?.subtasks || {};
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    return { existingSubtasks, isGuest };
}

/**
 * Saves task and subtasks depending on guest or user mode.
 * @param {boolean} isGuest - Whether the user is a guest.
 * @param {string} taskId - The task ID.
 * @param {Object} updatedTaskData - The updated task data.
 * @param {Array<string>} removedSubtasks - Array of removed subtask IDs.
 */
async function saveTaskAndSubtasks(isGuest, taskId, updatedTaskData, removedSubtasks) {
    if (isGuest) {
        await saveEditedTaskForGuest(taskId, updatedTaskData, removedSubtasks);
    } else {
        await saveEditedTaskForUser(taskId, updatedTaskData, removedSubtasks);
    }
}

/**
 * Collects all task data from the edit modal.
 * @param {string} taskId - The task ID.
 * @param {Object} existingSubtasks - The existing subtasks object.
 * @returns {Object} The task data object.
 */
function collectTaskData(taskId, existingSubtasks) {
    const title = document.getElementById("edit_input_title").value.trim();
    const description = document.getElementById("edit_input_description").value.trim();
    const dueDate = document.querySelector("input[type='date']").value;
    const priority = document.querySelector(".priority-buttons-div .active p").textContent.toLowerCase();
    const assignees = getAssignedUsersFromEdit();
    const category = document.querySelector(".edit-selected-categories .category-label")?.textContent || "";
    const createdAt = new Date(dueDate).toISOString();
    const currentSubtasks = collectSubtasks(taskId, existingSubtasks);

    return createTaskDataObject(taskId, title, description, createdAt, priority, assignees, category, currentSubtasks);
}

/**
 * Creates a task data object.
 * @param {string} taskId - The task ID.
 * @param {string} title - The task title.
 * @param {string} description - The task description.
 * @param {string} createdAt - The creation date.
 * @param {string} priority - The task priority.
 * @param {Array} assignees - The assigned users.
 * @param {string} category - The task category.
 * @param {Object} currentSubtasks - The current subtasks object.
 * @returns {Object} The task data object.
 */
function createTaskDataObject(taskId, title, description, createdAt, priority, assignees, category, currentSubtasks) {
    return {
        title,
        description,
        createdAt,
        priority,
        assignees,
        label: category,
        createdBy: (kanbanData && kanbanData.tasks && kanbanData.tasks[taskId]?.createdBy) || "unknown",
        subtasks: currentSubtasks,
        updatedAt: new Date().toISOString(),
    };
}

/**
 * Collects all subtasks from the edit modal.
 * @param {string} taskId - The task ID.
 * @param {Object} existingSubtasks - The existing subtasks object.
 * @returns {Object} The current subtasks object.
 */
function collectSubtasks(taskId, existingSubtasks) {
    const subtaskElements = document.querySelectorAll("#display_subtasks .edit-subtask-item");
    const currentSubtasks = {};

    for (let subtaskIndex = 0; subtaskIndex < subtaskElements.length; subtaskIndex++) {
        const item = subtaskElements[subtaskIndex];
        const subtaskTitle = item.textContent.trim();
        const subtaskId = findOrCreateSubtaskId(subtaskTitle, existingSubtasks, taskId);
        currentSubtasks[subtaskId] = true;
    }

    return currentSubtasks;
}

/**
 * Finds or creates a subtask ID for a given subtask title.
 * @param {string} subtaskTitle - The subtask title.
 * @param {Object} existingSubtasks - The existing subtasks object.
 * @param {string} taskId - The task ID.
 * @returns {string} The subtask ID.
 */
function findOrCreateSubtaskId(subtaskTitle, existingSubtasks, taskId) {
    const existingSubtaskIds = Object.keys(existingSubtasks);
    for (let subtaskIndex = 0; subtaskIndex < existingSubtaskIds.length; subtaskIndex++) {
        const subtaskId = existingSubtaskIds[subtaskIndex];
        if (kanbanData.subtasks[subtaskId]?.title === subtaskTitle) {
            return subtaskId;
        }
    }
    const nextSubtaskId = generateNextSubtaskId();
    kanbanData.subtasks[nextSubtaskId] = {
        title: subtaskTitle,
        [taskId]: true,
        completed: false,
    };
    return nextSubtaskId;
}

/**
 * Identifies removed subtasks by comparing existing and current subtasks.
 * @param {Object} existingSubtasks - The existing subtasks object.
 * @param {Object} currentSubtasks - The current subtasks object.
 * @returns {Array<string>} Array of removed subtask IDs.
 */
function identifyRemovedSubtasks(existingSubtasks, currentSubtasks) {
    const removedSubtasks = [];
    const currentSubtaskIds = Object.keys(currentSubtasks);
    const existingSubtaskIds = Object.keys(existingSubtasks);

    for (let subtaskIndex = 0; subtaskIndex < existingSubtaskIds.length; subtaskIndex++) {
        const subtaskId = existingSubtaskIds[subtaskIndex];
        const subtaskTitle = kanbanData.subtasks[subtaskId]?.title;
        if (subtaskTitle && !currentSubtaskIds.includes(subtaskId)) {
            removedSubtasks.push(subtaskId);
        }
    }
    return removedSubtasks;
}

/**
 * Generates the next subtask ID.
 * @returns {string} The next subtask ID.
 */
function generateNextSubtaskId() {
    const allSubtaskIds = Object.keys(kanbanData.subtasks);
    let maxId = 0;
    for (let subtaskIndex = 0; subtaskIndex < allSubtaskIds.length; subtaskIndex++) {
        const subtaskId = allSubtaskIds[subtaskIndex];
        const num = parseInt(subtaskId.replace("subtask", ""), 10);
        if (num > maxId) {
            maxId = num;
        }
    }
    return `subtask${maxId + 1}`;
}

/**
 * Saves edited task and subtasks for guest users in localStorage.
 * @param {string} taskId - The task ID.
 * @param {Object} updatedTaskData - The updated task data.
 * @param {Array<string>} removedSubtasks - Array of removed subtask IDs.
 */
async function saveEditedTaskForGuest(taskId, updatedTaskData, removedSubtasks) {
    kanbanData = JSON.parse(localStorage.getItem("guestKanbanData")) || {tasks: {}, subtasks: {}, users: {}};
    kanbanData.tasks[taskId] = updatedTaskData;
    updateGuestSubtasks(taskId, updatedTaskData);
    removeGuestSubtasks(removedSubtasks);
    localStorage.setItem("guestKanbanData", JSON.stringify(kanbanData));
}

/**
 * Updates subtasks for guest users.
 * @param {string} taskId - The task ID.
 * @param {Object} updatedTaskData - The updated task data.
 */
function updateGuestSubtasks(taskId, updatedTaskData) {
    const subtaskIds = Object.keys(updatedTaskData.subtasks);
    const subtaskElements = document.querySelectorAll("#display_subtasks .edit-subtask-item");
    for (let subtaskIndex = 0; subtaskIndex < subtaskIds.length; subtaskIndex++) {
        const subtaskId = subtaskIds[subtaskIndex];
        const title = subtaskElements[subtaskIndex]?.textContent.trim() || "Untitled Subtask";

        if (!kanbanData.subtasks[subtaskId]) {
            kanbanData.subtasks[subtaskId] = {
                title: title, completed: false,[taskId]: true,
            };
        } else {
            kanbanData.subtasks[subtaskId].title = title;
            kanbanData.subtasks[subtaskId][taskId] = true;
        }
    }
}

/**
 * Removes deleted subtasks for guest users.
 * @param {Array<string>} removedSubtasks - Array of removed subtask IDs.
 */
function removeGuestSubtasks(removedSubtasks) {
    for (let subtaskIndex = 0; subtaskIndex < removedSubtasks.length; subtaskIndex++) {
        const subtaskId = removedSubtasks[subtaskIndex];
        delete kanbanData.subtasks[subtaskId];
    }
}

/**
 * Saves edited task and subtasks for registered users in the database.
 * @param {string} taskId - The task ID.
 * @param {Object} updatedTaskData - The updated task data.
 * @param {Array<string>} removedSubtasks - Array of removed subtask IDs.
 */
async function saveEditedTaskForUser(taskId, updatedTaskData, removedSubtasks) {
    await updateTaskInDatabase(taskId, updatedTaskData);
    await deleteRemovedSubtasks(removedSubtasks);
    await waitForDatabaseSaveOperations(taskId);
}

/**
 * Deletes removed subtasks from the database.
 * @param {Array<string>} removedSubtasks - Array of removed subtask IDs.
 * @returns {Promise} A promise that resolves when all deletions are complete.
 */
function deleteRemovedSubtasks(removedSubtasks) {
    const subtaskDeletePromises = [];
    for (let subtaskIndex = 0; subtaskIndex < removedSubtasks.length; subtaskIndex++) {
        const subtaskId = removedSubtasks[subtaskIndex];
        subtaskDeletePromises.push(deleteSubtaskFromDatabase(subtaskId));
    }
    return Promise.all(subtaskDeletePromises);
}

/**
 * Waits for all ongoing save operations in the database to finish.
 * @param {string} taskId - The task ID.
 * @returns {Promise<void>} A promise that resolves when all save operations are complete.
 */
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
        throw error;
    }
}

/**
 * Saves all changes to the task and its subtasks.
 * @param {string} taskId - The task ID.
 */
async function saveEditedTask(taskId) {
    const { existingSubtasks, isGuest } = getTaskContext(taskId);
    const updatedTaskData = collectTaskData(taskId, existingSubtasks);
    const removedSubtasks = identifyRemovedSubtasks(existingSubtasks, updatedTaskData.subtasks);
    if (isGuest) {
        await saveEditedTaskForGuest(taskId, updatedTaskData, removedSubtasks);
    } else {
        await saveEditedTaskForUser(taskId, updatedTaskData, removedSubtasks);
    }
}

/**
 * Returns the highest subtask ID number.
 * @returns {number} The highest subtask ID number.
 */
function getMaxSubtaskIdNumber() {
    const ids = Object.keys(kanbanData.subtasks || {});
    const nums = ids.map(id => parseInt(id.replace('subtask', ''), 10)).filter(n => !isNaN(n));
    return nums.length ? Math.max(...nums) : 0;
}
// Deletes a task and all related guest data from localStorage
function deleteTaskForGuest(taskId) {
    deleteSubtasksForGuest(taskId);
    deleteTaskFromLocalStorage(taskId);
    deleteTaskFromCategoriesForGuest(taskId);
    deleteTaskFromAssigneesForGuest(taskId);
}


// Deletes all subtasks for a guest task from localStorage
function deleteSubtasksForGuest(taskId) {
    if (kanbanData && kanbanData.tasks && kanbanData.tasks[taskId] && kanbanData.tasks[taskId].subtasks) {
        const subtaskRefs = kanbanData.tasks[taskId].subtasks;
        for (const subtaskId in subtaskRefs) {
            if (subtaskRefs[subtaskId] && kanbanData.subtasks && kanbanData.subtasks[subtaskId]) {
                delete kanbanData.subtasks[subtaskId];
            }
        }
        delete kanbanData.tasks[taskId].subtasks;
    }
    localStorage.setItem("guestKanbanData", JSON.stringify(kanbanData));
}


// Removes the task from localStorage for guest users
function deleteTaskFromLocalStorage(taskId) {
    if (kanbanData && kanbanData.tasks) {
        delete kanbanData.tasks[taskId];
    }
    localStorage.setItem("guestKanbanData", JSON.stringify(kanbanData));
}


// Removes a guest task from all categories in localStorage
function deleteTaskFromCategoriesForGuest(taskId) {
    if (kanbanData && kanbanData.users && kanbanData.users.guest && kanbanData.users.guest.assignedTasks) {
        const assignedTasks = kanbanData.users.guest.assignedTasks;
        for (const categoryId in assignedTasks) {
            if (assignedTasks[categoryId] && assignedTasks[categoryId][taskId]) {
                delete assignedTasks[categoryId][taskId];
            }
        }
    }
    localStorage.setItem("guestKanbanData", JSON.stringify(kanbanData));
}


// Removes a guest task from all assignees in localStorage
function deleteTaskFromAssigneesForGuest(taskId) {
    if (!kanbanData || !kanbanData.tasks || !kanbanData.tasks[taskId] || !kanbanData.tasks[taskId].assignees) {
        return;
    }
    const assignees = kanbanData.tasks[taskId].assignees;
    for (const userId in assignees) {
        if (assignees[userId] && kanbanData.users && kanbanData.users[userId] && kanbanData.users[userId].assignedTasks) {
            delete kanbanData.users[userId].assignedTasks[taskId];
        }
    }
    localStorage.setItem("guestKanbanData", JSON.stringify(kanbanData));
}
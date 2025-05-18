// Displays the subtasks in the edit task modal and updates their completed status.
async function displayEditSubtasks(subtasks) {
    const subtaskContainer = document.getElementById("display_subtasks");
    subtaskContainer.innerHTML = "";

    if (subtasks && Object.keys(subtasks).length > 0) {
        for (const subtaskId of Object.keys(subtasks)) {
            const subtaskStatus = await fetchSubtaskStatusFromDatabase(subtaskId);
            subtasks[subtaskId].completed = subtaskStatus?.completed || false;
        }

        const subtaskHTML = renderEditSubtasks(subtasks);
        subtaskContainer.innerHTML = subtaskHTML;
    }
}

// Fetches the completed status of a specific subtask from the database.
async function fetchSubtaskStatusFromDatabase(subtaskId) {
    try {
        const response = await fetchFromDatabase(`${BASE_URL}subtasks/${subtaskId}.json`, "GET");
        if (!response.ok) {
            return { completed: false };
        }
        const subtaskData = await response.json();
        return { completed: subtaskData?.completed || false };
    } catch {
        return { completed: false };
    }
}

// Generates the HTML for all subtasks to be displayed in the edit task modal.
function renderEditSubtasks(subtasks) {
    let subtaskHTML = "";
    const subtaskIds = Object.keys(subtasks);
    for (let subtaskIndex = 0; subtaskIndex < subtaskIds.length; subtaskIndex++) {
        const subtaskId = subtaskIds[subtaskIndex];
        const subtaskData = kanbanData.subtasks[subtaskId];
        if (!subtaskData) continue;
        subtaskHTML += editSubtaskTemplate(subtaskId, subtaskData);
    }
    return subtaskHTML;
}

// Adds a new subtask to the UI and clears the input field.
function addEditSubtask() {
    const inputField = document.getElementById("input_edit_subtask");
    const subtaskValue = inputField.value.trim();

    if (subtaskValue) {
        let subtaskContainer = document.getElementById("display_subtasks");
        const nextSubtaskId = generateNextSubtaskId();
        const newSubtaskHTML = editSubtaskTemplate(nextSubtaskId, { title: subtaskValue });
        subtaskContainer.innerHTML += newSubtaskHTML;
        inputField.value = "";
    } else {
        alert("Please enter a subtask before adding.");
    }
}

// Removes a specific subtask from the edit task modal based on its ID.
function removeEditSubtask(subtaskId, subtaskTitle) {
    const subtaskContainer = document.getElementById("display_subtasks");
    const subtaskElements = subtaskContainer.getElementsByClassName("edit-subtask-item");

    for (let subtaskIndex = 0; subtaskIndex < subtaskElements.length; subtaskIndex++) {
        const subtaskElement = subtaskElements[subtaskIndex];
        if (subtaskElement.innerHTML.includes(subtaskId)) {
            subtaskContainer.removeChild(subtaskElement);
            return;
        }
    }
}

// Uploads a subtask to the database using a PUT request.
function uploadSubtaskToDatabase(subtaskId, subtaskData) {
    if (!subtaskData || typeof subtaskData !== "object") {
        return Promise.reject(new Error(`Invalid subtask data for subtaskId: ${subtaskId}`));
    }

    if (typeof subtaskData.completed === "undefined") {
        subtaskData.completed = false;
    }

    return fetchFromDatabase(`${BASE_URL}subtasks/${subtaskId}.json`, "PUT", subtaskData);
}

// Deletes a subtask from the database using a DELETE request.
function deleteSubtaskFromDatabase(subtaskId) {
    return fetchFromDatabase(`${BASE_URL}subtasks/${subtaskId}.json`, "DELETE");
}

// Sends a fetch request to the database with the specified method and body.
function fetchFromDatabase(url, method, body = null) {
    return fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null,
    });
}
// Updates the UI to display the subtasks in the edit task modal.
function displayEditSubtasks(subtasks) {
    const subtaskContainer = document.getElementById("display_subtasks");
        
    if (!subtasks || Object.keys(subtasks).length === 0) {
        subtaskContainer.innerHTML = "<p>No subtasks available.</p>";
        return;
    }

    subtaskContainer.innerHTML = "";
    
    const subtaskHTML = renderEditSubtasks(subtasks);
    subtaskContainer.innerHTML = subtaskHTML;
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

// Removes a subtask from the UI.
function removeEditSubtask(subtaskId, subtaskTitle) {
    const subtaskElement = document.querySelector(`.edit-subtask-item img[onclick*="${subtaskId}"]`).parentElement;

    if (subtaskElement) {
        subtaskElement.remove();
    }
}

// Uploads a subtask to the database using a PUT request.
function uploadSubtaskToDatabase(subtaskId, subtaskData) {
    if (!subtaskData || typeof subtaskData !== "object") {
        console.error(`Invalid subtask data for subtaskId: ${subtaskId}`, subtaskData);
        return Promise.reject(new Error(`Invalid subtask data for subtaskId: ${subtaskId}`));
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
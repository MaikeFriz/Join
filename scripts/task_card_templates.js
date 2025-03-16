function assigneeTemplate(assigneeInitials) {
    return /*html*/`
    <span class="assignee-initials ${assigneeInitials.charAt(0).toLowerCase()}">${assigneeInitials}</span>
    `;
}

function todoCardTemplate(todoContent) {
    return /*html*/`
    <div class="board-task">
        <label class="${todoContent.label.split(' ').join('-').toLowerCase()}">${todoContent.label}</label>
        <h3>${todoContent.title || "Unbenannte Aufgabe"}</h3>
        <p>${todoContent.description || "Keine Beschreibung"}</p>
        <div class="assignees-container">
            ${getAssignees(todoContent)}
        </div>
    </div>
    `;
}

function inProgressCardTemplate(inProgressContent) {
    return /*html*/`
    <div class="board-task">
        <label class="${inProgressContent.label.split(' ').join('-').toLowerCase()}">${inProgressContent.label}</label>
        <h3>${inProgressContent.title || "Unbenannte Aufgabe"}</h3>
        <p>${inProgressContent.description || "Keine Beschreibung"}</p>
        <div class="assignees-container">
            ${getAssignees(inProgressContent)}
        </div>
    </div>
    `;
}

function awaitingFeedbackCardTemplate(awaitingFeedbackContent) {
    return /*html*/`
    <div class="board-task">
        <label class="${awaitingFeedbackContent.label.split(' ').join('-').toLowerCase()}">${awaitingFeedbackContent.label}</label>
        <h3>${awaitingFeedbackContent.title || "Unbenannte Aufgabe"}</h3>
        <p>${awaitingFeedbackContent.description || "Keine Beschreibung"}</p>
        <div class="assignees-container">
            ${getAssignees(awaitingFeedbackContent)}
        </div>
    </div>
    `;
}

function doneCardTemplate(doneContent) {
    return /*html*/`
    <div class="board-task">
        <label class="${doneContent.label.split(' ').join('-').toLowerCase()}">${doneContent.label}</label>
        <h3>${doneContent.title || "Unbenannte Aufgabe"}</h3>
        <p>${doneContent.description || "Keine Beschreibung"}</p>
        <div class="assignees-container">
            ${getAssignees(doneContent)}
        </div>
    </div>
    `;
}
function todoCardTemplate(todoContent) {
  return /*html*/ `
      <div class="board-task draggable" draggable="true">
          <label class="${todoContent.label
            .split(" ")
            .join("-")
            .toLowerCase()}">${todoContent.label}</label>
          <div>
              <h3>${todoContent.title || "Unbenannte Aufgabe"}</h3>
              <p>${todoContent.description || "Keine Beschreibung"}</p>
          </div>
          <div class="review-task-bottom">
              <div class="assignees-container">
                  ${getAssignees(todoContent)}
              </div>
              <div class="${todoContent.priority}"></div>
          </div>
      </div>
      `;
}

function inProgressCardTemplate(inProgressContent) {
  return /*html*/ `
      <div class="board-task draggable" draggable="true">
          <label class="${inProgressContent.label
            .split(" ")
            .join("-")
            .toLowerCase()}">${inProgressContent.label}</label>
          <div>
              <h3>${inProgressContent.title || "Unbenannte Aufgabe"}</h3>
              <p>${inProgressContent.description || "Keine Beschreibung"}</p>
          </div>
          <div class="review-task-bottom">
              <div class="assignees-container">
                  ${getAssignees(inProgressContent)}
              </div>
              <div class="${inProgressContent.priority}"></div>
          </div>
      </div>
      `;
}

function awaitingFeedbackCardTemplate(awaitingFeedbackContent) {
  return /*html*/ `
      <div class="board-task draggable" draggable="true">
          <label class="${awaitingFeedbackContent.label
            .split(" ")
            .join("-")
            .toLowerCase()}">${awaitingFeedbackContent.label}</label>
          <div>
              <h3>${awaitingFeedbackContent.title || "Unbenannte Aufgabe"}</h3>
              <p>${
                awaitingFeedbackContent.description || "Keine Beschreibung"
              }</p>
          </div> 
          <div class="review-task-bottom">
              <div class="assignees-container">
                  ${getAssignees(awaitingFeedbackContent)}
              </div>
              <div class="${awaitingFeedbackContent.priority}"></div>
          </div>
      </div>
      `;
}

function doneCardTemplate(doneContent) {
  return /*html*/ `
      <div class="board-task draggable" draggable="true">
          <label class="${doneContent.label
            .split(" ")
            .join("-")
            .toLowerCase()}">${doneContent.label}</label>
          <div>  
              <h3>${doneContent.title || "Unbenannte Aufgabe"}</h3>
              <p>${doneContent.description || "Keine Beschreibung"}</p>
          </div>  
          <div class="review-task-bottom">
              <div class="assignees-container">
                  ${getAssignees(doneContent)}
              </div>
              <div class="${doneContent.priority}"></div>
          </div>
      </div>
      `;
}

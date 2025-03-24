function toDoCardTemplate(toDoContent) {
  let label = toDoContent.label || "Keine Kategorie"; // Provide a default value
  let fitLabelForCSS = label.toLowerCase().replace(/\s+/g, "-");
  let title = toDoContent.title || "Untitled Task"; // Provide a default value
  let description = toDoContent.description || "No Description"; // Provide a default value
  return /*html*/ `
      <div class="board-task draggable" draggable="true" data-task-id="${
        toDoContent.taskId
      }">
          <label class="${fitLabelForCSS}">${label}</label>
          <div>
              <h3>${title}</h3>
              <p>${description}</p>
          </div>
          <div class="review-task-bottom">
              <div class="assignees-container">
                  ${getAssignees(toDoContent)}
              </div>
              <div class="${toDoContent.priority}"></div>
          </div>
        </div>
    `;
}

function inProgressCardTemplate(inProgressContent) {
  let label = inProgressContent.label || "Keine Kategorie"; // Provide a default value
  let fitLabelForCSS = label.toLowerCase().replace(/\s+/g, "-");
  let title = inProgressContent.title || "Untitled Task"; // Provide a default value
  let description = inProgressContent.description || "No Description"; // Provide a default value
  return /*html*/ `
      <div class="board-task draggable" draggable="true" data-task-id="${
        inProgressContent.taskId
      }">
          <label class="${fitLabelForCSS}">${label}</label>
          <div>
              <h3>${title}</h3>
              <p>${description}</p>
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
  let label = awaitingFeedbackContent.label || "Keine Kategorie"; // Provide a default value
  let fitLabelForCSS = label.toLowerCase().replace(/\s+/g, "-");
  let title = awaitingFeedbackContent.title || "Untitled Task"; // Provide a default value
  let description = awaitingFeedbackContent.description || "No Description"; // Provide a default value
  return /*html*/ `
      <div class="board-task draggable" draggable="true" data-task-id="${
        awaitingFeedbackContent.taskId
      }">
          <label class="${fitLabelForCSS}">${label}</label>
          <div>
              <h3>${title}</h3>
              <p>${description}</p>
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
  let label = doneContent.label || "Keine Kategorie"; // Provide a default value
  let fitLabelForCSS = label.toLowerCase().replace(/\s+/g, "-");
  let title = doneContent.title || "Untitled Task"; // Provide a default value
  let description = doneContent.description || "No Description"; // Provide a default value
  return /*html*/ `
      <div class="board-task draggable" draggable="true" data-task-id="${
        doneContent.taskId
      }">
          <label class="${fitLabelForCSS}">${label}</label>
          <div>  
              <h3>${title}</h3>
              <p>${description}</p>
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

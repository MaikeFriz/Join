function toDoCardTemplate(toDoContent) {
    let fitLabelForCSS = toDoContent.label.toLowerCase().replace(/\s+/g, '-');
    return /*html*/ `
      <div class="board-task draggable" draggable="true" data-task-id="${toDoContent.taskId}">
          <label class="${fitLabelForCSS}">${toDoContent.label}</label>
          <div>
              <h3>${toDoContent.title || "Untitled Task"}</h3>
              <p>${toDoContent.description || "No Description"}</p>
          </div>
          <div class="review-task-bottom">
              <div class="assignees-container">
                  ${getAssignees(toDoContent)}
              </div>
              <div class="${toDoContent.priority}"></div>
          </div>
          <div class="assigned-user">
              
          </div>
      </div>
    `;
  }
  
  function inProgressCardTemplate(inProgressContent) {
    return /*html*/ `
      <div class="board-task draggable" draggable="true" data-task-id="${inProgressContent.taskId}">
          <label class="${inProgressContent.label}">${inProgressContent.label}</label>
          <div>
              <h3>${inProgressContent.title || "Untitled Task"}</h3>
              <p>${inProgressContent.description || "No Description"}</p>
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
      <div class="board-task draggable" draggable="true" data-task-id="${awaitingFeedbackContent.taskId}">
          <label class="${awaitingFeedbackContent.label}">${awaitingFeedbackContent.label}</label>
          <div>
              <h3>${awaitingFeedbackContent.title || "Untitled Task"}</h3>
              <p>${awaitingFeedbackContent.description || "No Description"}</p>
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
      <div class="board-task draggable" draggable="true" data-task-id="${doneContent.taskId}">
          <label class="${doneContent.label}">${doneContent.label}</label>
          <div>  
              <h3>${doneContent.title || "Untitled Task"}</h3>
              <p>${doneContent.description || "No Description"}</p>
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
  

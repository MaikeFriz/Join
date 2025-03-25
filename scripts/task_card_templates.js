function taskCardTemplate(taskContent, status) {
    console.log("Task-Daten in Template:", taskContent); // Debugging
    let { label, fitLabelForCSS, title, description } = getTaskData(taskContent);
  
    return /*html*/ `
      <div class="board-task draggable" draggable="true" data-task-id="${taskContent.taskId}">
          <label class="${fitLabelForCSS}">${label}</label>
          <div>
              <h3>${title}</h3>
              <p>${description}</p>
          </div>
          <div class="review-task-bottom">
              <div class="assignees-container">
                  ${getAssignees(taskContent)}
              </div>
              <div class="${taskContent.priority}"></div>
          </div>
      </div>
    `;
  }
  


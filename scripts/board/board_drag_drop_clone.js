/**
 * Creates a visual clone of the dragged task.
 * @param {HTMLElement} task - The task element being dragged.
 * @param {DragEvent} event - The dragstart event.
 * @returns {HTMLElement} The cloned task element.
 */
function createTaskClone(task, event) {
  const taskClone = task.cloneNode(true);
  taskClone.classList.add("dragging-clone");
  if (task.dataset.taskId) {
    taskClone.dataset.taskId = task.dataset.taskId;
  }
  document.body.appendChild(taskClone);
  const rect = task.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  taskClone.style.left = `${event.pageX - offsetX}px`;
  taskClone.style.top = `${event.pageY - offsetY}px`;
  taskClone.style.width = `${task.offsetWidth}px`;
  taskClone.style.height = `${task.offsetHeight}px`;
  return taskClone;
}

/**
 * Creates an invisible drag image to hide the default drag icon.
 * @param {DragEvent} event - The dragstart event.
 * @returns {HTMLElement} The invisible element used as drag image.
 */
function createInvisibleDragImage(event) {
  const invisibleElement = document.createElement("div");
  invisibleElement.style.width = "1px";
  invisibleElement.style.height = "1px";
  invisibleElement.style.opacity = "0";
  document.body.appendChild(invisibleElement);
  event.dataTransfer.setDragImage(invisibleElement, 0, 0);
  return invisibleElement;
}

/**
 * Removes the invisible drag image after use.
 * @param {HTMLElement} invisibleElement - The invisible element to remove.
 */
function cleanUpInvisibleDragImage(invisibleElement) {
  setTimeout(() => {
    invisibleElement.remove();
  }, 0);
}

/**
 * Updates the position of the task clone during dragover.
 * @param {DragEvent} event - The dragover event.
 * @param {HTMLElement} taskClone - The cloned task element.
 */
function handleDragOver(event, taskClone) {
  event.preventDefault();
  if (taskClone) {
    taskClone.style.left = `${event.pageX - taskClone.offsetWidth / 2}px`;
    taskClone.style.top = `${event.pageY - taskClone.offsetHeight / 2}px`;
  }
}


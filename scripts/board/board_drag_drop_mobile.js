let isDragging = false;
let longPressTimer = null;
let longPressTriggered = false;
const LONG_PRESS_DELAY = 250;


// Initializes touch drag-and-drop for all task containers
function initializeTouchDragAndDrop(taskContainers) {
  taskContainers.forEach((container) => {
    container.addEventListener("touchstart", (event) => onTouchStart(event));
  });
  document.addEventListener("touchmove", (event) => onTouchMove(event), { passive: false });
  document.addEventListener("touchend", (event) => onTouchEnd(event));
}


// Handles the touchstart event and starts dragging a task
function onTouchStart(event) {
  const task = event.target.closest('[draggable="true"]');
  if (!task) return;
  const touch = event.touches[0];
  longPressTriggered = false;

  longPressTimer = setTimeout(() => {
    longPressTriggered = true;
    handleDragStart(
      { target: task, dataTransfer: { setData: () => {}, setDragImage: () => {} }, clientX: touch.clientX, clientY: touch.clientY, pageX: touch.pageX, pageY: touch.pageY },
      (task, clone) => {
        draggedTask = task;
        taskClone = clone;
        draggedTaskId = task.dataset.taskId;
        isDragging = true;
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
      }
    );
    document.body.style.userSelect = "none";
  }, LONG_PRESS_DELAY);
}


// Handles the touchmove event, moves the task clone, manages placeholder and board scrolling
function onTouchMove(event) {
  if (!taskClone || !isDragging) return;
  const touch = event.touches[0];

  let container = document.elementFromPoint(touch.clientX, touch.clientY);
  while (container && !['drag_drop_todo_container','drag_drop_progress_container','drag_drop_in_await_container','drag_drop_in_done_container'].includes(container.id)) {
    container = container.parentElement;
  }

  let originContainer = draggedTask?.parentElement;
  while (originContainer && !['drag_drop_todo_container','drag_drop_progress_container','drag_drop_in_await_container','drag_drop_in_done_container'].includes(originContainer.id)) {
    originContainer = originContainer.parentElement;
  }

  handleMobileDropPlaceholder(container, originContainer);
  handleMobileTaskCloneMove(touch);
  handleMobileBoardScroll(touch);
  if (event.cancelable) event.preventDefault();
}


// Shows or removes the drop placeholder depending on the drag position
function handleMobileDropPlaceholder(container, originContainer) {
  if (container && originContainer && container.id !== originContainer.id) {
    const taskContainer = getTargetTaskContainer(container);
    showMobileDropPlaceholder(taskContainer);
  } else {
    removeMobileDropPlaceholder();
  }
}


// Appends the drop placeholder to the correct task container
function showMobileDropPlaceholder(taskContainer) {
  if (!dropPlaceholder && taskContainer) {
    dropPlaceholder = document.createElement("div");
    dropPlaceholder.className = "drop-placeholder";
    dropPlaceholder.style.pointerEvents = "none";
    taskContainer.appendChild(dropPlaceholder);
  }
  if (dropPlaceholder && dropPlaceholder.parentNode !== taskContainer) {
    if (dropPlaceholder.parentNode) {
      dropPlaceholder.parentNode.removeChild(dropPlaceholder);
    }
    taskContainer.appendChild(dropPlaceholder);
  }
}


// Removes the drop placeholder from the DOM
function removeMobileDropPlaceholder() {
  if (dropPlaceholder && dropPlaceholder.parentNode) {
    dropPlaceholder.parentNode.removeChild(dropPlaceholder);
    dropPlaceholder = null;
  }
}


// Moves the visual clone of the dragged task, keeping it within the board boundaries
function handleMobileTaskCloneMove(touch) {
  const board = document.getElementById("board_table");
  const bounds = board
    ? board.getBoundingClientRect()
    : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };

  const minX = bounds.left;
  const minY = bounds.top;
  const maxX = bounds.right - taskClone.offsetWidth;
  const maxY = bounds.bottom - taskClone.offsetHeight;

  let left = touch.pageX - taskClone.offsetWidth / 2;
  let top = touch.pageY - taskClone.offsetHeight / 2;
  left = Math.max(minX, Math.min(left, maxX));
  top = Math.max(minY, Math.min(top, maxY));
  taskClone.style.left = `${left}px`;
  taskClone.style.top = `${top}px`;
}


// Scrolls the board container when dragging near the top or bottom edge
function handleMobileBoardScroll(touch) {
  const SCROLL_ZONE = 60;
  const SCROLL_SPEED = 15;
  const board = document.getElementById("board_table");
  if (board) {
    const rect = board.getBoundingClientRect();
    if (touch.clientY < rect.top + SCROLL_ZONE) {
      board.scrollTop -= SCROLL_SPEED;
    } else if (touch.clientY > rect.bottom - SCROLL_ZONE) {
      board.scrollTop += SCROLL_SPEED;
    }
  }
}


// Handles the touchend event, drops the task and finalizes the drag operation
function onTouchEnd(event) {
  clearTimeout(longPressTimer);
  if (!longPressTriggered) {
    const task = event.target.closest('[draggable="true"]');
    if (task && task.dataset.taskId) {
      renderFocusedTask(task.dataset.taskId);
    }
    return;
  }
  if (!isDragging) return;
  isDragging = false;
  document.body.style.userSelect = "";
  const touch = event.changedTouches[0];
  const dropContainer = getDropContainerFromTouch(touch);
  handleMobileDrop(event, dropContainer);
  finalizeMobileDrag();
}


// Returns the drop container element under the touch position
function getDropContainerFromTouch(touch) {
  let elem = document.elementFromPoint(touch.clientX, touch.clientY);
  while (
    elem &&
    ![
      'drag_drop_todo_container',
      'drag_drop_progress_container',
      'drag_drop_in_await_container',
      'drag_drop_in_done_container'
    ].includes(elem.id)
  ) {
    elem = elem.parentElement;
  }
  return elem;
}


// Handles dropping the task into the correct container and updating its status
function handleMobileDrop(event, dropContainer) {
  if (dropContainer) {
    handleDrop(
      event,
      dropContainer,
      draggedTask,
      draggedTaskId,
      (taskId) => updateTaskStatus(taskId, getTargetTaskContainer(dropContainer).id)
    );
  }
}


// Finalizes the drag operation by cleaning up the clone and resetting state
function finalizeMobileDrag() {
  handleDragEnd(
    { target: draggedTask },
    () => {
      if (taskClone) {
        taskClone.remove();
        taskClone = null;
      }
      draggedTask = null;
      draggedTaskId = null;
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const dropContainers = [
    "#drag_drop_todo_container",
    "#drag_drop_progress_container",
    "#drag_drop_in_await_container",
    "#drag_drop_in_done_container"
  ];
  const taskContainers = document.querySelectorAll(dropContainers.join(", "));
  initializeTouchDragAndDrop(taskContainers);
});
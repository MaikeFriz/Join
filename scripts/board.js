document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    window.location.href = "./log_in.html";
    return;
  }

  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/${user.userId}/assignedTasks.json`;

  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return null;
    }
  }

  async function updateTaskStatus(taskId, newStatus) {
    const url = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/${user.userId}/assignedTasks/${taskId}.json`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  }

  function addHTMLToTaskContainers(
    toDoHTML,
    inProgressHTML,
    feedbackHTML,
    doneHTML
  ) {
    document.getElementById("toDoCard").innerHTML = toDoHTML;
    document.getElementById("inProgressCard").innerHTML = inProgressHTML;
    document.getElementById("awaitFeedbackCard").innerHTML = feedbackHTML;
    document.getElementById("doneCard").innerHTML = doneHTML;
    addDragAndDropHandlers();
  }

  function generateTaskContent(tasks, templateFunction) {
    if (!tasks || Object.keys(tasks).length === 0) {
      console.log("No tasks for this category");
      return "";
    }
    return Object.values(tasks).map(templateFunction).join("");
  }

  function addDragAndDropHandlers() {
    const draggables = document.querySelectorAll(".draggable");
    const containers = document.querySelectorAll(".task-container");

    draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", () =>
        draggable.classList.add("dragging")
      );
      draggable.addEventListener("dragend", () =>
        draggable.classList.remove("dragging")
      );
    });

    containers.forEach((container) => {
      container.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector(".dragging");
        if (afterElement == null) {
          container.appendChild(draggable);
        } else {
          container.insertBefore(draggable, afterElement);
        }
      });
    });
  }

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  const kanbanData = await fetchData(BASE_URL);
  if (kanbanData) {
    const toDoHTML = generateTaskContent(kanbanData.toDo, toDoCardTemplate);
    const inProgressHTML = generateTaskContent(
      kanbanData.inProgress,
      inProgressCardTemplate
    );
    const feedbackHTML = generateTaskContent(
      kanbanData.awaitingFeedback,
      awaitingFeedbackCardTemplate
    );
    const doneHTML = generateTaskContent(kanbanData.done, doneCardTemplate);

    addHTMLToTaskContainers(toDoHTML, inProgressHTML, feedbackHTML, doneHTML);
  }
});

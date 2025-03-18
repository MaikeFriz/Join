document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    window.location.href = "./log_in.html";
    return;
  }

  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return null;
    }
  }

  function addHTMLToTaskContainers(
    todoCardsHTML,
    inProgressCardsHTML,
    awaitingFeedbackCardsHTML,
    doneCardsHTML
  ) {
    let todoCardContainer = document.getElementById("toDoCard");
    let inProgressCardContainer = document.getElementById("inProgressCard");
    let awaitingFeedbackContainer =
      document.getElementById("awaitFeedbackCard");
    let doneCardContainer = document.getElementById("doneCard");

    todoCardContainer.innerHTML = todoCardsHTML;
    inProgressCardContainer.innerHTML = inProgressCardsHTML;
    awaitingFeedbackContainer.innerHTML = awaitingFeedbackCardsHTML;
    doneCardContainer.innerHTML = doneCardsHTML;

    addDragAndDropHandlers();
  }

  function generateTaskContent(tasks, templateFunction) {
    let taskCardsHTML = "";
    if (!tasks || Object.keys(tasks).length === 0) {
      console.log("No tasks for this category");
    } else {
      let tasksArray = Object.values(tasks);
      for (let taskIndex = 0; taskIndex < tasksArray.length; taskIndex++) {
        let taskContent = tasksArray[taskIndex];
        taskCardsHTML += templateFunction(taskContent);
      }
    }
    return taskCardsHTML;
  }

  function addDragAndDropHandlers() {
    const draggables = document.querySelectorAll(".draggable");
    const containers = document.querySelectorAll(".task-container");

    draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging");
      });

      draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
      });
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

  const dataUrl =
    "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/.json";
  const data = await fetchData(dataUrl);

  console.log("Fetched data:", data); // Log the fetched data

  if (
    data &&
    data.users &&
    data.users[user.userId] &&
    data.users[user.userId].assignedTasks
  ) {
    const assignedTasks = data.users[user.userId].assignedTasks;
    console.log("Assigned tasks:", assignedTasks); // Log the assigned tasks

    const todoContent = generateTaskContent(
      assignedTasks.todos,
      todoCardTemplate
    );
    const inProgressContent = generateTaskContent(
      assignedTasks.inProgress,
      inProgressCardTemplate
    );
    const awaitingFeedbackContent = generateTaskContent(
      assignedTasks.awaitingFeedback,
      awaitingFeedbackCardTemplate
    );
    const doneContent = generateTaskContent(
      assignedTasks.done,
      doneCardTemplate
    );

    addHTMLToTaskContainers(
      todoContent,
      inProgressContent,
      awaitingFeedbackContent,
      doneContent
    );
  } else {
    console.log("No assigned tasks found in the fetched data.");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  // Redirect to login page if no user is logged in
  if (!user) {
    window.location.href = "./log_in.html";
    return;
  }

  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/${user.userId}/assignedTasks.json`;

  // Function to fetch data from a URL
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return null; // Return null in case of an error
    }
  }

  // Function to update the status of a task in the database
  async function updateTaskStatus(taskId, newStatus) {
    const url = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/${user.userId}/assignedTasks/${taskId}.json`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }), // Send new status in the request body
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error("Failed to update task status:", error); // Log any errors
    }
  }

  // Function to add the HTML of task cards into the corresponding containers
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
    addDragAndDropHandlers();  // Call to add drag-and-drop functionality
  }

  // Function to generate HTML for task cards by passing tasks to a template function
  function generateTaskContent(tasks, templateFunction) {
    if (!tasks || Object.keys(tasks).length === 0) {
      console.log("No tasks for this category");
      return ""; // Return empty string if there are no tasks
    }
    return Object.values(tasks).map(templateFunction).join(""); // Map tasks to HTML using the template function
  }

  // Function to add drag-and-drop functionality to the task cards
  function addDragAndDropHandlers() {
    const draggables = document.querySelectorAll(".draggable");
    const containers = document.querySelectorAll(".task-container");

    // Add event listeners for drag start and drag end to draggables
    draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging");
        draggable.style.opacity = "0.5";  // Make the task semi-transparent while dragging
      });

      draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
        draggable.style.opacity = "1";  // Restore opacity when dragging ends
      });
    });

    // Add event listeners for dragover and drop to containers
    containers.forEach((container) => {
      container.addEventListener("dragover", (e) => {
        e.preventDefault(); // Necessary to allow dropping
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector(".dragging");

        // Insert the draggable element either after another element or at the end
        if (afterElement == null) {
          container.appendChild(draggable);
        } else {
          container.insertBefore(draggable, afterElement);
        }
      });

      container.addEventListener("drop", (e) => {
        e.preventDefault();
        const draggable = document.querySelector(".dragging");
        const taskId = draggable.getAttribute("data-task-id");
        const newStatus = container.id; // Use the container's id (e.g., "toDoCard") as the new status

        // Update the task's status in the database
        updateTaskStatus(taskId, newStatus);
      });
    });
  }

  // Function to find the element to drop the dragged item after
  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child }; // Return the closest element
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  // Fetch kanban data and generate task content for each status
  const kanbanData = await fetchData(BASE_URL);
  if (kanbanData) {
    const toDoHTML = generateTaskContent(kanbanData.toDo, taskCardTemplate);
    const inProgressHTML = generateTaskContent(
      kanbanData.inProgress,
      taskCardTemplate
    );
    const feedbackHTML = generateTaskContent(
      kanbanData.awaitingFeedback,
      taskCardTemplate
    );
    const doneHTML = generateTaskContent(kanbanData.done, taskCardTemplate);

    // Add the generated HTML into the containers
    addHTMLToTaskContainers(toDoHTML, inProgressHTML, feedbackHTML, doneHTML);
  }
});

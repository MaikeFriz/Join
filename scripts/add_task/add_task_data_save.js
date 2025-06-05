// Handles DOMContentLoaded: checks login, sets up form, and initializes task creation logic
document.addEventListener("DOMContentLoaded", async function () {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  let kanbanData = JSON.parse(localStorage.getItem("guestKanbanData")) || { tasks: {}, subtasks: {}, users: {} };
  if (isGuest) {
    let data = JSON.parse(localStorage.getItem("guestKanbanData"));
    user = data && data.users ? data.users.user : null;
  }
  if (!user && !isGuest) {
    window.location.href = "./log_in.html";
    return;
  }

  let BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/`;
  let taskForm = document.getElementById("task_form");

  /**
   * Gets all existing task IDs from the database or localStorage.
   * @returns {Promise<Array>} Array of task IDs.
   */
  async function getAllTaskIds() {
    let tasks;
    if (isGuest) {
      let data = JSON.parse(localStorage.getItem("guestKanbanData"));
      tasks = data?.tasks || {};
    } else {
      let response = await fetch(`${BASE_URL}tasks.json`);
      tasks = await response.json();
    }
    return tasks ? Object.keys(tasks) : [];
  }

  /**
   * Generates a new unique task ID.
   * @returns {Promise<string>} The new task ID.
   */
  async function getNewTaskId() {
    try {
      let taskIds = await getAllTaskIds();
      if (taskIds.length === 0) return "task1";
      let maxTaskId = taskIds.reduce((max, id) => {
        let numericId = parseInt(id.replace("task", ""), 10);
        return numericId > max ? numericId : max;
      }, 0);
      return `task${maxTaskId + 1}`;
    } catch (error) {
      return "task1";
    }
  }

  /**
   * Adds the submit event listener to the task form.
   */
  function addTaskFormListener() {
    taskForm.addEventListener("submit", onTaskFormSubmit);
  }

  /**
   * Handles validation and form submission logic.
   * @param {Event} event - The submit event.
   */
  async function onTaskFormSubmit(event) {
    event.preventDefault();

    if (!validateTaskForm()) {
      hideLoadingSpinner();
      return;
    }

    showLoadingSpinner();
    await handleTaskCreation();
    hideLoadingSpinner();
  }

  /**
   * Handles task creation and saving logic.
   */
  async function handleTaskCreation() {
    try {
      const taskData = getTaskDetails();
      const newTaskId = await getNewTaskId();
      const isGuest = JSON.parse(localStorage.getItem("isGuest"));
      const userId = isGuest ? "guest" : user.userId;
      await saveTaskToDatabase(newTaskId, taskData, userId);
    } catch (error) {
    }
  }

  /**
   * Collects all task details from the form fields.
   * @returns {Object} The task details object.
   */
  function getTaskDetails() {
    let title = document.getElementById("input_title").value;
    let description = document.getElementById("input_description").value;
    let createdAt = new Date().toISOString();
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    let createdBy = isGuest ? "guest" : user.userId;
    let updatedAt = createdAt;
    let priority = document.querySelector(".priority-buttons-div .active p").textContent.toLowerCase();
    let assignees = getAssignedUsers();
    let label = document.getElementById("category").value;
    let subtasks = getSubtaskDetails();

    return {
      label: label,
      title: title,
      description: description,
      createdAt: createdAt,
      updatedAt: updatedAt,
      priority: priority,
      createdBy: createdBy,
      assignees: assignees,
      subtasks: subtasks
    };
  }

  /**
   * Saves the task and subtasks to the database or localStorage, updates user/guest lists, and resets the form.
   * @param {string} taskId - The task ID.
   * @param {Object} taskData - The task data object.
   * @param {string} userId - The user ID.
   */
  async function saveTaskToDatabase(taskId, taskData, userId) {
    try {
      await saveTaskData(taskId, taskData);
      await saveSubtasksData(taskId);
      const urlCategory = getCategoryFromUrl();
      await addTaskToUserCategoryList(taskId, userId, urlCategory);
      const isGuest = JSON.parse(localStorage.getItem("isGuest"));
      if (!isGuest) {
        await waitForTaskSaveOperations(taskId);
      }
      resetFormFields();
      resetAssigneesAndSubtasks();
      window.location.href = "./board.html";
    } catch (error) {
    }
  }

  /**
   * Resets all form fields to their default state.
   */
  function resetFormFields() {
    document.getElementById("input_title").value = "";
    document.getElementById("input_description").value = "";
    const activePriority = document.querySelector(".priority-buttons-div .active");
    if (activePriority) activePriority.classList.remove("active");
    document.getElementById("category").value = "";
    document.getElementById("dropdown_selected").textContent = "Select Category";
    resetAssignees();
  }

  /**
   * Resets assignees and subtasks objects and UI.
   */
  function resetAssigneesAndSubtasks() {
    resetAssignees();
    resetSubtasks();
  }

  /**
   * Removes all selected assignees from the UI and object.
   */
  function resetAssignees() {
    for (const userId in assigneesObject) {
      removeAssignee(userId);
    }
    const showAssigneesDiv = document.getElementById("show-assignees");
    showAssigneesDiv.innerHTML = "";
  }

  /**
   * Removes all subtasks from the UI and object.
   */
  function resetSubtasks() {
    subtasksObject = {};
    const displaySubtasksDiv = document.getElementById("display_subtasks");
    if (displaySubtasksDiv) {
      displaySubtasksDiv.innerHTML = "";
    }
  }

  /**
   * Saves the task data to the database or localStorage (for guests).
   * @param {string} taskId - The task ID.
   * @param {Object} taskData - The task data object.
   * @returns {Promise<Object>} The saved tasks object.
   */
  function saveTaskData(taskId, taskData) {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    if (isGuest) {
      kanbanData = JSON.parse(localStorage.getItem("guestKanbanData")) || { tasks: {}, subtasks: {}, users: {} };
      kanbanData.tasks[taskId] = taskData;
      localStorage.setItem("guestKanbanData", JSON.stringify(kanbanData));
      return Promise.resolve(kanbanData.tasks);
    } else {
      return fetch(`${BASE_URL}tasks/${taskId}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      }).then((response) => response.json());
    }
  }

  /**
   * Saves the subtasks data to the database or localStorage (for guests).
   * @param {string} taskId - The task ID.
   * @returns {Promise<Object>} The saved subtasks object.
   */
  function saveSubtasksData(taskId) {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    if (isGuest) {
      kanbanData = JSON.parse(localStorage.getItem("guestKanbanData")) || { tasks: {}, subtasks: {}, users: {} };
      let existingSubtasks = kanbanData.subtasks;
      const updatedSubtasks = prepareSubtasksForDatabase(existingSubtasks, taskId);
      kanbanData.subtasks = updatedSubtasks;
      localStorage.setItem("guestKanbanData", JSON.stringify(kanbanData));
      return Promise.resolve(kanbanData.subtasks);
    } else {
      return fetch(`${BASE_URL}subtasks.json`)
        .then((response) => response.json())
        .then((existingSubtasks) => {
          existingSubtasks = existingSubtasks || {};
          const updatedSubtasks = prepareSubtasksForDatabase(existingSubtasks, taskId);
          return overwriteSubtaskCollection(updatedSubtasks);
        });
    }
  }

  /**
   * Overwrites the entire subtask collection in the database.
   * @param {Object} updatedSubtasks - The updated subtasks object.
   * @returns {Promise<Response>} The fetch response.
   */
  function overwriteSubtaskCollection(updatedSubtasks) {
    return fetch(`${BASE_URL}subtasks.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSubtasks),
    });
  }

  /**
   * Waits for all asynchronous save operations to complete before proceeding.
   * @param {string} taskId - The task ID.
   * @returns {Promise<void>}
   */
  async function waitForTaskSaveOperations(taskId) {
    try {
      const response = await fetch(`${BASE_URL}tasks/${taskId}/status.json`);
      if (!response.ok) {
        throw new Error(`Error checking task save status. Status: ${response.status}`);
      }
      const status = await response.json();
      if (status && status.pendingSaveOperations > 0) {
        return new Promise(resolve => setTimeout(() => resolve(waitForTaskSaveOperations(taskId)), 1000));
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds the task to the guest's assigned tasks for the selected category in localStorage.
   * @param {string} taskId - The task ID.
   * @param {string} databaseCategory - The database category.
   * @returns {Promise<Object>} The updated assigned tasks object.
   */
  function addTaskToGuestCategory(taskId, databaseCategory) {
    kanbanData = JSON.parse(localStorage.getItem("guestKanbanData")) || { tasks: {}, subtasks: {}, users: {} };
    if (!kanbanData.users) kanbanData.users = {};
    if (!kanbanData.users.guest) kanbanData.users.guest = {};
    if (!kanbanData.users.guest.assignedTasks) kanbanData.users.guest.assignedTasks = {};
    if (!kanbanData.users.guest.assignedTasks[databaseCategory]) kanbanData.users.guest.assignedTasks[databaseCategory] = {};
    kanbanData.users.guest.assignedTasks[databaseCategory][taskId] = true;
    localStorage.setItem("guestKanbanData", JSON.stringify(kanbanData));
    return Promise.resolve(kanbanData.users.guest.assignedTasks[databaseCategory]);
  }

  /**
   * Adds the task to the user's assigned tasks for the selected category in the database.
   * @param {string} taskId - The task ID.
   * @param {string} userId - The user ID.
   * @param {string} databaseCategory - The database category.
   * @returns {Promise<void>}
   */
  function addTaskToUserCategory(taskId, userId, databaseCategory) {
    return fetch(`${BASE_URL}users/${userId}/assignedTasks/${databaseCategory}.json`)
      .then((response) => response.json())
      .then((existingTasks) => {
        existingTasks = existingTasks || {};
        existingTasks[taskId] = true;
        return fetch(`${BASE_URL}users/${userId}/assignedTasks/${databaseCategory}.json`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(existingTasks),
        });
      })
      .then(() => { })
      .catch((error) => { });
  }

  /**
   * Adds the task to the correct category list for guest or user.
   * @param {string} taskId - The task ID.
   * @param {string} userId - The user ID.
   * @param {string} categoryParameter - The category parameter from the URL.
   * @returns {Promise<Object|void>}
   */
  function addTaskToUserCategoryList(taskId, userId, categoryParameter) {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    const databaseCategory = mapCategoryParameterToDatabaseCategory(categoryParameter);
    if (isGuest) {
      return addTaskToGuestCategory(taskId, databaseCategory);
    } else {
      return addTaskToUserCategory(taskId, userId, databaseCategory);
    }
  }

  addTaskFormListener();
});
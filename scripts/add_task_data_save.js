
document.addEventListener("DOMContentLoaded", async function () {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      window.location.href = "./log_in.html";
      return;
    }
  
    let userId = user.userId;
    let BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/`;
    let taskForm = document.getElementById("task_form");
  
    // Function to determine the new task ID, e.g., 'task1', 'task2', etc.
    async function getNewTaskId() {
      try {
        let response = await fetch(`${BASE_URL}tasks.json`);
        let data = await response.json();
        if (!data) return "task1";
        let taskIds = Object.keys(data);
        if (taskIds.length === 0) return "task1";
        let maxTaskId = taskIds.reduce((max, id) => {
          let numericId = parseInt(id.replace("task", ""), 10);
          return numericId > max ? numericId : max;
        }, 0);
        return `task${maxTaskId + 1}`;
      } catch (error) {
        console.error("Error fetching tasks:", error);
        return "task1";
      }
    }
  
    // Event listener for saving the task
    function addTaskFormListener() {
      taskForm.addEventListener("submit", async function (event) {
        event.preventDefault();
  
        // Gather task data
        let taskData = getTaskDetails();
  
        // Get the new task ID
        let newTaskId = await getNewTaskId();
  
        // Save the task to the Firebase database
        saveTaskToDatabase(newTaskId, taskData, userId);
      });
    }
  
    // Function to get the task details
    function getTaskDetails() {
      let title = document.getElementById("input_title").value;
      let description = document.getElementById("input_description").value;
      let createdAt = new Date().toISOString(); // Current timestamp for creation
      let updatedAt = createdAt; // Set updatedAt to createdAt initially
      let priority = document.querySelector(".priority_buttons_div .active p").textContent.toLowerCase();
      let assignees = getAssignedUsers();
      let label = document.getElementById("category").value;
      let subtasks = getSubtaskList();
  
      // Return the task data in the specified format
      return {
        label: label,
        title: title,
        description: description,
        createdAt: createdAt,
        updatedAt: updatedAt,
        priority: priority,
        createdBy: userId,
        assignees: assignees,
        subtasks: subtasks
      };
    }
  
    // Function to gather the assigned users
    function getAssignedUsers() {
      let assignees = {};
      for (let assigneeName in assigneesObject) {
        if (assigneesObject.hasOwnProperty(assigneeName)) {
          assignees[assigneeName.toLowerCase()] = true;
        }
      }
      return assignees;
    }
  
    // Function to gather the list of subtasks
    function getSubtaskList() {
      let subtasks = {};
      let subtasksList = document.querySelectorAll("#display_subtasks div span");
      for (let i = 0; i < subtasksList.length; i++) {
        let subtask = subtasksList[i].textContent;
        subtasks[`subtask${i + 1}`] = true; // Mark subtasks as true (completed)
      }
      return subtasks;
    }
  
    // Function to save the task in the Firebase database
    function saveTaskToDatabase(taskId, taskData, userId) {
      fetch(`${BASE_URL}tasks/${taskId}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })
      .then((response) => response.json())
      .then(() => {
        addTaskToUserToDo(taskId, userId);
      })
      .catch((error) => {
        console.error("Error saving task:", error);
      });
    }
  
    // Function to add the task to the user's "toDo" list
    function addTaskToUserToDo(taskId, userId) {
      let taskForUser = { taskId: taskId };
  
      fetch(`${BASE_URL}users/${userId}/assignedTasks/toDo.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskForUser),
      })
      .then((response) => response.json())
      .then(() => {
        console.log(`Task added to user ${userId} toDo list`);
      })
      .catch((error) => {
        console.error("Error adding task to user:", error);
      });
    }
  
    addTaskFormListener();
  });
  
/**
 * Fetches all user data from the database.
 * @returns {Promise<Object>} The users data object.
 */
async function getUsers() {
  const userResponse = await fetch(`${BASE_URL}users.json`);
  if (!userResponse.ok) {
    return Promise.reject(
      `Error fetching user data. Status: ${userResponse.status}`
    );
  }
  return userResponse.json();
}

/**
 * Fetches all assigned user data from the database.
 * @returns {Promise<Object>} The assigned users data object.
 */
async function getAssignedData() {
  const userResponse = await fetch(`${BASE_URL}users.json`);
  if (!userResponse.ok) {
    return Promise.reject(
      `Error fetching user data. Status: ${userResponse.status}`
    );
  }
  return userResponse.json();
}

/**
 * Retrieves and removes the task from all users' assigned tasks.
 * @param {string} taskId - The ID of the task.
 */
async function getUsersTasks(taskId) {
  const usersData = await getUsers().catch((error) => null);
  if (!usersData) return;

  const userIds = Object.keys(usersData);

  for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
    const userId = userIds[userIndex];
    const userTasks = usersData[userId].assignedTasks;
    if (userTasks) {
      await getCategory(userId, taskId, userTasks);
    }
  }
}

/**
 * Processes each category of assigned tasks for a user and deletes the task.
 * @param {string} userId - The user ID.
 * @param {string} taskId - The ID of the task.
 * @param {Object} userTasks - The user's assigned tasks object.
 */
async function getCategory(userId, taskId, userTasks) {
  const categories = Object.keys(userTasks);

  for (
    let categoryIndex = 0;
    categoryIndex < categories.length;
    categoryIndex++
  ) {
    const category = categories[categoryIndex];
    if (userTasks[category]?.[taskId]) {
      await deleteTaskFromCategory(userId, taskId, category);
    }
  }
}

/**
 * Removes the task from all assignees' lists.
 * @param {string} taskId - The ID of the task.
 */
async function getAssigneesTasks(taskId) {
  const usersData = await getAssignedData().catch((error) => null);

  if (!usersData) return;

  const userIds = Object.keys(usersData);

  for (let assigneeIndex = 0; assigneeIndex < userIds.length; assigneeIndex++) {
    const userId = userIds[assigneeIndex];
    const assignees = usersData[userId].assignedTasks;
    if (assignees && assignees[taskId]) {
      await deleteTaskFromAssignees(userId, taskId);
    }
  }
}

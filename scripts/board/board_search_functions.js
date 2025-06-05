/**
 * Searches tasks on the board based on the provided search term.
 * @param {string} searchTerm - The term to search for in task titles and descriptions.
 */
function searchTasks(searchTerm) {
  let found = false;
  const allTasks = document.getElementsByClassName('board-preview-task');
  
  for (let taskIndex = 0; taskIndex < allTasks.length; taskIndex++) {
      const task = allTasks[taskIndex];
      const titleElement = task.querySelector('#task-title');
      const descriptionElement = task.querySelector('#task-description');
      const title = titleElement ? titleElement.innerHTML.toLowerCase() : '';
      const description = descriptionElement ? descriptionElement.innerHTML.toLowerCase() : '';
      
      if (title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())) {
          found = true;
          task.style.display = 'flex';
      } else {
          task.style.display = 'none';
      }
  }
}

/**
 * Resets the search input and displays all tasks.
 */
function resetSearch() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = '';
    searchTasks('');
  }
}

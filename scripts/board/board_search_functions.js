
// Function to search tasks based on the search term
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

// Function to handle the search input and trigger the search
function resetSearch() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = '';
    searchTasks('');
  }
}

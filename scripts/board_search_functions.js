
// Function to manage the search functionality
function searchTasks(searchTerm) {
    hideAllTasksForSearch();
    
    const searchResultsContainer = document.getElementById('search-results');
    const found = showTasksMatchingSearch(searchTerm);
  
    if (!found) {
      searchResultsContainer.innerHTML = 'No tasks found';
    } else {
      searchResultsContainer.innerHTML = '';
    }
  }
  
  // Function to hide all tasks by adding 'd-done' class
  function hideAllTasksForSearch() {
    const allTasks = document.querySelectorAll('.board-task');
    allTasks.forEach(task => {
      task.classList.add('d-done');
    });
  }
  
  // Function to show tasks that match the search term
  function showTasksMatchingSearch(searchTerm) {
    const allTasks = document.querySelectorAll('.board-task');
    let found = false;
  
    allTasks.forEach(task => {
      const title = task.querySelector('h3').innerText.toLowerCase();
      const description = task.querySelector('p').innerText.toLowerCase();
  
      if (title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())) {
        found = true;
        task.classList.remove('d-done');
      }
    });
  
    return found;
  }
  
  // Function to trigger search on SVG click
  function searchTasksFromSVG() {
    const searchTerm = document.getElementById('search-input').value;
    searchTasks(searchTerm);
  }
  
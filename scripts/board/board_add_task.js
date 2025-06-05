/**
 * Redirects to the add_task.html page with the selected category as a query parameter.
 * @param {HTMLElement} button - The button element that was clicked.
 */
function openAddTaskWithCategory(button) {
  const category = button.getAttribute('data-target');
  window.location.href = `add_task.html?category=${encodeURIComponent(category)}`;
}
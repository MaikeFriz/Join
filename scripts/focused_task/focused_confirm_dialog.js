/**
 * Renders and displays the confirm dialog for a given task.
 * @param {string} taskId - The ID of the task.
 */
function renderConfirmDialog(taskId) {
    let confirmDialog = document.getElementById('confirmDialog');
    confirmDialog.classList.remove('d-none');
    confirmDialog.innerHTML = confirmDialogTemplate(taskId);
    
    setTimeout(() => {
      confirmDialog.classList.add('active');
    }, 10);
}
  
/**
 * Closes and hides the confirm dialog.
 */
function closeConfirmDialog() {
    let confirmDialog = document.getElementById('confirmDialog');
    confirmDialog.classList.remove('active');
  
    setTimeout(() => {
      confirmDialog.classList.add('d-none');
      confirmDialog.innerHTML = '';
    }, 400);
}


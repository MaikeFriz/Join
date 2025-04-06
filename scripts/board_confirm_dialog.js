
function renderConfirmDialog(taskId) {
    let confirmDialog = document.getElementById('confirmDialog');
    confirmDialog.classList.remove('d-none');
    confirmDialog.innerHTML = confirmDialogTemplate();
    
    setTimeout(() => {
      confirmDialog.classList.add('active');
    }, 10);
}
  
function backToFocusedTask() {
    let confirmDialog = document.getElementById('confirmDialog');
    confirmDialog.classList.remove('active');
  
    setTimeout(() => {
      confirmDialog.classList.add('d-none');
      confirmDialog.innerHTML = '';
    }, 400);
  }
  
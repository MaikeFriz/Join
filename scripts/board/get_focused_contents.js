function renderFocusedTask(taskId) {
    const taskContent = getTaskContent(taskId, kanbanData);
    if (!taskContent) return;
  
    const focusedContent = document.getElementById("focusedTask");
    document.getElementById('boardContent').classList.add('d-none');
    document.getElementById('logoutButton').classList.add('d-none');
    focusedContent.innerHTML = getFocusedTask(taskContent);
    focusedContent.classList.remove('d-none');
    setTimeout(() => {
      focusedContent.classList.add('active');
    }, 10);
  }
  
  function backToBoardTable() {
    const focusedContent = document.getElementById('focusedTask');
    focusedContent.classList.remove('active');
    setTimeout(() => {
      focusedContent.classList.add('d-none');
        focusedContent.innerHTML = '';
        document.getElementById('boardContent').classList.remove('d-none');
        document.getElementById('logoutButton').classList.remove('d-none');
    }, 300);
  }
  
  function formatDate(isoDate) {
    let date = new Date(isoDate);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

function renderEditTask(taskId) {
  const focusedContent = document.getElementById('focusedTask');
  focusedContent.classList.remove('active');
  setTimeout(() => {
    focusedContent.classList.add('d-none');
      focusedContent.innerHTML = '';

  }, 300);
  let editContent = document.getElementById('editTask');
  editContent.classList.remove('d-none');
  editContent.innerHTML = editTaskTemplate(taskId);
  
}

function editTaskTemplate(taskId) {
  return /*html*/`
    <div>
      Test
    </div>
`;
}  




  
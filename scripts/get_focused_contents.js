function renderFocusedTask(taskId) {
    const taskContent = getTaskContent(taskId, kanbanData);
    if (!taskContent) return;
    const focusedContent = document.getElementById("focusedTaskCard");
    document.getElementById('board-content').classList.add('d-none');
    document.getElementById('focusedTaskCard').classList.remove('d-none');
    focusedContent.innerHTML = focusedTaskTemplate(taskContent);
  }
  

function formatDate(isoDate) {
    let date = new Date(isoDate);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  function backToBoardTable() {
    document.getElementById('focusedTaskCard').classList.add('d-none');
    document.getElementById('board-content').classList.remove('d-none');
  }
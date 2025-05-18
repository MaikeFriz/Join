

function openAddTaskWithCategory(button) {
      const category = button.getAttribute('data-target');
      window.location.href = `add_task.html?category=${encodeURIComponent(category)}`;
    }
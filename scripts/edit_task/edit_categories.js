// Renders the edit task modal and initializes the UI with task data.
function renderEditTask(taskContent, taskId) {
    const { label, fitLabelForCSS, title, description, createAt, priority, subtasks } = getTaskData(taskContent);
    const displayedDueDate = createAt ? formatDateForInput(createAt) : '';
    const editTaskHTML = editTaskTemplate(displayedDueDate, label, fitLabelForCSS, title, description, createAt, priority, taskId);

    setTimeout(() => {
        setPriorityActive(priority);
        displayEditAssignees(taskId);
        displaySelectedCategories(taskId);
        displayEditSubtasks(subtasks);
    }, 0);

    return editTaskHTML;
}


// Updates the UI to display the selected categories for a task.
function displaySelectedCategories(taskId) {
    const selectedCategoriesDiv = document.querySelector(".edit-selected-categories");
    const taskContent = getTaskContent(taskId, kanbanData);
    if (!taskContent) {
        selectedCategoriesDiv.innerHTML = "No categories selected.";
        return;
    }
    const { label, fitLabelForCSS } = getTaskData(taskContent);
    if (!label) {
        selectedCategoriesDiv.innerHTML = "No categories selected.";
        return;
    }
    selectedCategoriesDiv.innerHTML = editCategoryLabelTemplate(label, fitLabelForCSS);
}


// Generates the HTML for the category options in the dropdown menu.
function getCategoryOptions() {
    const categories = ["User Story", "Technical Task", "HTML", "Javascript", "CSS"];
    let categoryOptionsHTML = "";

    for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
        const category = categories[categoryIndex];
        categoryOptionsHTML += `<div class="edit-custom-dropdown-option edit-dropdown-padding" data-value="${category}" onclick="selectCategory('${category}')">${category}</div>`;
    }

    return categoryOptionsHTML;
}


// Handles the selection of a category and updates the dropdown and UI.
function selectCategory(category) {
    const selectedCategory = document.getElementById("dropdown_selected_category");
    const dropdown = document.getElementById("dropdown_options_category");
    const trigger = document.getElementById("dropdown_category");
    selectedCategory.textContent = "Select task category";
    dropdown.classList.remove("show");
    trigger.classList.remove("dropdown_open");
  
    const selectedCategoriesDiv = document.querySelector(".edit-selected-categories");
    const taskContent = {
        label: category,
        fitLabelForCSS: getTaskData({ label: category }).fitLabelForCSS,
    };
    selectedCategoriesDiv.innerHTML = editCategoryLabelTemplate(taskContent.label, taskContent.fitLabelForCSS);
}

function createSubtaskElement(subtaskId, subtaskText) {
    const subtaskElement = document.createElement("li");
    subtaskElement.className = "subtask-item";
    subtaskElement.id = subtaskId;
    subtaskElement.innerHTML = `
    <span class="subtask-text">${subtaskText}</span>
    <div class="hover_button_div">
      <button><img class="delete_button_subtask" src="./assets/img/delete.svg" alt="Delete" /></button>
      <button><img class="edit_button_subtask" src="./assets/img/edit.svg" alt="Edit" /></button>
    </div>
  `;
    const deleteButton = subtaskElement.querySelector("button");
    deleteButton.addEventListener("click", () =>
        removeSubtask(subtaskId, subtaskElement)
    );
    const span = subtaskElement.querySelector(".subtask-text");
    const deleteImg = subtaskElement.querySelector(".delete_button_subtask");
    setupEditEvents(span, subtaskId, deleteImg);
    return subtaskElement;
}

function createEditIcons(input, onSave, onCancel) {
    const iconsContainer = document.createElement("div");
    iconsContainer.className = "icons-container";
    iconsContainer.innerHTML = `
    <img class="check-icon" src="./assets/img/check_dark.svg" alt="Save" />
    <div class="separator_subtasks">|</div>
    <img class="clear_icon_show_subtask" src="./assets/img/cancel.svg" alt="Clear" />
  `;
    iconsContainer.querySelector(".check-icon").addEventListener("click", onSave);
    iconsContainer.querySelector(".clear_icon_show_subtask").addEventListener("click", (e) => {
        e.preventDefault();
        input.value = "";
    });
    return iconsContainer;
}

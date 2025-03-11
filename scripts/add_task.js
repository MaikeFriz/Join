let subtasks = [];

function init() {
    toggleIcons();
}

function toggleIcons() {
    let inputSubtask = document.getElementById('input_subtask');
    let buttonAddSubtask = document.getElementById('button_add_subtask');
    let addIcon = document.getElementById('add_icon');
    let checkIcon = document.getElementById('check_icon');
    let clearIcon = document.getElementById('clear_icon')

    if (inputSubtask.value.trim() !== "") {
        addIcon.remove();

        if(!checkIcon){
            checkIcon = document.createElement("img");
            checkIcon.id = "check_icon";
            checkIcon.src = "./assets/img/check.svg";
            checkIcon.alt = "Check";

            clearIcon = document.createElement("img");
            clearIcon.id = "clear_icon";
            clearIcon.src = "./assets/img/clear_symbol.svg";
            clearIcon.alt = "Clear";

            buttonAddSubtask.appendChild(checkIcon);
            buttonAddSubtask.appendChild(clearIcon);
        }

        else {
            document.getElementById("check_icon")?.remove();
            document.getElementById("clear_icon")?.remove();

            if(!document.getElementById('add_icon')) {
                let addIconNew = document.createElement("img");
                addIconNew.id = "add_icon";
                addIconNew.src = "./assets/img/add_icon.svg";
                addIconNew.alt = "Add";
                buttonAddSubtask.appendChild(addIconNew);
            }
        }

    } 
}









/**
 * Fügt eine neue Unteraufgabe (Subtask) zur Liste hinzu und aktualisiert die Anzeige.
 * 
 * Diese Funktion nimmt die Eingabe aus einem Textfeld, erstellt ein Subtask-Objekt,
 * speichert es in einem globalen Array `subtasks` und zeigt die aktualisierte Liste
 * der Unteraufgaben in einem HTML-Element an.
 * 
 * @param {Event} event - Das Event-Objekt, das durch das `submit`- oder `click`-Event ausgelöst wurde.
 */
function addToSubtask(event) {
    event.preventDefault();
    let subtaskInput = document.getElementById('input_subtask');
    let displaySubtasks = document.getElementById('display_subtaskes');


    let subtask = {
        "task": subtaskInput.value,
    };

    subtasks.push(subtask);
    console.log(subtasks);
    subtaskInput.value = "";
    displaySubtasks.innerHTML = subtasks.map(sub => `<li>${sub.task}</li>`).join("");

}
const BASE_URL = "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/users.json";

Promise.resolve().then(async () => {
    await fetchKanbanData();
});

async function fetchKanbanData() {
    let response = await fetch(BASE_URL);
    let kanbanData = await response.json();
    getDataContent(kanbanData);
}

function getDataContent(kanbanData) {
    let dataArray = Object.values(kanbanData);
    console.log(dataArray); 
    for (let dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
        let userDataContent = dataArray[dataIndex];
        console.log(`User: ${userDataContent.name}`);
        getTodoContent(userDataContent);
        getInProgressContent(userDataContent);
        getAwaitingFeedback(userDataContent);
        getDone(userDataContent);
    }
}

function getTodoContent(userDataContent) {
    let todoCardContainer = document.getElementById('toDoCard');
    if (!userDataContent.assignedTasks || !userDataContent.assignedTasks.todos || Object.keys(userDataContent.assignedTasks.todos).length === 0) {
        console.log("Todo: Keine Aufgaben für diesen User");
    } else {
        let todos = userDataContent.assignedTasks.todos;
        let todosArray = Object.values(todos); 
        let todoCardsHTML = '';
        for (let todoIndex = 0; todoIndex < todosArray.length; todoIndex++) {
            let todoContent = todosArray[todoIndex];
            console.log("Todo:", todoContent);
            todoCardsHTML += todoCardTemplate(todoContent);
        }
        todoCardContainer.innerHTML += todoCardsHTML;
    }
}

function getInProgressContent(userDataContent) {
    let inProgressCardContainer = document.getElementById('inProgressCard');
    if (!userDataContent.assignedTasks || !userDataContent.assignedTasks.inProgress || Object.keys(userDataContent.assignedTasks.inProgress).length === 0) {
        console.log("In Progress: Keine Aufgaben für diesen User");
    } else {
        let inProgress = userDataContent.assignedTasks.inProgress;
        let inProgressArray = Object.values(inProgress);
        let inProgressCardsHTML = '';
        for (let inProgressIndex = 0; inProgressIndex < inProgressArray.length; inProgressIndex++) {
            let inProgressContent = inProgressArray[inProgressIndex];
            console.log("In Progress:", inProgressContent);
            inProgressCardsHTML += inProgressCardTemplate(inProgressContent);
        }
        inProgressCardContainer.innerHTML += inProgressCardsHTML;
    }
}

function getAwaitingFeedback(userDataContent) {
    let awaitingFeedbackContainer = document.getElementById('awaitFeedbackCard');

    if (!userDataContent.assignedTasks || !userDataContent.assignedTasks.awaitingFeedback || Object.keys(userDataContent.assignedTasks.awaitingFeedback).length === 0) {
        console.log("Awaiting Feedback: Keine Aufgaben für diesen User");
    } else {
        let awaitingFeedback = userDataContent.assignedTasks.awaitingFeedback;
        let awaitingFeedbackArray = Object.values(awaitingFeedback);
        let awaitingFeedbackCardsHTML = '';
        for (let awaitingFeedbackIndex = 0; awaitingFeedbackIndex < awaitingFeedbackArray.length; awaitingFeedbackIndex++) {
            let awaitingFeedbackContent = awaitingFeedbackArray[awaitingFeedbackIndex];
            console.log("Awaiting Feedback:", awaitingFeedbackContent)
            awaitingFeedbackCardsHTML += awaitingFeedbackCardTemplate(awaitingFeedbackContent);
        }
        awaitingFeedbackContainer.innerHTML += awaitingFeedbackCardsHTML;
    }
}

function getDone(userDataContent) {
    let doneCardContainer = document.getElementById('doneCard');
    if (!userDataContent.assignedTasks || !userDataContent.assignedTasks.done || Object.keys(userDataContent.assignedTasks.done).length === 0) {
        console.log("Done: Keine Aufgaben für diesen User");
    } else {
        let done = userDataContent.assignedTasks.done;
        let doneArray = Object.values(done);
        let doneCardsHTML = '';
        for (let doneIndex = 0; doneIndex < doneArray.length; doneIndex++) {
            let doneContent = doneArray[doneIndex];
            console.log("Done:", doneContent);
            doneCardsHTML += doneCardTemplate(doneContent);
        }
        doneCardContainer.innerHTML += doneCardsHTML;
    }
}

function todoCardTemplate(todoContent) {
    return /*html*/`
    <div class="board-task">
        <label class="${todoContent.label.split(' ').join('-').toLowerCase()}">${todoContent.label}</label>
        <h3>${todoContent.title || "Unbenannte Aufgabe"}</h3>
        <p>${todoContent.description || "Keine Beschreibung"}</p>
    </div>
`;
}

function inProgressCardTemplate(inProgressContent) {
    return /*html*/`
    <div class="board-task">
        <label class="${inProgressContent.label.split(' ').join('-').toLowerCase()}">${inProgressContent.label}</label>
        <h3>${inProgressContent.title || "Unbenannte Aufgabe"}</h3>
        <p>${inProgressContent.description || "Keine Beschreibung"}</p>
    </div>
`;
}

function awaitingFeedbackCardTemplate(awaitingFeedbackContent) {
    return /*html*/`
    <div class="board-task">
        <label class="${awaitingFeedbackContent.label.split(' ').join('-').toLowerCase()}">${awaitingFeedbackContent.label}</label>
        <h3>${awaitingFeedbackContent.title || "Unbenannte Aufgabe"}</h3>
        <p>${awaitingFeedbackContent.description || "Keine Beschreibung"}</p>
    </div>
`;
}

function doneCardTemplate(doneContent) {
    return /*html*/`
    <div class="board-task">
        <label class="${doneContent.label.split(' ').join('-').toLowerCase()}">${doneContent.label}</label>
        <h3>${doneContent.title || "Unbenannte Aufgabe"}</h3>
        <p>${doneContent.description || "Keine Beschreibung"}</p>
    </div>
`;
}

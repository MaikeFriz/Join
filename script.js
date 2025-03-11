
const BASE_URL = "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/users.json";

function onloadFunc(){
    fetchKanbanData();
}

async function fetchKanbanData() {
    let response = await fetch(BASE_URL);
    let kanbanData = await response.json();
        getDataContent(kanbanData);
}

function getDataContent(kanbanData) {
    let dataArray = Object.values(kanbanData);
    console.log(dataArray);
    console.log("");

    for (let dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
        console.log("");
        console.log("");
        console.log("");
        console.log(dataArray[dataIndex].name);
        let userDataContent = dataArray[dataIndex];
        getTodoContent(userDataContent);
        getInProgressContent(userDataContent);
        getAwaitingFeedback(userDataContent);
        getDone(userDataContent);
    } 
}
        
function getTodoContent(userDataContent) {
    
    if (!userDataContent.assignedTasks || !userDataContent.assignedTasks.todos || Object.keys(userDataContent.assignedTasks.todos).length === 0) {
        console.log("todo: keine Aufgaben"); 
    } else {
        let todos = userDataContent.assignedTasks.todos;
        let todosArray = Object.values(todos);
            for (let todoIndex = 0; todoIndex < todosArray.length; todoIndex++) {
                let todoContent = todosArray[todoIndex];
                console.log("todo:", todoContent); 
            }
    }
};

function getInProgressContent(userDataContent) {
    
    if (!userDataContent.assignedTasks || !userDataContent.assignedTasks.inProgress || Object.keys(userDataContent.assignedTasks.inProgress).length === 0) {
        console.log("in progress: keine Aufgaben");  
    } else {
        let inProgress = userDataContent.assignedTasks.inProgress;
        let inProgressArray = Object.values(inProgress);
            for (let inProgressIndex = 0; inProgressIndex < inProgressArray.length; inProgressIndex++) {
                let inProgressContent = inProgressArray[inProgressIndex];
                console.log("in progress:", inProgressContent); 
            }
    }
}

function getAwaitingFeedback(userDataContent) {
    
    if (!userDataContent.assignedTasks || !userDataContent.assignedTasks. awaitingFeedback || Object.keys(userDataContent.assignedTasks.awaitingFeedback).length === 0) {
        console.log("awaiting for feedback: keine Aufgaben");
    } else {
        let awaitingFeedback = userDataContent.assignedTasks.awaitingFeedback;
        let awaitingFeedbackArray = Object.values(awaitingFeedback);
            for (let awaitingFeedbackIndex = 0; awaitingFeedbackIndex < awaitingFeedbackArray.length; awaitingFeedbackIndex++) {
                let awaitingFeedbackContent = awaitingFeedbackArray[awaitingFeedbackIndex];
                console.log("awaiting for feedback:", awaitingFeedbackContent); 
            }
    }
}

function getDone(userDataContent) {
    
    if (!userDataContent.assignedTasks || !userDataContent.assignedTasks.done || Object.keys(userDataContent.assignedTasks.done).length === 0) {
        console.log("done: keine Aufgaben");
    } else {
        let done = userDataContent.assignedTasks.done;
        let doneArray = Object.values(done);
            for (let doneIndex = 0; doneIndex < doneArray.length; doneIndex++) {
                let doneContent = doneArray[doneIndex];
                console.log("done:", doneContent); 
            }
    }
}

    





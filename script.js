
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
    let todos = userDataContent.assignedTasks.todos;
            if (todos) {
                let todosArray = Object.values(todos);
                    for (let todoIndex = 0; todoIndex < todosArray.length; todoIndex++) {
                        let todoContent = todosArray[todoIndex];
                        console.log("todo:", todoContent); 
                    }
                        } else {
                            console.log("todo: keine Aufgaben");  
                        }
};

function getInProgressContent(userDataContent) {
    let inProgress = userDataContent.assignedTasks.inProgress;
            if (inProgress) {
                let inProgressArray = Object.values(inProgress);
                    for (let inProgressIndex = 0; inProgressIndex < inProgressArray.length; inProgressIndex++) {
                        let inProgressContent = inProgressArray[inProgressIndex];
                        console.log("in progress:", inProgressContent); 
                    }
                        } else {
                            console.log("in progress: keine Aufgaben");  
                        }
}

function getAwaitingFeedback(userDataContent) {
    let awaitingFeedback = userDataContent.assignedTasks.awaitingFeedback;
            if (awaitingFeedback) {
                let awaitingFeedbackArray = Object.values(awaitingFeedback);
                    for (let awaitingFeedbackIndex = 0; awaitingFeedbackIndex < awaitingFeedbackArray.length; awaitingFeedbackIndex++) {
                        let awaitingFeedbackContent = awaitingFeedbackArray[awaitingFeedbackIndex];
                        console.log("awaiting for feedback:", awaitingFeedbackContent); 
                    }
                        } else {
                            console.log("awaiting for feedback: keine Aufgaben");  
                        }
}

function getDone(userDataContent) {
    let done = userDataContent.assignedTasks.done;
            if (done) {
                let doneArray = Object.values(done);
                    for (let doneIndex = 0; doneIndex < doneArray.length; doneIndex++) {
                        let doneContent = doneArray[doneIndex];
                        console.log("done:", doneContent); 
                    }
                        } else {
                            console.log("done: keine Aufgaben");  
                        }
}

    





function getSummaryCount() {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            getTodoCount(loggedInUser);
            getDoneCount(loggedInUser);
            getUrgentCount(loggedInUser);
            getAllTasksCount(loggedInUser);
            getInprocessCount(loggedInUser);
            getAwaitingCount(loggedInUser);
            getLoggedUsername(loggedInUser);   
        } else {
            console.log("Kein Benutzer eingeloggt.");
        }
}

function getTodoCount(loggedInUser){
    let todoCountHTML = document.getElementById('todo-tasks-count');
        todoCountHTML.innerHTML = Object.keys(loggedInUser.assignedTasks.todos).length;
}

function getDoneCount(loggedInUser) {
    let doneCountHTML = document.getElementById('done-tasks-count');
        doneCountHTML.innerHTML = Object.keys(loggedInUser.assignedTasks.done).length;
}

function getUrgentCount(loggedInUser) {
    let urgentCountHTML = document.getElementById('urgent-tasks-count');
        urgentCountHTML.innerHTML = Object.keys(loggedInUser.assignedTasks).reduce((urgentCount, key) => urgentCount +
                                    Object.values(loggedInUser.assignedTasks[key]).filter(task => task.priority === 'high').length, 0);
}

function getAllTasksCount(loggedInUser) {
    let allTasksCountHTML = document.getElementById('all-tasks-count');
        allTasksCountHTML.innerHTML =   Object.keys(loggedInUser.assignedTasks).reduce((totalCount, key) => totalCount +
                                        Object.keys(loggedInUser.assignedTasks[key]).length, 0);
}

function getInprocessCount(loggedInUser) {
    let inprocessCountHTML = document.getElementById('inprocess-tasks-count');
        inprocessCountHTML.innerHTML =  loggedInUser.assignedTasks.inProgress ? 
                                        Object.keys(loggedInUser.assignedTasks.inProgress).length :
                                        0;
}

function getAwaitingCount(loggedInUser) {
    let awaitingCountHTML = document.getElementById('awaiting-tasks-count');
        awaitingCountHTML.innerHTML =   loggedInUser.assignedTasks.awaitingFeedback ? 
                                        Object.keys(loggedInUser.assignedTasks.awaitingFeedback).length : 
                                        0;
}

function getLoggedUsername(loggedInUser) {
    let loggedUsernameHTML = document.getElementById('logged-username');
        loggedUsernameHTML.innerHTML = loggedInUser.name;
}

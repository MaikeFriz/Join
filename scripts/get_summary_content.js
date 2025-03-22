function getSummaryCount() {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            getToDoCount(loggedInUser);
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

function getToDoCount(loggedInUser) {
    let toDoCountHTML = document.getElementById('toDo-tasks-count');
    toDoCountHTML.innerHTML = loggedInUser.assignedTasks && loggedInUser.assignedTasks.toDo
        ? Object.keys(loggedInUser.assignedTasks.toDo).length : 0;
}

function getDoneCount(loggedInUser) {
    let doneCountHTML = document.getElementById('done-tasks-count');
    doneCountHTML.innerHTML = loggedInUser.assignedTasks && loggedInUser.assignedTasks.done
        ? Object.keys(loggedInUser.assignedTasks.done).length : 0;
}

function getUrgentCount(loggedInUser) {
    let urgentCountHTML = document.getElementById('urgent-tasks-count');
    urgentCountHTML.innerHTML = loggedInUser.assignedTasks 
        ? Object.keys(loggedInUser.assignedTasks).reduce((urgentCount, key) => {
            return urgentCount + (Object.values(loggedInUser.assignedTasks[key]).filter(task => task.priority === 'urgent').length);}, 0) : 0;
}

function getAllTasksCount(loggedInUser) {
    let allTasksCountHTML = document.getElementById('all-tasks-count');
    allTasksCountHTML.innerHTML = loggedInUser.assignedTasks
        ? Object.keys(loggedInUser.assignedTasks).reduce((totalCount, key) => totalCount +
            Object.keys(loggedInUser.assignedTasks[key]).length, 0) : 0;
}

function getInprocessCount(loggedInUser) {
    let inprocessCountHTML = document.getElementById('inprocess-tasks-count');
    inprocessCountHTML.innerHTML = loggedInUser.assignedTasks && loggedInUser.assignedTasks.inProgress
        ? Object.keys(loggedInUser.assignedTasks.inProgress).length : 0;
}

function getAwaitingCount(loggedInUser) {
    let awaitingCountHTML = document.getElementById('awaiting-tasks-count');
    awaitingCountHTML.innerHTML = loggedInUser.assignedTasks && loggedInUser.assignedTasks.awaitingFeedback
        ? Object.keys(loggedInUser.assignedTasks.awaitingFeedback).length : 0;
}

function getLoggedUsername(loggedInUser) {
    let loggedUsernameHTML = document.getElementById('logged-username');
    loggedUsernameHTML.innerHTML = loggedInUser.name || 'null';
}
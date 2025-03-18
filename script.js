let dataArray = [];

// Check if the user is logged in
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "./log_in.html";
    return;
  }

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
    dataArray = Object.values(kanbanData);
    console.log(dataArray);
    for (let dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
      let userDataContent = dataArray[dataIndex];
      console.log(`User: ${userDataContent.name}`);
      getDataContentHTML(userDataContent);
    }
  }

  function getDataContentHTML(userDataContent) {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      return;
    }
      let todoCardsHTML = getTodoContent(userDataContent);
      let inProgressCardsHTML = getInProgressContent(userDataContent);
      let awaitingFeedbackCardsHTML = getAwaitingFeedbackContent(userDataContent);
      let doneCardsHTML = getDoneContent(userDataContent);

      addHTMLToTaskContainers(
        todoCardsHTML,
        inProgressCardsHTML,
        awaitingFeedbackCardsHTML,
        doneCardsHTML
      );
    }
});

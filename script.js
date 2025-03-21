
function onloadFunc() {
  getUserName();
}

// Check if the user is logged in
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "./log_in.html";
    return;
  }

  const BASE_URL =
    "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData.json";

  Promise.resolve().then(async () => {
    await fetchKanbanData();
  });

  async function fetchKanbanData() {
    let response = await fetch(BASE_URL);
    let kanbanData = await response.json();
    getDataContent(kanbanData);
  }

  function getDataContent(kanbanData) {
    let userData = Object.values(kanbanData.users);
    console.log(userData);
    for (let dataIndex = 0; dataIndex < userData.length; dataIndex++) {
      let userDataContent = userData[dataIndex];
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

function getUserName() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    let userObject = JSON.parse(loggedInUser);
    let userName = userObject.name;
    console.log("Benutzername:", userName);
    getUserInitialForHeader(userName);
  }
}

function getUserInitialForHeader(userName) {
  let [firstName, lastName] = userName.split(" ");
  let firstLetter = firstName.charAt(0).toUpperCase();
  let lastNameFirstLetter = lastName.charAt(0).toUpperCase();
  let initials = firstLetter + lastNameFirstLetter;
  let headerInitials = document.getElementById("user-initials-header");

  headerInitials.innerHTML = /*html*/ `
    <div>${initials}</div>
  `;
}

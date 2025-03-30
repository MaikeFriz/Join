document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("log-in-form");
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  const errorMessage = document.createElement("p");
  errorMessage.style.color = "red";

  //if (isUserLoggedIn()) return;

  form.appendChild(errorMessage);

  form.addEventListener("submit", (event) => handleFormSubmit(event, emailInput, passwordInput, errorMessage));
});

function isUserLoggedIn() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  return loggedInUser !== null;
}

function handleFormSubmit(event, emailInput, passwordInput, errorMessage) {
  event.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  if (isInputValid(email, password, errorMessage)) {
    authenticateUser(email, password, errorMessage);
  }
}

function isInputValid(email, password, errorMessage) {
  if (!email || !password) {
    errorMessage.textContent = "Email and password are required.";
    return false;
  }
  return true;
}

function authenticateUser(email, password, errorMessage) {
  fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json")
    .then((response) => response.json())
    .then((data) => handleAuthenticationResponse(data, email, password, errorMessage))
    .catch((error) => handleError(error, errorMessage));
}

function handleAuthenticationResponse(data, email, password, errorMessage) {
  const userKey = findUserKey(data, email, password);

  if (userKey) {
    storeUserInLocalStorage(data, userKey);
    window.location.href = "./summary.html";
  } else {
    errorMessage.textContent = "Invalid email or password.";
  }
}

function findUserKey(data, email, password) {
  return Object.keys(data).find(
    (key) => data[key].email === email && data[key].password === password
  );
}

function storeUserInLocalStorage(data, userKey) {
  const user = data[userKey];
  const loggedInUser = {
    userId: userKey,
    ...user,
  };

  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
}

function handleError(error, errorMessage) {
  errorMessage.textContent = "Error logging in: " + error.message;
}

//Handle loading screen and mobile loading screen
function handleLoadingScreen() {
  const loadingScreen = document.getElementById("blue_loading_screen");
  const pageContent = document.querySelector(".page_content");

  if (window.innerWidth <= 450) {
    pageContent.style.display = "none";

    setTimeout(() => {
      loadingScreen.style.display = "none";
      pageContent.style.display = "";
      setupLoginForm();
      setupLogoAnimationReset();
    }, 1500);
  } else {
    setupLoginForm();
    setupLogoAnimationReset();
  }
}



// Handles logo animation end event to reset logo styles
function setupLogoAnimationReset() {
  const logoHeader = document.querySelector(".logo_header");
  logoHeader.addEventListener("animationend", () => {
    logoHeader.style.position = "relative";
    logoHeader.style.transform = "none";
    logoHeader.style.top = "auto";
    logoHeader.style.left = "auto";
    logoHeader.style.marginTop = "0";
    logoHeader.style.marginLeft = "0";
  });
};


// Handles DOMContentLoaded: sets up form, error message, and event listeners for login and guest login
function setupLoginForm() {
  const form = document.getElementById("log-in-form");
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  const errorMessage = document.createElement("p");
  errorMessage.style.color = "red";
  form.appendChild(errorMessage);
  document.getElementById("guestButton").addEventListener("click", function (event) {
    event.preventDefault();
    guestLogin();
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    showLoadingSpinner();
    handleFormSubmit(event, emailInput, passwordInput, errorMessage);
  });
};


// Loading Spinner functions
function showLoadingSpinner() {
  document.getElementById("loading_spinner").style.display = "flex";
}


function hideLoadingSpinner() {
  document.getElementById("loading_spinner").style.display = "none";
}


// Loads guest data from local storage (not implemented)
function loadGuestDataFromLocalStorage() {
  return
}


// Handles guest login: sets guest state, fetches guest data, and redirects to summary
async function guestLogin() {
  showLoadingSpinner();
  console.log("Guest Log In clicked");
  document.getElementById("input_email").removeAttribute("required");
  document.getElementById("input_password").removeAttribute("required");
  localStorage.removeItem("loggedInUser");
  localStorage.setItem("isGuest", "true");
  const guestData = await fetchGuestKanbanData();
  if (guestData) {
    console.log("Guest data successfully fetched and stored.");
    hideLoadingSpinner()
  } else {
    console.error("Failed to fetch guest data.");
    hideLoadingSpinner()
  }
  window.location.href = "./summary.html";
}


// Handles the login form submission: validates input and authenticates user
function handleFormSubmit(event, emailInput, passwordInput, errorMessage) {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!isInputValid(email, password, errorMessage)) {
    hideLoadingSpinner();
    return;
  }
  authenticateUser(email, password, errorMessage);
}


// Checks if a user is currently logged in
function isUserLoggedIn() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  return loggedInUser !== null;
}


// Clears input field styles and hides error messages
function clearInputStyles(emailInput, passwordInput, errorMessage) {
  emailInput.style.border = "";
  passwordInput.style.border = "";
  errorMessage.style.display = "none";
  errorMessage.textContent = "";
}


// Shows an error message and marks input fields as invalid
function showError(emailInput, passwordInput, errorMessage, message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  emailInput.style.border = "2px solid red";
  passwordInput.style.border = "2px solid red";
}


// Validates the email format using a regex
function isEmailFormatValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


// Validates login input fields and shows errors if invalid
function isInputValid(email, password) {
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  const errorMessage = document.getElementById("login-error-message");
  const forgotPasswordDiv = document.getElementById("forgot_password_div");
  clearInputStyles(emailInput, passwordInput, errorMessage);
  if (!email || !password) {
    showError(emailInput, passwordInput, errorMessage, "Wrong email or password.");
    forgotPasswordDiv.style.display = "block";
    return false;
  }
  if (!isEmailFormatValid(email)) {
    showError(emailInput, passwordInput, errorMessage, "Wrong email or password.");
    forgotPasswordDiv.style.display = "block";
    return false;
  }
  return true;
}


// Fetches user data from the database and authenticates the user
function authenticateUser(email, password, errorMessage) {
  fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json")
    .then((response) => response.json())
    .then((data) => handleAuthenticationResponse(data, email, password, errorMessage))
    .catch((error) => handleError(error, errorMessage));
}


// Handles the authentication response: logs in user or shows error
function handleAuthenticationResponse(data, email, password) {
  const userKey = findUserKey(data, email, password);
  if (userKey) {
    handleSuccessfulLogin(data, userKey);
  } else {
    handleFailedLogin();
  }
}


// Handles successful login: stores user, hides spinner, and redirects
function handleSuccessfulLogin(data, userKey) {
  hideLoginError();
  resetInputBorders();
  storeUserInLocalStorage(data, userKey);
  hideLoadingSpinner();
  redirectToSummary();
}


// Handles failed login: shows error, marks inputs, and resets fields
function handleFailedLogin() {
  showLoginError("Check your email and password. Please try again.");
  markInputsAsInvalid();
  const forgotPasswordDiv = document.getElementById("forgot_password_div");
  forgotPasswordDiv.style.display = "block";
  document.getElementById("input_email").value = "";
  document.getElementById("input_password").value = "";
  hideLoadingSpinner();
}


// Shows the login error message
function showLoginError(message) {
  const errorDiv = document.getElementById("login-error-message");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}


// Hides the login error message
function hideLoginError() {
  const errorDiv = document.getElementById("login-error-message");
  errorDiv.textContent = "";
  errorDiv.style.display = "none";
}


// Marks the email and password input fields as invalid
function markInputsAsInvalid() {
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  emailInput.style.border = "2px solid red";
  passwordInput.style.border = "2px solid red";
}


// Resets the input field borders to default
function resetInputBorders() {
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  emailInput.style.border = "";
  passwordInput.style.border = "";
}


// Redirects the user to the summary page after successful login
function redirectToSummary() {
  window.location.href = "./summary.html";
}


// Finds the user key in the database matching the given email and password
function findUserKey(data, email, password) {
  return Object.keys(data).find(
    (key) => data[key].email === email && data[key].password === password
  );
}


// Stores the logged-in user in localStorage and clears guest data
function storeUserInLocalStorage(data, userKey) {
  const user = data[userKey];
  const loggedInUser = {
    userId: userKey,
    ...user,
  };
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  localStorage.removeItem("isGuest");
  localStorage.removeItem("guestKanbanData");
}


// Handles errors during authentication and displays an error message
function handleError(error, errorMessage) {
  hideLoadingSpinner();
  errorMessage.textContent = "Error logging in: " + error.message;
}



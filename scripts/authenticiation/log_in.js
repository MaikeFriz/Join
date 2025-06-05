/**
 * Handles the loading screen animation and sets up the login form and logo animation reset.
 */
function handleLoadingScreen() {
  const loadingScreen = document.getElementById("blue_loading_screen");
  const pageContent = document.querySelector(".page_content");
  loadingScreen.classList.add("visible");
  setTimeout(() => {
    loadingScreen.classList.add("fade-out");
    loadingScreen.classList.remove("visible");
    setTimeout(() => {
      loadingScreen.style.display = "none";
      if (pageContent) {
        pageContent.style.display = "block";
        void pageContent.offsetWidth;
        pageContent.classList.add("visible");
      }
      setupLoginForm();
      setupLogoAnimationReset();
    }, 600); 
  }, 1200);
}

/**
 * Handles logo animation end event to reset logo styles.
 */
function setupLogoAnimationReset() {
  const logoHeader = document.querySelector(".logo_header");
  if (logoHeader) {
    logoHeader.addEventListener("animationend", () => {
      logoHeader.style.position = "relative";
      logoHeader.style.transform = "none";
      logoHeader.style.top = "auto";
      logoHeader.style.left = "auto";
      logoHeader.style.marginTop = "0";
      logoHeader.style.marginLeft = "0";
    });
  }
}

/**
 * Sets up the login form, guest button, and forgot password UI on DOMContentLoaded.
 */
function setupLoginForm() {
  const form = document.getElementById("log-in-form");
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  const forgotPasswordDiv = document.getElementById("forgot_password_div");

  setupGuestButton();
  setupLoginFormSubmit(form, emailInput, passwordInput);
  hideForgotPasswordInitially(forgotPasswordDiv);
}

/**
 * Sets up the guest login button event listener.
 */
function setupGuestButton() {
  const guestButton = document.getElementById("guestButton");
  if (guestButton) {
    guestButton.addEventListener("click", function (event) {
      event.preventDefault();
      guestLogin();
    });
  }
}

/**
 * Sets up the login form submit event listener.
 * @param {HTMLFormElement} form - The login form element.
 * @param {HTMLInputElement} emailInput - The email input element.
 * @param {HTMLInputElement} passwordInput - The password input element.
 */
function setupLoginFormSubmit(form, emailInput, passwordInput) {
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      showLoadingSpinner();
      handleFormSubmit(event, emailInput, passwordInput);
    });
  }
}

/**
 * Hides the forgot password div initially.
 * @param {HTMLElement} forgotPasswordDiv - The forgot password div element.
 */
function hideForgotPasswordInitially(forgotPasswordDiv) {
  if (forgotPasswordDiv) {
    forgotPasswordDiv.classList.add("d_none_forgot_password-div");
  }
}

/**
 * Shows the loading spinner.
 */
function showLoadingSpinner() {
  document.getElementById("loading_spinner").style.display = "flex";
}

/**
 * Hides the loading spinner.
 */
function hideLoadingSpinner() {
  document.getElementById("loading_spinner").style.display = "none";
}

/**
 * Loads guest data from local storage (not implemented).
 */
function loadGuestDataFromLocalStorage() {
  return;
}

/**
 * Handles guest login: sets guest state, fetches guest data, and redirects to summary.
 */
async function guestLogin() {
  showLoadingSpinner();
  document.getElementById("input_email").removeAttribute("required");
  document.getElementById("input_password").removeAttribute("required");
  localStorage.removeItem("loggedInUser");
  localStorage.setItem("isGuest", "true");
  const guestData = await fetchGuestKanbanData();
  hideLoadingSpinner();
  window.location.href = "./summary.html";
}

/**
 * Handles the login form submission: validates input and authenticates user.
 * @param {Event} event - The submit event.
 * @param {HTMLInputElement} emailInput - The email input element.
 * @param {HTMLInputElement} passwordInput - The password input element.
 */
function handleFormSubmit(event, emailInput, passwordInput) {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const errorMessage = document.getElementById("login-error-message");
  if (!isInputValid(email, password)) {
    hideLoadingSpinner();
    return;
  }
  authenticateUser(email, password, errorMessage);
}

/**
 * Checks if a user is currently logged in.
 * @returns {boolean} True if a user is logged in, otherwise false.
 */
function isUserLoggedIn() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  return loggedInUser !== null;
}

/**
 * Clears input field styles and hides error messages.
 * @param {HTMLInputElement} emailInput - The email input element.
 * @param {HTMLInputElement} passwordInput - The password input element.
 * @param {HTMLElement} errorMessage - The error message element.
 */
function clearInputStyles(emailInput, passwordInput, errorMessage) {
  emailInput.style.border = "";
  passwordInput.style.border = "";
  errorMessage.textContent = "";
  const forgotPasswordDiv = document.getElementById("forgot_password_div");
  if (forgotPasswordDiv) {
    forgotPasswordDiv.classList.add("d_none_forgot_password-div");
  }
}

/**
 * Shows an error message and marks input fields as invalid.
 * @param {HTMLInputElement} emailInput - The email input element.
 * @param {HTMLInputElement} passwordInput - The password input element.
 * @param {HTMLElement} errorMessage - The error message element.
 * @param {string} message - The error message text.
 */
function showError(emailInput, passwordInput, errorMessage, message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  emailInput.style.border = "1px solid #ff8190";
  passwordInput.style.border = "1px solid #ff8190";
  const forgotPasswordDiv = document.getElementById("forgot_password_div");
  if (forgotPasswordDiv) {
    forgotPasswordDiv.classList.remove("d_none_forgot_password-div");
  }
}

/**
 * Fetches user data from the database and authenticates the user.
 * @param {string} email - The email value.
 * @param {string} password - The password value.
 * @param {HTMLElement} errorMessage - The error message element.
 */
function authenticateUser(email, password, errorMessage) {
  fetch(
    "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json"
  )
    .then((response) => response.json())
    .then((data) =>
      handleAuthenticationResponse(data, email, password, errorMessage)
    )
    .catch((error) => handleError(error, errorMessage));
}

/**
 * Handles the authentication response: logs in user or shows error.
 * @param {Object} data - The user data object.
 * @param {string} email - The email value.
 * @param {string} password - The password value.
 * @param {HTMLElement} errorMessage - The error message element.
 */
function handleAuthenticationResponse(data, email, password, errorMessage) {
  const userKey = findUserKey(data, email, password);
  if (userKey) {
    handleSuccessfulLogin(data, userKey);
  } else {
    handleFailedLogin();
  }
}

/**
 * Handles successful login: stores user, hides spinner, and redirects.
 * @param {Object} data - The user data object.
 * @param {string} userKey - The key of the logged-in user.
 */
function handleSuccessfulLogin(data, userKey) {
  hideLoginError();
  resetInputBorders();
  storeUserInLocalStorage(data, userKey);
  hideLoadingSpinner();
  redirectToSummary();
}

/**
 * Handles failed login: shows error, marks inputs, and resets fields.
 */
function handleFailedLogin() {
  showLoginError("Check your email and password. Please try again.");
  markInputsAsInvalid();
  const forgotPasswordDiv = document.getElementById("forgot_password_div");
  if (forgotPasswordDiv) {
    forgotPasswordDiv.classList.remove("d_none_forgot_password-div");
  }
  document.getElementById("input_email").value = "";
  document.getElementById("input_password").value = "";
  hideLoadingSpinner();
}

/**
 * Shows the login error message.
 * @param {string} message - The error message text.
 */
function showLoginError(message) {
  const errorDiv = document.getElementById("login-error-message");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

/**
 * Hides the login error message.
 */
function hideLoginError() {
  const errorDiv = document.getElementById("login-error-message");
  errorDiv.textContent = "";
}

/**
 * Marks the email and password input fields as invalid.
 */
function markInputsAsInvalid() {
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  emailInput.style.border = "1px solid red";
  passwordInput.style.border = "1px solid red";
}

/**
 * Resets the input field borders to default.
 */
function resetInputBorders() {
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  emailInput.style.border = "";
  passwordInput.style.border = "";
}

/**
 * Redirects the user to the summary page after successful login.
 */
function redirectToSummary() {
  window.location.href = "./summary.html";
}

/**
 * Finds the user key in the database matching the given email and password.
 * @param {Object} data - The user data object.
 * @param {string} email - The email value.
 * @param {string} password - The password value.
 * @returns {string|undefined} The user key if found, otherwise undefined.
 */
function findUserKey(data, email, password) {
  return Object.keys(data).find(
    (key) => data[key].email === email && data[key].password === password
  );
}

/**
 * Stores the logged-in user in localStorage and clears guest data.
 * @param {Object} data - The user data object.
 * @param {string} userKey - The key of the logged-in user.
 */
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

/**
 * Handles errors during authentication and displays an error message.
 * @param {Error} error - The error object.
 * @param {HTMLElement} errorMessage - The error message element.
 */
function handleError(error, errorMessage) {
  hideLoadingSpinner();
  errorMessage.textContent = "Error logging in: " + error.message;
}


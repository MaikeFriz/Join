document.addEventListener("DOMContentLoaded", () => {
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
});

// ==========================
// Loading Spinner
// ==========================

function showLoadingSpinner() {
  document.getElementById("loading_spinner").style.display = "flex";
}

function hideLoadingSpinner() {
  document.getElementById("loading_spinner").style.display = "none";
}

// ==========================
// Gast-Login Funktionen
// ==========================
function loadGuestDataFromLocalStorage() {
  return
}

async function guestLogin() {
  console.log("Guest Log In clicked");

  document.getElementById("input_email").removeAttribute("required");
  document.getElementById("input_password").removeAttribute("required");

  localStorage.removeItem("loggedInUser");
  localStorage.setItem("isGuest", "true");

  // Abrufen der Gastdaten von der Datenbank und Speichern in LocalStorage
  const guestData = await fetchGuestKanbanData();
  if (guestData) {
    console.log("Guest data successfully fetched and stored.");
  } else {
    console.error("Failed to fetch guest data.");
  }

  window.location.href = "./summary.html";
}

// ==========================
// Formularverarbeitung & Validierung
// ==========================
function handleFormSubmit(event, emailInput, passwordInput, errorMessage) {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!isInputValid(email, password, errorMessage)) {
    hideLoadingSpinner();
    return;
  }

  authenticateUser(email, password, errorMessage);
}

function isUserLoggedIn() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  return loggedInUser !== null;
}

// ==========================
// Inputvalidierung (Style & Format)
/// ==========================
function clearInputStyles(emailInput, passwordInput, errorMessage) {
  emailInput.style.border = "";
  passwordInput.style.border = "";
  errorMessage.style.display = "none";
  errorMessage.textContent = "";
}

function showError(emailInput, passwordInput, errorMessage, message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  emailInput.style.border = "2px solid red";
  passwordInput.style.border = "2px solid red";
}

function isEmailFormatValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isInputValid(email, password) {
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  const errorMessage = document.getElementById("login-error-message");
  const forgotPasswordDiv = document.getElementById("forgot_password_div");


  clearInputStyles(emailInput, passwordInput, errorMessage);

  if (!email || !password) {
    showError(emailInput, passwordInput, errorMessage, "Check your email and password. Please try again.");
    forgotPasswordDiv.style.display = "block";
    return false;
  }

  if (!isEmailFormatValid(email)) {
    showError(emailInput, passwordInput, errorMessage, "Check your email and password. Please try again.");
    forgotPasswordDiv.style.display = "block";
    return false;
  }

  return true;
}

// ==========================
// Authentifizierung & Antwortbehandlung
// ==========================
function authenticateUser(email, password, errorMessage) {
  fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json")
    .then((response) => response.json())
    .then((data) => handleAuthenticationResponse(data, email, password, errorMessage))
    .catch((error) => handleError(error, errorMessage));
}

function handleAuthenticationResponse(data, email, password) {
  const userKey = findUserKey(data, email, password);

  if (userKey) {
    handleSuccessfulLogin(data, userKey);
  } else {
    handleFailedLogin();
  }
}

// ==========================
// Erfolgreicher/Fehlgeschlagener Login
// ==========================
function handleSuccessfulLogin(data, userKey) {
  hideLoginError();
  resetInputBorders();
  storeUserInLocalStorage(data, userKey);
  hideLoadingSpinner();
  redirectToSummary();
}

function handleFailedLogin() {
  showLoginError("Check your email and password. Please try again.");
  markInputsAsInvalid();
  const forgotPasswordDiv = document.getElementById("forgot_password_div");
  forgotPasswordDiv.style.display = "block";
  document.getElementById("input_email").value = "";
  document.getElementById("input_password").value = "";
  hideLoadingSpinner();
}

function showLoginError(message) {
  const errorDiv = document.getElementById("login-error-message");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

function hideLoginError() {
  const errorDiv = document.getElementById("login-error-message");
  errorDiv.textContent = "";
  errorDiv.style.display = "none";
}

function markInputsAsInvalid() {
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  emailInput.style.border = "2px solid red";
  passwordInput.style.border = "2px solid red";
}

function resetInputBorders() {
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  emailInput.style.border = "";
  passwordInput.style.border = "";
}

function redirectToSummary() {
  window.location.href = "./summary.html";
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
  localStorage.removeItem("isGuest");
  localStorage.removeItem("guestKanbanData");
}

function handleError(error, errorMessage) {
  hideLoadingSpinner();
  errorMessage.textContent = "Error logging in: " + error.message;
}


// Ändere die Position des Logos nach Abschluss der Animation
document.addEventListener("DOMContentLoaded", () => {
  const logoHeader = document.querySelector(".logo_header");
  logoHeader.addEventListener("animationend", () => {
    logoHeader.style.position = "relative";
    logoHeader.style.transform = "none";
    logoHeader.style.top = "auto";
    logoHeader.style.left = "auto";
    logoHeader.style.marginTop = "0";
    logoHeader.style.marginLeft = "0";
  });
});
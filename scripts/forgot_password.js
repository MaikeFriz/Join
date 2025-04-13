// Email validieren
/// ==========================
async function validateEmail() {
  const emailInput = document.getElementById("email_forgot_password").value.trim();
  const validationMessageDiv = document.getElementById("email_validation_message");
  const showWhenMailValidatedDiv = document.getElementById("show_when_mail_validaded");
  const loadingSpinner = document.getElementById("loading_spinner");

  validationMessageDiv.textContent = "";
  validationMessageDiv.style.color = "black";
  showWhenMailValidatedDiv.style.display = "none";

  if (!emailInput) {
    validationMessageDiv.textContent = "Please enter an email address.";
    validationMessageDiv.style.color = "red";
    return;
  }
  loadingSpinner.style.display = "flex";

  try {
    const response = await fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json");
    const users = await response.json();

    const userExists = Object.values(users).some(user => user.email === emailInput);

    if (userExists) {
      validationMessageDiv.textContent = "User with this email address found in the database.";
      validationMessageDiv.style.color = "green";
      showWhenMailValidatedDiv.style.display = "block";

      const emailLabel = document.getElementById("email_input_label");
      const emailButton = document.getElementById("forgot_password_validade_email_button");

      if (emailLabel) emailLabel.style.setProperty("display", "none", "important");
      if (emailButton) emailButton.style.setProperty("display", "none", "important");
    } else {
      validationMessageDiv.textContent = "No user with this email address found in the database.";
      validationMessageDiv.style.color = "red";
      showWhenMailValidatedDiv.style.display = "none";
    }
  } catch (error) {
    console.error("Error validating email:", error);
    validationMessageDiv.textContent = "An error occurred while validating the email. Please try again later.";
    validationMessageDiv.style.color = "red";
  } finally {
    loadingSpinner.style.display = "none";
  }
}

function getEmailInputValue() {
  return document.getElementById("email_forgot_password").value.trim();
}

function resetValidationUI() {
  const validationMessageDiv = document.getElementById("email_validation_message");
  const showWhenMailValidatedDiv = document.getElementById("show_when_mail_validaded");
  validationMessageDiv.textContent = "";
  validationMessageDiv.style.color = "black";
  showWhenMailValidatedDiv.style.display = "none";
}

function showValidationMessage(message, color) {
  const validationMessageDiv = document.getElementById("email_validation_message");
  validationMessageDiv.textContent = message;
  validationMessageDiv.style.color = color;
}

function toggleValidatedDiv(show) {
  const showWhenMailValidatedDiv = document.getElementById("show_when_mail_validaded");
  showWhenMailValidatedDiv.style.display = show ? "block" : "none";
  showWhenMailValidatedDiv.classList.add("div_d_none_style");

}

async function fetchUserData() {
  const response = await fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json");
  return await response.json();
}

function checkIfUserExists(users, email) {
  return Object.values(users).some(user => user.email === email);
}

// Password updaten
/// ==========================
async function updatePassword() {
  resetUI();
  const { email, password, confirmPassword } = getInputValues();

  if (!validatePasswordFields(password, confirmPassword)) return;
  showSpinner();

  try {
    const users = await fetchUsers();
    if (!users) throw new Error("No users found.");

    const userKey = findUserKeyByEmail(users, email);
    if (userKey) {
      await updateUserPassword(userKey, users[userKey], password);
      showSuccessMessage();
    } else {
      showUserNotFoundError();
    }
  } catch (error) {
    showGeneralError(error);
  } finally {
    hideSpinner();
  }
}

function getInputValues() {
  return {
    email: document.getElementById("email_forgot_password").value.trim().toLowerCase(),
    password: document.getElementById("password_forgot_password").value.trim(),
    confirmPassword: document.getElementById("confirm_password_forgot_password").value.trim()
  };
}

function getElement(id) {
  return document.getElementById(id);
}

function resetUI() {
  const errorDiv = getElement("error_new_password_message");
  errorDiv.textContent = "";
  errorDiv.style.color = "red";

  ["password_forgot_password", "confirm_password_forgot_password", "email_forgot_password"]
    .forEach(id => getElement(id).style.border = "");
}

function validatePasswordFields(password, confirmPassword) {
  if (!password || !confirmPassword) {
    setError("Both password fields are required.", ["password_forgot_password", "confirm_password_forgot_password"]);
    return false;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match. Please try again.", ["password_forgot_password", "confirm_password_forgot_password"]);
    return false;
  }

  return true;
}

function setError(message, inputIds) {
  const errorDiv = getElement("error_new_password_message");
  errorDiv.textContent = message;
  inputIds.forEach(id => getElement(id).style.border = "2px solid red");
}

async function fetchUsers() {
  const response = await fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json");
  return await response.json();
}

function findUserKeyByEmail(users, email) {
  return Object.keys(users).find(key => users[key].email.toLowerCase() === email);
}

async function updateUserPassword(userKey, userObject, newPassword) {
  const updatedUser = { ...userObject, password: newPassword };

  await fetch(`https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userKey}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedUser)
  });
}

function showSuccessMessage() {
  getElement("confirmation_message").textContent = "Password updated successfully! You can now log in with your new password.";
  getElement("confirmation_message").style.color = "green";
  getElement("lead_to_log_in_div").style.display = "block";
  document.querySelector("form").style.display = "none";
}

function showUserNotFoundError() {
  setError("User not found. Please check your email.", ["email_forgot_password"]);
}

function showGeneralError(error) {
  console.error("Error updating password:", error);
  const errorDiv = getElement("error_new_password_message");
  errorDiv.textContent = `An error occurred: ${error.message}`;
}

function showSpinner() {
  getElement("loading_spinner").style.display = "flex";
}

function hideSpinner() {
  getElement("loading_spinner").style.display = "none";
}

function resetConfirmationMessage() {
  const div = document.getElementById("confirmation_message");
  div.textContent = "";
  div.style.color = "black";
}

function showConfirmationMessage(message, color) {
  const div = document.getElementById("confirmation_message");
  div.textContent = message;
  div.style.color = color;
}

function doPasswordsMatch(pw1, pw2) {
  return pw1 === pw2;
}

// Back to Login button
// ==========================
function redirectToLogin() {
  window.location.href = "./log_in.html";
}

// Toggle Icons for Password Input
// ==========================
function togglePasswordIcons(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId).querySelector("img");

  if (input.value.trim() === "") {
    icon.src = "./assets/img/placeholder_lock_input.svg";
  } else {
    if (input.type === "password") {
      icon.src = "./assets/img/visibility_off.svg";
    } else {
      icon.src = "./assets/img/visibility.svg";
    }
  }
}

function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId).querySelector("img");

  if (input.type === "password") {
    input.type = "text";
    icon.src = "./assets/img/visibility.svg";
  } else {
    input.type = "password";
    icon.src = "./assets/img/visibility_off.svg";
  }
}

// Validates the entered email for password reset and shows appropriate UI feedback
async function validateEmail() {
  resetValidationUI();
  const emailInput = getEmailInputValue();
  if (!validateEmailInput(emailInput)) return;
  showLoadingSpinner(true);
  try {
    const users = await fetchUserData();
    handleEmailValidationResult(users, emailInput);
  } catch (error) {
    handleEmailValidationError(error);
  } finally {
    showLoadingSpinner(false);
  }
}

// Checks if the email input is not empty
function validateEmailInput(emailInput) {
  if (!emailInput) {
    showValidationMessage("Please enter an email address.", "red");
    return false;
  }
  return true;
}

// Shows or hides the loading spinner overlay
function showLoadingSpinner(show) {
  const loadingSpinner = document.getElementById("loading_spinner");
  loadingSpinner.style.display = show ? "flex" : "none";
}

// Handles the result of email validation (user found or not)
function handleEmailValidationResult(users, emailInput) {
  const userExists = checkIfUserExists(users, emailInput);
  if (userExists) {
    showValidationMessage(
      "User with this email address found in the database.",
      "green"
    );
    showValidatedUI(true);
    hideEmailInputAndButton();
  } else {
    showValidationMessage(
      "No user with this email address found in the database.",
      "red"
    );
    showValidatedUI(false);
  }
}

// Handles errors during email validation
function handleEmailValidationError(error) {
  showValidationMessage(
    "An error occurred while validating the email. Please try again later.",
    "red"
  );
  showValidatedUI(false);
}

// Shows or hides the UI section for validated emails
function showValidatedUI(show) {
  const showWhenMailValidatedDiv = document.getElementById(
    "show_when_mail_validaded"
  );
  showWhenMailValidatedDiv.style.display = show ? "block" : "none";
}

// Hides the email input and validation button after successful validation
function hideEmailInputAndButton() {
  const emailLabel = document.getElementById("email_input_label");
  const emailButton = document.getElementById(
    "forgot_password_validade_email_button"
  );
  if (emailLabel) emailLabel.style.setProperty("display", "none", "important");
  if (emailButton)
    emailButton.style.setProperty("display", "none", "important");
}

// Gets the trimmed value of the email input field
function getEmailInputValue() {
  return document.getElementById("email_forgot_password").value.trim();
}

// Resets the validation UI to its default state
function resetValidationUI() {
  const validationMessageDiv = document.getElementById(
    "email_validation_message"
  );
  const showWhenMailValidatedDiv = document.getElementById(
    "show_when_mail_validaded"
  );
  validationMessageDiv.textContent = "";
  validationMessageDiv.style.color = "black";
  showWhenMailValidatedDiv.style.display = "none";
}

// Shows a validation message with the specified color
function showValidationMessage(message, color) {
  const validationMessageDiv = document.getElementById(
    "email_validation_message"
  );
  validationMessageDiv.textContent = message;
  validationMessageDiv.style.color = color;
}

// Toggles the validated email UI section and adds a CSS class
function toggleValidatedDiv(show) {
  const showWhenMailValidatedDiv = document.getElementById(
    "show_when_mail_validaded"
  );
  showWhenMailValidatedDiv.style.display = show ? "block" : "none";
  showWhenMailValidatedDiv.classList.add("div_d_none_style");
}

// Fetches all users from the database
async function fetchUserData() {
  const response = await fetch(
    "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json"
  );
  return await response.json();
}

// Checks if a user with the given email exists in the users object
function checkIfUserExists(users, email) {
  return Object.values(users).some((user) => user.email === email);
}

// Handles the password update process after email validation
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

// Gets the values of the email, password, and confirm password input fields
function getInputValues() {
  return {
    email: document
      .getElementById("email_forgot_password")
      .value.trim()
      .toLowerCase(),
    password: document.getElementById("password_forgot_password").value.trim(),
    confirmPassword: document
      .getElementById("confirm_password_forgot_password")
      .value.trim(),
  };
}

// Helper to get an element by its ID
function getElement(id) {
  return document.getElementById(id);
}

// Resets the UI for password update (clears errors and input borders)
function resetUI() {
  const errorDiv = getElement("error_new_password_message");
  errorDiv.textContent = "";
  errorDiv.style.color = "red";
  [
    "password_forgot_password",
    "confirm_password_forgot_password",
    "email_forgot_password",
  ].forEach((id) => (getElement(id).style.border = ""));
}

// Validates the password and confirm password fields
function validatePasswordFields(password, confirmPassword) {
  if (!password || !confirmPassword) {
    setError("Both password fields are required.", [
      "password_forgot_password",
      "confirm_password_forgot_password",
    ]);
    return false;
  }
  if (password !== confirmPassword) {
    setError("Passwords do not match. Please try again.", [
      "password_forgot_password",
      "confirm_password_forgot_password",
    ]);
    return false;
  }
  return true;
}

// Sets an error message and highlights the specified input fields
function setError(message, inputIds) {
  const errorDiv = getElement("error_new_password_message");
  errorDiv.textContent = message;
  inputIds.forEach((id) => (getElement(id).style.border = "2px solid red"));
}

// Fetches all users from the database (used for password update)
async function fetchUsers() {
  const response = await fetch(
    "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json"
  );
  return await response.json();
}

// Finds the user key by email (case-insensitive)
function findUserKeyByEmail(users, email) {
  return Object.keys(users).find(
    (key) => users[key].email.toLowerCase() === email
  );
}

// Updates the user's password in the database
async function updateUserPassword(userKey, userObject, newPassword) {
  const updatedUser = { ...userObject, password: newPassword };
  await fetch(
    `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userKey}.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    }
  );
}

// Shows a success message after password update and displays the login link
function showSuccessMessage() {
  getElement("confirmation_message").textContent =
    "Password updated successfully! You can now log in with your new password.";
  getElement("confirmation_message").style.color = "green";
  getElement("lead_to_log_in_div").style.display = "block";
  document.querySelector("form").style.display = "none";
}

// Shows an error message if the user is not found
function showUserNotFoundError() {
  setError("User not found. Please check your email.", [
    "email_forgot_password",
  ]);
}

// Shows a general error message for password update failures
function showGeneralError(error) {
  const errorDiv = getElement("error_new_password_message");
  errorDiv.textContent = `An error occurred: ${error.message}`;
}

// Shows the loading spinner for password update
function showSpinner() {
  getElement("loading_spinner").style.display = "flex";
}

// Hides the loading spinner for password update
function hideSpinner() {
  getElement("loading_spinner").style.display = "none";
}

// Resets the confirmation message UI
function resetConfirmationMessage() {
  const div = document.getElementById("confirmation_message");
  div.textContent = "";
  div.style.color = "black";
}

// Shows a confirmation message with the specified color
function showConfirmationMessage(message, color) {
  const div = document.getElementById("confirmation_message");
  div.textContent = message;
  div.style.color = color;
}

// Checks if two passwords match
function doPasswordsMatch(pw1, pw2) {
  return pw1 === pw2;
}

// Redirects the user to the login page
function redirectToLogin() {
  window.location.href = "./log_in.html";
}

// Updates the password icon for the given input field based on its state
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

// Toggles the visibility of the password input field and updates the icon
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

/**
 * Validates the entered email for password reset and shows appropriate UI feedback.
 * @returns {Promise<void>}
 */
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

/**
 * Checks if the email input is not empty.
 * @param {string} emailInput - The email input value.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateEmailInput(emailInput) {
  if (!emailInput) {
    showValidationMessage("Please enter an email address.", "red");
    return false;
  }
  return true;
}

/**
 * Shows or hides the loading spinner overlay.
 * @param {boolean} show - Whether to show or hide the spinner.
 */
function showLoadingSpinner(show) {
  const loadingSpinner = document.getElementById("loading_spinner");
  loadingSpinner.style.display = show ? "flex" : "none";
}

/**
 * Handles the result of email validation (user found or not).
 * @param {Object} users - The users object.
 * @param {string} emailInput - The email input value.
 */
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

/**
 * Handles errors during email validation.
 * @param {Error} error - The error object.
 */
function handleEmailValidationError(error) {
  showValidationMessage(
    "An error occurred while validating the email. Please try again later.",
    "red"
  );
  showValidatedUI(false);
}

/**
 * Shows or hides the UI section for validated emails.
 * @param {boolean} show - Whether to show or hide the section.
 */
function showValidatedUI(show) {
  const showWhenMailValidatedDiv = document.getElementById(
    "show_when_mail_validaded"
  );
  showWhenMailValidatedDiv.style.display = show ? "block" : "none";
}

/**
 * Hides the email input and validation button after successful validation.
 */
function hideEmailInputAndButton() {
  const emailLabel = document.getElementById("email_input_label");
  const emailButton = document.getElementById(
    "forgot_password_validade_email_button"
  );
  if (emailLabel) emailLabel.style.setProperty("display", "none", "important");
  if (emailButton)
    emailButton.style.setProperty("display", "none", "important");
}

/**
 * Gets the trimmed value of the email input field.
 * @returns {string} The trimmed email value.
 */
function getEmailInputValue() {
  return document.getElementById("email_forgot_password").value.trim();
}

/**
 * Resets the validation UI to its default state.
 */
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

/**
 * Shows a validation message with the specified color.
 * @param {string} message - The message to display.
 * @param {string} color - The color of the message.
 */
function showValidationMessage(message, color) {
  const validationMessageDiv = document.getElementById(
    "email_validation_message"
  );
  validationMessageDiv.textContent = message;
  validationMessageDiv.style.color = color;
}

/**
 * Toggles the validated email UI section and adds a CSS class.
 * @param {boolean} show - Whether to show or hide the section.
 */
function toggleValidatedDiv(show) {
  const showWhenMailValidatedDiv = document.getElementById(
    "show_when_mail_validaded"
  );
  showWhenMailValidatedDiv.style.display = show ? "block" : "none";
  showWhenMailValidatedDiv.classList.add("div_d_none_style");
}

/**
 * Fetches all users from the database.
 * @returns {Promise<Object>} The users object.
 */
async function fetchUserData() {
  const response = await fetch(
    "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json"
  );
  return await response.json();
}

/**
 * Checks if a user with the given email exists in the users object.
 * @param {Object} users - The users object.
 * @param {string} email - The email to check.
 * @returns {boolean} True if user exists, otherwise false.
 */
function checkIfUserExists(users, email) {
  return Object.values(users).some((user) => user.email === email);
}

/**
 * Handles the password update process after email validation.
 * @returns {Promise<void>}
 */
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

/**
 * Gets the values of the email, password, and confirm password input fields.
 * @returns {Object} Object containing email, password, and confirmPassword.
 */
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

/**
 * Helper to get an element by its ID.
 * @param {string} id - The element ID.
 * @returns {HTMLElement} The DOM element.
 */
function getElement(id) {
  return document.getElementById(id);
}

/**
 * Resets the UI for password update (clears errors and input borders).
 */
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

/**
 * Validates the password and confirm password fields.
 * @param {string} password - The password value.
 * @param {string} confirmPassword - The confirm password value.
 * @returns {boolean} True if valid, otherwise false.
 */
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

/**
 * Sets an error message and highlights the specified input fields.
 * @param {string} message - The error message.
 * @param {Array<string>} inputIds - The input field IDs to highlight.
 */
function setError(message, inputIds) {
  const errorDiv = getElement("error_new_password_message");
  errorDiv.textContent = message;
  inputIds.forEach((id) => (getElement(id).style.border = "2px solid red"));
}

/**
 * Fetches all users from the database (used for password update).
 * @returns {Promise<Object>} The users object.
 */
async function fetchUsers() {
  const response = await fetch(
    "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json"
  );
  return await response.json();
}

/**
 * Finds the user key by email (case-insensitive).
 * @param {Object} users - The users object.
 * @param {string} email - The email to search for.
 * @returns {string|undefined} The user key if found, otherwise undefined.
 */
function findUserKeyByEmail(users, email) {
  return Object.keys(users).find(
    (key) => users[key].email.toLowerCase() === email
  );
}

/**
 * Updates the user's password in the database.
 * @param {string} userKey - The user's key in the database.
 * @param {Object} userObject - The user object.
 * @param {string} newPassword - The new password.
 * @returns {Promise<void>}
 */
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

/**
 * Shows a success message after password update and displays the login link.
 */
function showSuccessMessage() {
  getElement("confirmation_message").textContent =
    "Password updated successfully! You can now log in with your new password.";
  getElement("confirmation_message").style.color = "green";
  getElement("lead_to_log_in_div").style.display = "block";
  document.querySelector("form").style.display = "none";
}

/**
 * Shows an error message if the user is not found.
 */
function showUserNotFoundError() {
  setError("User not found. Please check your email.", [
    "email_forgot_password",
  ]);
}

/**
 * Shows a general error message for password update failures.
 * @param {Error} error - The error object.
 */
function showGeneralError(error) {
  const errorDiv = getElement("error_new_password_message");
  errorDiv.textContent = `An error occurred: ${error.message}`;
}

/**
 * Shows the loading spinner for password update.
 */
function showSpinner() {
  getElement("loading_spinner").style.display = "flex";
}

/**
 * Hides the loading spinner for password update.
 */
function hideSpinner() {
  getElement("loading_spinner").style.display = "none";
}

/**
 * Resets the confirmation message UI.
 */
function resetConfirmationMessage() {
  const div = document.getElementById("confirmation_message");
  div.textContent = "";
  div.style.color = "black";
}

/**
 * Shows a confirmation message with the specified color.
 * @param {string} message - The message to display.
 * @param {string} color - The color of the message.
 */
function showConfirmationMessage(message, color) {
  const div = document.getElementById("confirmation_message");
  div.textContent = message;
  div.style.color = color;
}

/**
 * Checks if two passwords match.
 * @param {string} pw1 - The first password.
 * @param {string} pw2 - The second password.
 * @returns {boolean} True if passwords match, otherwise false.
 */
function doPasswordsMatch(pw1, pw2) {
  return pw1 === pw2;
}

/**
 * Redirects the user to the login page.
 */
function redirectToLogin() {
  window.location.href = "./log_in.html";
}

/**
 * Updates the password icon for the given input field based on its state.
 * @param {string} inputId - The input field ID.
 * @param {string} iconId - The icon element ID.
 */
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

/**
 * Toggles the visibility of the password input field and updates the icon.
 * @param {string} inputId - The input field ID.
 * @param {string} iconId - The icon element ID.
 */
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

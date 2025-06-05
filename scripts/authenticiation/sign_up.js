/**
 * Initializes the sign-up form and event listeners on DOMContentLoaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  setupSignUpForm();
  initForm();
});

/**
 * Sets up the sign-up form button state and event listeners.
 */
function setupSignUpForm() {
  const form = document.getElementById("sign-up-form");
  const submitBtn = document.getElementById("button_sign_up_input_section");
  const privacyCheckbox = document.getElementById("privacy");

  function updateButtonState() {
    if (!form.checkValidity() || !privacyCheckbox.checked) {
      disableSubmitButton(submitBtn);
    } else {
      enableSubmitButton(submitBtn);
    }
  }

  updateButtonState();
  form.addEventListener("input", updateButtonState);
  privacyCheckbox.addEventListener("change", updateButtonState);
}

/**
 * Disables the submit button and updates its styles/attributes.
 * @param {HTMLElement} submitBtn - The submit button element.
 */
function disableSubmitButton(submitBtn) {
  submitBtn.disabled = true;
  submitBtn.setAttribute('aria-disabled', 'true');
  submitBtn.classList.add('button-disabled');
}

/**
 * Enables the submit button and updates its styles/attributes.
 * @param {HTMLElement} submitBtn - The submit button element.
 */
function enableSubmitButton(submitBtn) {
  submitBtn.disabled = false;
  submitBtn.removeAttribute('aria-disabled');
  submitBtn.classList.remove('button-disabled');
}

/**
 * Shows the loading spinner.
 */
function showLoadingSpinner() {
  document.getElementById("loading-spinner").style.display = "flex";
}

/**
 * Hides the loading spinner after the sign-up process is complete.
 */
function hideLoadingSpinner() {
  document.getElementById("loading-spinner").style.display = "none";
}

/**
 * Checks if the email already exists in the database.
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>} True if email exists, otherwise false.
 */
async function emailAlreadyExists(email) {
  const response = await fetch(
    "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json"
  );
  const users = await response.json();
  if (!users) return false;
  return Object.values(users).some((user) => user.email === email);
}

/**
 * Initializes the sign-up form and its event listeners.
 */
function initForm() {
  const form = document.getElementById("sign-up-form");
  form.appendChild(createErrorMessage());
  document.body.appendChild(createOverlay());
  form.addEventListener("submit", handleFormSubmit);
}

/**
 * Creates an error message element for the form.
 * @returns {HTMLElement} The error message element.
 */
function createErrorMessage() {
  const errorMessage = document.createElement("p");
  errorMessage.id = "error_message_sign_up";
  errorMessage.style.color = "red";
  errorMessage.style.display = "none";
  return errorMessage;
}

/**
 * Creates the overlay for the success message after sign-up.
 * @returns {HTMLElement} The overlay element.
 */
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  const successMsg = document.createElement("p");
  successMsg.textContent = "User signed up successfully!";
  successMsg.className = "success-message";
  overlay.appendChild(successMsg);
  overlay.style.display = "none";
  return overlay;
}

/**
 * Handles the form submit event, validates input, and registers the user.
 * @param {Event} event - The submit event.
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  showLoadingSpinner();
  const { name, email, password, confirmPassword, privacyCheckbox } = getFormData();
  if (!checkIfAllFieldsFilled()) {
    hideLoadingSpinner();
    return;
  }
  if (!validateInputs(password, confirmPassword, privacyCheckbox)) {
    hideLoadingSpinner();
    return;
  }
  await registerUser(name, email, password);
}

/**
 * Retrieves all form field values.
 * @returns {Object} Object containing name, email, password, confirmPassword, and privacyCheckbox.
 */
function getFormData() {
  return {
    name: document.getElementById("input_name").value,
    email: document.getElementById("input_email").value,
    password: document.getElementById("input_password_sign_up").value,
    confirmPassword: document.getElementById("input_confirm_password_sign_up").value,
    privacyCheckbox: document.getElementById("privacy"),
  };
}

/**
 * Displays an error message in the form (for global errors).
 * @param {string} message - The error message to display.
 */
function showErrorMessage(message) {
  const errorMessageDiv = document.getElementById("error_message_sign_up");
  errorMessageDiv.textContent = message;
  errorMessageDiv.style.display = "block";
  errorMessageDiv.style.color = "red";
}

/**
 * Hides the error message in the form.
 */
function hideErrorMessage() {
  const errorMessageDiv = document.getElementById("error_message_sign_up");
  errorMessageDiv.textContent = "";
  errorMessageDiv.style.display = "none";
}

/**
 * Retrieves and trims all input values from the form.
 * @returns {Object} Object containing name, email, password, and confirmPassword.
 */
function getInputValues() {
  return {
    name: document.getElementById("input_name").value.trim(),
    email: document.getElementById("input_email").value.trim(),
    password: document.getElementById("input_password_sign_up").value.trim(),
    confirmPassword: document.getElementById("input_confirm_password_sign_up").value.trim(),
  };
}

/**
 * Shows an error message if a required field is empty.
 * @param {string} message - The error message to display.
 */
function showFieldErrorMessage(message) {
  const errorMessageDiv = document.getElementById("error_message_sign_up");
  errorMessageDiv.textContent = message;
  errorMessageDiv.style.color = "red";
  errorMessageDiv.style.display = "block";
}

/**
 * Hides the error message for empty fields.
 */
function hideFieldErrorMessage() {
  const errorMessageDiv = document.getElementById("error_message_sign_up");
  errorMessageDiv.textContent = "";
  errorMessageDiv.style.display = "none";
}

/**
 * Registers the user, checks for duplicate email, saves user, and shows success.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
async function registerUser(name, email, password) {
  try {
    if (await handleDuplicateEmail(email)) return;
    const userId = await generateUserId();
    const newUser = createUserObject(name, email, password);
    await saveUserToDatabase(userId, newUser);
    saveUserToLocalStorage(userId, newUser);
    await addUserToContacts(userId, newUser);
    showSuccessMessage();
  } catch (error) {
    showSignUpError(error);
    hideLoadingSpinner();
  }
}

/**
 * Checks for duplicate email and handles error UI if found.
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>} True if duplicate found, otherwise false.
 */
async function handleDuplicateEmail(email) {
  if (await emailAlreadyExists(email)) {
    showErrorMessage("This email address is already registered.");
    const emailInput = document.getElementById("input_email");
    emailInput.value = "";
    emailInput.focus();
    hideLoadingSpinner();
    return true;
  }
  return false;
}

/**
 * Saves user info to localStorage.
 * @param {string} userId - The user ID.
 * @param {Object} newUser - The user object.
 */
function saveUserToLocalStorage(userId, newUser) {
  localStorage.setItem(
    "loggedInUser",
    JSON.stringify({
      userId,
      name: newUser.name,
      email: newUser.email,
    })
  );
}

/**
 * Shows error message for sign up.
 * @param {Error} error - The error object.
 */
function showSignUpError(error) {
  document.getElementById(
    "error_message_sign_up"
  ).textContent = `Error: ${error.message}`;
}

/**
 * Adds the new user to their own contacts list in the database.
 * @param {string} userId - The user ID.
 * @param {Object} user - The user object.
 */
async function addUserToContacts(userId, user) {
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts.json`;
  const contact = {
    name: user.name, email: user.email, phone: "",
  };
  try {
    await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
  } catch (error) {
  }
}

/**
 * Generates a new unique user ID.
 * @returns {Promise<string>} The new user ID.
 */
async function generateUserId() {
  const response = await fetch(
    "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData.json"
  );
  const data = await response.json();
  const existingUserIds = Object.keys(data.users || {});
  const maxUserId =
    existingUserIds.length > 0
      ? Math.max(
          ...existingUserIds.map(
            (id) => parseInt(id.replace("user", ""), 10) || 0
          )
        )
      : 0;
  return `user${maxUserId + 1}`;
}

/**
 * Creates a user object with all required properties.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Object} The user object.
 */
function createUserObject(name, email, password) {
  return {
    name,
    email,
    password,
    assignedTasks: { toDo: {}, inProgress: {}, awaitingFeedback: {}, done: {} },
  };
}

/**
 * Saves the user object to the database.
 * @param {string} userId - The user ID.
 * @param {Object} user - The user object.
 * @returns {Promise<void>}
 */
async function saveUserToDatabase(userId, user) {
  await fetch(
    `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}.json`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }
  );
}

/**
 * Shows the success overlay and redirects to the login page after 1 second.
 */
function showSuccessMessage() {
  const overlay = document.querySelector(".overlay");
  overlay.style.display = "flex";
  setTimeout(() => (window.location.href = "./index.html"), 1000);
}
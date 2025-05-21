document.addEventListener("DOMContentLoaded", () => {
  initForm();
});

//Loading spinner
function showLoadingSpinner() {
  document.getElementById("loading-spinner").style.display = "flex";
}


function hideLoadingSpinner() {
  document.getElementById("loading-spinner").style.display = "none";
}

// Checks if the password is strong
function isStrongPassword(password) {
  const minLength = 8;
  const specialChars = password.match(/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]/g);
  return (
    password.length >= minLength && specialChars && specialChars.length >= 3
  );
}


// Checks if the email already exists in the database
async function emailAlreadyExists(email) {
  const response = await fetch(
    "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json"
  );
  const users = await response.json();
  if (!users) return false;
  return Object.values(users).some((user) => user.email === email);
}


// Initializes the sign-up form and its event listeners
function initForm() {
  const form = document.getElementById("sign-up-form");
  form.appendChild(createErrorMessage());
  document.body.appendChild(createOverlay());
  form.addEventListener("submit", handleFormSubmit);
}


// Creates an error message element for the form
function createErrorMessage() {
  const errorMessage = document.createElement("p");
  errorMessage.id = "error-message";
  errorMessage.style.color = "red";
  return errorMessage;
}


// Creates the overlay for the success message after sign-up
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = "<p>User signed up successfully!</p>";
  overlay.style.display = "none";
  return overlay;
}


//Handles the form submit event, validates input, and registers the user
async function handleFormSubmit(event) {
  event.preventDefault();
  showLoadingSpinner();
  const { name, email, password, confirmPassword, privacyCheckbox } =
    getFormData();
  if (
    !checkIfAllFieldsFilled() ||
    !validateInputs(password, confirmPassword, privacyCheckbox)
  ) {
    hideLoadingSpinner();
    return;
  }
  await registerUser(name, email, password);
}


// Retrieves all form field values
function getFormData() {
  return {
    name: document.getElementById("input_name").value,
    email: document.getElementById("input_email").value,
    password: document.getElementById("input_password_sign_up").value,
    confirmPassword: document.getElementById("input_confirm_password_sign_up")
      .value,
    privacyCheckbox: document.getElementById("privacy"),
  };
}


// Displays an error message in the form
function showErrorMessage(message) {
  const errorMessageDiv = document.getElementById("error_message_sign_up");
  errorMessageDiv.textContent = message;
  errorMessageDiv.style.display = "block";
  errorMessageDiv.style.color = "red";
}


// Hides the error message in the form
function hideErrorMessage() {
  const errorMessageDiv = document.getElementById("error_message_sign_up");
  errorMessageDiv.textContent = "";
  errorMessageDiv.style.display = "none";
}


// Checks if both passwords match
function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}


// Checks if the privacy policy checkbox is checked
function privacyAccepted(checkbox) {
  return checkbox.checked;
}


// Validates the password fields and shows an error if they don't match
function validateInputs(password, confirmPassword) {
  if (!passwordsMatch(password, confirmPassword)) {
    showErrorMessage("Your passwords don't match. Please try again.");
    document.getElementById("input_password_sign_up").value = "";
    document.getElementById("input_confirm_password_sign_up").value = "";
    return false;
  }
  hideErrorMessage();
  return true;
}


// Shows or hides the password mismatch error and highlights fields
function checkIfPasswordErrorMessageNeeded() {
  const passwordInput = document.getElementById("input_password_sign_up");
  const confirmPasswordInput = document.getElementById(
    "input_confirm_password_sign_up"
  );
  const errorMessageDiv = document.getElementById("error_message_sign_up");
  if (passwordInput.value !== confirmPasswordInput.value) {
    errorMessageDiv.textContent =
      "Your passwords don't match. Please try again.";
    errorMessageDiv.style.color = "red";
    errorMessageDiv.style.display = "block";
    passwordInput.style.border = "2px solid red";
    confirmPasswordInput.style.border = "2px solid red";
  } else {
    errorMessageDiv.textContent = "";
    errorMessageDiv.style.display = "none";
    passwordInput.style.border = "";
    confirmPasswordInput.style.border = "";
  }
}


// Retrieves and trims all input values from the form
function getInputValues() {
  return {
    name: document.getElementById("input_name").value.trim(),
    email: document.getElementById("input_email").value.trim(),
    password: document.getElementById("input_password_sign_up").value.trim(),
    confirmPassword: document
      .getElementById("input_confirm_password_sign_up")
      .value.trim(),
  };
}


// Checks if any required field is empty
function anyFieldIsEmpty({ name, email, password, confirmPassword }) {
  return !name || !email || !password || !confirmPassword;
}


// Shows an error message if a required field is empty
function showFieldErrorMessage(message) {
  const errorMessageDiv = document.getElementById("error_message_sign_up");
  errorMessageDiv.textContent = message;
  errorMessageDiv.style.color = "red";
  errorMessageDiv.style.display = "block";
}


// Hides the error message for empty fields
function hideFieldErrorMessage() {
  const errorMessageDiv = document.getElementById("error_message_sign_up");
  errorMessageDiv.textContent = "";
  errorMessageDiv.style.display = "none";
}


// Checks if all required fields are filled and shows an error if not
function checkIfAllFieldsFilled() {
  const values = getInputValues();
  if (anyFieldIsEmpty(values)) {
    showFieldErrorMessage("Please fill in all input fields.");
    return false;
  }
  hideFieldErrorMessage();
  return true;
}


// Registers the user, checks for duplicate email, saves user, and shows success
async function registerUser(name, email, password) {
  try {
    if (await emailAlreadyExists(email)) {
      showErrorMessage("This email address is already registered.");
      const emailInput = document.getElementById("input_email");
      emailInput.value = "";
      emailInput.style.border = "2px solid red";
      hideLoadingSpinner();
      return;
    }
    const userId = await generateUserId();
    const newUser = createUserObject(name, email, password);
    await saveUserToDatabase(userId, newUser);
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({
        userId,
        name: newUser.name,
        email: newUser.email,
      })
    );
    await addUserToContacts(userId, newUser);
    showSuccessMessage();
  } catch (error) {
    document.getElementById(
      "error-message"
    ).textContent = `Error: ${error.message}`;
    hideLoadingSpinner();
  }
}


// Adds the new user to their own contacts list in the database
async function addUserToContacts(userId, user) {
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts.json`;

  const contact = {
    name: user.name,
    email: user.email,
    phone: "",
  };
  try {
    await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
    console.log("User added to their own contacts list.");
  } catch (error) {
    console.error("Error adding user to contacts:", error);
  }
}


// Generates a new unique user ID
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


// Creates a user object with all required properties
function createUserObject(name, email, password) {
  return {
    name,
    email,
    password,
    assignedTasks: { toDo: {}, inProgress: {}, awaitingFeedback: {}, done: {} },
  };
}


// Saves the user object to the database
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


// Shows the success overlay and redirects to the login page after 1 second
function showSuccessMessage() {
  const overlay = document.querySelector(".overlay");
  overlay.style.display = "flex";
  setTimeout(() => (window.location.href = "./index.html"), 1000);
}

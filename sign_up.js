document.addEventListener("DOMContentLoaded", () => {
  initForm();
});

// Initialisiert das Formular: fügt Fehlermeldung und Overlay hinzu, registriert Submit-Handler
function initForm() {
  const form = document.getElementById("sign-up-form");
  form.appendChild(createErrorMessage());
  document.body.appendChild(createOverlay());
  form.addEventListener("submit", handleFormSubmit);
}

function createErrorMessage() {
  const errorMessage = document.createElement("p");
  errorMessage.id = "error-message";
  errorMessage.style.color = "red";
  return errorMessage;
}

// Erstellt das Overlay, das nach erfolgreichem Sign-up angezeigt wird
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = "<p>User signed up successfully!</p>";
  overlay.style.display = "none";
  return overlay;
}

// Behandelt das Formular-Submit-Event: validiert und registriert den User
async function handleFormSubmit(event) {
  event.preventDefault();
  const { name, email, password, confirmPassword, privacyCheckbox } = getFormData();

  if (!validateInputs(password, confirmPassword, privacyCheckbox)) return;
  await registerUser(name, email, password);
}

function getFormData() {
  return {
    name: document.getElementById("input_name").value,
    email: document.getElementById("input_email").value,
    password: document.getElementById("input_password_sign_up").value,
    confirmPassword: document.getElementById("input_confirm_password_sign_up").value,
    privacyCheckbox: document.getElementById("privacy"),
  };
}

// Zeigt eine Fehlermeldung im dafür vorgesehenen Div an
function showErrorMessage(message) {
  const errorMessageDiv = document.getElementById("error_message_sign_up");
  errorMessageDiv.textContent = message;
  errorMessageDiv.style.display = "block";
  errorMessageDiv.style.color = "red";
}

function hideErrorMessage() {
  const errorMessageDiv = document.getElementById("error_message_sign_up");
  errorMessageDiv.textContent = "";
  errorMessageDiv.style.display = "none";
}

function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

function privacyAccepted(checkbox) {
  return checkbox.checked;
}

// Führt die Validierung der Passwörter und der Datenschutz-Checkbox durch
function validateInputs(password, confirmPassword, privacyCheckbox) {
  if (!passwordsMatch(password, confirmPassword)) {
    showErrorMessage("Your passwords don't match. Please try again.");
    return false;
  }
  if (!privacyAccepted(privacyCheckbox)) {
    showErrorMessage("You must accept the Privacy Policy.");
    return false;
  }
  hideErrorMessage();
  return true;
}

function checkIfPasswordErrorMessageNeeded() {
  const passwordInput = document.getElementById("input_password_sign_up");
  const confirmPasswordInput = document.getElementById("input_confirm_password_sign_up");
  const errorMessageDiv = document.getElementById("error_message_sign_up");
  if (passwordInput.value !== confirmPasswordInput.value) {
    errorMessageDiv.textContent = "Your passwords don't match. Please try again.";
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

function getInputValues() {
  return {
    name: document.getElementById("input_name").value.trim(),
    email: document.getElementById("input_email").value.trim(),
    password: document.getElementById("input_password_sign_up").value.trim(),
    confirmPassword: document.getElementById("input_confirm_password_sign_up").value.trim(),
  };
}

// Prüft, ob mindestens eines der Eingabefelder leer ist
function anyFieldIsEmpty({ name, email, password, confirmPassword }) {
  return !name || !email || !password || !confirmPassword;
}

// Zeigt eine allgemeine Fehlermeldung für leere Felder
function showFieldErrorMessage(message) {
  const errorMessageDiv = document.getElementById("error_message_sign_up");
  errorMessageDiv.textContent = message;
  errorMessageDiv.style.color = "red";
  errorMessageDiv.style.display = "block";
}

function hideFieldErrorMessage() {
  const errorMessageDiv = document.getElementById("error_message_sign_up");
  errorMessageDiv.textContent = "";
  errorMessageDiv.style.display = "none";
}

function checkIfAllFieldsFilled() {
  const values = getInputValues();
  if (anyFieldIsEmpty(values)) {
    showFieldErrorMessage("Please fill in all input fields.");
    return false;
  }
  hideFieldErrorMessage();
  return true;
}

// Registriert einen neuen Nutzer: erstellt ID, Objekt, speichert in DB
async function registerUser(name, email, password) {
  try {
    const userId = await generateUserId();
    const newUser = createUserObject(name, email, password);
    await saveUserToDatabase(userId, newUser);
    showSuccessMessage();
  } catch (error) {
    document.getElementById("error-message").textContent = `Error: ${error.message}`;
  }
}

// Generiert eine neue eindeutige Nutzer-ID anhand der vorhandenen Datenbankeinträge
async function generateUserId() {
  const response = await fetch(
    "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData.json"
  );
  const data = await response.json();
  const existingUserIds = Object.keys(data.users || {});
  const maxUserId = existingUserIds.length > 0
    ? Math.max(...existingUserIds.map(id => parseInt(id.replace('user', ''), 10) || 0))
    : 0;
  return `user${maxUserId + 1}`;
}

// Erstellt ein User-Objekt mit den eingegebenen Daten und leeren Task-Listen
function createUserObject(name, email, password) {
  return {
    name,
    email,
    password,
    assignedTasks: { toDo: {}, inProgress: {}, awaitingFeedback: {}, done: {} },
  };
}

// Speichert das User-Objekt in der Datenbank unter der neuen ID
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

// Zeigt das Overlay mit Erfolgsmeldung und leitet nach 1 Sekunde zur Startseite weiter
function showSuccessMessage() {
  const overlay = document.querySelector(".overlay");
  overlay.style.display = "flex";
  setTimeout(() => (window.location.href = "./index.html"), 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  initForm();
});

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

function createOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = "<p>User signed up successfully!</p>";
  overlay.style.display = "none";
  return overlay;
}

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

function validateInputs(password, confirmPassword, privacyCheckbox) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = "";

  if (password !== confirmPassword) {
    document.getElementById("input_confirm_password_sign_up").setCustomValidity("Passwords do not match!");
    document.getElementById("input_confirm_password_sign_up").reportValidity();
    return false;
  }

  if (!privacyCheckbox.checked) {
    errorMessage.textContent = "You must accept the Privacy Policy.";
    return false;
  }
  return true;
}

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

function createUserObject(name, email, password) {
  return {
    name,
    email,
    password,
    assignedTasks: { toDo: {}, inProgress: {}, awaitingFeedback: {}, done: {} },
  };
}

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

function showSuccessMessage() {
  const overlay = document.querySelector(".overlay");
  overlay.style.display = "flex";
  setTimeout(() => (window.location.href = "./index.html"), 1000);
}

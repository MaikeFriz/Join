document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("log-in-form");
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  const errorMessage = document.createElement("p");
  errorMessage.style.color = "red";
  form.appendChild(errorMessage);

  // Attach the guest login event listener to the guest button
  document.getElementById("guestButton").addEventListener("click", function(event) {
    event.preventDefault();  // Prevent form submission
    guestLogin();            // Call guestLogin when the button is clicked
  });

  // Regular form submission for login
  form.addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent form submission
    
    // Handle form submission if it's not a guest login
    handleFormSubmit(event, emailInput, passwordInput, errorMessage);
  });
});


//Functions fot guest log in


function loadGuestDataFromLocalStorage() {
  return 
}

function initializeGuestData() {
  return {
    "subtasks": {},
    "tasks": {},
    "users": {
      "user": {
        "userId": "guest",
        "assignedTasks": {},
        "name": "Guest"
      }
    }
  };
}

function saveGuestDataToLocalStorage(data) {
  localStorage.setItem("guestKanbanData", JSON.stringify(data));
}

// Function for guest login
function guestLogin() {
  console.log("Guest Log In clicked");

  // Temporarily remove "required" attributes to allow guest login
  document.getElementById("input_email").removeAttribute("required");
  document.getElementById("input_password").removeAttribute("required");

  localStorage.removeItem("loggedInUser"); // Clear any logged-in user data
  localStorage.setItem("isGuest", "true");  // Set a guest session

  data = initializeGuestData();
  saveGuestDataToLocalStorage(data);

  window.location.href = "./summary.html";
}

// Function to handle form submission for normal login
function handleFormSubmit(event, emailInput, passwordInput, errorMessage) {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!isInputValid(email, password, errorMessage)) {
    return; // Stop if input is invalid
  }

  authenticateUser(email, password, errorMessage);
}

function isUserLoggedIn() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  return loggedInUser !== null;
}

function isInputValid(email, password, errorMessage) {
  if (!email || !password) {
    errorMessage.textContent = "Email and password are required.";
    return false;
  }
  return true;
}

function authenticateUser(email, password, errorMessage) {
  fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json")
    .then((response) => response.json())
    .then((data) => handleAuthenticationResponse(data, email, password, errorMessage))
    .catch((error) => handleError(error, errorMessage));
}

function handleAuthenticationResponse(data, email, password, errorMessage) {
  const userKey = findUserKey(data, email, password);

  if (userKey) {
    storeUserInLocalStorage(data, userKey);
    window.location.href = "./summary.html";
  } else {
    errorMessage.textContent = "Invalid email or password.";
  }
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
  errorMessage.textContent = "Error logging in: " + error.message;
}

//Email validieren
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
}

async function fetchUserData() {
    const response = await fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json");
    return await response.json();
}

function checkIfUserExists(users, email) {
    return Object.values(users).some(user => user.email === email);
}

//Password updaten
/// ==========================
async function updatePassword() {
    const passwordInput = document.getElementById("password_forgot_password").value.trim();
    const confirmPasswordInput = document.getElementById("confirm_password_forgot_password").value.trim();
    const emailInput = document.getElementById("email_forgot_password").value.trim();
    const errorNewPasswordMessageDiv = document.getElementById("error_new_password_message");
    const confirmationMessageDiv = document.getElementById("confirmation_message");
    const form = document.querySelector("form");
    const backToLogInDiv = document.getElementById("lead_to_log_in_div");
    const loadingSpinner = document.getElementById("loading_spinner");
  
    errorNewPasswordMessageDiv.textContent = "";
    errorNewPasswordMessageDiv.style.color = "red";
  
    if (!passwordInput || !confirmPasswordInput) {
      errorNewPasswordMessageDiv.textContent = "Both password fields are required.";
      return;
    }
  
    if (passwordInput !== confirmPasswordInput) {
      errorNewPasswordMessageDiv.textContent = "Passwords do not match. Please try again.";
      return;
    }
      loadingSpinner.style.display = "flex";
  
    try {
      const response = await fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json");
      const users = await response.json();
  
      const userKey = Object.keys(users).find(key => users[key].email === emailInput);
  
      if (userKey) {
        users[userKey].password = passwordInput;
  
        await fetch(`https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userKey}.json`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(users[userKey])
        });
  
        form.style.display = "none";
        backToLogInDiv.style.display = "block";
        confirmationMessageDiv.textContent = "Password updated successfully! You can now log in with your new password.";
        confirmationMessageDiv.style.color = "green";
      } else {
        errorNewPasswordMessageDiv.textContent = "User not found. Please try again.";
      }
    } catch (error) {
      console.error("Error updating password:", error);
      errorNewPasswordMessageDiv.textContent = "An error occurred while updating the password. Please try again later.";
    } finally {
      loadingSpinner.style.display = "none";
    }
  }

function getInputValue(elementId) {
    return document.getElementById(elementId).value.trim();
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

async function fetchUserData() {
    const response = await fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users.json");
    return await response.json();
}

function findUserKeyByEmail(users, email) {
    return Object.keys(users).find(key => users[key].email === email);
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

//Back to Login button
// ==========================
function redirectToLogin() {
    window.location.href = "./log_in.html";
  }

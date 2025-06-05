/**
 * Checks if both passwords match.
 * @param {string} password - The password value.
 * @param {string} confirmPassword - The confirm password value.
 * @returns {boolean} True if passwords match, otherwise false.
 */
function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

/**
 * Validates the password fields and privacy checkbox, shows an error if invalid.
 * @param {string} password - The password value.
 * @param {string} confirmPassword - The confirm password value.
 * @param {HTMLInputElement} privacyCheckbox - The privacy checkbox element.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateInputs(password, confirmPassword, privacyCheckbox) {
  if (!passwordsMatch(password, confirmPassword)) {
    showErrorMessage("Your passwords don't match. Please try again.");
    document.getElementById("input_password_sign_up").value = "";
    document.getElementById("input_confirm_password_sign_up").value = "";
    document.getElementById("input_password_sign_up").focus();
    return false;
  }
  if (!privacyCheckbox.checked) {
    showErrorMessage("You must accept the Privacy Policy to sign up.");
    document.getElementById("privacy").focus();
    return false;
  }
  hideErrorMessage();
  return true;
}

/**
 * Checks if all required fields are filled and shows an error if not.
 * @returns {boolean} True if all fields are filled, otherwise false.
 */
function checkIfAllFieldsFilled() {
  const values = getInputValues();
  if (anyFieldIsEmpty(values)) {
    showFieldErrorMessage("Please fill in all input fields.");
    return false;
  }
  hideFieldErrorMessage();
  return true;
}

/**
 * Checks if any required field is empty.
 * @param {Object} fields - Object containing form field values.
 * @returns {boolean} True if any field is empty, otherwise false.
 */
function anyFieldIsEmpty({ name, email, password, confirmPassword }) {
  return !name || !email || !password || !confirmPassword;
}

/**
 * Checks if the password and confirm password fields match and updates UI accordingly.
 */
function checkPasswordMatch() {
  const pw1 = document.getElementById('input_password_sign_up');
  const pw2 = document.getElementById('input_confirm_password_sign_up');
  const errorSpan = pw2.closest('.input_wrapper').querySelector('.confirm-password-input-error');
  if (pw2.value && pw1.value !== pw2.value) {
    pw2.setCustomValidity("Passwords do not match");
    errorSpan.style.visibility = "visible";
  } else {
    pw2.setCustomValidity("");
    errorSpan.style.visibility = "hidden";
  }
}

/**
 * Validates the email format using a regex.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if the email format is valid, otherwise false.
 */
function isEmailFormatValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates login input fields and shows errors if invalid.
 * @param {string} email - The email value.
 * @param {string} password - The password value.
 * @returns {boolean} True if input is valid, otherwise false.
 */
function isInputValid(email, password) {
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  const errorMessage = document.getElementById("login-error-message");
  clearInputStyles(emailInput, passwordInput, errorMessage);

  if (!areCredentialsFilled(email, password, emailInput, passwordInput, errorMessage)) {
    return false;
  }
  if (!isEmailFormatValidAndShowError(email, emailInput, passwordInput, errorMessage)) {
    return false;
  }
  return true;
}

/**
 * Checks if email and password are filled, shows error if not.
 * @param {string} email - The email value.
 * @param {string} password - The password value.
 * @param {HTMLInputElement} emailInput - The email input element.
 * @param {HTMLInputElement} passwordInput - The password input element.
 * @param {HTMLElement} errorMessage - The error message element.
 * @returns {boolean} True if credentials are filled, otherwise false.
 */
function areCredentialsFilled(email, password, emailInput, passwordInput, errorMessage) {
  if (!email || !password) {
    showError(
      emailInput,
      passwordInput,
      errorMessage,
      "Wrong email or password."
    );
    return false;
  }
  return true;
}

/**
 * Checks if email format is valid, shows error if not.
 * @param {string} email - The email value.
 * @param {HTMLInputElement} emailInput - The email input element.
 * @param {HTMLInputElement} passwordInput - The password input element.
 * @param {HTMLElement} errorMessage - The error message element.
 * @returns {boolean} True if email format is valid, otherwise false.
 */
function isEmailFormatValidAndShowError(email, emailInput, passwordInput, errorMessage) {
  if (!isEmailFormatValid(email)) {
    showError(
      emailInput,
      passwordInput,
      errorMessage,
      "Wrong email or password."
    );
    return false;
  }
  return true;
}
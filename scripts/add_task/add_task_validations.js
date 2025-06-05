/**
 * Validates the entire task form before submission.
 * @returns {boolean} True if all fields are valid, otherwise false.
 */
function validateTaskForm() {
  const titleValid = validateTitleField();
  const dateValid = validateDateField();
  const categoryValid = validateCategoryField();
  return titleValid && dateValid && categoryValid;
}

/**
 * Validates the title input field.
 * @returns {boolean} True if the title is valid, otherwise false.
 */
function validateTitleField() {
  const titleInput = document.getElementById("input_title");
  const errorTitle = document.getElementById("error_message_title");
  resetTitleInputError();
  if (!titleInput.value.trim()) {
    titleInput.style.border = "1px solid red";
    errorTitle
      .querySelector("span")
      .classList.remove("d_none_error_message_title");
    return false;
  }
  return true;
}

/**
 * Validates the due date input field.
 * @returns {boolean} True if the date is valid, otherwise false.
 */
function validateDateField() {
  const dateInput = document.querySelector('input[type="date"]');
  const errorDate = document.getElementById("error_message_date");
  resetDateInputError();
  if (!dateInput.value || isDateInPast(dateInput.value)) {
    dateInput.style.border = "1px solid red";
    errorDate
      .querySelector("span")
      .classList.remove("d_none_error_message_date");
    return false;
  }
  return true;
}

/**
 * Validates the category input field.
 * @returns {boolean} True if the category is valid, otherwise false.
 */
function validateCategoryField() {
  const categoryInput = document.getElementById("category");
  const errorCategory = document.getElementById("error_message_category");
  const dropdownCategory = document.getElementById("dropdown_category");
  resetCategoryInputError();
  if (!categoryInput.value) {
    dropdownCategory.style.border = "1px solid red";
    errorCategory
      .querySelector("span")
      .classList.remove("d_none_error_message_category");
    return false;
  }
  return true;
}

/**
 * Resets the error state for the title input.
 */
function resetTitleInputError() {
  const titleInput = document.getElementById("input_title");
  const errorTitle = document.getElementById("error_message_title");
  if (titleInput && errorTitle) {
    titleInput.style.border = "";
    errorTitle
      .querySelector("span")
      .classList.add("d_none_error_message_title");
  }
}

/**
 * Resets the error state for the date input.
 */
function resetDateInputError() {
  const dateInput = document.querySelector('input[type="date"]');
  const errorDate = document.getElementById("error_message_date");
  if (dateInput && errorDate) {
    dateInput.style.border = "";
    errorDate.querySelector("span").classList.add("d_none_error_message_date");
  }
}

/**
 * Resets the error state for the category input.
 */
function resetCategoryInputError() {
  const dropdownCategory = document.getElementById("dropdown_category");
  const errorCategory = document.getElementById("error_message_category");
  if (dropdownCategory && errorCategory) {
    dropdownCategory.style.border = "";
    errorCategory
      .querySelector("span")
      .classList.add("d_none_error_message_category");
  }
}

/**
 * Checks if a given date is in the past.
 * @param {string} dateString - The date string to check.
 * @returns {boolean} True if the date is in the past, otherwise false.
 */
function isDateInPast(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(dateString);
  return selectedDate < today;
}

/**
 * Resets all error messages in the form.
 */
function resetAllErrorMessages() {
  resetTitleInputError();
  resetDateInputError();
  resetCategoryInputError();
}
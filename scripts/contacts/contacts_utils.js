/**
 * Fetches all contacts for a logged-in user from Firebase.
 * @param {string} userId - The user ID.
 * @returns {Promise<Object>} A promise that resolves to the contacts object.
 */
function fetchContactsList(userId) {
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts.json`;
  return fetch(BASE_URL).then((response) => response.json());
}

/**
 * Fetches all contacts for a guest user from localStorage.
 * @returns {Object} The guest contacts object.
 */
function fetchGuestContactsList() {
  const guestKanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
  return guestKanbanData?.users?.guest?.contacts || {};
}

/**
 * Fetches a single contact for a logged-in user from Firebase.
 * @param {string} userId - The user ID.
 * @param {string} contactId - The contact ID.
 * @returns {Promise<Object>} A promise that resolves to the contact object.
 */
function fetchContactById(userId, contactId) {
  const url = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contactId}.json`;
  return fetch(url).then((response) => response.json());
}

/**
 * Fetches a single contact for a guest user from localStorage.
 * @param {string} contactId - The contact ID.
 * @returns {Object|null} The guest contact object or null if not found.
 */
function fetchGuestContactById(contactId) {
  const guestKanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
  const contacts = guestKanbanData?.users?.guest?.contacts || {};
  return contacts[contactId];
}

/**
 * Returns initials and CSS class for a contact name.
 * @param {string} name - The contact's name.
 * @returns {Object} An object with initials and initialClass properties.
 */
function getInitialsAndClass(name) {
  if (!name || typeof name !== "string" || !name.trim()) {
    return { initials: "", initialClass: "" };
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  let initialClass = "";
  if (initials.length === 0) {
    initialClass = "";
  } else if (/^\d$/.test(initials[0])) {
    initialClass = "number";
  } else {
    initialClass = initials[0].toLowerCase();
  }
  return { initials, initialClass };
}

/**
 * Removes the currently displayed contact details from the UI.
 */
function removeExistingContactDetails() {
  const contactDetailsDiv = document.querySelector(".contact-details");
  if (contactDetailsDiv) contactDetailsDiv.remove();
}

/**
 * Highlights the selected contact in the contact list.
 * @param {string} contactId - The contact ID to highlight.
 */
function highlightSelectedContact(contactId) {
  const contactItems = document.querySelectorAll(".contacts-list ul li");
  contactItems.forEach((item) => item.classList.remove("contact-highlight"));
  const selectedContact = document.querySelector(
    `.contacts-list ul li[data-contact-id="${contactId}"]`
  );
  if (selectedContact) selectedContact.classList.add("contact-highlight");
}

/**
 * Activates the overlay with a short delay.
 */
function activateOverlay() {
  setTimeout(() => {
    const overlay = document.querySelector('.contact-overlay');
    if (overlay) overlay.classList.add('active');
  }, 30);
}

/**
 * Sets up the button state handler to enable/disable the save button based on form validity.
 * @param {HTMLFormElement} form - The form element.
 * @param {HTMLElement} saveBtn - The save button element.
 */
function setupButtonStateHandler(form, saveBtn) {
  function updateButtonState() {
    if (!form.checkValidity()) {
      saveBtn.setAttribute('aria-disabled', 'true');
      saveBtn.disabled = true;
    } else {
      saveBtn.removeAttribute('aria-disabled');
      saveBtn.disabled = false;
    }
  }
  updateButtonState();
  form.addEventListener("input", updateButtonState);
}

/**
 * Sets up the form submission handler to validate and call the onSubmit function.
 * @param {HTMLFormElement} form - The form element.
 * @param {Function} onSubmit - The function to call on valid submit.
 */
function setupFormSubmitHandler(form, onSubmit) {
  form.addEventListener("submit", function (event) {
    if (!form.checkValidity()) {
      event.preventDefault();
      form.querySelectorAll("input").forEach(input => {
        input.dispatchEvent(new Event("input"));
      });
      return false;
    }
    onSubmit();
    event.preventDefault();
  });
}

/**
 * Sets up event listeners for the close buttons to close the overlay.
 * @param {Function} closeOverlayFn - The function to call to close the overlay.
 */
function setupCloseHandlers(closeOverlayFn) {
  document.querySelector(".close-btn").addEventListener("click", closeOverlayFn);
  document.querySelector(".button_cancel").addEventListener("click", closeOverlayFn);
}

/**
 * Renders the input fields for the contact form if not already rendered.
 * @param {string} inputFieldsId - The ID of the container for input fields.
 * @param {Function} inputFieldsTemplate - The function that returns the HTML template for input fields.
 */
function renderInputFields(inputFieldsId, inputFieldsTemplate) {
  if (inputFieldsId && inputFieldsTemplate) {
    const container = document.getElementById(inputFieldsId);
    if (container && container.children.length === 0) {
      container.innerHTML = inputFieldsTemplate();
    }
  }
}

/**
 * Initializes the contact form setup with validation, event listeners, and rendering input fields.
 * @param {Object} options - The setup options.
 * @param {string} options.formId - The form element ID.
 * @param {string} options.saveBtnId - The save button element ID.
 * @param {Function} options.onSubmit - The function to call on valid submit.
 * @param {Function} options.closeOverlayFn - The function to call to close the overlay.
 * @param {string} options.inputFieldsId - The ID of the container for input fields.
 * @param {Function} options.inputFieldsTemplate - The function that returns the HTML template for input fields.
 */
function setupContactForm({
  formId,
  saveBtnId,
  onSubmit,
  closeOverlayFn,
  inputFieldsId,
  inputFieldsTemplate
}) {
  activateOverlay();

  const form = document.getElementById(formId);
  const saveBtn = document.getElementById(saveBtnId);

  setupButtonStateHandler(form, saveBtn);
  setupFormSubmitHandler(form, onSubmit);
  setupCloseHandlers(closeOverlayFn);
  renderInputFields(inputFieldsId, inputFieldsTemplate);
}
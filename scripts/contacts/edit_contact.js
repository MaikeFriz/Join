/**
 * Returns the contactId from the URL parameters.
 * @returns {string|null} The contact ID from the URL or null if not found.
 */
function getContactIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("contactId");
}

/**
 * Fetches a guest contact by its ID from localStorage.
 * @param {string} contactId - The contact ID.
 * @returns {Object|null} The guest contact object or null if not found.
 */
function fetchGuestContactById(contactId) {
  const guestKanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
  return guestKanbanData?.users?.guest?.contacts?.[contactId] || null;
}

/**
 * Updates a guest contact in localStorage and notifies the parent window.
 * @param {Object} contact - The contact object to update.
 * @param {string} contactId - The contact ID.
 */
function updateGuestContact(contact, contactId) {
  contact.name = document.getElementById("input_name").value;
  contact.email = document.querySelector("input[type='email']").value;
  contact.phone = document.querySelector("input[type='tel']").value;
  const guestKanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
  guestKanbanData.users.guest.contacts[contactId] = contact;
  localStorage.setItem("guestKanbanData", JSON.stringify(guestKanbanData));
  window.parent.postMessage({ type: "editContact", contact: { ...contact, id: contactId } }, "*");
}

/**
 * Updates a user contact in the remote database and notifies the parent window.
 * @param {string} userId - The user ID.
 * @param {string} contactId - The contact ID.
 */
function updateUserContact(userId, contactId) {
  const contact = getContactFormData(contactId);
  saveUserContactToDatabase(userId, contactId, contact)
    .then(() => {
      window.parent.postMessage({ type: "editContact", contact: contact }, "*");
    })
    .catch(() => {});
}

/**
 * Retrieves contact data from the form fields.
 * @param {string} contactId - The contact ID.
 * @returns {Object} The contact data object.
 */
function getContactFormData(contactId) {
  return {
    id: contactId,
    name: document.getElementById("input_name").value,
    email: document.querySelector("input[type='email']").value,
    phone: document.querySelector("input[type='tel']").value,
  };
}

/**
 * Saves the user contact to the remote database.
 * @param {string} userId - The user ID.
 * @param {string} contactId - The contact ID.
 * @param {Object} contact - The contact object to save.
 * @returns {Promise<Object>} A promise that resolves with the saved contact data.
 */
function saveUserContactToDatabase(userId, contactId, contact) {
  const url = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contactId}.json`;
  return fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  }).then((response) => {
    if (!response.ok) throw new Error("Failed to save contact changes.");
    return response.json();
  });
}

/**
 * Sets the profile initials and class for the initials badge.
 * @param {string} name - The contact's name.
 */
function setProfileInitials(name) {
  const { initials, initialClass } = getInitialsAndClass(name);
  const profileInitials = document.getElementById("profileInitials");
  if (profileInitials) {
    profileInitials.textContent = initials;
    profileInitials.className = "contact-initials " + initialClass;
  }
}

/**
 * Set fields if contact data is available.
 * @param {Object} contact - The contact object.
 */
function fillEditContactFormFields(contact) {
  if (contact) {
    document.getElementById("input_name").value = contact.name;
    document.querySelector("input[type='email']").value = contact.email;
    document.querySelector("input[type='tel']").value = contact.phone;
    setProfileInitials(contact.name);
  }
}

/**
 * Initializes the edit contact form: sets up handlers, fills fields, and sets up live initials update.
 */
function initEditContactForm() {
  setupEditContactForm();
  fillEditContactFormFieldsFromSource();
  setupLiveInitialsUpdate();
}

/**
 * Sets up the edit contact form with handlers and templates.
 */
function setupEditContactForm() {
  setupContactForm({
    formId: "editContactForm",
    saveBtnId: "saveBtn",
    onSubmit: handleEditContactSubmit,
    closeOverlayFn: closeEditContactOverlay,
    inputFieldsId: "edit_contact_input_fields",
    inputFieldsTemplate: contactInputFieldsTemplate
  });
}

/**
 * Handles the submit logic for editing a contact (guest or user).
 */
function handleEditContactSubmit() {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  const contactId = getContactIdFromUrl();
  if (isGuest) {
    const contact = fetchGuestContactById(contactId);
    updateGuestContact(contact, contactId);
  } else {
    const userId = JSON.parse(localStorage.getItem("loggedInUser")).userId;
    updateUserContact(userId, contactId);
  }
}

/**
 * Fills the edit contact form fields with data from the correct source (guest or user).
 */
function fillEditContactFormFieldsFromSource() {
  const contactId = getContactIdFromUrl();
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  if (isGuest) {
    const contact = fetchGuestContactById(contactId);
    fillEditContactFormFields(contact);
  } else {
    const userId = JSON.parse(localStorage.getItem("loggedInUser")).userId;
    fetchContactById(userId, contactId).then((contact) => fillEditContactFormFields(contact));
  }
}

/**
 * Sets up live update of initials when the name input changes.
 */
function setupLiveInitialsUpdate() {
  const nameInput = document.getElementById("input_name");
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      setProfileInitials(e.target.value);
    });
  }
}

document.addEventListener("DOMContentLoaded", initEditContactForm);

/**
 * Adds event listeners to close the overlay.
 */
function addCloseListeners() {
  document.querySelector(".close-btn").addEventListener("click", closeEditContactOverlay);
  document.querySelector(".button_cancel").addEventListener("click", closeEditContactOverlay);
}

/**
 * Renders the edit contact input fields and fills them with contact data.
 * @param {Object} contact - The contact object.
 */
function renderEditContactFields(contact) {
  document.getElementById('edit_contact_input_fields').innerHTML = contactInputFieldsTemplate();
  document.getElementById("input_name").value = contact.name;
  document.querySelector("input[type='email']").value = contact.email;
  document.querySelector("input[type='tel']").value = contact.phone;
  setProfileInitials(contact.name);
}

/**
 * Initializes validation and button state for the edit contact form.
 */
function initEditContactValidation() {
  const form = document.getElementById("editContactForm");
  const saveBtn = document.getElementById("saveBtn");
  const nameInput = document.getElementById("input_name");

  function updateButtonState() {
    if (!form.checkValidity()) {
      saveBtn.setAttribute('aria-disabled', 'true');
    } else {
      saveBtn.removeAttribute('aria-disabled');
    }
  }

  updateButtonState();
  form.addEventListener("input", updateButtonState);
  nameInput.addEventListener('input', (e) => {
    setProfileInitials(e.target.value);
  });
}
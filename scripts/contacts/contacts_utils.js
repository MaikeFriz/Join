// Fetches all contacts for a logged-in user from Firebase.
function fetchContactsList(userId) {
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts.json`;
  return fetch(BASE_URL).then((response) => response.json());
}

// Fetches all contacts for a guest user from localStorage.
function fetchGuestContactsList() {
  const guestKanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
  return guestKanbanData?.users?.guest?.contacts || {};
}

// Fetches a single contact for a logged-in user from Firebase.
function fetchContactById(userId, contactId) {
  const url = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contactId}.json`;
  return fetch(url).then((response) => response.json());
}

// Fetches a single contact for a guest user from localStorage.
function fetchGuestContactById(contactId) {
  const guestKanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
  const contacts = guestKanbanData?.users?.guest?.contacts || {};
  return contacts[contactId];
}

// Returns initials and CSS class for a contact name.
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

// Removes the currently displayed contact details from the UI.
function removeExistingContactDetails() {
  const contactDetailsDiv = document.querySelector(".contact-details");
  if (contactDetailsDiv) contactDetailsDiv.remove();
}

// Highlights the selected contact in the contact list.
function highlightSelectedContact(contactId) {
  const contactItems = document.querySelectorAll(".contacts-list ul li");
  contactItems.forEach((item) => item.classList.remove("contact-highlight"));
  const selectedContact = document.querySelector(
    `.contacts-list ul li[data-contact-id="${contactId}"]`
  );
  if (selectedContact) selectedContact.classList.add("contact-highlight");
}

// Activates the overlay with a short delay.
function activateOverlay() {
  setTimeout(() => {
    const overlay = document.querySelector('.contact-overlay');
    if (overlay) overlay.classList.add('active');
  }, 30);
}

// Sets up the button state handler to enable/disable the save button based on form validity.
function setupButtonStateHandler(form, saveBtn) {
  function updateButtonState() {
    if (!form.checkValidity()) {
      saveBtn.setAttribute('aria-disabled', 'true');
    } else {
      saveBtn.removeAttribute('aria-disabled');
    }
  }
  form.addEventListener("input", updateButtonState);
  updateButtonState();
}

// Sets up the form submission handler to validate and call the onSubmit function.
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

// Sets up event listeners for the close buttons to close the overlay.
function setupCloseHandlers(closeOverlayFn) {
  document.querySelector(".close-btn").addEventListener("click", closeOverlayFn);
  document.querySelector(".button_cancel").addEventListener("click", closeOverlayFn);
}

// Renders the input fields for the contact form if not already rendered.
function renderInputFields(inputFieldsId, inputFieldsTemplate) {
  if (inputFieldsId && inputFieldsTemplate) {
    const container = document.getElementById(inputFieldsId);
    if (container && container.children.length === 0) {
      container.innerHTML = inputFieldsTemplate();
    }
  }
}

// Initializes the contact form setup with validation, event listeners, and rendering input fields.
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
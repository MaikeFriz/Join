// Returns the contactId from the URL parameters.
function getContactIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("contactId");
}

// Fetches a guest contact by its ID from localStorage.
function fetchGuestContactById(contactId) {
  const guestKanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
  return guestKanbanData?.users?.guest?.contacts?.[contactId] || null;
}

// Updates a guest contact in localStorage and notifies the parent window.
function updateGuestContact(contact, contactId) {
  contact.name = document.getElementById("input_name").value;
  contact.email = document.querySelector("input[type='email']").value;
  contact.phone = document.querySelector("input[type='tel']").value;
  const guestKanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
  guestKanbanData.users.guest.contacts[contactId] = contact;
  localStorage.setItem("guestKanbanData", JSON.stringify(guestKanbanData));
  window.parent.postMessage({ type: "editContact", contact: { ...contact, id: contactId } }, "*");
}

// Updates a user contact in the remote database and notifies the parent window.
function updateUserContact(userId, contactId) {
  const contact = {
    id: contactId,
    name: document.getElementById("input_name").value,
    email: document.querySelector("input[type='email']").value,
    phone: document.querySelector("input[type='tel']").value,
  };
  const url = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contactId}.json`;
  fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to save contact changes.");
      return response.json();
    })
    .then(() => {
      window.parent.postMessage({ type: "editContact", contact: contact }, "*");
    })
    .catch(() => {});
}

// Sets the profile initials and class for the initials badge.
function setProfileInitials(name) {
  const { initials, initialClass } = getInitialsAndClass(name);
  const profileInitials = document.getElementById("profileInitials");
  if (profileInitials) {
    profileInitials.textContent = initials;
    profileInitials.className = "contact-initials " + initialClass;
  }
}

// Set fields if contact data is available.
function fillEditContactFormFields(contact) {
  if (contact) {
    document.getElementById("input_name").value = contact.name;
    document.querySelector("input[type='email']").value = contact.email;
    document.querySelector("input[type='tel']").value = contact.phone;
    setProfileInitials(contact.name);
  }
}

// Initializes the edit contact form: sets up validation, events, and fills fields.
function initEditContactForm() {
  setupContactForm({
    formId: "editContactForm",
    saveBtnId: "saveBtn",
    onSubmit: function() {
      const isGuest = JSON.parse(localStorage.getItem("isGuest"));
      const contactId = getContactIdFromUrl();
      if (isGuest) {
        const contact = fetchGuestContactById(contactId);
        updateGuestContact(contact, contactId);
      } else {
        const userId = JSON.parse(localStorage.getItem("loggedInUser")).userId;
        updateUserContact(userId, contactId);
      }
    },
    closeOverlayFn: closeEditContactOverlay,
    inputFieldsId: "edit_contact_input_fields",
    inputFieldsTemplate: contactInputFieldsTemplate
  });

  // After rendering the fields, fill them with contact data
  const contactId = getContactIdFromUrl();
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  if (isGuest) {
    const contact = fetchGuestContactById(contactId);
    fillEditContactFormFields(contact);
  } else {
    const userId = JSON.parse(localStorage.getItem("loggedInUser")).userId;
    fetchContactById(userId, contactId).then((contact) => fillEditContactFormFields(contact));
  }

  // Live update initials when name input changes
  const nameInput = document.getElementById("input_name");
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      setProfileInitials(e.target.value);
    });
  }
}

document.addEventListener("DOMContentLoaded", initEditContactForm);

// Adds event listeners to close the overlay.
function addCloseListeners() {
  document.querySelector(".close-btn").addEventListener("click", closeEditContactOverlay);
  document.querySelector(".button_cancel").addEventListener("click", closeEditContactOverlay);
}

// Renders the edit contact input fields and fills them with contact data.
function renderEditContactFields(contact) {
  document.getElementById('edit_contact_input_fields').innerHTML = contactInputFieldsTemplate();
  document.getElementById("input_name").value = contact.name;
  document.querySelector("input[type='email']").value = contact.email;
  document.querySelector("input[type='tel']").value = contact.phone;
  setProfileInitials(contact.name);
}

// Initializes validation and button state for the edit contact form.
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

  // Live update initials when name input changes
  nameInput.addEventListener('input', (e) => {
    setProfileInitials(e.target.value);
  });
}
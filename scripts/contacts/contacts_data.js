/**
 * Adds a new contact for either guest or logged-in user.
 * @param {Object} contact - The contact object to add.
 */
function addContact(contact) {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  if (isGuest) {
    addGuestContact(contact);
    return;
  }
  addUserContact(contact);
}

/**
 * Adds a new contact to guest data in localStorage.
 * @param {Object} contact - The contact object to add.
 */
function addGuestContact(contact) {
  let guestKanbanData = getGuestKanbanData();
  const contactId = Date.now().toString();
  guestKanbanData.users.guest.contacts[contactId] = {
    ...contact,
    id: contactId,
  };
  localStorage.setItem("guestKanbanData", JSON.stringify(guestKanbanData));
  renderContacts();
  displayContactDetails(contactId);
}

/**
 * Retrieves guest kanban data from localStorage or returns a default object.
 * @returns {Object} The guest kanban data object.
 */
function getGuestKanbanData() {
  return (
    JSON.parse(localStorage.getItem("guestKanbanData")) || {
      users: { guest: { contacts: {} } },
    }
  );
}

/**
 * Adds a new contact to the logged-in user's Firebase data.
 * @param {Object} contact - The contact object to add.
 */
function addUserContact(contact) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || !loggedInUser.userId) return;
  const userId = loggedInUser.userId;
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts.json`;
  postContact(BASE_URL, contact);
}

/**
 * Sends a POST request to add a contact to Firebase.
 * @param {string} BASE_URL - The Firebase URL.
 * @param {Object} contact - The contact object to add.
 */
function postContact(BASE_URL, contact) {
  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  })
    .then((response) => response.json())
    .then((data) => handleContactAdded(data))
    .catch((error) => {});
}

/**
 * Handles UI updates after a contact is added.
 * @param {Object} data - The response data from Firebase.
 */
function handleContactAdded(data) {
  renderContacts();
  if (data && data.name) {
    displayContactDetails(data.name);
  }
}

/**
 * Updates an existing contact for the logged-in user.
 * @param {Object} contact - The contact object to update.
 */
function updateContact(contact) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || !loggedInUser.userId) return;
  const userId = loggedInUser.userId;
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contact.id}.json`;
  putContact(BASE_URL, contact);
}

/**
 * Sends a PUT request to update a contact in Firebase.
 * @param {string} BASE_URL - The Firebase URL.
 * @param {Object} contact - The contact object to update.
 */
function putContact(BASE_URL, contact) {
  fetch(BASE_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to update contact.");
      return response.json();
    })
    .then(() => {
      renderContacts();
      displayContactDetails(contact.id);
    })
    .catch(() => {});
}

/**
 * Deletes a contact for the logged-in user from Firebase.
 * @param {string} contactId - The ID of the contact to delete.
 */
function deleteContact(contactId) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || !loggedInUser.userId) {
    return;
  }
  const userId = loggedInUser.userId;
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contactId}.json`;
  fetch(BASE_URL, {
    method: "DELETE",
  })
    .then(() => {
      renderContacts();
      const detailsDiv = document.querySelector(".contact-details");
      if (detailsDiv && detailsDiv.querySelector("#delete-contact-button")) {
        detailsDiv.remove();
      }
    })
    .catch((error) => {});
}

/**
 * Deletes a contact from the guest user's localStorage data.
 * @param {string} contactId - The ID of the contact to delete.
 */
function deleteGuestContact(contactId) {
  const guestKanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
  if (
    guestKanbanData &&
    guestKanbanData.users &&
    guestKanbanData.users.guest &&
    guestKanbanData.users.guest.contacts
  ) {
    delete guestKanbanData.users.guest.contacts[contactId];
    localStorage.setItem("guestKanbanData", JSON.stringify(guestKanbanData));
    renderContacts();
    // Optionally clear details if the deleted contact was open
    const detailsDiv = document.querySelector(".contact-details");
    if (detailsDiv && detailsDiv.querySelector("#delete-contact-button")) {
      detailsDiv.remove();
    }
  }
}

/**
 * Fetches and displays user contact details from Firebase.
 * @param {string} contactId - The ID of the contact to display.
 */
function displayUserContactDetails(contactId) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || !loggedInUser.userId) return;
  const userId = loggedInUser.userId;
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contactId}.json`;
  fetch(BASE_URL)
    .then((response) => response.json())
    .then((contact) => handleUserContactDetails(contact, contactId))
    .catch(() => {});
}

/**
 * Handles rendering and listeners for user contact details.
 * @param {Object} contact - The contact object.
 * @param {string} contactId - The contact ID.
 */
function handleUserContactDetails(contact, contactId) {
  removeExistingContactDetails();
  const { initials, initialClass } = getInitialsAndClass(contact.name);
  const newDiv = createContactDetailsDiv(contact, initials, initialClass);
  renderContactDetailsDiv(newDiv);
  addUserContactDetailListeners(contactId);
  highlightSelectedContact(contactId);

  if (window.innerWidth <= 980) {
    showActionButton(contactId);
  } else {
    showAddButton();
  }
}

/**
 * Adds event listeners for editing and deleting a guest contact.
 * @param {string} contactId - The contact ID.
 */
function addGuestContactDetailListeners(contactId) {
  document
    .getElementById("edit-contact-button")
    .addEventListener("click", () =>
      openOverlay(`./edit_contact.html?contactId=${contactId}`)
    );
  document
    .getElementById("delete-contact-button")
    .addEventListener("click", () => deleteGuestContact(contactId));
}

/**
 * Adds event listeners for editing and deleting a user contact.
 * @param {string} contactId - The contact ID.
 */
function addUserContactDetailListeners(contactId) {
  document
    .getElementById("edit-contact-button")
    .addEventListener("click", () =>
      openOverlay(`./edit_contact.html?contactId=${contactId}`)
    );
  document
    .getElementById("delete-contact-button")
    .addEventListener("click", () => deleteContact(contactId));
}

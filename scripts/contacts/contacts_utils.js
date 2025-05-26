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
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  let initialClass;
  if (/^\d$/.test(initials[0])) {
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
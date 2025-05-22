// Initializes the edit contact process on DOMContentLoaded.
document.addEventListener("DOMContentLoaded", initEditContact);

// Determines user type and starts the appropriate edit process.
function initEditContact() {
  const contactId = getContactIdFromUrl();
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  if (isGuest) {
    handleGuestEdit(contactId);
    return;
  }
  handleUserEdit(contactId);
}

// Extracts the contactId from the URL parameters.
function getContactIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("contactId");
}

// Handles editing a contact for a guest user.
function handleGuestEdit(contactId) {
  let guestKanbanData = getGuestKanbanData();
  let contact = guestKanbanData?.users?.guest?.contacts?.[contactId];
  if (contact) fillForm(contact);
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    updateGuestContact(contact, contactId, guestKanbanData);
  });
  addCloseListeners();
}

// Retrieves guest kanban data from localStorage or returns a default object.
function getGuestKanbanData() {
  return JSON.parse(localStorage.getItem("guestKanbanData")) || { users: { guest: { contacts: {} } } };
}

// Fills the edit form with the contact's data.
function fillForm(contact) {
  document.getElementById("input_name").value = contact.name;
  document.querySelector("input[type='email']").value = contact.email;
  document.querySelector("input[type='tel']").value = contact.phone;
  setProfileInitials(contact.name);
}

// Sets the profile initials in the UI.
function setProfileInitials(name) {
  const initials = getInitials(name);
  const profileInitials = document.getElementById("profileInitials");
  if (profileInitials) {
    profileInitials.textContent = initials;
    profileInitials.className = "contact-initials " + initials[0].toLowerCase();
  }
}

// Updates a guest contact in localStorage and notifies the parent window.
function updateGuestContact(contact, contactId, guestKanbanData) {
  contact.name = document.getElementById("input_name").value;
  contact.email = document.querySelector("input[type='email']").value;
  contact.phone = document.querySelector("input[type='tel']").value;
  guestKanbanData.users.guest.contacts[contactId] = contact;
  localStorage.setItem("guestKanbanData", JSON.stringify(guestKanbanData));
  window.parent.postMessage({ type: "editContact", contact: { ...contact, id: contactId } }, "*");
}

// Adds event listeners to close the overlay.
function addCloseListeners() {
  document.querySelector(".close-btn").addEventListener("click", closeEditContactOverlay);
  document.querySelector(".button_cancel").addEventListener("click", closeEditContactOverlay);
}

// Sends a message to the parent window to close the overlay.
function closeEditContactOverlay() {
  const overlay = document.querySelector('.contact-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => {
      window.parent.postMessage({ type: "closeOverlay" }, "*");
    }, 300); // 300ms wie in deiner CSS-Transition
  } else {
    window.parent.postMessage({ type: "closeOverlay" }, "*");
  }
}

// Handles editing a contact for a logged-in user.
function handleUserEdit(contactId) {
  const userId = JSON.parse(localStorage.getItem("loggedInUser")).userId;
  fetchContact(userId, contactId).then((contact) => fillForm(contact));
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    updateUserContact(userId, contactId);
  });
  addCloseListeners();
}

// Fetches a contact from Firebase for a logged-in user.
function fetchContact(userId, contactId) {
  const url = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contactId}.json`;
  return fetch(url).then((response) => response.json());
}

// Updates a contact in Firebase and notifies the parent window.
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

// Returns the initials from a contact's name.
function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const overlay = document.querySelector('.contact-overlay');
    if (overlay) overlay.classList.add('active');
  }, 30);
});

window.addEventListener("message", function(event) {
  if (event.data.type === "startCloseAnimation") {
    closeEditContactOverlay();
  }
});

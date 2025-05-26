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

// Retrieves a guest contact by its ID from localStorage.
function getGuestContactById(contactId) {
  const guestKanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
  const contacts = guestKanbanData?.users?.guest?.contacts || {};
  return contacts[contactId];
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
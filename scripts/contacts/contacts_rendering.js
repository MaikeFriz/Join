
// Renders the contact list for guest or logged-in user.
function renderContacts() {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  const contactsList = document.querySelector(".contacts-list ul");
  contactsList.innerHTML = "";
  if (isGuest) {
    const contacts = getGuestContacts();
    renderContactsList(contactsList, contacts, true);
    return;
  }
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || !loggedInUser.userId) return;
  fetchContactsFromServer(loggedInUser.userId)
    .then((contacts) => renderContactsList(contactsList, contacts, false))
    .catch(() => {});
}

// Retrieves guest contacts from localStorage.
function getGuestContacts() {
  const guestKanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
  return guestKanbanData?.users?.guest?.contacts || {};
}

// Fetches contacts from Firebase for the logged-in user.
function fetchContactsFromServer(userId) {
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts.json`;
  return fetch(BASE_URL).then((response) => response.json());
}

// Renders the sorted and grouped contacts into the contact list.
function renderContactsList(contactsList, contacts, isGuest) {
  if (!contacts || Object.keys(contacts).length === 0) return;
  const sortedContacts = sortContactsByName(contacts);
  const groupedContacts = groupContactsByInitial(sortedContacts);
  Object.keys(groupedContacts).forEach((initial) => {
    renderContactSection(contactsList, initial, groupedContacts[initial], isGuest);
  });
}

// Sorts contacts alphabetically by name.
function sortContactsByName(contacts) {
  return Object.keys(contacts)
    .map((key) => ({ id: key, ...contacts[key] }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Groups sorted contacts by their initial letter.
function groupContactsByInitial(sortedContacts) {
  return sortedContacts.reduce((acc, contact) => {
    const initial = contact.name[0].toUpperCase();
    if (!acc[initial]) acc[initial] = [];
    acc[initial].push(contact);
    return acc;
  }, {});
}

// Renders a section for each initial and its contacts.
function renderContactSection(contactsList, initial, contacts, isGuest) {
  const section = document.createElement("li");
  section.innerHTML = `<h3>${initial}</h3>`;
  contactsList.appendChild(section);
  contacts.forEach((contact) => {
    const listItem = createContactListItem(contact, isGuest);
    contactsList.appendChild(listItem);
  });
}

// Creates a list item element for a single contact.
function createContactListItem(contact, isGuest) {
  const initials = getInitials(contact.name);
  const initialClass = initials[0].toLowerCase();
  const listItem = document.createElement("li");
  listItem.innerHTML = `
    <div class="contact-initials ${initialClass}">${initials}</div>
    <div>
      <strong>${contact.name}</strong><br>
      <a href="mailto:${contact.email}">${contact.email}</a>
    </div>
  `;
  listItem.dataset.contactId = contact.id;
  listItem.addEventListener("click", () => displayContactDetails(contact.id));
  return listItem;
}

// Returns the initials from a contact's name.
function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
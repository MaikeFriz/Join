// Renders the contact list for guest or logged-in user.
function renderContacts() {
  return new Promise((resolve) => {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    const contactsList = document.querySelector(".contacts-list ul");
    contactsList.innerHTML = "";
    if (isGuest) {
      const contacts = getGuestContacts();
      renderContactsList(contactsList, contacts, true);
      resolve();
      return;
    }
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || !loggedInUser.userId) {
      resolve();
      return;
    }
    const userId = loggedInUser.userId;
    const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts.json`;
    fetch(BASE_URL)
      .then((response) => response.json())
      .then((contacts) => {
        renderContactsList(contactsList, contacts, false);
        resolve();
      })
      .catch(() => resolve());
  });
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

// Renders the sorted and grouped contacts into the contact list.
function renderContactsList(contactsList, contacts, isGuest) {
  if (!contacts || Object.keys(contacts).length === 0) return;
  const sortedContacts = sortContactsByName(contacts);
  const groupedContacts = groupContactsByInitial(sortedContacts);
  Object.keys(groupedContacts).forEach((initial) => {
    renderContactSection(contactsList, initial, groupedContacts[initial], isGuest);
  });
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
  const { initials, initialClass } = getInitialsAndClass(contact.name);
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

// Creates a div element for contact details.
function createContactDetailsDiv(contact, initials, initialClass) {
  const div = document.createElement("div");
  div.className = "contact-details";
  div.innerHTML = contactDetailsTemplate(contact, initials, initialClass);
  return div;
}

// Renders the contact details div in the appropriate container.
function renderContactDetailsDiv(newDiv) {
  const isMobileView = window.innerWidth <= 980;
  const rightSideContent = document.querySelector(".right-side-content-contacts");
  if (isMobileView) {
    rightSideContent.innerHTML = "";
    rightSideContent.appendChild(newDiv);
  } else {
    rightSideContent.appendChild(newDiv);
  }
}

// Renders the headline in the contact details area.
function renderHeadline() {
  const headlineContainer = document.querySelector(
    ".right-side-content-contacts"
  );
  if (!headlineContainer) return;

  headlineContainer.innerHTML = contactHeadlineTemplate();
}
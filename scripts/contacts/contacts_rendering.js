/**
 * Handles the DOMContentLoaded event to show the contact saved toast if needed.
 */
document.addEventListener("DOMContentLoaded", function() {
  if (localStorage.getItem('showContactSavedToast') === '1') {
    showContactSavedToast();
    localStorage.removeItem('showContactSavedToast');
  }
});

/**
 * Displays the contact saved toast notification.
 */
function showContactSavedToast() {
  const toast = document.getElementById('contact-toast');
  if (!toast) return;
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 1800);
}

/**
 * Renders the contact list for guest or logged-in user.
 * @returns {Promise<void>} A promise that resolves when rendering is complete.
 */
function renderContacts() {
  return new Promise((resolve) => {
    getContactsData()
      .then(({ contacts, isGuest }) => {
        const contactsList = document.querySelector(".contacts-list ul");
        contactsList.innerHTML = "";
        renderContactsList(contactsList, contacts, isGuest);
        resolve();
      })
      .catch(() => resolve());
  });
}

/**
 * Fetches contacts for the current user or guest from storage or Firebase.
 * @returns {Promise<Object>} A promise that resolves to an object with contacts and isGuest flag.
 */
function getContactsData() {
  return new Promise((resolve, reject) => {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    if (isGuest) {
      const contacts = fetchGuestContactsList();
      resolve({ contacts, isGuest: true });
      return;
    }
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || !loggedInUser.userId) {
      resolve({ contacts: {}, isGuest: false });
      return;
    }
    const userId = loggedInUser.userId;
    fetchContactsList(userId)
      .then((contacts) => resolve({ contacts, isGuest: false }))
      .catch(reject);
  });
}

/**
 * Sorts contacts alphabetically by name.
 * @param {Object} contacts - The contacts object.
 * @returns {Array<Object>} Sorted array of contact objects.
 */
function sortContactsByName(contacts) {
  return Object.keys(contacts)
    .map((key) => ({ id: key, ...contacts[key] }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Groups sorted contacts by their initial letter.
 * @param {Array<Object>} sortedContacts - Array of sorted contact objects.
 * @returns {Object} An object grouping contacts by initial letter.
 */
function groupContactsByInitial(sortedContacts) {
  return sortedContacts.reduce((acc, contact) => {
    const initial = contact.name[0].toUpperCase();
    if (!acc[initial]) acc[initial] = [];
    acc[initial].push(contact);
    return acc;
  }, {});
}

/**
 * Renders the sorted and grouped contacts into the contact list.
 * @param {HTMLElement} contactsList - The container element for the contact list.
 * @param {Object} contacts - The contacts object.
 * @param {boolean} isGuest - Whether the user is a guest.
 */
function renderContactsList(contactsList, contacts, isGuest) {
  if (!contacts || Object.keys(contacts).length === 0) return;
  const sortedContacts = sortContactsByName(contacts);
  const groupedContacts = groupContactsByInitial(sortedContacts);
  Object.keys(groupedContacts).forEach((initial) => {
    renderContactSection(contactsList, initial, groupedContacts[initial], isGuest);
  });
}

/**
 * Renders a section for each initial and its contacts.
 * @param {HTMLElement} contactsList - The container element for the contact list.
 * @param {string} initial - The initial letter.
 * @param {Array<Object>} contacts - Array of contact objects for the initial.
 * @param {boolean} isGuest - Whether the user is a guest.
 */
function renderContactSection(contactsList, initial, contacts, isGuest) {
  const section = document.createElement("li");
  section.innerHTML = `<h3>${initial}</h3>`;
  contactsList.appendChild(section);
  contacts.forEach((contact) => {
    const listItem = createContactListItem(contact, isGuest);
    contactsList.appendChild(listItem);
  });
}

/**
 * Creates a list item element for a single contact.
 * @param {Object} contact - The contact object.
 * @param {boolean} isGuest - Whether the user is a guest.
 * @returns {HTMLElement} The list item element.
 */
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

/**
 * Creates a div element for contact details.
 * @param {Object} contact - The contact object.
 * @param {string} initials - The initials of the contact.
 * @param {string} initialClass - The CSS class for the initials badge.
 * @returns {HTMLDivElement} The div element containing contact details.
 */
function createContactDetailsDiv(contact, initials, initialClass) {
  const div = document.createElement("div");
  div.className = "contact-details";
  div.innerHTML = contactDetailsTemplate(contact, initials, initialClass);
  return div;
}

/**
 * Renders the contact details div in the appropriate container.
 * @param {HTMLDivElement} newDiv - The div element containing contact details.
 */
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

/**
 * Renders the headline in the contact details area.
 */
function renderHeadline() {
  const headlineContainer = document.querySelector(
    ".right-side-content-contacts"
  );
  if (!headlineContainer) return;

  headlineContainer.innerHTML = contactHeadlineTemplate();
}

/**
 * Handles the message event to update the contact list and details after creating a contact.
 */
window.addEventListener("message", async function(event) {
  if (event.data && event.data.type === "createContact") {
    const contact = event.data.contact;
    await renderContacts();
    displayContactDetails(contact.id);

    if (window.innerWidth <= 980) {
      const contactsList = document.querySelector(".contacts-list");
      if (contactsList) contactsList.style.display = "none";
    }
    showContactSavedToast();
    closeAddContactOverlay();
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));

  if (!user && !isGuest) {
    window.location.href = "./log_in.html";
    return;
  }

  renderContacts();

  document
    .getElementById("add-contact-button")
    .addEventListener("click", function () {
      openOverlay("add_contact.html");
    });

  const floatingButton = document.querySelector(".add-contact-floating-button");
  if (floatingButton) {
    floatingButton.addEventListener("click", function () {
      openOverlay("add_contact.html");
    });
  }
});

window.addEventListener("resize", handleResponsiveContactDetails);

function handleResponsiveContactDetails() {
  const isMobile = window.innerWidth <= 980;
  const rightSideContent = document.querySelector(".right-side-content-contacts");
  const contactDetails = document.querySelector(".contact-details");

  if (isMobile && contactDetails && rightSideContent.contains(contactDetails)) {
    const contactsList = document.querySelector(".contacts-list");
    if (contactsList) contactsList.style.display = "none";
  } else {
    renderContacts();
  }
}

// Displays the contact details for the given contactId, for guest or user.
function displayContactDetails(contactId) {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  if (isGuest) {
    displayGuestContactDetails(contactId);
    return;
  }
  displayUserContactDetails(contactId);
}

// Displays guest contact details in the UI.
function displayGuestContactDetails(contactId) {
  const contact = getGuestContactById(contactId);
  if (!contact) return;
  removeExistingContactDetails();
  const { initials, initialClass } = getInitialsAndClass(contact.name);
  const newDiv = createContactDetailsDiv(contact, initials, initialClass);
  renderContactDetailsDiv(newDiv);
  addGuestContactDetailListeners(contactId);
  highlightSelectedContact(contactId);

  if (window.innerWidth <= 980) {
    const addBtn = document.querySelector('.add-contact-floating-button');
    if (addBtn) addBtn.style.display = 'none';

    const oldActionBtn = document.getElementById('action-button');
    if (oldActionBtn) oldActionBtn.remove();

    addMobileActionMenu(contactId);
  }
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

// Returns initials and CSS class for a contact name.
function getInitialsAndClass(name) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return { initials, initialClass: initials[0].toLowerCase() };
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
  const rightSideContent = document.querySelector(
    ".right-side-content-contacts"
  );
  if (isMobileView) {
    rightSideContent.innerHTML = "";
    rightSideContent.appendChild(newDiv);
  } else {
    rightSideContent.appendChild(newDiv);
  }
}

// Adds event listeners for editing and deleting a guest contact.
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

// Highlights the selected contact in the contact list.
function highlightSelectedContact(contactId) {
  const contactItems = document.querySelectorAll(".contacts-list ul li");
  contactItems.forEach((item) => item.classList.remove("contact-highlight"));
  const selectedContact = document.querySelector(
    `.contacts-list ul li[data-contact-id="${contactId}"]`
  );
  if (selectedContact) selectedContact.classList.add("contact-highlight");
}

// Fetches and displays user contact details from Firebase.
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

// Handles rendering and listeners for user contact details.
function handleUserContactDetails(contact, contactId) {
  removeExistingContactDetails();
  const { initials, initialClass } = getInitialsAndClass(contact.name);
  const newDiv = createContactDetailsDiv(contact, initials, initialClass);
  renderContactDetailsDiv(newDiv);
  addUserContactDetailListeners(contactId);
  highlightSelectedContact(contactId);

  if (window.innerWidth <= 768) {
    const addBtn = document.querySelector('.add-contact-floating-button');
    if (addBtn) addBtn.style.display = 'none';

    const oldActionBtn = document.getElementById('action-button');
    if (oldActionBtn) oldActionBtn.remove();

    addMobileActionMenu(contactId);
  }
}

// Adds event listeners for editing and deleting a user contact.
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

// Adds the mobile action menu button for user contacts.
function addMobileActionMenu(contactId) {
  const actionButton = createMobileActionButton();
  document.body.appendChild(actionButton);
  actionButton.addEventListener("click", () =>
    showMobileActionMenu(contactId, actionButton)
  );
}

// Creates the floating action button for mobile actions.
function createMobileActionButton() {
  const btn = document.createElement("button");
  btn.id = "action-button";
  btn.className = "action-button";
  btn.innerHTML = `<img src="./assets/img/more_vert.svg" alt="Actions" style="width: 24px; height: 24px;">`;
  return btn;
}

// Shows the mobile action menu for a contact.
function showMobileActionMenu(contactId, actionButton) {
  const oldMenu = document.getElementById("mobile-action-menu");
  if (oldMenu) oldMenu.remove();

  const actionMenu = createMobileActionMenu();
  actionMenu.id = "mobile-action-menu";
  document.body.appendChild(actionMenu);

  setTimeout(() => {
    addMobileActionMenuListeners(actionMenu, contactId, actionButton);
  }, 0);
}

// Creates the mobile action menu element.
function createMobileActionMenu() {
  const actionMenu = document.createElement("div");
  actionMenu.className = "mobile-action-menu";
  actionMenu.innerHTML = mobileActionMenuTemplate();
  return actionMenu;
}

// Adds event listeners to the mobile action menu buttons and closes the menu on outside click.
function addMobileActionMenuListeners(actionMenu, contactId, actionButton) {
  actionMenu
    .querySelector("#mobile-edit-contact-button")
    .addEventListener("click", () => {
      openOverlay(`./edit_contact.html?contactId=${contactId}`);
      document.body.removeChild(actionMenu);
    });

  actionMenu
    .querySelector("#mobile-delete-contact-button")
    .addEventListener("click", () => {
      const isGuest = JSON.parse(localStorage.getItem("isGuest"));
      if (isGuest) {
        deleteGuestContact(contactId);
      } else {
        deleteContact(contactId);
      }
      document.body.removeChild(actionMenu);
    });

  setTimeout(() => {
    document.addEventListener(
      "click",
      (event) => {
        if (!actionMenu.contains(event.target) && event.target !== actionButton) {
          if (document.body.contains(actionMenu)) {
            document.body.removeChild(actionMenu);
          }
        }
      },
      { once: true }
    );
  }, 0);
}

// Renders the headline in the contact details area.
function renderHeadline() {
  const headlineContainer = document.querySelector(
    ".right-side-content-contacts"
  );
  if (!headlineContainer) return;

  headlineContainer.innerHTML = contactHeadlineTemplate();
}

// Updates a contact in Firebase and refreshes the list and details.
function updateContact(contact) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || !loggedInUser.userId) return;
  const userId = loggedInUser.userId;
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contact.id}.json`;
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

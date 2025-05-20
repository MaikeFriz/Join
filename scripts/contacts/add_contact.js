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

window.addEventListener("message", function (event) {
  if (event.data.type === "createContact") {
    const newContact = event.data.contact;
    addContact(newContact);
    closeOverlay();
  } else if (event.data.type === "closeOverlay") {
    closeOverlay();
  } else if (event.data.type === "editContact") {
    const updatedContact = event.data.contact;
    updateContact(updatedContact); // Das Rendering passiert jetzt in updateContact!
    closeOverlay();
  }
});

function openOverlay(url) {
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "1000";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";

  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.style.width = "80%";
  iframe.style.height = "80%";
  iframe.style.border = "none";
  iframe.style.borderRadius = "8px";

  overlay.appendChild(iframe);

  document.body.appendChild(overlay);

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeOverlay();
    }
  });
}

function closeOverlay() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

function displayContactDetails(contactId) {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  if (isGuest) {
    displayGuestContactDetails(contactId);
    return;
  }
  displayUserContactDetails(contactId);
}

function displayGuestContactDetails(contactId) {
  const contact = getGuestContactById(contactId);
  if (!contact) return;
  removeExistingContactDetails();
  const { initials, initialClass } = getInitialsAndClass(contact.name);
  const newDiv = createContactDetailsDiv(contact, initials, initialClass);
  renderContactDetailsDiv(newDiv);
  addGuestContactDetailListeners(contactId);
  highlightSelectedContact(contactId);
}

function getGuestContactById(contactId) {
  const guestKanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
  const contacts = guestKanbanData?.users?.guest?.contacts || {};
  return contacts[contactId];
}

function removeExistingContactDetails() {
  const contactDetailsDiv = document.querySelector(".contact-details");
  if (contactDetailsDiv) contactDetailsDiv.remove();
}

function getInitialsAndClass(name) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return { initials, initialClass: initials[0].toLowerCase() };
}

function createContactDetailsDiv(contact, initials, initialClass) {
  const div = document.createElement("div");
  div.className = "contact-details";
  div.innerHTML = contactDetailsTemplate(contact, initials, initialClass);
  return div;
}

function renderContactDetailsDiv(newDiv) {
  const isMobileView = window.innerWidth <= 768;
  const rightSideContent = document.querySelector(".right-side-content-contacts");
  if (isMobileView) {
    rightSideContent.innerHTML = "";
    rightSideContent.appendChild(newDiv);
  } else {
    rightSideContent.appendChild(newDiv);
  }
}

function addGuestContactDetailListeners(contactId) {
  document.getElementById("edit-contact-button")
    .addEventListener("click", () => openOverlay(`./edit_contact.html?contactId=${contactId}`));
  document.getElementById("delete-contact-button")
    .addEventListener("click", () => deleteGuestContact(contactId));
  if (window.innerWidth <= 768) {
    document.getElementById("reload-page-button")
      .addEventListener("click", () => location.reload());
  }
}

function highlightSelectedContact(contactId) {
  const contactItems = document.querySelectorAll(".contacts-list ul li");
  contactItems.forEach((item) => item.classList.remove("contact-highlight"));
  const selectedContact = document.querySelector(
    `.contacts-list ul li[data-contact-id="${contactId}"]`
  );
  if (selectedContact) selectedContact.classList.add("contact-highlight");
}

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

function handleUserContactDetails(contact, contactId) {
  removeExistingContactDetails();
  const { initials, initialClass } = getInitialsAndClass(contact.name);
  const newDiv = createContactDetailsDiv(contact, initials, initialClass);
  renderContactDetailsDiv(newDiv);
  addUserContactDetailListeners(contactId);
  if (window.innerWidth <= 768) addMobileActionMenu(contactId);
  highlightSelectedContact(contactId);
}

function addUserContactDetailListeners(contactId) {
  document.getElementById("edit-contact-button")
    .addEventListener("click", () => openOverlay(`./edit_contact.html?contactId=${contactId}`));
  document.getElementById("delete-contact-button")
    .addEventListener("click", () => deleteContact(contactId));
}

function addMobileActionMenu(contactId) {
  const actionButton = createMobileActionButton();
  document.body.appendChild(actionButton);
  actionButton.addEventListener("click", () => showMobileActionMenu(contactId, actionButton));
  document.getElementById("reload-page-button")
    .addEventListener("click", () => location.reload());
}

function createMobileActionButton() {
  const btn = document.createElement("button");
  btn.id = "action-button";
  Object.assign(btn.style, {
    position: "fixed", bottom: "90px", right: "20px", width: "50px", height: "50px",
    borderRadius: "50%", backgroundColor: "#2A3647", color: "#fff", border: "none",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", display: "flex", justifyContent: "center",
    alignItems: "center", cursor: "pointer", zIndex: "1100"
  });
  btn.innerHTML = `<img src="./assets/img/more_vert.svg" alt="Actions" style="width: 24px; height: 24px;">`;
  return btn;
}

function showMobileActionMenu(contactId, actionButton) {
  const actionMenu = document.createElement("div");
  Object.assign(actionMenu.style, {
    position: "fixed", bottom: "160px", right: "20px", backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", borderRadius: "8px", padding: "10px",
    zIndex: "1200", display: "flex", flexDirection: "column", gap: "10px"
  });
  actionMenu.innerHTML = `
    <button id="mobile-edit-contact-button" style="display: flex; align-items: center; gap: 5px; border: none; background-color: white; border-radius: 4px; padding: 8px; cursor: pointer;">
      <img src="./assets/img/edit.svg" alt="Edit" style="width: 16px; height: 16px;">
      Edit
    </button>
    <button id="mobile-delete-contact-button" style="display: flex; align-items: center; gap: 5px; border: none; background-color: white; border-radius: 4px; padding: 8px; cursor: pointer;">
      <img src="./assets/img/delete.svg" alt="Delete" style="width: 16px; height: 16px;">
      Delete
    </button>
  `;
  document.body.appendChild(actionMenu);
  document.getElementById("mobile-edit-contact-button")
    .addEventListener("click", () => {
      openOverlay(`./edit_contact.html?contactId=${contactId}`);
      document.body.removeChild(actionMenu);
    });
  document.getElementById("mobile-delete-contact-button")
    .addEventListener("click", () => {
      deleteContact(contactId);
      document.body.removeChild(actionMenu);
    });
  document.addEventListener("click", (event) => {
    if (!actionMenu.contains(event.target) && event.target !== actionButton) {
      document.body.removeChild(actionMenu);
    }
  }, { once: true });
}

function renderHeadline() {
  const headlineContainer = document.querySelector(
    ".right-side-content-contacts"
  );
  if (!headlineContainer) return;

  const headlineHTML = `
    <h1 class="contact-headline">
      Contacts
      <span class="vertical-line"></span>
      <span class="team-tagline">Better with a Team</span>
    </h1>
  `;

  headlineContainer.innerHTML = headlineHTML;
}

// edit_contact.js
const form = document.querySelector("form");
form.addEventListener("submit", onSubmit);

function onSubmit(event) {
  event.preventDefault();
  // ... update logic ...
  // Nach dem ersten Submit ggf. Listener entfernen:
  form.removeEventListener("submit", onSubmit);
}

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
      // Jetzt die Kontakte frisch laden und Details anzeigen!
      renderContacts();
      displayContactDetails(contact.id);
    })
    .catch(() => {});
}

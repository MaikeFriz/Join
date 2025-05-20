document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));


  if (!user && !isGuest) {
    window.location.href = "./log_in.html";
    return;
  }

  renderContacts();

  // Add event listener for the original Add Contact button
  document
    .getElementById("add-contact-button")
    .addEventListener("click", function () {
      openOverlay("add_contact.html");
    });

  // Add event listener for the floating Add Contact button
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
    updateContact(updatedContact);
    displayContactDetails(updatedContact.id); // Refresh the contact details view
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

function addContact(contact) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || !loggedInUser.userId) {
    console.error("No logged-in user found");
    return;
  }

  const userId = loggedInUser.userId;
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts.json`;

  fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Contact added:", data);
      renderContacts();
    })
    .catch((error) => {
      console.error("Error adding contact:", error);
    });
}

function updateContact(contact) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || !loggedInUser.userId) {
    console.error("No logged-in user found");
    return;
  }

  const userId = loggedInUser.userId;
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contact.id}.json`;

  fetch(BASE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update contact.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Contact updated successfully:", data);
      renderContacts();
    })
    .catch((error) => {
      console.error("Error updating contact:", error);
    });
}
function renderContacts() {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  const contactsList = document.querySelector(".contacts-list ul");
  contactsList.innerHTML = "";

  if (isGuest) {
    // Kontakte für Gast aus LocalStorage laden
    const guestKanbanData = JSON.parse(localStorage.getItem("guestKanbanData"));
    const contacts = guestKanbanData?.users?.guest?.contacts || {};
    if (!contacts || Object.keys(contacts).length === 0) {
      console.log("No contacts found for guest.");
      return;
    }

    const sortedContacts = Object.keys(contacts)
      .map((key) => ({ id: key, ...contacts[key] }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const groupedContacts = sortedContacts.reduce((acc, contact) => {
      const initial = contact.name[0].toUpperCase();
      if (!acc[initial]) acc[initial] = [];
      acc[initial].push(contact);
      return acc;
    }, {});

    Object.keys(groupedContacts).forEach((initial) => {
      const section = document.createElement("li");
      section.innerHTML = `<h3>${initial}</h3>`;
      contactsList.appendChild(section);

      groupedContacts[initial].forEach((contact) => {
        const initials = contact.name
          .split(" ")
          .map((name) => name[0])
          .join("")
          .toUpperCase();
        const backgroundColor = getInitialsBackgroundColor(initials[0]);
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <div class="contact-initials" style="background-color: ${backgroundColor};">${initials}</div>
          <div>
            <strong>${contact.name}</strong><br>
            <a href="mailto:${contact.email}">${contact.email}</a>
          </div>
        `;
        listItem.dataset.contactId = contact.id;
        // Optional: Klick-Handler für Details, falls gewünscht
        // listItem.addEventListener("click", () => displayContactDetails(contact.id));
        contactsList.appendChild(listItem);
      });
    });
    return;
  }

  // Bisheriger Code für eingeloggte User:
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || !loggedInUser.userId) {
    console.error("No logged-in user found");
    return;
  }

  const userId = loggedInUser.userId;
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts.json`;

  fetch(BASE_URL)
    .then((response) => response.json())
    .then((contacts) => {
      if (!contacts) {
        console.log("No contacts found.");
        return;
      }

      const sortedContacts = Object.keys(contacts)
        .map((key) => ({ id: key, ...contacts[key] }))
        .sort((a, b) => a.name.localeCompare(b.name));

      const groupedContacts = sortedContacts.reduce((acc, contact) => {
        const initial = contact.name[0].toUpperCase();
        if (!acc[initial]) acc[initial] = [];
        acc[initial].push(contact);
        return acc;
      }, {});

      Object.keys(groupedContacts).forEach((initial) => {
        const section = document.createElement("li");
        section.innerHTML = `<h3>${initial}</h3>`;
        contactsList.appendChild(section);

        groupedContacts[initial].forEach((contact) => {
          const initials = contact.name
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase();
          const backgroundColor = getInitialsBackgroundColor(initials[0]);
          const listItem = document.createElement("li");
          listItem.innerHTML = `
            <div class="contact-initials" style="background-color: ${backgroundColor};">${initials}</div>
            <div>
              <strong>${contact.name}</strong><br>
              <a href="mailto:${contact.email}">${contact.email}</a>
            </div>
          `;
          listItem.dataset.contactId = contact.id;
          listItem.addEventListener("click", () =>
            displayContactDetails(contact.id)
          );
          contactsList.appendChild(listItem);
        });
      });
    })
    .catch((error) => console.error("Error fetching contacts:", error));
}

function getInitialsBackgroundColor(initial) {
  const colors = {
    A: "#FF5733",
    B: "#33FF57",
    C: "#3357FF",
    D: "#FF33A1",
    E: "#FF8C33",
    F: "#33FFF5",
    G: "#8C33FF",
    H: "#FF3333",
    I: "#33FF8C",
    J: "#FF5733",
    K: "#33FF57",
    L: "#3357FF",
    M: "#FF33A1",
    N: "#FF8C33",
    O: "#33FFF5",
    P: "#8C33FF",
    Q: "#FF3333",
    R: "#33FF8C",
    S: "#FF5733",
    T: "#33FF57",
    U: "#3357FF",
    V: "#FF33A1",
    W: "#FF8C33",
    X: "#33FFF5",
    Y: "#8C33FF",
    Z: "#FF3333",
  };
  return colors[initial.toUpperCase()] || "#007bff";
}

function displayContactDetails(contactId) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || !loggedInUser.userId) {
    console.error("No logged-in user found");
    return;
  }

  const userId = loggedInUser.userId;
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contactId}.json`;

  fetch(BASE_URL)
    .then((response) => response.json())
    .then((contact) => {
      const contactDetailsDiv = document.querySelector(".contact-details");
      if (contactDetailsDiv) {
        contactDetailsDiv.remove();
      }

      const initials = contact.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase();
      const backgroundColor = getInitialsBackgroundColor(initials[0]);

      const newContactDetailsDiv = document.createElement("div");
      newContactDetailsDiv.className = "contact-details";
      newContactDetailsDiv.innerHTML = `
        <h1 class="contact-headline">
          Contacts
          <span class="vertical-line"></span>
          <span class="team-tagline">Better with a Team</span>
        </h1>
        <div class="contact-header">
          <div class="contact-initials" style="background-color: ${backgroundColor};">${initials}</div>
          <div class="contact-name">
            <p><strong>${contact.name}</strong></p>
            <div class="contact-buttons">
              <button id="edit-contact-button" class="desktop-visible">
                <img src="./assets/img/edit.svg" alt="Edit" style="width: 16px; height: 16px; margin-right: 5px;">
                Edit
              </button>
              <button id="delete-contact-button" class="desktop-visible">
                <img src="./assets/img/delete.svg" alt="Delete" style="width: 16px; height: 16px; margin-right: 5px;">
                Delete
              </button>
            </div>
          </div>
        </div>
        <div class="contact-details-info">
          <h3>Contact Information</h3>
          <p>
            <strong>Email:</strong><br><br>
            <a href="mailto:${contact.email}">${contact.email}</a>
          </p>
          <br>
          <p>
            <strong>Phone:</strong><br><br>
            <span>${contact.phone}</span>
          </p>
        </div>
        ${
          window.innerWidth <= 768
            ? `<button id="reload-page-button" style="margin-top: 20px; display: flex; align-items: center; gap: 5px; background: none; border: none; cursor: pointer; color: #007bff; font-size: 16px;">
                 <img src="./assets/img/arrow-left-line.svg" alt="Back" style="width: 16px; height: 16px;">
               </button>`
            : ""
        }
      `;

      const isMobileView = window.innerWidth <= 768;
      if (isMobileView) {
        // Replace the contact list in mobile view
        const rightSideContent = document.querySelector(
          ".right-side-content-contacts"
        );
        rightSideContent.innerHTML = ""; // Clear existing content
        rightSideContent.appendChild(newContactDetailsDiv);
      } else {
        // Open contact details on the right side in desktop view
        const rightSideContent = document.querySelector(
          ".right-side-content-contacts"
        );
        rightSideContent.appendChild(newContactDetailsDiv);
      }

      // Add event listeners for edit and delete buttons
      document
        .getElementById("edit-contact-button")
        .addEventListener("click", () => {
          openOverlay(`edit_contact.html?contactId=${contactId}`);
        });

      document
        .getElementById("delete-contact-button")
        .addEventListener("click", () => {
          deleteContact(contactId);
        });

      // Add a combined action button for edit and delete in mobile view
      if (isMobileView) {
        const actionButton = document.createElement("button");
        actionButton.id = "action-button";
        actionButton.style.position = "fixed";
        actionButton.style.bottom = "90px"; // Position above the sidebar
        actionButton.style.right = "20px";
        actionButton.style.width = "50px"; // Match size of add-contact-floating-button
        actionButton.style.height = "50px"; // Match size of add-contact-floating-button
        actionButton.style.borderRadius = "50%";
        actionButton.style.backgroundColor = "#2A3647";
        actionButton.style.color = "#fff";
        actionButton.style.border = "none";
        actionButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
        actionButton.style.display = "flex";
        actionButton.style.justifyContent = "center";
        actionButton.style.alignItems = "center";
        actionButton.style.cursor = "pointer";
        actionButton.style.zIndex = "1100";
        actionButton.innerHTML = `
          <img src="./assets/img/more_vert.svg" alt="Actions" style="width: 24px; height: 24px;">
        `;

        document.body.appendChild(actionButton);

        actionButton.addEventListener("click", () => {
          const actionMenu = document.createElement("div");
          actionMenu.style.position = "fixed";
          actionMenu.style.bottom = "160px"; // Position above the action button
          actionMenu.style.right = "20px";
          actionMenu.style.backgroundColor = "#fff";
          actionMenu.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
          actionMenu.style.borderRadius = "8px";
          actionMenu.style.padding = "10px";
          actionMenu.style.zIndex = "1200";
          actionMenu.style.display = "flex";
          actionMenu.style.flexDirection = "column";
          actionMenu.style.gap = "10px";

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

          document
            .getElementById("mobile-edit-contact-button")
            .addEventListener("click", () => {
              openOverlay(`edit_contact.html?contactId=${contactId}`);
              document.body.removeChild(actionMenu);
            });

          document
            .getElementById("mobile-delete-contact-button")
            .addEventListener("click", () => {
              deleteContact(contactId);
              document.body.removeChild(actionMenu);
            });

          // Close the menu if clicked outside
          document.addEventListener(
            "click",
            (event) => {
              if (
                !actionMenu.contains(event.target) &&
                event.target !== actionButton
              ) {
                document.body.removeChild(actionMenu);
              }
            },
            { once: true }
          );
        });

        document
          .getElementById("reload-page-button")
          .addEventListener("click", function () {
            location.reload(); // Reload the page
          });
      }

      const contactItems = document.querySelectorAll(".contacts-list ul li");
      contactItems.forEach((item) =>
        item.classList.remove("contact-highlight")
      );

      const selectedContact = document.querySelector(
        `.contacts-list ul li[data-contact-id="${contactId}"]`
      );
      if (selectedContact) {
        selectedContact.classList.add("contact-highlight");
      }
    })
    .catch((error) => {
      console.error("Error fetching contact details:", error);
    });
}

function deleteContact(contactId) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || !loggedInUser.userId) {
    console.error("No logged-in user found");
    return;
  }

  const userId = loggedInUser.userId;
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contactId}.json`;

  fetch(BASE_URL, {
    method: "DELETE",
  })
    .then(() => {
      console.log("Contact deleted");
      renderContacts();
    })
    .catch((error) => {
      console.error("Error deleting contact:", error);
    });
}
function renderHeadline() {
  const headlineContainer = document.querySelector(
    ".right-side-content-contacts"
  );
  if (!headlineContainer) return;

  const headlineHTML = `
    <h1 class="contact-headline">
      Contacts
      <span class="vertical-line"></span> <!-- Added blue vertical line -->
      <span class="team-tagline">Better with a Team</span> <!-- Added tagline -->
    </h1>
  `;

  headlineContainer.innerHTML = headlineHTML;
}

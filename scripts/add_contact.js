document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    window.location.href = "./log_in.html";
    return;
  }

  renderContacts();

  document
    .getElementById("add-contact-button")
    .addEventListener("click", function () {
      openOverlay("add_contact.html");
    });
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
    .then((response) => response.json())
    .then((data) => {
      console.log("Contact updated:", data);
      renderContacts();
    })
    .catch((error) => {
      console.error("Error updating contact:", error);
    });
}

function renderContacts() {
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
      const contactsList = document.querySelector(".contacts-list ul");
      contactsList.innerHTML = "";

      // Convert contacts object to an array and sort alphabetically by name
      const sortedContacts = Object.keys(contacts)
        .map((key) => ({ id: key, ...contacts[key] }))
        .sort((a, b) => a.name.localeCompare(b.name));

      // Group contacts by their first initial
      const groupedContacts = sortedContacts.reduce((acc, contact) => {
        const initial = contact.name[0].toUpperCase();
        if (!acc[initial]) {
          acc[initial] = [];
        }
        acc[initial].push(contact);
        return acc;
      }, {});

      // Render contacts grouped by their first initial
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
          listItem.dataset.contactId = contact.id; // Store the contact ID in a data attribute
          listItem.addEventListener("click", function () {
            displayContactDetails(contact.id);
          });
          contactsList.appendChild(listItem);
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching contacts:", error);
    });
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
  return colors[initial.toUpperCase()] || "#007bff"; // Default color if initial is not in the map
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
        <h2>Contact Details</h2>
        <div class="contact-initials" style="background-color: ${backgroundColor};">${initials}</div>
        <div>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
          <p><strong>Phone:</strong> ${contact.phone}</p>
          <p><strong>Address:</strong> ${contact.address}</p>
        </div>
        <div class="contact-buttons">
          <button id="edit-contact-button">Edit Contact</button>
          <button id="delete-contact-button">Delete Contact</button>
        </div>
      `;
      document
        .querySelector(".right-side-content-contacts")
        .appendChild(newContactDetailsDiv);

      document
        .getElementById("delete-contact-button")
        .addEventListener("click", function () {
          deleteContact(contactId);
        });

      document
        .getElementById("edit-contact-button")
        .addEventListener("click", function () {
          openOverlay(`edit_contact.html?contactId=${contactId}`);
        });
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

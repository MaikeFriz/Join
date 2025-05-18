document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return (window.location.href = "./log_in.html");
  renderContacts();
  document
    .getElementById("add-contact-button")
    .addEventListener("click", () => openOverlay("add_contact.html"));
  const floatingButton = document.querySelector(".add-contact-floating-button");
  if (floatingButton)
    floatingButton.addEventListener("click", () =>
      openOverlay("add_contact.html")
    );
});

window.addEventListener("message", (event) => {
  if (event.data.type === "createContact") {
    addContact(event.data.contact);
    closeOverlay();
  } else if (event.data.type === "closeOverlay") {
    closeOverlay();
  } else if (event.data.type === "editContact") {
    updateContact(event.data.contact);
    displayContactDetails(event.data.contact.id);
    closeOverlay();
  }
});

function openOverlay(url) {
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });
  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    width: "80%",
    height: "80%",
    border: "none",
    borderRadius: "8px",
  });
  iframe.src = url;
  overlay.appendChild(iframe);
  document.body.appendChild(overlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });
}

function closeOverlay() {
  const overlay = document.getElementById("overlay");
  if (overlay) document.body.removeChild(overlay);
}

function addContact(contact) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user?.userId) return console.error("No logged-in user found");
  fetch(
    `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${user.userId}/contacts.json`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    }
  )
    .then((r) => r.json())
    .then(() => renderContacts())
    .catch((e) => console.error("Error adding contact:", e));
}

function updateContact(contact) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user?.userId) return console.error("No logged-in user found");
  fetch(
    `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${user.userId}/contacts/${contact.id}.json`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    }
  )
    .then((r) => {
      if (!r.ok) throw new Error("Failed to update contact.");
      return r.json();
    })
    .then(() => renderContacts())
    .catch((e) => console.error("Error updating contact:", e));
}

function renderContacts() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user?.userId) return console.error("No logged-in user found");
  fetch(
    `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${user.userId}/contacts.json`
  )
    .then((r) => r.json())
    .then((contacts) => {
      const ul = document.querySelector(".contacts-list ul");
      ul.innerHTML = "";
      if (!contacts) return;
      const sorted = Object.keys(contacts)
        .map((k) => ({ id: k, ...contacts[k] }))
        .sort((a, b) => a.name.localeCompare(b.name));
      const grouped = sorted.reduce((acc, c) => {
        const initial = c.name[0].toUpperCase();
        (acc[initial] = acc[initial] || []).push(c);
        return acc;
      }, {});
      Object.keys(grouped).forEach((initial) => {
        const section = document.createElement("li");
        section.innerHTML = `<h3>${initial}</h3>`;
        ul.appendChild(section);
        grouped[initial].forEach((contact) => {
          const initials = contact.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
          const bg = getInitialsBackgroundColor(initials[0]);
          const li = document.createElement("li");
          li.innerHTML = `
            <div class="contact-initials" style="background-color: ${bg};">${initials}</div>
            <div>
              <strong>${contact.name}</strong><br>
              <a href="mailto:${contact.email}">${contact.email}</a>
            </div>
          `;
          li.dataset.contactId = contact.id;
          li.addEventListener("click", () => displayContactDetails(contact.id));
          ul.appendChild(li);
        });
      });
    })
    .catch((e) => console.error("Error fetching contacts:", e));
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
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user?.userId) return console.error("No logged-in user found");
  fetch(
    `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${user.userId}/contacts/${contactId}.json`
  )
    .then((r) => r.json())
    .then((contact) => {
      document.querySelector(".contact-details")?.remove();
      const initials = contact.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      const bg = getInitialsBackgroundColor(initials[0]);
      const div = document.createElement("div");
      div.className = "contact-details";
      div.innerHTML = `
        <h1 class="contact-headline">
          Contacts
          <span class="vertical-line"></span>
          <span class="team-tagline">Better with a Team</span>
        </h1>
        <div class="contact-header">
          <div class="contact-initials" style="background-color: ${bg};">${initials}</div>
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
      const rightSide = document.querySelector(".right-side-content-contacts");
      if (window.innerWidth <= 768) {
        rightSide.innerHTML = "";
        rightSide.appendChild(div);
      } else {
        rightSide.appendChild(div);
      }
      document
        .getElementById("edit-contact-button")
        .addEventListener("click", () =>
          openOverlay(`edit_contact.html?contactId=${contactId}`)
        );
      document
        .getElementById("delete-contact-button")
        .addEventListener("click", () => deleteContact(contactId));
      if (window.innerWidth <= 768) {
        const actionButton = document.createElement("button");
        Object.assign(actionButton, {
          id: "action-button",
          innerHTML: `<img src="./assets/img/more_vert.svg" alt="Actions" style="width: 24px; height: 24px;">`,
        });
        Object.assign(actionButton.style, {
          position: "fixed",
          bottom: "90px",
          right: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "#2A3647",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: "1100",
        });
        document.body.appendChild(actionButton);
        actionButton.addEventListener("click", () => {
          const actionMenu = document.createElement("div");
          Object.assign(actionMenu.style, {
            position: "fixed",
            bottom: "160px",
            right: "20px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
            borderRadius: "8px",
            padding: "10px",
            zIndex: "1200",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
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
          .addEventListener("click", () => location.reload());
      }
      document
        .querySelectorAll(".contacts-list ul li")
        .forEach((item) => item.classList.remove("contact-highlight"));
      const selected = document.querySelector(
        `.contacts-list ul li[data-contact-id="${contactId}"]`
      );
      if (selected) selected.classList.add("contact-highlight");
    })
    .catch((e) => console.error("Error fetching contact details:", e));
}

function deleteContact(contactId) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user?.userId) return console.error("No logged-in user found");
  fetch(
    `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${user.userId}/contacts/${contactId}.json`,
    { method: "DELETE" }
  )
    .then(() => renderContacts())
    .catch((e) => console.error("Error deleting contact:", e));
}

function renderHeadline() {
  const container = document.querySelector(".right-side-content-contacts");
  if (!container) return;
  container.innerHTML = `
    <h1 class="contact-headline">
      Contacts
      <span class="vertical-line"></span>
      <span class="team-tagline">Better with a Team</span>
    </h1>
  `;
}

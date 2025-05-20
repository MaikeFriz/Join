document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const contactId = urlParams.get("contactId");
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));

  if (isGuest) {
    // Komplettes guestKanbanData-Objekt laden
    let guestKanbanData = JSON.parse(localStorage.getItem("guestKanbanData")) || { users: { guest: { contacts: {} } } };
    let contact = guestKanbanData?.users?.guest?.contacts?.[contactId];
    if (contact) {
      document.getElementById("input_name").value = contact.name;
      document.querySelector("input[type='email']").value = contact.email;
      document.querySelector("input[type='tel']").value = contact.phone;
      // Initialen setzen
      const initials = getInitials(contact.name);
      const profileInitials = document.getElementById("profileInitials");
      if (profileInitials) {
        profileInitials.textContent = initials;
        profileInitials.className = "contact-initials " + initials[0].toLowerCase();
      }
    }

    document.querySelector("form").addEventListener("submit", function (event) {
      event.preventDefault();
      // Werte übernehmen
      contact.name = document.getElementById("input_name").value;
      contact.email = document.querySelector("input[type='email']").value;
      contact.phone = document.querySelector("input[type='tel']").value;
      // Änderung am Objekt
      guestKanbanData.users.guest.contacts[contactId] = contact;
      // Gesamtes Objekt speichern
      localStorage.setItem("guestKanbanData", JSON.stringify(guestKanbanData));
      window.parent.postMessage({ type: "editContact", contact: { ...contact, id: contactId } }, "*");
      return; // <--- Das sorgt dafür, dass das Overlay geschlossen wird!
    });

    document.querySelector(".close-btn").addEventListener("click", function () {
      window.parent.postMessage({ type: "closeOverlay" }, "*");
    });

    document.querySelector(".button_cancel").addEventListener("click", function () {
      window.parent.postMessage({ type: "closeOverlay" }, "*");
    });

    return;
  }

  // --- Bisheriger Code für eingeloggte User ---
  const userId = JSON.parse(localStorage.getItem("loggedInUser")).userId;

  fetch(
    `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contactId}.json`
  )
    .then((response) => response.json())
    .then((contact) => {
      document.getElementById("input_name").value = contact.name;
      document.querySelector("input[type='email']").value = contact.email;
      document.querySelector("input[type='tel']").value = contact.phone;
      // Set initials in profile container styled as contact-initials
      const initials = getInitials(contact.name);
      const profileInitials = document.getElementById("profileInitials");
      if (profileInitials) {
        profileInitials.textContent = initials;
        profileInitials.className = "contact-initials " + initials[0].toLowerCase();
      }
    });

  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    const contact = {
      id: contactId,
      name: document.getElementById("input_name").value,
      email: document.querySelector("input[type='email']").value,
      phone: document.querySelector("input[type='tel']").value,
    };

    // Save the updated contact to the database
    fetch(
      `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contactId}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save contact changes.");
        }
        return response.json();
      })
      .then(() => {
        // Notify the parent window about the update
        window.parent.postMessage(
          { type: "editContact", contact: contact },
          "*"
        );
      })
      .catch((error) => {
        console.error("Error saving contact:", error);
        alert("Failed to save changes. Please try again.");
      });
  });

  document.querySelector(".close-btn").addEventListener("click", function () {
    window.parent.postMessage({ type: "closeOverlay" }, "*");
  });

  document
    .querySelector(".button_cancel")
    .addEventListener("click", function () {
      window.parent.postMessage({ type: "closeOverlay" }, "*");
    });
});

function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

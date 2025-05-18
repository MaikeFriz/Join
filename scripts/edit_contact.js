document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const contactId = urlParams.get("contactId");
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
        profileInitials.style.backgroundColor = getInitialsBackgroundColor(
          initials[0]
        );
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

function fetchComponent(file) {
  return fetch(file).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  });
}

function insertComponent(content, elementId) {
  const container = document.getElementById(elementId);

  if (container) {
    container.innerHTML = content;

    // Warten bis das DOM aktualisiert ist
    setTimeout(() => {
      const loggedInUser = checkUserLogin();
      const guest = JSON.parse(localStorage.getItem("isGuest"));

      if (loggedInUser || guest) {
        let userName = loggedInUser ? loggedInUser.name : "Guest";
        initUserDropdown(userName); // Neue separate Funktion
      }
    }, 0); // Timeout 0 reicht aus für DOM-Update
  } else {
    console.error(`Element with ID "${elementId}" not found.`);
  }
}

// Neue separate Funktion für Dropdown-Initialisierung
function initUserDropdown(userName) {
  let [firstName, lastName] = userName.split(" ");
  let firstLetter = firstName.charAt(0).toUpperCase();
  let lastNameFirstLetter = lastName ? lastName.charAt(0).toUpperCase() : "";
  let initials = firstLetter + lastNameFirstLetter;
  let headerInitials = document.getElementById("user-initials-header");

  if (!headerInitials) return;

  headerInitials.textContent = initials;

  // Verbesserte Dropdown-Logik mit Event-Delegation
  headerInitials.addEventListener("click", function (event) {
    event.stopPropagation();
    const dropdown = document.querySelector(".user-dropdown");
    dropdown.classList.toggle("active");
  });

  // Globaler Listener zum Schließen des Dropdowns
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".user-menu-container")) {
      document.querySelectorAll(".user-dropdown.active").forEach((d) => {
        d.classList.remove("active");
      });
    }
  });
}

function loadComponent(file, elementId) {
  fetchComponent(file)
    .then((content) => insertComponent(content, elementId))
    .catch((error) => console.error("Error loading component:", error));
}

function loadHeaderAndSidebar() {
  loadComponent("header.html", "header-container");
  loadComponent("sidebar.html", "sidebar-container");
}

function loadHeaderAndSidebarLoggedOut() {
  loadComponent("header.html", "header-container");
  loadComponent("sidebar_logged_out.html", "sidebar-container");
}

document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = checkUserLogin();
  const guest = JSON.parse(localStorage.getItem("isGuest"));

  if (loggedInUser || guest) {
    loadHeaderAndSidebar();
  } else {
    loadHeaderAndSidebarLoggedOut();
  }
});

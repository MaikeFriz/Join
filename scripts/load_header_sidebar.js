function fetchComponent(file) {
  return fetch(file).then((response) => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.text();
  });
}

function insertComponent(content, elementId) {
  const container = document.getElementById(elementId);
  if (!container) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  container.innerHTML = content;

  // Nur Header-spezifische Logik für das Dropdown
  if (elementId === "header-container") {
    setTimeout(() => {
      const loggedInUser = checkUserLogin();
      const guest = JSON.parse(localStorage.getItem("isGuest"));
      if (loggedInUser || guest) {
        setupUserDropdown(loggedInUser ? loggedInUser.name : "Guest");
      }
    }, 0);
  }
}

// Vereinfachte Dropdown-Initialisierung
function setupUserDropdown(userName) {
  const headerInitials = document.getElementById("user-initials-header");
  if (!headerInitials) return;

  // Initialen setzen
  const [first, last] = userName.split(" ");
  headerInitials.textContent =
    (first?.charAt(0)?.toUpperCase() || "") +
    (last?.charAt(0)?.toUpperCase() || "");

  // Dropdown-Toggle
  headerInitials.onclick = (e) => {
    e.stopPropagation();
    document.querySelector(".user-dropdown").classList.toggle("active");
  };

  // Schließen bei Klick außerhalb
  document.onclick = (e) => {
    if (!e.target.closest(".user-menu-container")) {
      document.querySelector(".user-dropdown")?.classList.remove("active");
    }
  };
}

function loadComponent(file, elementId) {
  fetchComponent(file)
    .then((content) => insertComponent(content, elementId))
    .catch((error) => console.error("Error loading component:", error));
}

function loadHeaderAndSidebar() {
  loadComponent("header.html", "header-container");
  loadComponent("sidebar.html", "sidebar-container"); // Sidebar bleibt unverändert
}

function loadHeaderAndSidebarLoggedOut() {
  loadComponent("header.html", "header-container");
  loadComponent("sidebar_logged_out.html", "sidebar-container");
}

// Initialisierung
document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = checkUserLogin();
  const guest = JSON.parse(localStorage.getItem("isGuest"));

  if (loggedInUser || guest) {
    loadHeaderAndSidebar(); // Lädt beides: Header UND Sidebar
  } else {
    loadHeaderAndSidebarLoggedOut();
  }
});

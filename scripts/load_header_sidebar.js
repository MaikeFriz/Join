// Fetches an HTML component file and returns its content as text.
function fetchComponent(file) {
  return fetch(file).then((response) => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.text();
  });
}


// Inserts the loaded component HTML into the specified container.
function insertComponent(content, elementId) {
  const container = document.getElementById(elementId);
  if (!container) {
    return;
  }
  container.innerHTML = content;

  if (elementId === "header-container") {
    initializeHeaderUserDropdown();
  }
}


// Initializes the user dropdown in the header after rendering.
function initializeHeaderUserDropdown() {
  setTimeout(() => {
    const loggedInUser = checkUserLogin();
    const guest = JSON.parse(localStorage.getItem("isGuest"));
    let userName = "";
    if (loggedInUser) {
      userName = loggedInUser.name;
    } else if (guest) {
      const guestKanbanData = JSON.parse(
        localStorage.getItem("guestKanbanData")
      );
      userName = guestKanbanData?.users?.guest?.name || "Guest";
    }
    if (userName) {
      setUserInitialsInHeader(userName);
      setupUserDropdownInteractions();
    }
  }, 0);
}


// Sets up the user initials in the header
function setUserInitialsInHeader(userName) {
  const headerInitials = document.getElementById("user-initials-header");
  if (!headerInitials) return;

  const [first, last] = userName.split(" ");
  headerInitials.textContent =
    (first?.charAt(0)?.toUpperCase() || "") +
    (last?.charAt(0)?.toUpperCase() || "");
}


// Handles dropdown menu interactions for the user menu
function setupUserDropdownInteractions() {
  const headerInitials = document.getElementById("user-initials-header");
  if (!headerInitials) return;

  headerInitials.onclick = (e) => {
    e.stopPropagation();
    document.querySelector(".user-dropdown").classList.toggle("active");
  };

  document.onclick = (e) => {
    if (!e.target.closest(".user-menu-container")) {
      document.querySelector(".user-dropdown")?.classList.remove("active");
    }
  };
}


// Loads an HTML component and inserts it into the specified element.
function loadComponent(file, elementId) {
  fetchComponent(file)
    .then((content) => insertComponent(content, elementId))
    .catch((error) => console.error("Error loading component:", error));
}


// Loads the header and sidebar components for logged-in or guest users.
function loadHeaderAndSidebar() {
  loadComponent("header.html", "header-container");
  loadComponent("sidebar.html", "sidebar-container");
}


// Loads the header and sidebar components for logged-out users.
function loadHeaderAndSidebarLoggedOut() {
  loadComponent("header.html", "header-container");
  loadComponent("sidebar_logged_out.html", "sidebar-container");
}


// Initializes the header and sidebar based on the user's login status when the DOM is ready.
document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = checkUserLogin();
  const guest = JSON.parse(localStorage.getItem("isGuest"));
  if (loggedInUser || guest) {
    loadHeaderAndSidebar();
  } else {
    loadHeaderAndSidebarLoggedOut();
  }
});

// Fetches the HTML content of a component file
function fetchComponent(file) {
    return fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        });
}


// Inserts the fetched component HTML into the specified element and sets user initials in the header
function insertComponent(content, elementId) {
    const container = document.getElementById(elementId);
    if (container) {
        container.innerHTML = content;
        const loggedInUser = checkUserLogin(); 
        const guest = JSON.parse(localStorage.getItem("isGuest"));
        if (loggedInUser || guest) {
            const userName = loggedInUser ? loggedInUser.name : "Guest User"; 
            getUserInitialForHeader(userName); 
        }
    } else {
        console.error(`Element with ID "${elementId}" not found.`);
    }
}


// Loads a component file and inserts it into the specified element
function loadComponent(file, elementId) {
    fetchComponent(file)
        .then(content => insertComponent(content, elementId))
        .catch(error => console.error("Error loading component:", error));
}


// Loads the header and sidebar components for logged-in users or guests
function loadHeaderAndSidebar() {
    loadComponent("header.html", "header-container");
    loadComponent("sidebar.html", "sidebar-container");
}


// Loads the header and sidebar components for logged-out users
function loadHeaderAndSidebarLoggedOut() {
    loadComponent("header.html", "header-container");
    loadComponent("sidebar_logged_out.html", "sidebar-container");
}


// On DOMContentLoaded, loads the appropriate header and sidebar based on login state
document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = checkUserLogin(); 
    const guest = JSON.parse(localStorage.getItem("isGuest"));
    if (loggedInUser || guest) {
        loadHeaderAndSidebar();
    } else {
        loadHeaderAndSidebarLoggedOut();
    }
});

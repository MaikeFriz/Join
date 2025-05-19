function fetchComponent(file) {
    return fetch(file)
        .then(response => {
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


function loadComponent(file, elementId) {
    fetchComponent(file)
        .then(content => insertComponent(content, elementId))
        .catch(error => console.error("Error loading component:", error));
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

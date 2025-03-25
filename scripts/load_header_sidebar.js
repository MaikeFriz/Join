// Holt den Inhalt einer Datei per fetch()
function fetchComponent(file) {
    return fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        });
}

// Fügt den geladenen Inhalt in das richtige Element ein
function insertComponent(content, elementId) {
    const container = document.getElementById(elementId);
    if (container) {
        container.innerHTML = content;
    } else {
        console.error(`Element with ID "${elementId}" not found.`);
    }
}

// Lädt eine Komponente, indem sie geholt und eingefügt wird
function loadComponent(file, elementId) {
    fetchComponent(file)
        .then(content => insertComponent(content, elementId))
        .catch(error => console.error("Error loading component:", error));
}

// Lädt alle notwendigen Komponenten der Seite
function loadHeaderAndSidebar() {
    loadComponent("header.html", "header-container");
    loadComponent("sidebar.html", "sidebar-container");
}

// Startet das Laden der Komponenten beim Laden der Seite
document.addEventListener("DOMContentLoaded", loadHeaderAndSidebar);

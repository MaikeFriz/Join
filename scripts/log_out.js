// Logout-Funktion
function logoutUser() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("isGuest");
  localStorage.removeItem("guestKanbanData");
  window.location.href = "./index.html";
}

// Event Delegation für dynamische Elemente
document.body.addEventListener("click", function (event) {
  if (event.target.closest("#logoutButton")) {
    logoutUser();
  }
});

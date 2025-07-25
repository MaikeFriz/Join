/**
 * Handles the logout process when the logout button is clicked.
 * Removes user data from localStorage and redirects to the index page.
 */
document.addEventListener("click", function (event) {
  if (
    event.target.id === "logoutButton" ||
    event.target.closest("#logoutButton")
  ) {
    event.preventDefault();
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isGuest");
    localStorage.removeItem("guestKanbanData");
    window.location.href = "./index.html";
  }
});

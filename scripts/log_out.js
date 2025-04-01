document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logoutButton").addEventListener("click", logoutUser);
});

function logoutUser() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("isGuest");
  localStorage.removeItem("guestKanbanData");
  window.location.href = "./index.html";
}

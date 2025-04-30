document.addEventListener("DOMContentLoaded", () => {
  const checkLogoutButton = setInterval(() => {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
      logoutButton.addEventListener("click", logoutUser);
      clearInterval(checkLogoutButton);
    }
  }, 100);
});

function logoutUser() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("isGuest");
  localStorage.removeItem("guestKanbanData");
  window.location.href = "./index.html";
}

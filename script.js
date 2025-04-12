
// Function to check if the user is logged in and redirect to login page if not
function checkUserLogin() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const guest = JSON.parse(localStorage.getItem("isGuest"));

  if (!user && !guest) {
    window.location.href = "./log_in.html";
  }
  return user;
}

// Function to retrieve the logged-in user's name and display initials in the header
function getUserName() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const guest = JSON.parse(localStorage.getItem("isGuest"));

  if (guest) {
    getUserInitialForHeader("Guest");
  } else if (loggedInUser) {
    let userName = loggedInUser.name;
    getUserInitialForHeader(userName);
  } else {
    window.location.href = "./log_in.html";
  }
}

// Function to extract initials from the user's name and display them in the header
function getUserInitialForHeader(userName) {
  let [firstName, lastName] = userName.split(" ");
  let firstLetter = firstName.charAt(0).toUpperCase();
  let lastNameFirstLetter = lastName ? lastName.charAt(0).toUpperCase() : "";
  let initials = firstLetter + lastNameFirstLetter;
  let headerInitials = document.getElementById("user-initials-header");

  headerInitials.textContent = initials;

  // Event-Listener für das Dropdown
  headerInitials.addEventListener("click", function (event) {
    event.stopPropagation();
    const dropdown = document.querySelector(".user-dropdown");
    dropdown.style.opacity = dropdown.style.opacity === "1" ? "0" : "1";
    dropdown.style.visibility =
      dropdown.style.visibility === "visible" ? "hidden" : "visible";
    dropdown.style.transform =
      dropdown.style.transform === "translateY(0px)"
        ? "translateY(-10px)"
        : "translateY(0px)";
  });

  // Schließen beim Klick außerhalb
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".user-menu-container")) {
      const dropdown = document.querySelector(".user-dropdown");
      dropdown.style.opacity = "0";
      dropdown.style.visibility = "hidden";
      dropdown.style.transform = "translateY(-10px)";
    }
  });

  // Direkter Event-Listener für den Logout-Button
  document.getElementById("logoutButton").addEventListener("click", function (e) {
      e.stopPropagation();
      logoutUser();
    });
}

// Diese Funktion muss global verfügbar sein
function logoutUser() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("isGuest");
  localStorage.removeItem("guestKanbanData");
  window.location.href = "./index.html";
}

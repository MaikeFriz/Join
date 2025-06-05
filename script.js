// Checks if a user or guest is logged in; redirects to login page if not authenticated and not on an excluded page
function checkUserLogin() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const guest = JSON.parse(localStorage.getItem("isGuest"));
  if (!user && !guest) {
    if (!isExcludedPage()) {
      window.location.href = "./log_in.html";
    }
    return;
  }
  return user;
}


// Checks if the current page is excluded from authentication
function isExcludedPage() {
  const excludedPages = [
    "log_in.html",
    "sign_up.html",
    "forgot_password.html",
    "privacy.html",
    "legal.html",
    "privacy_policy_logged_out.html",
    "legal_notice_logged_out.html"
  ];
  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .split("?")[0]
    .split("#")[0];
  return excludedPages.includes(currentPage);
}


// Sets the user initials in the header based on the logged-in user or guest
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


// Sets the user's initials in the header
function setUserInitialsInHeader(userName) {
  let [firstName, lastName] = userName.split(" ");
  let firstLetter = firstName.charAt(0).toUpperCase();
  let lastNameFirstLetter = lastName ? lastName.charAt(0).toUpperCase() : "";
  let initials = firstLetter + lastNameFirstLetter;
  let headerInitials = document.getElementById("user-initials-header");
  if (!headerInitials) {
    return;
  }
  headerInitials.textContent = initials;
}


// Sets up the dropdown toggle for the user initials in the header
function setupUserDropdownToggle() {
  const headerInitials = document.getElementById("user-initials-header");
  if (!headerInitials) return;
  headerInitials.addEventListener("click", function (event) {
    event.stopPropagation();
    const dropdown = document.querySelector(".user-dropdown");
    if (!dropdown) return;
    dropdown.style.opacity = dropdown.style.opacity === "1" ? "0" : "1";
    dropdown.style.visibility =
      dropdown.style.visibility === "visible" ? "hidden" : "visible";
    dropdown.style.transform =
      dropdown.style.transform === "translateY(0px)"
        ? "translateY(-10px)"
        : "translateY(0px)";
  });
}


// Sets up the logout button event listener
function setupLogoutButton() {
  const logoutBtn = document.getElementById("logoutButton");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      logoutUser();
    });
  }
}


// Combines all header setup functions for user initials, dropdown, and logout
function getUserInitialForHeader(userName) {
  setUserInitialsInHeader(userName);
  setupUserDropdownToggle();
  setupLogoutButton();
}


// Initializes the user initials header on DOMContentLoaded if the element exists
document.addEventListener("DOMContentLoaded", () => {
  const userInitialsHeader = document.getElementById("user-initials-header");
  if (!userInitialsHeader) {
    return;
  }
});

// Checks if a user or guest is logged in; redirects to login page if not authenticated and not on an excluded page
function checkUserLogin() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const guest = JSON.parse(localStorage.getItem("isGuest"));
  if (!user && !guest) {
    const excludedPages = [
      "log_in.html",
      "sign_up.html",
      "forgot_password.html",
      "privacy.html",
      "legal.html",
    ];
    const currentPage = window.location.pathname
      .split("/")
      .pop()
      .split("?")[0]
      .split("#")[0];
    if (excludedPages.includes(currentPage)) {
      return;
    } else {
      window.location.href = "./log_in.html";
    }
  }
  return user;
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


// Displays the user's initials in the header and sets up dropdown and logout event listeners
function getUserInitialForHeader(userName) {
  let [firstName, lastName] = userName.split(" ");
  let firstLetter = firstName.charAt(0).toUpperCase();
  let lastNameFirstLetter = lastName ? lastName.charAt(0).toUpperCase() : "";
  let initials = firstLetter + lastNameFirstLetter;
  let headerInitials = document.getElementById("user-initials-header");
  if (!headerInitials) {
    return;
  }
  headerInitials.textContent = initials;
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
  const logoutBtn = document.getElementById("logoutButton");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      logoutUser();
    });
  }
}


// Initializes the user initials header on DOMContentLoaded if the element exists
document.addEventListener("DOMContentLoaded", () => {
  const userInitialsHeader = document.getElementById("user-initials-header");
  if (!userInitialsHeader) {
    return;
  }
});

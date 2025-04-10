// Function to initialize the user name when the page loads
function onloadFunc() {
  getUserName();
}

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
  const headerInitials = document.getElementById("user-initials-header");

  let [firstName, lastName] = userName.split(" ");
  let firstLetter = firstName.charAt(0).toUpperCase();
  let lastNameFirstLetter = lastName ? lastName.charAt(0).toUpperCase() : "";
  let initials = firstLetter + lastNameFirstLetter;

  headerInitials.innerHTML = `
      <div>${initials}</div>
    `;
}


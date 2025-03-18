document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("log-in-form");
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  const errorMessage = document.createElement("p");
  errorMessage.style.color = "red";

  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    return;
  }
  
  form.appendChild(errorMessage);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      errorMessage.textContent = "Email and password are required.";
      return;
    }

    fetch(
      "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/users.json"
    )
      .then((response) => response.json())
      .then((data) => {
        const user = Object.values(data).find(
          (user) => user.email === email && user.password === password
        );

        if (user) {
          errorMessage.textContent = "";
          localStorage.setItem("loggedInUser", JSON.stringify(user));
          window.location.href = "./summary.html";
        } else {
          errorMessage.textContent = "Invalid email or password.";
        }
      })
      .catch((error) => {
        errorMessage.textContent = "Error logging in: " + error.message;
      });
  });
});

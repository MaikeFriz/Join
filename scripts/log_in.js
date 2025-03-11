document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("log-in-form");
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  const errorMessage = document.createElement("p");
  errorMessage.style.color = "red";
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
        const userFound = Object.values(data).some(
          (user) => user.email === email && user.password === password
        );

        errorMessage.textContent = userFound
          ? ""
          : "Invalid email or password.";
        if (userFound) window.location.href = "./index.html";
      })
      .catch((error) => {
        errorMessage.textContent = "Error logging in: " + error.message;
      });
  });
});

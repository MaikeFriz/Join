document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("log-in-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("input_email").value;
    const password = document.getElementById("input_password").value;

    fetch(
      "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/users.json"
    )
      .then((response) => response.json())
      .then((data) => {
        const userFound = Object.values(data).some(
          (user) => user.email === email && user.password === password
        );

        if (userFound) {
          alert("Login successful!");
          window.location.href = "./index.html";
        } else {
          alert("Invalid email or password.");
        }
      })
      .catch((error) => {
        alert("Error logging in: " + error.message);
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("log-in-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("input_email").value;
      const password = document.getElementById("input_password").value;

      fetch(
        "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/users.json"
      )
        .then((response) => response.json())
        .then((data) => {
          let userFound = false;
          for (const key in data) {
            if (data[key].email === email && data[key].password === password) {
              userFound = true;
              break;
            }
          }

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

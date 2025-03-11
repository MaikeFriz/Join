document
  .getElementById("sign-up-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("input_name").value;
    const email = document.getElementById("input_email").value;
    const password = document.getElementById("input_password").value;
    const confirmPassword = document.getElementById(
      "input_confirm_password"
    ).value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = {
      name: name,
      email: email,
      password: password,
    };

    fetch(
      "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/users.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        alert("User signed up successfully!");
      })
      .catch((error) => {
        alert("Error signing up: " + error.message);
      });
  });

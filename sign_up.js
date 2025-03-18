document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("sign-up-form");
  const nameInput = document.getElementById("input_name");
  const emailInput = document.getElementById("input_email");
  const passwordInput = document.getElementById("input_password");
  const confirmPasswordInput = document.getElementById("input_confirm_password");
  const privacyCheckbox = document.getElementById("privacy");
  const errorMessage = document.createElement("p");
  errorMessage.style.color = "red";
  form.appendChild(errorMessage);

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = "<p>User signed up successfully!</p>";
  document.body.appendChild(overlay);
  overlay.style.display = "none";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const userId = email.replace(/@/g, "0").replace(/\./g, "-");
    console.log(userId);
    
    emailInput.setCustomValidity("");
    confirmPasswordInput.setCustomValidity("");

    if (password !== confirmPassword) {
      confirmPasswordInput.setCustomValidity("Passwords do not match!");
      confirmPasswordInput.reportValidity();
      return;
    }

    if (!privacyCheckbox.checked) {
      errorMessage.textContent = "You must accept the Privacy Policy.";
      return;
    }

    try {
      const response = await fetch(
        "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/users.json"
      );
      const data = await response.json();

      if (Object.values(data).some((user) => user.email === email)) {
        emailInput.setCustomValidity("Email already exists!");
        emailInput.reportValidity();
        return;
      }

      await fetch(
        `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, userId }),
        }
      );

      overlay.style.display = "flex";
      setTimeout(() => (window.location.href = "./index.html"), 1000);
    } catch (error) {
      errorMessage.textContent = `Error: ${error.message}`;
    }
  });
});

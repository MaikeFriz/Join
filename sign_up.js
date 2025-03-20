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
        "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData.json"
      );
      const data = await response.json();

      const existingUserIds = Object.keys(data.users || {});
      const maxUserId = existingUserIds.length > 0
        ? Math.max(...existingUserIds.map(id => {
            const userIdNumber = parseInt(id.replace('user', ''), 10);
            return isNaN(userIdNumber) ? 0 : userIdNumber; // Ensure NaN doesn't break the calculation
          }))
        : 0;
      const newUserId = `user${maxUserId + 1}`;

      const newUser = {
        name,
        email,
        password,
        assignedTasks: {
          toDo: {},
          inProgress: {},
          awaitingFeedback: {},
          done: {},
        },
      };

      await fetch(
        `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${newUserId}.json`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );

      overlay.style.display = "flex";
      setTimeout(() => (window.location.href = "./index.html"), 1000);
    } catch (error) {
      errorMessage.textContent = `Error: ${error.message}`;
    }
  });
});

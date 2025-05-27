document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const overlay = document.querySelector('.contact-overlay');
    if (overlay) overlay.classList.add('active');
  }, 30);

  const form = document.getElementById("addContactForm");
  const createBtn = document.getElementById("createBtn");

  function updateButtonState() {
    createBtn.disabled = !form.checkValidity();
  }

  updateButtonState();
  form.addEventListener("input", updateButtonState);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const contact = {
      name: document.getElementById("input_name").value,
      email: document.getElementById("input_email").value,
      phone: document.getElementById("input_phone").value,
    };

    window.parent.postMessage({ type: "createContact", contact: contact }, "*");
  });

  document.querySelector(".close-btn").addEventListener("click", closeAddContactOverlay);
  document.querySelector(".button_cancel").addEventListener("click", closeAddContactOverlay);

  window.addEventListener("message", function(event) {
    if (event.data.type === "startCloseAnimation") {
      closeAddContactOverlay();
    }
  });
});

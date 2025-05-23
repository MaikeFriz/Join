document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const overlay = document.querySelector('.contact-overlay');
    if (overlay) overlay.classList.add('active');
  }, 30);

  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    const contact = {
      name: document.getElementById("input_name").value,
      email: document.querySelector("input[type='email']").value,
      phone: document.querySelector("input[type='tel']").value,
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

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    const contact = {
      name: document.getElementById("input_name").value,
      email: document.querySelector("input[type='email']").value,
      phone: document.querySelector("input[type='tel']").value,
    };

    // Send the contact data to the parent window
    window.parent.postMessage({ type: "createContact", contact: contact }, "*");
  });

  document.querySelector(".close-btn").addEventListener("click", function () {
    window.parent.postMessage({ type: "closeOverlay" }, "*");
  });
});

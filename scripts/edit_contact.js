document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const contactId = urlParams.get("contactId");
  const userId = JSON.parse(localStorage.getItem("loggedInUser")).userId;

  fetch(
    `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/contacts/${contactId}.json`
  )
    .then((response) => response.json())
    .then((contact) => {
      document.getElementById("input_name").value = contact.name;
      document.querySelector("input[type='email']").value = contact.email;
      document.querySelector("input[type='tel']").value = contact.phone;
    });

  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    const contact = {
      id: contactId,
      name: document.getElementById("input_name").value,
      email: document.querySelector("input[type='email']").value,
      phone: document.querySelector("input[type='tel']").value,
    };

    window.parent.postMessage({ type: "editContact", contact: contact }, "*");
  });

  document.querySelector(".close-btn").addEventListener("click", function () {
    window.parent.postMessage({ type: "closeOverlay" }, "*");
  });

  document
    .querySelector(".button_cancel")
    .addEventListener("click", function () {
      window.parent.postMessage({ type: "closeOverlay" }, "*");
    });
});

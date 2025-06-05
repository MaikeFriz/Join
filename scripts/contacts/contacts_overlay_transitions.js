/**
 * Creates and styles the overlay div element.
 * @returns {HTMLDivElement} The overlay div element.
 */
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.classList.add("overlay");
  return overlay;
}

/**
 * Creates and styles the iframe for the overlay.
 * @param {string} url - The URL to load in the iframe.
 * @returns {HTMLIFrameElement} The overlay iframe element.
 */
function createOverlayIframe(url) {
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.classList.add("overlay-iframe");

  function setIframeSize() {
    iframe.style.border = "none";
    iframe.style.borderRadius = "30px";
  }

  setIframeSize();
  window.addEventListener("resize", setIframeSize);

  return iframe;
}

/**
 * Adds a click listener to close the overlay when clicking outside the iframe.
 * @param {HTMLDivElement} overlay - The overlay div element.
 */
function addOverlayCloseListener(overlay) {
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      const iframe = overlay.querySelector('.overlay-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "startCloseAnimation" }, "*");
      } else {
        closeOverlay();
      }
    }
  });
}

/**
 * Opens an overlay with the given URL loaded in an iframe.
 * @param {string} url - The URL to load in the overlay iframe.
 */
function openOverlay(url) {
  const overlay = createOverlay();
  overlay.classList.add('overlay-fade-in'); 
  const iframe = createOverlayIframe(url);
  iframe.classList.add('overlay-iframe-fade-in');
  overlay.appendChild(iframe);
  document.body.appendChild(overlay);
  addOverlayCloseListener(overlay);
}

/**
 * Removes the overlay from the DOM.
 */
function closeOverlay() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

/**
 * Removes the overlay iframe from the DOM.
 */
function removeOverlayIframe() {
  const iframe = document.getElementById("dein-iframe-id"); // Adjust the ID if needed!
  if (iframe) iframe.remove();
}

/**
 * Opens the overlay iframe in the parent with animation.
 * @param {HTMLIFrameElement} iframe - The overlay iframe element.
 */
window.openOverlayIframe = function(iframe) {
  setTimeout(() => {
    iframe.classList.add("active");
  }, 30);
};

/**
 * Closes the overlay iframe in the parent with animation.
 * @param {HTMLIFrameElement} iframe - The overlay iframe element.
 * @param {HTMLDivElement} overlay - The overlay div element.
 */
window.closeOverlayIframe = function(iframe, overlay) {
  if (iframe) {
    iframe.classList.remove('active');
    if (overlay) document.body.removeChild(overlay);
    setTimeout(() => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }, 600); 
  } else if (overlay) {
    document.body.removeChild(overlay);
  }
};

/**
 * Opens the overlay in the iframe with animation.
 */
window.openContactOverlay = function() {
  const overlay = document.querySelector('.contact-overlay');
  if (overlay) {
    overlay.classList.add('active');
  }
};

/**
 * Closes the overlay in the iframe with animation and notifies the parent.
 */
window.closeContactOverlay = function() {
  const overlay = document.querySelector('.contact-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => {
      window.parent.postMessage({ type: "closeOverlay" }, "*");
    }, 300);
  } else {
    window.parent.postMessage({ type: "closeOverlay" }, "*");
  }
}

/**
 * Closes the add contact overlay and notifies the parent window.
 */
function closeAddContactOverlay() {
  const overlay = document.querySelector('.contact-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => {
      window.parent.postMessage({ type: "closeOverlay" }, "*");
    }, 300);
  } else {
    window.parent.postMessage({ type: "closeOverlay" }, "*");
  }
}

/**
 * Closes the edit contact overlay and notifies the parent window.
 */
function closeEditContactOverlay() {
  const overlay = document.querySelector('.contact-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => {
      window.parent.postMessage({ type: "closeOverlay" }, "*");
    }, 300);
  } else {
    window.parent.postMessage({ type: "closeOverlay" }, "*");
  }
}

/**
 * Adds event listeners to close the overlay for close/cancel buttons in iframe.
 */
function addCloseListeners() {
  document.querySelector(".close-btn").addEventListener("click", closeEditContactOverlay);
  document.querySelector(".button_cancel").addEventListener("click", closeEditContactOverlay);
}

/**
 * Handles messages from the overlay iframe or parent window.
 */
window.addEventListener("message", function (event) {
  if (event.data.type === "createContact") {
    const newContact = event.data.contact;
    addContact(newContact);
    closeOverlay();
  } else if (event.data.type === "closeOverlay") {
    closeOverlay();
    removeOverlayIframe();
  } else if (event.data.type === "editContact") {
    const updatedContact = event.data.contact;
    updateContact(updatedContact);
    if (JSON.parse(localStorage.getItem("isGuest"))) {
      renderContacts();
      displayContactDetails(updatedContact.id);
    }
    closeOverlay();
  }
});

/**
 * Handles overlay close animation and removal on message.
 */
window.addEventListener("message", function (event) {
  if (event.data.type === "closeOverlay") {
    const overlay = document.getElementById("overlay");
    const iframe = document.querySelector('.overlay-iframe');
    if (iframe) {
      iframe.classList.add('d-none');
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "startContentCloseAnimation" }, "*");
      }
    }
    if (overlay) document.body.removeChild(overlay);
  }
});

/**
 * Handles start close animation in iframe.
 */
window.addEventListener("message", function(event) {
  if (event.data.type === "startCloseAnimation") {
    window.closeContactOverlay();
  }
});

/**
 * Handles iframe content ready (parent and iframe).
 */
window.addEventListener("message", function (event) {
  if (event.data.type === "iframeContentReady") {
    const iframe = document.querySelector('.overlay-iframe');
    if (iframe) iframe.classList.add('active');
  }
});

/**
 * Handles iframe content ready for the contact overlay.
 */
window.addEventListener("message", function(event) {
  if (event.data.type === "iframeContentReady") {
    const overlay = document.getElementById("overlay");
    const iframe = document.querySelector('.overlay-iframe');
    if (overlay) overlay.classList.add('active');
    if (iframe) iframe.classList.add('active');
  }
});

/**
 * Handles DOMContentLoaded to add the contact overlay class and notify parent.
 */
document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.querySelector('.contact-overlay');
  if (overlay) overlay.classList.add('active');
  setTimeout(() => {
    window.parent.postMessage({ type: "iframeContentReady" }, "*");
  }, 400); 
});




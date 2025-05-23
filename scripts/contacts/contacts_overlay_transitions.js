// 1. Overlay creation functions

// Creates and styles the overlay div element.
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
    zIndex: "1000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });
  return overlay;
}

// Creates and styles the iframe for the overlay.
function createOverlayIframe(url) {
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.classList.add("overlay-iframe");
  Object.assign(iframe.style, {
    width: "85%",
    height: "85%",
    border: "none",
    borderRadius: "30px",
  });
  return iframe;
}

// Adds a click listener to close the overlay when clicking outside the iframe.
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

// 2. Overlay open/close functions (parent)

// Opens an overlay with the given URL loaded in an iframe.
function openOverlay(url) {
  const overlay = createOverlay();
  const iframe = createOverlayIframe(url);
  overlay.appendChild(iframe);
  document.body.appendChild(overlay);
  addOverlayCloseListener(overlay);

  setTimeout(() => {
    iframe.classList.add("active");
  }, 30);
}

// Removes the overlay from the DOM.
function closeOverlay() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

// Removes the overlay iframe from the DOM.
function removeOverlayIframe() {
  const iframe = document.getElementById("dein-iframe-id"); // Adjust the ID if needed!
  if (iframe) iframe.remove();
}

// Closes the add contact overlay and notifies the parent window.
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

// Closes the edit contact overlay and notifies the parent window.
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

// 3. Overlay open/close functions (animation, parent & iframe)

// Opens the overlay iframe in the parent (animation)
window.openOverlayIframe = function(iframe) {
  setTimeout(() => {
    iframe.classList.add("active");
  }, 30);
};

// Closes the overlay iframe in the parent (with animation)
window.closeOverlayIframe = function(iframe, overlay) {
  if (iframe) {
    iframe.classList.remove('active');
    setTimeout(() => {
      if (overlay) document.body.removeChild(overlay);
    }, 600);
  } else if (overlay) {
    document.body.removeChild(overlay);
  }
};

// Opens the overlay in the iframe (animation)
window.openContactOverlay = function() {
  const overlay = document.querySelector('.contact-overlay');
  if (overlay) {
    setTimeout(() => {
      overlay.classList.add('active');
    }, 30);
  }
};

// Closes the overlay in the iframe (animation + notify parent)
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

// 4. Message event listeners

// Handles messages from the overlay iframe or parent window
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

// Handles special cases for closing the overlay iframe
window.addEventListener("message", function (event) {
  if (event.data.type === "closeOverlay") {
    removeOverlayIframe();
  }
});

// Listener for parent message (in the iframe)
window.addEventListener("message", function(event) {
  if (event.data.type === "startCloseAnimation") {
    window.closeContactOverlay();
  }
});

// 5. Overlay open animation on DOMContentLoaded (for iframe overlays)
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const overlay = document.querySelector('.contact-overlay');
    if (overlay) overlay.classList.add('active');
  }, 30);
});




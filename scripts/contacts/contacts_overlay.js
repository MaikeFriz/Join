
// Opens an overlay with the given URL loaded in an iframe.
function openOverlay(url) {
  const overlay = createOverlay();
  const iframe = createOverlayIframe(url);
  overlay.appendChild(iframe);
  document.body.appendChild(overlay);
  addOverlayCloseListener(overlay);
}

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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  Object.assign(iframe.style, {
    width: "80%",
    height: "80%",
    border: "none",
    borderRadius: "8px",
  });
  return iframe;
}

// Adds a click listener to close the overlay when clicking outside the iframe.
function addOverlayCloseListener(overlay) {
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeOverlay();
    }
  });
}

// Removes the overlay from the DOM.
function closeOverlay() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    document.body.removeChild(overlay);
  }
}
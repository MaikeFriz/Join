/**
 * Initializes the contacts page and checks login state.
 */
document.addEventListener("DOMContentLoaded", initContactsPage);

window.addEventListener("resize", handleResponsiveContactDetails);

document.addEventListener("DOMContentLoaded", initAddContactForm);

/**
 * Initializes the contacts page and redirects if not logged in or guest.
 */
function initContactsPage() {
  if (!isUserLoggedInOrGuest()) {
    window.location.href = "./log_in.html";
    return;
  }
  renderContacts();
  setupAddContactButtons();
}

/**
 * Checks if a user or guest is logged in.
 * @returns {boolean} True if user or guest is logged in, otherwise false.
 */
function isUserLoggedInOrGuest() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  return user || isGuest;
}

/**
 * Adds event listeners to add contact buttons.
 */
function setupAddContactButtons() {
  const addContactBtn = document.getElementById("add-contact-button");
  if (addContactBtn) {
    addContactBtn.addEventListener("click", () => openOverlay("add_contact.html"));
  }
  const floatingButton = document.querySelector(".add-contact-floating-button");
  if (floatingButton) {
    floatingButton.addEventListener("click", () => openOverlay("add_contact.html"));
  }
}

/**
 * Handles responsive UI for contact details on window resize.
 */
function handleResponsiveContactDetails() {
  const isMobile = window.innerWidth <= 980;
  const rightSideContent = document.querySelector(".right-side-content-contacts");
  const contactDetails = document.querySelector(".contact-details");
  const contactsList = document.querySelector(".contacts-list");
  const contactDetailsVisible = contactDetails && rightSideContent && rightSideContent.contains(contactDetails);
  if (isMobile && contactDetailsVisible) {
    if (contactsList) contactsList.classList.add("hide-on-mobile");
    const selected = document.querySelector('.contacts-list ul li.contact-highlight');
    const contactId = selected ? selected.getAttribute('data-contact-id') : null;
    showActionButton(contactId);
  } else {
    if (contactsList) contactsList.classList.remove("hide-on-mobile");
    showAddButton();
  }
}

/**
 * Displays the contact details for the given contactId, for guest or user.
 * @param {string} contactId - The contact ID.
 */
function displayContactDetails(contactId) {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  if (isGuest) {
    displayGuestContactDetails(contactId);
    return;
  }
  displayUserContactDetails(contactId);
}

/**
 * Displays guest contact details in the UI.
 * @param {string} contactId - The contact ID.
 */
function displayGuestContactDetails(contactId) {
  const contact = fetchGuestContactById(contactId);
  if (!contact) return;
  removeExistingContactDetails();
  const { initials, initialClass } = getInitialsAndClass(contact.name);
  const newDiv = createContactDetailsDiv(contact, initials, initialClass);
  renderContactDetailsDiv(newDiv);
  addGuestContactDetailListeners(contactId);
  highlightSelectedContact(contactId);
  
  if (window.innerWidth <= 980) {
    showActionButton(contactId);
  }
}

/**
 * Adds the mobile action menu button for user contacts.
 * @param {string} contactId - The contact ID.
 */
function addMobileActionMenu(contactId) {
  const actionButton = createMobileActionButton();
  document.body.appendChild(actionButton);
  actionButton.addEventListener("click", () =>
    showMobileActionMenu(contactId, actionButton)
  );
}

/**
 * Creates the floating action button for mobile actions.
 * @returns {HTMLButtonElement} The action button element.
 */
function createMobileActionButton() {
  const btn = document.createElement("button");
  btn.id = "action-button";
  btn.className = "action-button";
  btn.innerHTML = `<img src="./assets/img/more_vert.svg" alt="Actions" style="width: 24px; height: 24px;">`;
  return btn;
}

/**
 * Shows the mobile action menu for a contact.
 * @param {string} contactId - The contact ID.
 * @param {HTMLElement} actionButton - The action button element.
 */
function showMobileActionMenu(contactId, actionButton) {
  const oldMenu = document.getElementById("mobile-action-menu");
  if (oldMenu) oldMenu.remove();

  const actionMenu = createMobileActionMenu();
  actionMenu.id = "mobile-action-menu";
  document.body.appendChild(actionMenu);

  setTimeout(() => {
    addMobileActionMenuListeners(actionMenu, contactId, actionButton);
  }, 0);
}

/**
 * Creates the mobile action menu element.
 * @returns {HTMLDivElement} The action menu element.
 */
function createMobileActionMenu() {
  const actionMenu = document.createElement("div");
  actionMenu.className = "mobile-action-menu";
  actionMenu.innerHTML = mobileActionMenuTemplate();
  return actionMenu;
}

/**
 * Adds event listeners to the mobile action menu buttons and closes the menu on outside click.
 * @param {HTMLElement} actionMenu - The action menu element.
 * @param {string} contactId - The contact ID.
 * @param {HTMLElement} actionButton - The action button element.
 */
function addMobileActionMenuListeners(actionMenu, contactId, actionButton) {
  actionMenu
    .querySelector("#mobile-edit-contact-button")
    .addEventListener("click", () => handleMobileEditContact(actionMenu, contactId));

  actionMenu
    .querySelector("#mobile-delete-contact-button")
    .addEventListener("click", () => handleMobileDeleteContact(actionMenu, contactId));

  addOutsideClickListener(actionMenu, actionButton);
}

/**
 * Handles the edit action in the mobile action menu.
 * @param {HTMLElement} actionMenu - The action menu element.
 * @param {string} contactId - The contact ID.
 */
function handleMobileEditContact(actionMenu, contactId) {
  openOverlay(`./edit_contact.html?contactId=${contactId}`);
  document.body.removeChild(actionMenu);
}

/**
 * Handles the delete action in the mobile action menu.
 * @param {HTMLElement} actionMenu - The action menu element.
 * @param {string} contactId - The contact ID.
 */
function handleMobileDeleteContact(actionMenu, contactId) {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  if (isGuest) {
    deleteGuestContact(contactId);
  } else {
    deleteContact(contactId);
  }
  document.body.removeChild(actionMenu);
}

/**
 * Adds an outside click listener to close the mobile action menu.
 * @param {HTMLElement} actionMenu - The action menu element.
 * @param {HTMLElement} actionButton - The action button element.
 */
function addOutsideClickListener(actionMenu, actionButton) {
  setTimeout(() => {
    document.addEventListener(
      "click",
      (event) => {
        if (!actionMenu.contains(event.target) && event.target !== actionButton) {
          if (document.body.contains(actionMenu)) {
            document.body.removeChild(actionMenu);
          }
        }
      },
      { once: true }
    );
  }, 0);
}

/**
 * Initializes the add contact form: sets up validation, events, and disables the save button initially.
 */
function initAddContactForm() {
  if (!document.getElementById("addContactForm")) return;
  setupAddContactForm();
  disableCreateButton();
}

/**
 * Sets up the add contact form with handlers and templates.
 */
function setupAddContactForm() {
  setupContactForm({
    formId: "addContactForm",
    saveBtnId: "createBtn",
    onSubmit: function() {
      const contact = {
        name: document.getElementById("input_name").value,
        email: document.getElementById("input_email").value,
        phone: document.getElementById("input_phone").value,
      };
      window.parent.postMessage({ type: "createContact", contact: contact }, "*");
    },
    closeOverlayFn: closeAddContactOverlay,
    inputFieldsId: "add_contact_input_fields",
    inputFieldsTemplate: contactInputFieldsTemplate
  });
}

/**
 * Disables the create button initially for validation purposes.
 */
function disableCreateButton() {
  const saveBtn = document.getElementById("createBtn");
  if (saveBtn) {
    saveBtn.setAttribute('aria-disabled', 'true');
    saveBtn.disabled = true;
  }
}

/**
 * Shows a toast notification when a contact is saved.
 */
function showContactSavedToast() {
  const toast = document.getElementById('contact-toast');
  if (!toast) return;
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 2600);
}

/**
 * Shows the add contact button and removes the action button if it exists.
 */
function showAddButton() {
  const addBtn = document.querySelector('.add-contact-floating-button');
  const actionBtn = document.getElementById('action-button');
  if (addBtn) addBtn.style.display = '';
  if (actionBtn) actionBtn.remove();
}

/**
 * Shows the action button for mobile view when a contact is selected.
 * @param {string} contactId - The contact ID.
 */
function showActionButton(contactId) {
  const addBtn = document.querySelector('.add-contact-floating-button');
  const actionBtn = document.getElementById('action-button');
  if (addBtn) addBtn.style.display = 'none';
  if (!actionBtn && contactId) addMobileActionMenu(contactId);
}

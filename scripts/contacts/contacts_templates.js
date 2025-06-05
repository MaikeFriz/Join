/**
 * Returns the HTML template for displaying contact details.
 * @param {Object} contact - The contact object.
 * @param {string} initials - The initials of the contact.
 * @param {string} initialClass - The CSS class for the initials badge.
 * @returns {string} The HTML string for the contact details.
 */
function contactDetailsTemplate(contact, initials, initialClass) {
  return `
    <h1 class="contact-headline">
      Contacts
      <span class="vertical-line"></span>
      <span class="team-tagline">Better with a Team</span>
    </h1>
    <div class="contact-header">
      <div class="contact-initials ${initialClass}">${initials}</div>
      <div class="contact-name">
        <p>${contact.name}</p>
        <div class="contact-buttons">
          <button id="edit-contact-button" class="desktop-visible">
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="#2A3647"/>
            </svg>
            Edit
          </button>
          <button id="delete-contact-button" class="desktop-visible">
            <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
    <div class="contact-details-info">
      <h3>Contact Information</h3>
      <p>
        <strong>Email:</strong><br>
        <a href="mailto:${contact.email}">${contact.email}</a>
      </p>
      <p>
        <strong>Phone:</strong><br>
        <span>${contact.phone}</span>
      </p>
    </div>
    
        <button id="reload-page-button" class="reload-page-button" onclick="location.reload()">
          <img src="./assets/img/arrow-left-line.svg" alt="Back" style="width: 32px; height: 32px;">
        </button>
  `;
}

/**
 * Returns the HTML template for the contact headline.
 * @returns {string} The HTML string for the contact headline.
 */
function contactHeadlineTemplate() {
  return `
    <h1 class="contact-headline">
      Contacts
      <span class="vertical-line"></span>
      <span class="team-tagline">Better with a Team</span>
    </h1>
  `;
}

/**
 * Returns the HTML template for the mobile action menu.
 * @returns {string} The HTML string for the mobile action menu.
 */
function mobileActionMenuTemplate() {
  return `
    <button id="mobile-edit-contact-button" class="mobile-edit-contact-button">
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="#2A3647"/>
      </svg>
      Edit
    </button>
    <button id="mobile-delete-contact-button" class="mobile-delete-contact-button">
      <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
      </svg>
      Delete
    </button>
  `;
}

/**
 * Returns the HTML template for the contact input fields.
 * @returns {string} The HTML string for the contact input fields.
 */
function contactInputFieldsTemplate() {
  return `
    <label class="input_label">
      <div class="input_wrapper">
        <input
          id="input_name"
          type="text"
          required
          placeholder="Name"
          pattern="^.*\\S+.*\\s+.*\\S+.*$"
        />
        <div class="input_icon">
          <img src="./assets/img/placeholder_mail_input.svg" alt="Name" />
        </div>
      </div>
      <span class="name-input-error input-error">
        Please enter first and last name.
      </span>
    </label>

    <label class="input_label">
      <div class="input_wrapper">
        <input
          id="input_email"
          type="email"
          required
          placeholder="Email"
          pattern="^[^@\\s]+@[^@\\s]+\\.[a-zA-Z]{2,}$"
        />
        <div class="input_icon">
          <img src="./assets/img/placeholder_lock_input_field.svg" alt="Email" />
        </div>
      </div>
      <div class="error-message">
        <span class="email-input-error input-error" id="email_error">
          Please enter a valid email address.
        </span>
      </div>
    </label>

    <label class="input_label">
      <div class="input_wrapper">
        <input
          id="input_phone"
          type="tel"
          required
          placeholder="Phone"
          pattern="^\\+?\\s?[0-9][0-9 ]*$"
        />
        <div class="input_icon">
          <img src="./assets/img/call.svg" alt="Phone" />
        </div>
      </div>
      <span class="phone-input-error input-error">
        Please enter a valid phone number.
      </span>
    </label>
  `;
}


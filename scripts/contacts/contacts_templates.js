
// Returns the HTML template for displaying contact details.
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
        <p><strong>${contact.name}</strong></p>
        <div class="contact-buttons">
          <button id="edit-contact-button" class="desktop-visible">
            <img src="./assets/img/edit.svg" alt="Edit" style="width: 16px; height: 16px; margin-right: 5px;">
            Edit
          </button>
          <button id="delete-contact-button" class="desktop-visible">
            <img src="./assets/img/delete.svg" alt="Delete" style="width: 16px; height: 16px; margin-right: 5px;">
            Delete
          </button>
        </div>
      </div>
    </div>
    <div class="contact-details-info">
      <h3>Contact Information</h3>
      <p>
        <strong>Email:</strong><br><br>
        <a href="mailto:${contact.email}">${contact.email}</a>
      </p>
      <br>
      <p>
        <strong>Phone:</strong><br><br>
        <span>${contact.phone}</span>
      </p>
    </div>
    ${
      window.innerWidth <= 768
        ? `<button id="reload-page-button" style="margin-top: 20px; display: flex; align-items: center; gap: 5px; background: none; border: none; cursor: pointer; color: #007bff; font-size: 16px;">
             <img src="./assets/img/arrow-left-line.svg" alt="Back" style="width: 16px; height: 16px;">
           </button>`
        : ""
    }
  `;
}
/**
 * Handles the change event for a date input and formats the selected date.
 * @param {Event} event - The change event from the date input.
 */
function handleDateChange(event) {
    const inputDate = event.target;
    const isoDate = inputDate.value;
    if (!isoDate) {
        return;
    }
    const formattedDate = formatDate(isoDate);
}

/**
 * Formats an ISO date string to "DD/MM/YYYY".
 * @param {string} isoDate - The ISO date string.
 * @returns {string} The formatted date string.
 */
function formatDate(isoDate) {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Formats an ISO date string to "YYYY-MM-DD" for input fields.
 * @param {string} isoDate - The ISO date string.
 * @returns {string} The formatted date string for input fields.
 */
function formatDateForInput(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}
/**
 * Wird aufgerufen, wenn sich der Wert des Datumseingabefelds ändert.
 * @param {Event} event - Das Event-Objekt des Eingabefelds.
 */
function handleDateChange(event) {
    const inputDate = event.target;
    const isoDate = inputDate.value; // ISO-Format (YYYY-MM-DD)

    if (!isoDate) {
        console.log("Invalid date input");
        return;
    }

    const formattedDate = formatDate(isoDate); // DD/MM/YYYY
    console.log("Date input changed to (formatted):", formattedDate);
}

/**
 * Formatiert ein gegebenes ISO-Datum in das Format "DD/MM/YYYY".
 * @param {string} isoDate - Das ISO-Datum (z. B. "2025-04-19T12:00:00.000Z").
 * @returns {string} - Das formatierte Datum im Format "DD/MM/YYYY".
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
 * Formatiert ein gegebenes ISO-Datum in das Format "YYYY-MM-DD".
 * Dieses Format wird für `<input type="date">` benötigt.
 * @param {string} isoDate - Das ISO-Datum (z. B. "2025-04-19T12:00:00.000Z").
 * @returns {string} - Das formatierte Datum im Format "YYYY-MM-DD".
 */
function formatDateForInput(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Format YYYY-MM-DD
}
// Returns initials and CSS class for a contact name.
function getInitialsAndClass(name) {
const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
let initialClass;
if (/^\d$/.test(initials[0])) {
    initialClass = "number";
} else {
    initialClass = initials[0].toLowerCase();
}
return { initials, initialClass };
}
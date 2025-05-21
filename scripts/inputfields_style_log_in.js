// Toggles the visibility of the login password input field and updates the icon
function togglePasswordLogIn() {
    const passwordInput = document.getElementById("input_password");
    const passwordIcon = document.getElementById("password_icon");
    const isPasswordVisible = passwordInput.type === "text";
    passwordInput.type = isPasswordVisible ? "password" : "text";
    updatePasswordIconLogIn(passwordInput, passwordIcon);
}


// Updates the icon for the login password input field based on its state
function updatePasswordIconLogIn(passwordInput, passwordIcon) {
    if (passwordInput.value.length > 0) {
        passwordIcon.src = passwordInput.type === "password"
            ? "./assets/img/visibility_off.svg"
            : "./assets/img/visibility.svg";
    } else {
        passwordIcon.src = "./assets/img/placeholder_lock_input_field.svg";
    }
}


// Adds click event listener to toggle password visibility icon
document.getElementById("toggle_icon").addEventListener("click", togglePasswordLogIn);

// Adds input event listener to update the password icon as the user types
document.getElementById("input_password").addEventListener("input", function () {
    updatePasswordIconLogIn(
        document.getElementById("input_password"),
        document.getElementById("password_icon")
    );
});


// Initializes the password icon on page load
updatePasswordIconLogIn(
    document.getElementById("input_password"),
    document.getElementById("password_icon")
);



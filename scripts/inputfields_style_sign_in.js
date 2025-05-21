// Shows the password in the sign-up password input field
function showPassword() {
    const passwordInputSignUp = document.getElementById("input_password_sign_up");
    passwordInputSignUp.type = "text";
    updatePasswordVisibilityIcon();
}


// Hides the password in the sign-up password input field
function hidePassword() {
    const passwordInputSignUp = document.getElementById("input_password_sign_up");
    passwordInputSignUp.type = "password";
    updatePasswordVisibilityIcon();
}


// Toggles the visibility of the sign-up password input field
function togglePasswordSignUp() {
    const passwordInputSignUp = document.getElementById("input_password_sign_up");
    if (passwordInputSignUp.type === "password") {
        showPassword();
    } else {
        hidePassword();
    }
}


// Updates the icon for the sign-up password input field based on its state
function updatePasswordVisibilityIcon() {
    const passwordInputSignUp = document.getElementById("input_password_sign_up");
    const passwordIconSignUp = document.getElementById("icon_password_sign_up");
    if (passwordInputSignUp.value.length === 0) {
        passwordIconSignUp.src = "./assets/img/placeholder_lock_input_field.svg";
    } else if (passwordInputSignUp.type === "password") {
        passwordIconSignUp.src = "./assets/img/visibility_off.svg";
    } else {
        passwordIconSignUp.src = "./assets/img/visibility.svg";
    }
}


// Handles input event for the sign-up password field and updates the icon
function handlePasswordInput() {
    updatePasswordVisibilityIcon();
}
document.addEventListener("DOMContentLoaded", updatePasswordVisibilityIcon);


// Shows the confirm password in the confirm password input field
function showConfirmPassword() {
    const confirmPasswordInput = document.getElementById("input_confirm_password_sign_up");
    confirmPasswordInput.type = "text";
    updateConfirmPasswordVisibilityIcon();
}


// Hides the confirm password in the confirm password input field
function hideConfirmPassword() {
    const confirmPasswordInput = document.getElementById("input_confirm_password_sign_up");
    confirmPasswordInput.type = "password";
    updateConfirmPasswordVisibilityIcon();
}


// Toggles the visibility of the confirm password input field
function toggleConfirmPasswordVisibility() {
    const confirmPasswordInput = document.getElementById("input_confirm_password_sign_up");
    if (confirmPasswordInput.type === "password") {
        showConfirmPassword();
    } else {
        hideConfirmPassword();
    }
}


// Updates the icon for the confirm password input field based on its state
function updateConfirmPasswordVisibilityIcon() {
    const confirmPasswordInput = document.getElementById("input_confirm_password_sign_up");
    const confirmPasswordIcon = document.getElementById("icon_confirm_password_sign_up");

    if (confirmPasswordInput.value.length === 0) {
        confirmPasswordIcon.src = "./assets/img/placeholder_lock_input_field.svg";
    } else if (confirmPasswordInput.type === "password") {
        confirmPasswordIcon.src = "./assets/img/visibility_off.svg";
    } else {
        confirmPasswordIcon.src = "./assets/img/visibility.svg";
    }
}


// Handles input event for the confirm password field and updates the icon
function handleConfirmPasswordInput() {
    updateConfirmPasswordVisibilityIcon();
}
document.addEventListener("DOMContentLoaded", updateConfirmPasswordVisibilityIcon);

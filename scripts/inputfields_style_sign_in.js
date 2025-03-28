

function showPassword() {
    const passwordInputSignUp = document.getElementById("input_password_sign_up");
    passwordInputSignUp.type = "text";
    updatePasswordVisibilityIcon();
}

function hidePassword() {
    const passwordInputSignUp = document.getElementById("input_password_sign_up");
    passwordInputSignUp.type = "password";
    updatePasswordVisibilityIcon();
}

function togglePasswordSignUp() {
    const passwordInputSignUp = document.getElementById("input_password_sign_up");

    if (passwordInputSignUp.type === "password") {
        showPassword();
    } else {
        hidePassword();
    }
}

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

function handlePasswordInput() {
    updatePasswordVisibilityIcon();
}
document.addEventListener("DOMContentLoaded", updatePasswordVisibilityIcon);


// Confirm Password

function showConfirmPassword() {
    const confirmPasswordInput = document.getElementById("input_confirm_password_sign_up");
    confirmPasswordInput.type = "text";
    updateConfirmPasswordVisibilityIcon();
}

function hideConfirmPassword() {
    const confirmPasswordInput = document.getElementById("input_confirm_password_sign_up");
    confirmPasswordInput.type = "password";
    updateConfirmPasswordVisibilityIcon();
}

function toggleConfirmPasswordVisibility() {
    const confirmPasswordInput = document.getElementById("input_confirm_password_sign_up");

    if (confirmPasswordInput.type === "password") {
        showConfirmPassword();
    } else {
        hideConfirmPassword();
    }
}

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

function handleConfirmPasswordInput() {
    updateConfirmPasswordVisibilityIcon();
}
document.addEventListener("DOMContentLoaded", updateConfirmPasswordVisibilityIcon);

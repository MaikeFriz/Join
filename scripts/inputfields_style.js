//--------------------------------------------------------------------Log In
function togglePassword() {
    const passwordInput = document.getElementById("input_password");
    const passwordIcon = document.getElementById("password_icon");
    const isPasswordVisible = passwordInput.type === "text";
    passwordInput.type = isPasswordVisible ? "password" : "text";
    updatePasswordIcon(passwordInput, passwordIcon);
}

function updatePasswordIcon(passwordInput, passwordIcon) {
    if (passwordInput.value.length > 0) {
        passwordIcon.src = passwordInput.type === "password"
            ? "./assets/img/visibility_off.svg"
            : "./assets/img/visibility.svg";
    } else {
        passwordIcon.src = "./assets/img/placeholder_lock_input_field.svg"; 
    }
}

document.getElementById("toggle_icon").addEventListener("click", togglePassword);
document.getElementById("input_password").addEventListener("input", function() {
    updatePasswordIcon(
        document.getElementById("input_password"),
        document.getElementById("password_icon")
    );
});

updatePasswordIcon(
    document.getElementById("input_password"),
    document.getElementById("password_icon")
);

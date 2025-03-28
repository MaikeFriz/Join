function togglePasswordLogIn() {
    const passwordInput = document.getElementById("input_password");
    const passwordIcon = document.getElementById("password_icon");
    const isPasswordVisible = passwordInput.type === "text";
    passwordInput.type = isPasswordVisible ? "password" : "text";
    updatePasswordIconLogIn(passwordInput, passwordIcon);
}

function updatePasswordIconLogIn(passwordInput, passwordIcon) {
    if (passwordInput.value.length > 0) {
        passwordIcon.src = passwordInput.type === "password"
            ? "./assets/img/visibility_off.svg"
            : "./assets/img/visibility.svg";
    } else {
        passwordIcon.src = "./assets/img/placeholder_lock_input_field.svg";
    }
}

document.getElementById("toggle_icon").addEventListener("click", togglePasswordLogIn);
document.getElementById("input_password").addEventListener("input", function () {
    updatePasswordIconLogIn(
        document.getElementById("input_password"),
        document.getElementById("password_icon")
    );
});

updatePasswordIconLogIn(
    document.getElementById("input_password"),
    document.getElementById("password_icon")
);



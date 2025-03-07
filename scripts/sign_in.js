function checkCheckbox() {
    let checkBoxImage = document.getElementById('check_box_image');

    if (checkBoxImage.src.includes('disabled_checkbox.svg')) {
        checkBoxImage.src = './assets/img/checked_checkbox.svg';
    } else {
        checkBoxImage.src = './assets/img/disabled_checkbox.svg';
    }
}
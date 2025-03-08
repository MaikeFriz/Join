function init(){
    changeHoverImgLowPriority();
    changeHoverImgMediumPriority();
    changeHoverImgUrgentPriority()
}

//Change Design of priority buttons when hover
function changeHoverImgLowPriority(){
    let lowSymbolImg = document.getElementById('low_symbol_img');
    let lowButton = document.getElementById('low_button');

    lowButton.addEventListener('mouseover', () => {
        lowSymbolImg.src = './assets/img/low_symbol_hover.svg';
    });
    
    lowButton.addEventListener('mouseout', () => {
        lowSymbolImg.src = './assets/img/low_symbol.svg';
    });
}

function changeHoverImgMediumPriority(){
    let mediumSymbolImg = document.getElementById('medium_symbol_img');
    let mediumButton = document.getElementById('medium_button');

    mediumButton.addEventListener('mouseover', () => {
        mediumSymbolImg.src = './assets/img/medium_symbol_hover.svg';
    });
    
    mediumButton.addEventListener('mouseout', () => {
        mediumSymbolImg.src = './assets/img/medium_symbol.svg';
    });
}

function changeHoverImgUrgentPriority(){
    let urgentSymbolImg = document.getElementById('urgent_symbol_img');
    let urgentButton = document.getElementById('urgent_button');

    urgentButton.addEventListener('mouseover', () => {
        urgentSymbolImg.src = './assets/img/urgent_symbol_hover.svg';
    });
    
    urgentButton.addEventListener('mouseout', () => {
        urgentSymbolImg.src = './assets/img/urgent_symbol.svg';
    });
}
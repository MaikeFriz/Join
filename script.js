let localDatabase = [];

const BASE_URL = "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/.json";

function onloadFunc(){
    fetchKanbanDataFromFireBase();
}

async function fetchKanbanDataFromFireBase() {
    let response = await fetch(BASE_URL);
    let responseToJson = await response.json();
    console.log(responseToJson);
    
}


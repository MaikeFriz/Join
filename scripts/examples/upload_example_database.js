
const BASE_URL = "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/users.json";

async function uploadExampleDatabase() {
        await fetch(BASE_URL, {
          method: "PUT", // Ersetzt die gesamte Datenbank
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(localDatabaseExamples),
        });
        console.log("Beispieldaten erfolgreich hochgeladen.");
      }
      
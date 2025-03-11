
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
      
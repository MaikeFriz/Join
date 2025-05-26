# Join – Projektmanagement leicht gemacht

**Join** ist eine moderne Web-App zur Visualisierung und Verwaltung von Aufgaben in Projektteams. Sie wurde mit **HTML**, **CSS**, **JavaScript**, **Git** und **Firebase** entwickelt. Die App bietet eine übersichtliche Benutzeroberfläche zur Verwaltung von Aufgaben, Verantwortlichkeiten und Fortschritt im Team – ideal für kleine bis mittlere Projekte.


## Live-Demo

[Zur Anwendung](https://join-437.developerakademie.net/Join/index.html)


## Funktionen

- Aufgaben erstellen, bearbeiten und löschen
- Aufgaben in Status-Spalten organisieren: *To Do*, *In Progress*, *Done*
- Drag-and-Drop zur einfachen Aufgabenverwaltung
- Responsive Design für Desktop und Mobile
- Datenbank-Anbindung mit **Firebase**

## Installation

1. **Repository klonen:**

   ```bash
   git clone https://github.com/dein-nutzername/join.git
   ```

2. **Projekt öffnen:**

   Öffne den Ordner in deinem Code-Editor (z. B. Visual Studio Code).

3. **Projekt starten:**

   Öffne die Datei `index.html` im Browser. Die Anwendung funktioniert direkt lokal – es ist keine zusätzliche Installation erforderlich.

> ℹ️ Für die vollständige Funktionalität, z. B. das Speichern von Aufgaben, ist eine bestehende Verbindung zur enthaltenen **Firebase-Datenbank** erforderlich.

## 💡 Verwendung / Nutzung

1. Starte die App durch Öffnen der `index.html`.
2. Erstelle neue Aufgaben über das Eingabeformular.
3. Verschiebe Aufgaben per Drag & Drop zwischen den Spalten.
4. Bearbeite oder lösche Aufgaben nach Bedarf.
5. Behalte Überblick über den Status und die Verantwortlichkeiten im Projektteam.

## 🔍 Beispielcode

```javascript
// Beispiel: Eine neue Aufgabe erstellen
function createTask(title, description, assignedTo) {
  return {
    id: Date.now(),
    title,
    description,
    assignedTo,
    status: 'To Do'
  };
}
```

## Mitwirkende

- **Maike Friz**
- **Marcel Sörensen**
- **Uros Nedeljkovic**
- **Thierno Diallo**

## Lizenz

Dieses Projekt steht unter der **MIT-Lizenz**.  
Du darfst den Code frei verwenden, kopieren, verändern und weitergeben, solange ein Hinweis auf die ursprünglichen Autor:innen erhalten bleibt.

[Mehr zur MIT-Lizenz](https://opensource.org/licenses/MIT)


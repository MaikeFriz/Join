let localDatabaseExamples = {

    "sofiaMueller": {
      "name": "Sofia Müller",
      "email": "sofia-mueller@keine.de",
      "password": "1234",
      "assignedTasks": {
        "todos": {
          "task1": {
            "title": "Kochwelt Page & Recipe Recommender",
            "description": "Build start page with recipe recommendation",
            "label": "User Story",
            "assignees": ["anjaSchulz", "benediktZiegler"],
            "createdAt": "2025-03-11T09:00:00Z",
            "priority": "urgent"
          },
          "task2": {
            "title": "Create Recipe Database Schema",
            "description": "Create schema for recipe database",
            "label": "Technical Task",
            "assignees": ["antonMayer", "evaFischer"],
            "createdAt": "2025-03-11T09:30:00Z",
            "priority": "medium"
          }
        },
        "inProgress": {
          "task1": {
            "title": "Page Layout Design",
            "description": "Design layout for the recipe page with responsive grid",
            "label": "CSS",
            "assignees": ["antonMayer", "manuelSchmidt"],
            "createdAt": "2025-03-11T10:00:00Z",
            "priority": "medium"
          }
        },
        "awaitingFeedback": {
          "task1": {
            "title": "HTML Markup for Recipe Card",
            "description": "Create HTML structure for displaying recipe cards",
            "label": "HTML",
            "assignees": ["evaFischer", "manuelSchmidt"],
            "createdAt": "2025-03-11T12:00:00Z",
            "priority": "low"
          }
        },
        "done": {
          "task1": {
            "title": "Fix Login Button",
            "description": "Fix issue with the login button not working on mobile devices",
            "label": "Technical Task",
            "assignees": ["antonMayer"],
            "createdAt": "2025-03-12T10:30:00Z",
            "priority": "urgent"
          },
          "task2": {
            "title": "Write CSS for Recipe Cards",
            "description": "Create the styles for recipe cards including hover effect",
            "label": "CSS",
            "assignees": ["anjaSchulz", "manuelSchmidt"],
            "createdAt": "2025-03-12T12:00:00Z",
            "priority": "medium"
          }
        }
      }
    },
    "antonMayer": {
      "name": "Anton Mayer",
      "email": "anton.mayer@keine.de",
      "password": "password123",
      "assignedTasks": {
        "todos": {
          "task1": {
            "title": "Fix Login Button",
            "description": "Fix issue with the login button not working on mobile devices",
            "label": "Technical Task",
            "assignees": ["sofiaMueller", "manuelSchmidt"],
            "createdAt": "2025-03-12T10:30:00Z",
            "priority": "urgent"
          }
        },
        "inProgress": {
          "task1": {
            "title": "Page Layout Design",
            "description": "Design layout for the recipe page with responsive grid",
            "label": "CSS",
            "assignees": ["sofiaMueller", "manuelSchmidt"],
            "createdAt": "2025-03-11T10:00:00Z",
            "priority": "medium"
          }
        },
        "awaitingFeedback": {
          "task1": {
            "title": "Create JavaScript Slider",
            "description": "Develop a JavaScript slider for recipe images",
            "label": "JavaScript",
            "assignees": ["sofiaMueller", "benediktZiegler"],
            "createdAt": "2025-03-12T14:00:00Z",
            "priority": "medium"
          }
        },
        "done": {
          "task1": {
            "title": "Create Recipe Search Function",
            "description": "Develop a search function for the recipe database",
            "label": "JavaScript",
            "assignees": ["benediktZiegler"],
            "createdAt": "2025-03-12T14:30:00Z",
            "priority": "urgent"
          }
        }
      }
    },
    "anjaSchulz": {
      "name": "Anja Schulz",
      "email": "anja.schulz@keine.de",
      "password": "password456",
      "assignedTasks": {
        "todos": {
          "task1": {
            "title": "Kochwelt Page & Recipe Recommender",
            "description": "Build start page with recipe recommendation",
            "label": "User Story",
            "assignees": ["sofiaMueller", "benediktZiegler"],
            "createdAt": "2025-03-11T09:00:00Z",
            "priority": "urgent"
          }
        },
        "inProgress": {
          "task1": {
            "title": "Write CSS for Recipe Cards",
            "description": "Create the styles for recipe cards including hover effect",
            "label": "CSS",
            "assignees": ["sofiaMueller", "manuelSchmidt"],
            "createdAt": "2025-03-12T12:00:00Z",
            "priority": "medium"
          }
        },
        "done": {
          "task1": {
            "title": "Fix Footer Layout",
            "description": "Fix layout of footer on all pages",
            "label": "CSS",
            "assignees": ["manuelSchmidt"],
            "createdAt": "2025-03-12T11:00:00Z",
            "priority": "low"
          }
        }
      }
    },
    "benediktZiegler": {
      "name": "Benedikt Ziegler",
      "email": "benedikt.ziegler@keine.de",
      "password": "password789",
      "assignedTasks": {
        "todos": {},
        "inProgress": {},
        "done": {}
      }
    },
    "evaFischer": {
      "name": "Eva Fischer",
      "email": "eva.fischer@keine.de",
      "password": "password101",
      "assignedTasks": {
        "todos": {
          "task1": {
            "title": "Recipe Image Upload Feature",
            "description": "Add feature for uploading recipe images",
            "label": "Technical Task",
            "assignees": ["sofiaMueller", "manuelSchmidt"],
            "createdAt": "2025-03-12T09:00:00Z",
            "priority": "medium"
          }
        },
        "inProgress": {},
        "awaitingFeedback": {
          "task1": {
            "title": "Recipe Details Page",
            "description": "Design and implement the recipe details page",
            "label": "HTML",
            "assignees": ["sofiaMueller", "manuelSchmidt"],
            "createdAt": "2025-03-12T16:00:00Z",
            "priority": "low"
          }
        },
        "done": {}
      }
    },
    "davidEisenberg": {
      "name": "David Eisenberg",
      "email": "david.eisenberg@keine.de",
      "password": "password112",
      "assignedTasks": {
        "todos": {},
        "inProgress": {},
        "awaitingFeedback": {},
        "done": {}
      }
    },
    "emanuelMauer": {
      "name": "Emanuel Mauer",
      "email": "emanuel.mauer@keine.de",
      "password": "password113",
      "assignedTasks": {
        "todos": {},
        "inProgress": {},
        "awaitingFeedback": {},
        "done": {}
      }
    },
    "manuelSchmidt": {
      "name": "Manuel Schmidt",
      "email": "manuel.schmidt@keine.de",
      "password": "password114",
      "assignedTasks": {
        "todos": {
          "task1": {
            "title": "Add Search Bar to Homepage",
            "description": "Add a search bar to the homepage",
            "label": "Technical Task",
            "assignees": ["antonMayer", "evaFischer"],
            "createdAt": "2025-03-12T10:00:00Z",
            "priority": "medium"
          }
        },
        "inProgress": {},
        "done": {}
      }
    }
  }
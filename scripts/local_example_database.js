let localDatabaseExamples = {

    "users": {
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
              "assignees": ["sofiaMueller", "anjaSchulz", "benediktZiegler"],
              "createdAt": "2025-03-11T09:00:00Z",
              "priority": "high"
            },
            "task2": {
              "title": "Create Recipe Database Schema",
              "description": "Create schema for recipe database",
              "label": "Technical Task",
              "assignees": ["antonMayer", "sofiaMueller"],
              "createdAt": "2025-03-11T09:30:00Z",
              "priority": "medium"
            }
          },
          "inProgress": {
            "task1": {
              "title": "Page Layout Design",
              "description": "Design layout for the recipe page with responsive grid",
              "label": "CSS",
              "assignees": ["antonMayer", "sofiaMueller"],
              "createdAt": "2025-03-11T10:00:00Z",
              "priority": "medium"
            }
          },
          "awaitingFeedback": {
            "task1": {
              "title": "HTML Markup for Recipe Card",
              "description": "Create HTML structure for displaying recipe cards",
              "label": "HTML",
              "assignees": ["sofiaMueller", "evaFischer"],
              "createdAt": "2025-03-11T12:00:00Z",
              "priority": "low"
            }
          },
          "done": {
            "task1": {
              "title": "Recipe Recommendation Algorithm",
              "description": "Write the algorithm to suggest recipes based on user preferences",
              "label": "JavaScript",
              "assignees": ["benediktZiegler", "davidEisenberg"],
              "createdAt": "2025-03-10T15:00:00Z",
              "priority": "high"
            },
            "task2": {
              "title": "Backend API for Recipe Management",
              "description": "Set up the backend API for managing recipes, CRUD operations",
              "label": "Technical Task",
              "assignees": ["antonMayer", "emanuelMauer"],
              "createdAt": "2025-03-09T14:00:00Z",
              "priority": "high"
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
              "assignees": ["antonMayer", "sofiaMueller"],
              "createdAt": "2025-03-12T10:30:00Z",
              "priority": "high"
            }
          },
          "inProgress": {
            "task1": {
              "title": "Page Layout Design",
              "description": "Design layout for the recipe page with responsive grid",
              "label": "CSS",
              "assignees": ["antonMayer", "sofiaMueller"],
              "createdAt": "2025-03-11T10:00:00Z",
              "priority": "medium"
            }
          },
          "awaitingFeedback": {
            "task1": {
              "title": "Create JavaScript Slider",
              "description": "Develop a JavaScript slider for recipe images",
              "label": "JavaScript",
              "assignees": ["antonMayer", "sofiaMueller"],
              "createdAt": "2025-03-12T14:00:00Z",
              "priority": "medium"
            }
          },
          "done": {
            "task1": {
              "title": "Backend API for Recipe Management",
              "description": "Set up the backend API for managing recipes, CRUD operations",
              "label": "Technical Task",
              "assignees": ["antonMayer", "emanuelMauer"],
              "createdAt": "2025-03-09T14:00:00Z",
              "priority": "high"
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
              "assignees": ["sofiaMueller", "anjaSchulz", "benediktZiegler"],
              "createdAt": "2025-03-11T09:00:00Z",
              "priority": "high"
            }
          },
          "inProgress": {
            "task1": {
              "title": "Write CSS for Recipe Cards",
              "description": "Create the styles for recipe cards including hover effect",
              "label": "CSS",
              "assignees": ["anjaSchulz", "sofiaMueller"],
              "createdAt": "2025-03-12T12:00:00Z",
              "priority": "medium"
            }
          },
          "awaitingFeedback": {},
          "done": {}
        }
      },
      "benediktZiegler": {
        "name": "Benedikt Ziegler",
        "email": "benedikt.ziegler@keine.de",
        "password": "password789",
        "assignedTasks": {
          "todos": {},
          "inProgress": {
            "task1": {
              "title": "Create Recipe Search Function",
              "description": "Develop a search function for the recipe database",
              "label": "JavaScript",
              "assignees": ["benediktZiegler", "sofiaMueller"],
              "createdAt": "2025-03-12T14:30:00Z",
              "priority": "high"
            }
          },
          "awaitingFeedback": {},
          "done": {
            "task1": {
              "title": "Recipe Recommendation Algorithm",
              "description": "Write the algorithm to suggest recipes based on user preferences",
              "label": "JavaScript",
              "assignees": ["benediktZiegler", "davidEisenberg"],
              "createdAt": "2025-03-10T15:00:00Z",
              "priority": "high"
            }
          }
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
              "assignees": ["evaFischer", "sofiaMueller"],
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
              "assignees": ["evaFischer", "sofiaMueller"],
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
          "done": {
            "task1": {
              "title": "Recipe Recommendation Algorithm",
              "description": "Write the algorithm to suggest recipes based on user preferences",
              "label": "JavaScript",
              "assignees": ["benediktZiegler", "davidEisenberg"],
              "createdAt": "2025-03-10T15:00:00Z",
              "priority": "high"
            }
          }
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
          "done": {
            "task1": {
              "title": "Backend API for Recipe Management",
              "description": "Set up the backend API for managing recipes, CRUD operations",
              "label": "Technical Task",
              "assignees": ["antonMayer", "emanuelMauer"],
              "createdAt": "2025-03-09T14:00:00Z",
              "priority": "high"
            }
          }
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
              "assignees": ["manuelSchmidt", "antonMayer"],
              "createdAt": "2025-03-12T10:00:00Z",
              "priority": "medium"
            }
          },
          "inProgress": {
            "task1": {
              "title": "Fix Footer Layout",
              "description": "Fix layout of footer on all pages",
              "label": "CSS",
              "assignees": ["manuelSchmidt", "evaFischer"],
              "createdAt": "2025-03-12T11:00:00Z",
              "priority": "low"
            }
          },
          "awaitingFeedback": {},
          "done": {
            "task1": {
              "title": "User Authentication System",
              "description": "Create the user authentication system for the app",
              "label": "JavaScript",
              "assignees": ["manuelSchmidt", "antonMayer"],
              "createdAt": "2025-03-11T13:00:00Z",
              "priority": "high"
            }
          }
        }
      }
    }
  }
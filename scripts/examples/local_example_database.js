let localExampleDatabase = {

  "users": {
    "user1": {
      "name": "Sofia Müller",
      "email": "sofia.mueller@keine.de",
      "password": "1234",
      "assignedTasks": {
        "toDo": {
          "task1": true,
          "task5": true
        },
        "inProgress": {
          "task3": true,
          "task7": true
        },
        "awaitingFeedback": {},
        "done": {
          "task4": true
        }
      }
    },
    "user2": {
      "name": "Anton Mayer",
      "email": "anton.mayer@keine.de",
      "password": "password123",
      "assignedTasks": {
        "toDo": {},
        "inProgress": {
          "task6": true
        },
        "awaitingFeedback": {},
        "done": {}
      }
    },
    "user3": {
      "name": "Anja Schulz",
      "email": "anja.schulz@keine.de",
      "password": "password456",
      "assignedTasks": {
        "toDo": {
          "task2": true
        },
        "inProgress": {},
        "awaitingFeedback": {},
        "done": {
          "task4": true
        }
      }
    },
    "user4": {
      "name": "Benedikt Ziegler",
      "email": "benedikt.ziegler@keine.de",
      "password": "password789",
      "assignedTasks": {
        "toDo": {},
        "inProgress": {},
        "awaitingFeedback": {},
        "done": {}
      }
    },
    "user5": {
      "name": "Eva Fischer",
      "email": "eva.fischer@keine.de",
      "password": "password101",
      "assignedTasks": {
        "toDo": {
          "task8": true
        },
        "inProgress": {},
        "awaitingFeedback": {
          "task9": true
        },
        "done": {}
      }
    },
    "user6": {
      "name": "David Eisenberg",
      "email": "david.eisenberg@keine.de",
      "password": "password112",
      "assignedTasks": {
        "toDo": {},
        "inProgress": {},
        "awaitingFeedback": {},
        "done": {}
      }
    },
    "user7": {
      "name": "Emanuel Mauer",
      "email": "emanuel.mauer@keine.de",
      "password": "password113",
      "assignedTasks": {
        "toDo": {},
        "inProgress": {},
        "awaitingFeedback": {},
        "done": {}
      }
    },
    "user8": {
      "name": "Manuel Schmidt",
      "email": "manuel.schmidt@keine.de",
      "password": "password114",
      "assignedTasks": {
        "toDo": {
          "task10": true
        },
        "inProgress": {},
        "awaitingFeedback": {},
        "done": {}
      }
    }
  },
  "tasks": {
    "task1": {
      "label": "User Story",
      "title": "Kochwelt Page & Recipe Recommender",
      "description": "Build start page with recipe recommendation",
      "createdAt": "2025-03-11T08:30:00Z",
      "updatedAt": "2025-03-14T09:00:00Z",
      "priority": "urgent",
      "createdBy": "user1",
      "assignees": {
        "user1": true,
        "user3": true
      },
      "subtasks": {
        "subtask1": true,
        "subtask2": false
      }
    },
    "task2": {
      "label": "Technical Task",
      "title": "Create Recipe Database Schema",
      "description": "Create schema for recipe database",
      "createdAt": "2025-03-11T08:30:00Z",
      "updatedAt": "2025-03-14T09:00:00Z",
      "priority": "medium",
      "createdBy": "user1",
      "assignees": {
        "user1": true,
        "user3": true
      },
      "subtasks": {
        "subtask1": true,
        "subtask2": true
      }
    },
    "task3": {
      "label": "CSS",
      "title": "Page Layout Design",
      "description": "Design layout for the recipe page with responsive grid",
      "createdAt": "2025-03-12T08:30:00Z",
      "updatedAt": "2025-03-14T09:00:00Z",
      "priority": "medium",
      "createdBy": "user2",
      "assignees": {
        "user1": true,
        "user2": true
      },
      "subtasks": {
        "subtask1": true,
        "subtask2": false
      }
    },
    "task4": {
      "label": "Technical Task",
      "title": "Fix Login Button",
      "description": "Fix issue with the login button not working on mobile devices",
      "createdAt": "2025-03-11T08:30:00Z",
      "updatedAt": "2025-03-14T09:00:00Z",
      "priority": "urgent",
      "createdBy": "user3",
      "assignees": {
        "user2": true,
        "user3": true
      },
      "subtasks": {
        "subtask1": true,
        "subtask2": false
      }
    },
    "task5": {
      "label": "JavaScript",
      "title": "Create Recipe Search Function",
      "description": "Develop a search function for the recipe database",
      "createdAt": "2025-03-12T08:30:00Z",
      "updatedAt": "2025-03-14T09:00:00Z",
      "priority": "low",
      "createdBy": "user1",
      "assignees": {
        "user1": true,
        "user2": true
      },
      "subtasks": {
        "subtask1": true
      }
    },
    "task6": {
      "label": "CSS",
      "title": "Write CSS for Recipe Cards",
      "description": "Create the styles for recipe cards including hover effect",
      "createdAt": "2025-03-11T08:30:00Z",
      "updatedAt": "2025-03-14T09:00:00Z",
      "priority": "medium",
      "createdBy": "user2",
      "assignees": {
        "user2": true,
        "user1": true
      },
      "subtasks": {
        "subtask1": true,
        "subtask2": true
      }
    },
    "task7": {
      "label": "JavaScript",
      "title": "Create JavaScript Slider",
      "description": "Develop a JavaScript slider for recipe images",
      "createdAt": "2025-03-12T08:30:00Z",
      "updatedAt": "2025-03-14T09:00:00Z",
      "priority": "medium",
      "createdBy": "user1",
      "assignees": {
        "user1": true,
        "user3": true
      },
      "subtasks": {
        "subtask1": false,
        "subtask2": true
      }
    },
    "task8": {
      "label": "Technical Task",
      "title": "Recipe Image Upload Feature",
      "description": "Add feature for uploading recipe images",
      "createdAt": "2025-03-12T08:30:00Z",
      "updatedAt": "2025-03-14T09:00:00Z",
      "priority": "medium",
      "createdBy": "user5",
      "assignees": {
        "user5": true
      },
      "subtasks": {
        "subtask1": true
      }
    },
    "task9": {
      "label": "HTML",
      "title": "Recipe Details Page",
      "description": "Design and implement the recipe details page",
      "createdAt": "2025-03-12T08:30:00Z",
      "updatedAt": "2025-03-14T09:00:00Z",
      "priority": "low",
      "createdBy": "user5",
      "assignees": {
        "user5": true
      },
      "subtasks": {
        "subtask1": true
      }
    },
    "task10": {
      "label": "Technical Task",
      "title": "Add Search Bar to Homepage",
      "description": "Add a search bar to the homepage",
      "createdAt": "2025-03-12T08:30:00Z",
      "updatedAt": "2025-03-14T09:00:00Z",
      "priority": "medium",
      "createdBy": "user8",
      "assignees": {
        "user8": true
      },
      "subtasks": {
        "subtask1": true
      }
    }
  }
}

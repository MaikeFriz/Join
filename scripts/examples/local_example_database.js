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
        "subtask3": true,
        "subtask4": true
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
        "subtask5": true,
        "subtask6": false
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
        "subtask7": true,
        "subtask8": false
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
        "subtask9": true
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
        "subtask10": true,
        "subtask11": true
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
        "subtask12": false,
        "subtask13": true
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
        "subtask14": true
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
        "subtask15": true
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
        "subtask16": true
      }
    }
  },
  "subtasks": {
    "subtask1": {
      "title": "Design homepage layout",
      "task1": true
    },
    "subtask2": {
      "title": "Implement recipe card design",
      "task1": true
    },
    "subtask3": {
      "title": "Design database schema",
      "task2": true
    },
    "subtask4": {
      "title": "Implement schema validation",
      "task2": true
    },
    "subtask5": {
      "title": "Setup responsive grid",
      "task3": true
    },
    "subtask6": {
      "title": "Test layout on devices",
      "task3": true
    },
    "subtask7": {
      "title": "Debug mobile login issue",
      "task4": true
    },
    "subtask8": {
      "title": "Optimize button placement",
      "task4": true
    },
    "subtask9": {
      "title": "Build search function logic",
      "task5": true
    },
    "subtask10": {
      "title": "Style hover effects",
      "task6": true
    },
    "subtask11": {
      "title": "Ensure cross-browser compatibility",
      "task6": true
    },
    "subtask12": {
      "title": "Develop image slider logic",
      "task7": true
    },
    "subtask13": {
      "title": "Optimize slider animations",
      "task7": true
    },
    "subtask14": {
      "title": "Create image upload UI",
      "task8": true
    },
    "subtask15": {
      "title": "Add detailed recipe sections",
      "task9": true
    },
    "subtask16": {
      "title": "Embed search functionality",
      "task10": true
    }
  }
}

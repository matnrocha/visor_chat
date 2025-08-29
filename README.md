# Project Overview

This project is a full-stack chat application. It delivers messaging with AI-generated responses and includes:

- Secure user authentication with JWT and password hashing;

- LLM (Gemini) integration using the Factory Pattern, allowing seamless extension to other AI providers;

- Modular and clean architecture, separating models, services, controllers, repositories, and routes;

- Clean, responsive UI built with shadcn/ui and reusable components;

- Unit and integration testing using Jest, supertest, and in-memory MongoDB.

The application emphasizes scalability, testability, and clean code practices, laying a solid foundation for long-term growth and maintainability.



## Application explanation

- Each sent message is recorded and displayed in the user interface.

- The back-end receives the message, processes it, and automatically responds using Gemini API.
- Previous messages are used for context, so the chat can understand the user better.

- Messages, Users, Sessions are stored in database.

- The front-end automatically updates the message history after each interaction.
- Users can delete and change the title of the chats.

## Tech Stack

### Front-end
- React.js with Typescript
- Axios (for HTTP requests)
- Tailwind.css
- Lucide React icons

### Back-end
- Node.js with Typescript
- Express.js
- MongoDB (non-relational database)
- Jest, Superteste (unit testing)

---

### Some Backend Structure Details

1. Single Responsability
* `Controllers`: Only receive requests and return responses;
* `Services`:  Contain all business logic;
* `Models`: Define MongoDB data structures;

2. Implicit Dependency Injection
* Services are imported directly into controllers;
* Facilitates mocking in tests;

3. Automated Testing
* `Jest + Supertest`: runnable using `npm test`in root;

4. Routes Documentation
* See Swagger Documentation in `http://localhost:3000/api-docs`;


### Some Frontend Structure Details

1. Modular Archtecture:
* `components/ui/`: Button, Card, Input...;
* `components/chat/`: Components with "Logic";

2. Custom Hooks:
* `hooks/useChat.ts`: Reusable chat logic;
* `hooks/useAuth.ts`: Manages authentication;

3. API Calls:
* `api/chat.ts`: All the API calls;


## How to Run the Project

### Prerequisites

- Docker

- [Get a Gemini API Key](https://aistudio.google.com/app/apikey)
    - On the website, click the "Create API Key" button, copy it, and save it.


### Setup Steps

1. Clone the repository:
   ```bash
    git clone https://github.com/matnrocha/visor_chat.git
    cd visor_chat
   ```
2. Configure the environment variables in both the backend and the frontend.
    ```bash
    cp backend/.env.example backend/.env
    cp client/.env.example client/.env
    ```
3. In the backend `.env`, insert your `GEMINI_API_KEY`

4. Run the containers: 
    ```bash
    docker-compose up --build
    ```
5. Test the application in `http://localhost:5173/`
---

In case of any questions about the project or dificulties on how to run, please get in touch:
mateusanroc@gmail.com





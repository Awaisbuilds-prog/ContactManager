# Contact Manager

A contact management application built using React, Node.js, Express.js, and MongoDB. It allows users to manage contact information through a simple user interface.

## Features

- Add new contacts
- View all saved contacts
- Update existing contacts
- Delete contacts
- Validate contact information
- Prevent duplicate email addresses
- Handle errors and invalid requests
- Store contacts in MongoDB

## Technologies Used

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **ODM:** Mongoose

## Project Structure

```text
ContactManager/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
├── backend/
│   ├── models/
│   │   └── Contact.js
│   ├── routes/
│   │   └── contacts.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## Requirements

- Node.js and npm
- MongoDB connection
- A web browser

## Installation and Setup

### 1. Backend Setup

Open a terminal and run:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and configure your MongoDB connection:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Replace the example connection string with your own MongoDB connection string. Do not share your real credentials.

Start the backend:

```bash
npm run dev
```

### 2. Frontend Setup

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in the terminal, usually `http://localhost:5173/`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/contacts` | Retrieve all contacts |
| GET | `/api/contacts/:id` | Retrieve a contact by ID |
| POST | `/api/contacts` | Create a new contact |
| PUT | `/api/contacts/:id` | Update a contact |
| DELETE | `/api/contacts/:id` | Delete a contact |

## Production Build

To build the frontend for production:

```bash
cd frontend
npm run build
```

## Security

- Keep database credentials in the backend `.env` file.
- Do not upload `.env` or `node_modules` to a public repository.
- Configure appropriate environment variables before running the application.

## Author

Developed as a contact management application project.

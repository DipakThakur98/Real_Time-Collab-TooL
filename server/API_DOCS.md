# API Documentation - Collaborative Tool

Base URL: `http://localhost:5000/api`

## Authentication
### Register
- **POST** `/auth/register`
- **Body**: `{ username, email, password }`
- **Response**: `201 Created`

### Login
- **POST** `/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ token, user: { id, username, email } }`

## Documents
### Create Document
- **POST** `/documents` (Auth Required)
- **Response**: `{ id, message }`

### List Documents
- **GET** `/documents` (Auth Required)
- **Response**: `Array of Document objects`

### Get Document
- **GET** `/documents/:id` (Auth Required)
- **Response**: `Document object`

## Chat
### Get Messages
- **GET** `/messages/:documentId` (Auth Required)
- **Response**: `Array of Message objects`

### Send Message
- **POST** `/messages` (Auth Required)
- **Body**: `{ documentId, content }`
- **Response**: `201 Created`

## WebSockets (Socket.IO)
### Events (Client -> Server)
- `join-document`: `(documentId)`
- `send-changes`: `(delta, documentId)`
- `typing`: `(documentId)`
- `save-document`: `(content, documentId)`
- `send-message`: `(message, documentId)`

### Events (Server -> Client)
- `load-document`: `(content)`
- `receive-changes`: `(delta)`
- `user-list`: `(Array of usernames)`
- `user-typing`: `(username)`
- `receive-message`: `(message)`

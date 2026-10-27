# Campus Lost and Found

A React + Express + MongoDB application for reporting lost items, submitting claims, and allowing administrators to manage item and claim workflows.

## Features

- User registration and sign-in
- Lost/found item reporting and browsing
- Claim submission and claim-status workflows
- Admin routes for managing users, items, and claims
- Image upload using Multer and Cloudinary storage
- JWT-protected API routes
- React frontend with a separate Express backend

## Tech stack

- Frontend: React, React Router, Axios
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT
- Image storage: Cloudinary

## Project structure

```text
campus-lost-found/
├── campus-lost-found-backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── campus-lost-found-frontend/
│   ├── public/
│   └── src/
└── package.json
```

## Local setup

Requirements: Node.js, npm, and a reachable MongoDB database. Cloudinary credentials are needed for image uploads.

### 1. Install dependencies

From the repository root:

```powershell
npm install
npm run install:all
```

### 2. Configure the backend

Create `campus-lost-found-backend/.env` with values for your environment:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

The server connects to the `lostfound` database. Never commit real credentials.

### 3. Configure the frontend

Create `campus-lost-found-frontend/.env` and set the API base URL expected by the frontend:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start the application

From the repository root:

```powershell
npm run dev
```

The root script starts the backend and frontend concurrently. The frontend normally runs at `http://localhost:3000`; the backend uses port `5000` unless configured otherwise.

## Production notes

- Configure `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, and the Cloudinary variables in the hosting provider.
- Set the frontend API base URL to the deployed backend.
- Restrict CORS to the real frontend origin(s).
- Verify that authorization checks prevent users from changing or viewing other users' private claims.
- Do not advertise a live demo until registration, item reporting, claiming, uploads, and admin workflows have been tested on the deployed version.

## API overview

The backend mounts routes under:

- `/api/auth`
- `/api/items`
- `/api/admin`
- `/api/claims`

Check the route files for the current supported methods and payloads.

## Recommended next steps

- Add automated tests for authentication, authorization, item and claim workflows.
- Add CI checks for backend tests and frontend production builds.
- Add verified screenshots and a short walkthrough.

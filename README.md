# Campus Lost and Found

A full-stack web application for managing lost and found items on a college campus. Users can report lost items, claim found items, and administrators can verify users and manage the system. Built with React, Express, and MongoDB.

## Quick Look

- Live Demo: [Coming Soon]
- Frontend: React, React Router, Tailwind CSS, Axios
- Backend: Express, MongoDB, JWT auth
- Deployment: Vercel frontend, Render backend, MongoDB Atlas database

## Preview

The application is ready for deployment. A screenshot can be added here next, but the project is structured for separate frontend and backend hosting plus a hosted MongoDB database.

## Why This Project

This project was built to create a practical solution for campus communities to efficiently manage lost and found items. It demonstrates role-based access with separate user and admin workflows, JWT-based authentication, and a deployable full-stack architecture. It shows how to structure a React and Express application that works locally during development and scales to production with environment-based configuration, hosted services, and a shared cloud database.

## Engineering Highlights

- Role-based flows for users and administrators
- JWT-backed authentication for protected actions
- Express API split into auth, item, claim, and admin route modules
- MongoDB-backed persistence for users, items, and claims
- Frontend API configuration moved to environment variables for local and deployed environments
- Backend supports serving the production React build for a single-server deployment model
- Image upload handling with Multer and college ID verification

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Axios
- Backend: Node.js, Express, MongoDB
- Authentication: JWT-based auth with protected user/admin flows

## Architecture

- React frontend handles signup, login, item reporting, claiming, and admin dashboard
- Express backend exposes modular route groups for auth, items, claims, and admin actions
- MongoDB stores application data for users, items, claims, and uploaded files
- Express can also serve the built frontend for a single-service deployment path

## Features

- User and admin signup/login
- Item reporting and claiming for users
- Admin dashboard for managing items and claims
- Image upload for items and college ID verification
- Email notifications for claims
- Responsive design with Tailwind CSS

## Project Structure

```text
campus-lost-found/
|-- campus-lost-found-backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- uploads/
|   `-- server.js
`-- campus-lost-found-frontend/
    |-- public/
    |-- src/
    `-- build/  # generated for production
```

## Run Locally

### 1. Backend environment

Create `campus-lost-found-backend/.env` from example:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus-lost-found
JWT_SECRET=your-secret-key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 2. Frontend environment

Create `campus-lost-found-frontend/.env` from example:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Install dependencies

```powershell
npm install
npm run install:all
```

### 4. Start MongoDB

```powershell
mongod
```

### 5. Start the full project

```powershell
npm run dev
```

Open `http://localhost:3000`.

## Production Build

To serve the React build through Express:

```powershell
cd campus-lost-found-frontend
npm run build
cd ..\campus-lost-found-backend
npm start
```

The backend serves the built frontend from `campus-lost-found-frontend/build`.

## Deployment Notes

- Set `MONGODB_URI` to a hosted MongoDB instance such as MongoDB Atlas.
- Set `JWT_SECRET` to a strong secret in your deployment environment.
- Set `REACT_APP_API_URL` to your deployed backend URL when hosting the frontend separately.
- Set `CLIENT_URL` to your deployed frontend URL so the backend accepts cross-origin requests.
- If you serve the frontend from Express, make sure the frontend is built before starting the backend.
- Full deployment steps can be added to `DEPLOYMENT.md`.

## Recruiter Notes

- This repo demonstrates end-to-end ownership across frontend, backend, auth, database integration, file uploads, and production build serving.
- The current version is ready for deployment with separate frontend and backend hosting.
- The codebase supports environment-specific API configuration for local development and production.

## Next Improvements

- Add richer homepage content and item discovery UX
- Add automated tests for auth and item flows
- Add CI checks for build/test
- Add screenshots and a short product walkthrough to the README
- Implement real-time notifications with WebSockets
- Add search and filtering for items
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../campus-lost-found-frontend
   npm install
   ```

4. **Set up environment variables**

   Create `.env` files in both backend and frontend directories:

   **Backend (.env)**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campus-lost-found
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

   **Frontend (.env)**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

## 🚀 Usage

1. **Start the backend server**
   ```bash
   cd campus-lost-found-backend
   npm start
   ```

2. **Start the frontend development server**
   ```bash
   cd campus-lost-found-frontend
   npm start
   ```

3. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Report a new item
- `GET /api/items/:id` - Get item details
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Claims
- `POST /api/claims` - Submit a claim
- `GET /api/claims` - Get user's claims
- `PUT /api/claims/:id` - Update claim status

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/items` - Get all items for admin
- `PUT /api/admin/verify-user/:id` - Verify user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Authors

- **Pranith Kumar** - *Initial work* - [pranith-kumar7](https://github.com/pranith-kumar7)

## 🙏 Acknowledgments

- College administration for the inspiration
- Open source community for the amazing tools

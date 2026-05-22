# Application Tracker

A full-stack web app for tracking job applications. Register an account, log your applications, update their status as you progress through the hiring process, and filter your list to stay organised.

**Live site:** https://application-tracker-peach.vercel.app

---

## Features

- Register and log in with a secure account
- Add job applications with company, role, location, website, date applied, and status
- Update application status inline (Applied, Interview, Rejected, Offer)
- Delete applications
- Filter by status and search by company, role, or location
- Session persists across page refreshes via HTTP-only cookies

---

## Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Axios
- React Router v7

**Backend**
- Node.js + Express v5
- Prisma ORM v7 (with `@prisma/adapter-pg`)
- PostgreSQL
- JWT authentication (HTTP-only cookies)
- bcryptjs for password hashing

---

## Project Structure

```
application-tracker/
├── frontend/          # Vite + React app
│   ├── src/
│   │   ├── api/           # Axios instance
│   │   ├── components/    # Page components
│   │   └── context/       # Auth context
│   └── vercel.json        # SPA routing config for Vercel
└── backend/           # Express API
    ├── controllers/       # Route handlers
    ├── middleware/        # Auth middleware
    ├── prisma/            # Schema and Prisma client
    └── routes/            # Express routers
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```
DB_URL=postgresql://postgres:yourpassword@localhost:5432/applicationtracker
JWT_SECRET=your_secret_here
NODE_ENV=development
```

Generate the Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

Start the server:

```bash
npm start
```

Backend runs on `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. The Vite proxy forwards `/api` requests to the backend automatically — no extra config needed.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Get current user |

### Applications *(all require authentication)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/application` | Get all applications for logged-in user |
| POST | `/api/application` | Create a new application |
| PUT | `/api/application/:id` | Update an application |
| DELETE | `/api/application/:id` | Delete an application |

---

## Deployment

The app is deployed with the frontend on **Vercel** and the backend + database on **Railway**.

### Environment variables

**Railway (backend)**

| Variable | Description |
|----------|-------------|
| `DB_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `NODE_ENV` | Set to `production` |
| `CLIENT_ORIGIN` | Your Vercel frontend URL |

**Vercel (frontend)**

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your Railway backend URL |

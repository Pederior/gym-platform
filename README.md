# Project Documentation: Gym Platform

## Overview

Gym Platform is a full-stack application for managing gym operations. It includes an Express/Mongoose backend and a React + Vite frontend. Features include user & staff management, classes, products, orders/payments, subscriptions, chat, notifications, file uploads, and activity logs.

## Technology Stack

- Backend: Node.js, Express, Mongoose (MongoDB)
- Frontend: React (TypeScript), Vite
- Real-time: socket.io (chat/notifications)
- File uploads: multer
- Auth: JWT (`jsonwebtoken`)
- Dev: nodemon (backend), vite (frontend)

## High-level repo layout

```
backend/
  package.json
  server.js
  src/
    app.js
    config/
      db.js
    controllers/
      (user.controller.js, class.controller.js, product.controller.js, ...)
    models/
      (User.js, Class.js, Product.js, ...)
    routes/
      (user.routes.js, product.routes.js, ...)
    middleware/
    uploads/
      images/
      products/
      videos/
  backup/
    gym_platform/   # BSON exports of collections
frontend/
  package.json
  vite.config.ts
  index.html
  src/
    main.tsx
    App.tsx
    pages/
    components/
    services/
    store/
    assets/
README.md
```

## Key Features

- Authentication & authorization (JWT)
- User roles: admin, coach, member
- Class scheduling & booking
- Product catalog, ordering, and payments
- Subscriptions and recurring billing support
- Chat and notifications (socket.io)
- File uploads for images and videos
- Activity logs and admin dashboards

## How it works (concise)

- The backend (`backend/`) exposes REST endpoints (see `backend/src/routes/`) and uses controllers to implement business logic.
- Mongoose models in `backend/src/models/` map application entities to MongoDB collections.
- The frontend (`frontend/`) calls backend APIs (via `frontend/src/services/`) and renders UI in `frontend/src/pages/` and `frontend/src/components/`.
- Socket.io provides real-time messaging/notifications.
- Uploaded files are stored under `backend/uploads/` and served by the Express server.

## Exact scripts

- Backend (`backend/package.json`):
  - `dev`: `nodemon server.js`
  - `start`: `node server.js`

- Frontend (`frontend/package.json`):
  - `dev`: `vite`
  - `build`: `tsc -b && vite build`
  - `preview`: `vite preview`
  - `lint`: `eslint .`

## Environment variables (observed & recommended)

From `backend/src/config/db.js` the DB selection uses:

- `NODE_ENV` — determines whether to use Atlas or local URI
- `MONGO_ATLAS_URI` — MongoDB Atlas connection string (used when `NODE_ENV === 'production'`)
- `MONGO_LOCAL_URI` — Local MongoDB connection string (used otherwise)

Other environment variables commonly required by this project (inspect controllers and config for exact names):

- `PORT` — backend server port
- `JWT_SECRET` — JWT signing secret
- Payment provider keys (e.g., `STRIPE_SECRET_KEY`) if payments are enabled
- `NODE_ENV` — development/production

Create a `.env` file in `backend/` based on `backend/.env.example`.

## backend/.env.example

```env
# backend/.env.example
NODE_ENV=development
MONGO_LOCAL_URI=mongodb://localhost:27017/gym_platform_dev
# MONGO_ATLAS_URI=mongodb+srv://<user>:<pass>@cluster0/mydb
# JWT_SECRET=change_me
# PORT=5000
# STRIPE_SECRET_KEY=sk_live_...
```

This file is included in the repo as `backend/.env.example` for quick reference.

## Running locally

1) Backend

```bash
cd backend
npm install
npm run dev   
# runs nodemon server.js for development
# or for production
npm start
```

2) Frontend

```bash
cd frontend
npm install

# starts Vite dev server (default port shown by Vite)
npm run dev   

# build for production
npm run build
npm run preview
```

If backend and frontend are on different ports, enable CORS in the backend or add a proxy to `vite.config.ts`.

## Restoring backup data

The `backend/backup/gym_platform` directory contains BSON exports of the MongoDB collections (e.g., `users.bson`, `products.bson`, `classes.bson`) plus `.metadata.json` and a `prelude.json` file.

Restore using `mongorestore`:

```bash
mongorestore --uri "mongodb://localhost:27017/gym_platform" --dir backend/backup/gym_platform
```

Restore to a test DB first to avoid overwriting production data.

## Key files to inspect (quick guide)

- `backend/package.json` — backend scripts & dependencies
- `backend/server.js` — server entry point
- `backend/src/app.js` — Express app configuration (middleware, static folders)
- `backend/src/config/db.js` — DB connection logic and env var names
- `backend/src/routes/` — route definitions
- `backend/src/controllers/` — business logic for endpoints
- `backend/src/models/` — Mongoose schemas
- `frontend/package.json` — frontend scripts
- `frontend/vite.config.ts` — dev proxy and build config
- `frontend/src/services/` — API client modules (how frontend talks to backend)
- `frontend/src/pages/` and `frontend/src/components/` — UI structure

## Troubleshooting & tips

- DB connection errors: verify `MONGO_LOCAL_URI` / `MONGO_ATLAS_URI` and `NODE_ENV` in `backend/.env`.
- CORS: check CORS middleware in Express or add `proxy` to `vite.config.ts`.
- File uploads: ensure `backend/uploads/` exists and is writable by the server.
- Logs: `morgan` logs requests in development; check console for startup errors.

## Security notes

- Never commit real secrets. Use `backend/.env.example` as a template but keep actual `.env` out of VCS.
- Rotate API keys periodically and store secrets in a secret manager for production.

## Future enhancements (ideas)

- Add a `docker-compose.yml` to run MongoDB, backend, and frontend together for development.
- Add CI to run linting and tests on PRs.
- Add end-to-end tests for critical user flows.
- Consider RBAC for finer-grained access control.
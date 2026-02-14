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
├───backend
│   │   .env
│   │   .env.example
│   │   package-lock.json
│   │   package.json
│   │   server.js
│   │   test.js
│   │
│   ├───backup
│   │   └───gym_platform
│   │           
│   ├───src
│   │   │   app.js
│   │   │
│   │   ├───config
│   │   │       db.js
│   │   │
│   │   ├───controllers
│   │   │       admin.controller.js
│   │   │       adminArticle.controller.js
│   │   │       adminComment.controller.js
│   │   │       adminTicket.controller.js
│   │   │       article.controller.js
│   │   │       auth.controller.js
│   │   │       chat.controller.js
│   │   │       class.controller.js
│   │   │       coach.controller.js
│   │   │       coachComment.controller.js
│   │   │       comment.controller.js
│   │   │       dietPlan.controller.js
│   │   │       financial.controller.js
│   │   │       log.controller.js
│   │   │       notification.controller.js
│   │   │       order.controller.js
│   │   │       payment.controller.js
│   │   │       product.controller.js
│   │   │       productAdmin.controller.js
│   │   │       subscription.controller.js
│   │   │       ticket.controller.js
│   │   │       trainingVideo.controller.js
│   │   │       user.controller.js
│   │   │       userSubscription.controller.js
│   │   │       userTrainingVideo.controller.js
│   │   │       userWorkout.controller.js
│   │   │       workout.controller.js
│   │   │
│   │   ├───middleware
│   │   │       activityLogger.js
│   │   │       auth.middleware.js
│   │   │       role.middleware.js
│   │   │       upload.js
│   │   │       upload.middleware.js
│   │   │
│   │   ├───models
│   │   │       Article.js
│   │   │       Class.js
│   │   │       ClubSettings.js
│   │   │       Comment.js
│   │   │       DietPlan.js
│   │   │       Equipment.js
│   │   │       Invoice.js
│   │   │       Log.js
│   │   │       Message.js
│   │   │       Notification.js
│   │   │       Order.js
│   │   │       Payment.js
│   │   │       Product.js
│   │   │       Room.js
│   │   │       Subscription.js
│   │   │       SubscriptionPlan.js
│   │   │       Ticket.js
│   │   │       TrainingVideo.js
│   │   │       User.js
│   │   │       UserDietPlan.js
│   │   │       UserProgress.js
│   │   │       UserTrainingVideo.js
│   │   │       UserWorkout.js
│   │   │       WorkoutPlan.js
│   │   │
│   │   └───routes
│   │           admin.routes.js
│   │           adminArticle.routes.js
│   │           adminComment.routes.js
│   │           adminTicket.routes.js
│   │           article.routes.js
│   │           auth.routes.js
│   │           chat.routes.js
│   │           class.routes.js
│   │           coach.routes.js
│   │           coachArticle.routes.js
│   │           coachComment.routes.js
│   │           comment.routes.js
│   │           dashboard.routes.js
│   │           dietPlan.routes.js
│   │           financial.routes.js
│   │           log.routes.js
│   │           notification.routes.js
│   │           order.routes.js
│   │           payment.routes.js
│   │           product.routes.js
│   │           productAdmin.routes.js
│   │           subscription.routes.js
│   │           ticket.routes.js
│   │           trainingVideo.routes.js
│   │           upload.routes.js
│   │           user.routes.js
│   │           userSubscription.routes.js
│   │           userTrainingVideo.routes.js
│   │           userWorkout.routes.js
│   │           workout.routes.js
│   │
│   └───uploads
│       │   
│       ├───images
│       │       
│       ├───products
│       │       
│       └───videos
└───frontend
    │   .env
    │   .gitignore
    │   components.json
    │   eslint.config.js
    │   index.html
    │   package-lock.json
    │   package.json
    │   postcss.config.js
    │   README.md
    │   tailwind.config.js
    │   tsconfig.app.json
    │   tsconfig.json
    │   tsconfig.node.json
    │   vite.config.ts
    │
    ├───public
    │   └───images
    └───src
        │   App.css
        │   App.tsx
        │   index.css
        │   main.tsx
        │
        ├───assets
        │       react.svg
        │
        ├───components
        │   │   AppInitializer.tsx
        │   │
        │   ├───Chat
        │   │       ChatBox.tsx
        │   │       MessageList.tsx
        │   │       SocketContext.tsx
        │   │       SocketProvider.tsx
        │   │
        │   ├───Features
        │   │       HeroCard.tsx
        │   │       RootDarkMode.tsx
        │   │       UnderLine.tsx
        │   │
        │   ├───layout
        │   │       ClassSection.tsx
        │   │       ExerciseSection.tsx
        │   │       Footer.tsx
        │   │       HeaderDash.tsx
        │   │       HeaderMain.tsx
        │   │       ImageFitnessSection.tsx
        │   │       MuscleBuilding.tsx
        │   │       Navbar.tsx
        │   │       PricingSection.tsx
        │   │       SideBar.tsx
        │   │       TestimonialsSection.tsx
        │   │       TopBar.tsx
        │   │       VideoOverlay.tsx
        │   │
        │   └───ui
        │           Button.tsx
        │           Card.tsx
        │           Input.tsx
        │
        ├───hooks
        │       useAuth.ts
        │       useDocumentTitle.tsx
        │
        ├───lib
        │       utils.ts
        │
        ├───pages
        │   │   AboutUs.tsx
        │   │   FAQ.tsx
        │   │   Home.tsx
        │   │   NotFound.tsx
        │   │   Profile.tsx
        │   │   ProfileEdit.tsx
        │   │
        │   ├───Articles
        │   │       ArticleDetail.tsx
        │   │       Articles.tsx
        │   │
        │   ├───Auth
        │   │       Login.tsx
        │   │       Register.tsx
        │   │
        │   ├───Classes
        │   │       ClassBooking.tsx
        │   │       ClassList.tsx
        │   │
        │   ├───Dashboard
        │   │   │   Header.tsx
        │   │   │   Layout.tsx
        │   │   │   Sidebar.tsx
        │   │   │
        │   │   ├───AdminDashboard
        │   │   │       AdminArticleEdit.tsx
        │   │   │       AdminArticleForm.tsx
        │   │   │       AdminArticles.tsx
        │   │   │       AdminClasses.tsx
        │   │   │       AdminClubSettings.tsx
        │   │   │       AdminComments.tsx
        │   │   │       AdminDashboard.tsx
        │   │   │       AdminInvoices.tsx
        │   │   │       AdminLogs.tsx
        │   │   │       AdminPayments.tsx
        │   │   │       AdminPricingSettings.tsx
        │   │   │       AdminProductForm.tsx
        │   │   │       AdminProducts.tsx
        │   │   │       AdminPrograms.tsx
        │   │   │       AdminReports.tsx
        │   │   │       AdminReservations.tsx
        │   │   │       AdminSubscriptionPlans.tsx
        │   │   │       AdminSubscriptions.tsx
        │   │   │       AdminTicketDetails.tsx
        │   │   │       AdminTickets.tsx
        │   │   │       AdminUsers.tsx
        │   │   │       AdminUsersCreate.tsx
        │   │   │       AdminUsersEdit.tsx
        │   │   │       KpiCard.tsx
        │   │   │       LineChartComponent.tsx
        │   │   │
        │   │   ├───CoachDashboard
        │   │   │       CoachAddWorkoutsToUsers.tsx
        │   │   │       CoachArticleEdit.tsx
        │   │   │       CoachArticleForm.tsx
        │   │   │       CoachArticles.tsx
        │   │   │       CoachChat.tsx
        │   │   │       CoachClasses.tsx
        │   │   │       CoachClassesCreate.tsx
        │   │   │       CoachClassesEdit.tsx
        │   │   │       CoachComments.tsx
        │   │   │       CoachDashboard.tsx
        │   │   │       CoachDietPlans.tsx
        │   │   │       CoachDietplansCreate.tsx
        │   │   │       CoachDietPlansEdit.tsx
        │   │   │       CoachProgress.tsx
        │   │   │       CoachStudents.tsx
        │   │   │       CoachTrainingVideoCreate.tsx
        │   │   │       CoachTrainingVideoEdit.tsx
        │   │   │       CoachTrainingVideos.tsx
        │   │   │       CoachWorkouts.tsx
        │   │   │       CoachWorkoutsCreate.tsx
        │   │   │       CoachWorkoutsEdit.tsx
        │   │   │
        │   │   └───UserDashboard
        │   │           UserChat.tsx
        │   │           UserClasses.tsx
        │   │           UserDashboard.tsx
        │   │           UserDietPlans.tsx
        │   │           UserPayments.tsx
        │   │           UserProgress.tsx
        │   │           UserStore.tsx
        │   │           UserSubscriptions.tsx
        │   │           UserTicketCreate.tsx
        │   │           UserTicketDetail.tsx
        │   │           UserTickets.tsx
        │   │           UserTrainingVideoPlayer.tsx
        │   │           UserTrainingVideos.tsx
        │   │           UserWorkouts.tsx
        │   │           UserWorkoutSession.tsx
        │   │
        │   ├───Store
        │   │       Cart.tsx
        │   │       OrderSuccess.tsx
        │   │       ProductSorting.tsx
        │   │       ProductsPerPage.tsx
        │   │       Store.tsx
        │   │
        │   └───WorkOuts
        │           WorkoutDetail.tsx
        │           WorkoutList.tsx
        │
        ├───routes
        │       index.tsx
        │       indexOld.tsx
        │       ProtectedRoute.tsx
        │       Test.tsx
        │
        ├───services
        │       adminService.ts
        │       api.ts
        │       authService.ts
        │       classService.ts
        │       coachService.ts
        │       financialService.ts
        │       productService.ts
        │       userService.ts
        │
        ├───store
        │   │   hook.ts
        │   │   store.ts
        │   │
        │   └───features
        │           authSlice.ts
        │           chatSlice.ts
        │           darkModeSlice.ts
        │           userSlice.ts
        │           workoutSlice.ts
        │
        ├───types
        │       css-modules.d.ts
        │       index.ts
        │
        └───utils
                constants.ts
                subscriptionUtils.ts
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

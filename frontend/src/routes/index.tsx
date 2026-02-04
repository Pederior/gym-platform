import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Home from "../pages/Home";

// داشبوردها
import Layout from "../pages/Dashboard/Layout";
import AdminDashboard from "../pages/Dashboard/AdminDashboard/AdminDashboard";
import CoachDashboard from "../pages/Dashboard/CoachDashboard/CoachDashboard";
import UserDashboard from "../pages/Dashboard/UserDashboard/UserDashboard";
import Profile from "../pages/Profile";
import ProfileEdit from "../pages/ProfileEdit";

// صفحات مدیر
import AdminUsers from "../pages/Dashboard/AdminDashboard/AdminUsers";
import AdminUsersCreate from "../pages/Dashboard/AdminDashboard/AdminUsersCreate";
import AdminSubscriptions from "../pages/Dashboard/AdminDashboard/AdminSubscriptions";
import AdminInvoices from "../pages/Dashboard/AdminDashboard/AdminInvoices";
import AdminPayments from "../pages/Dashboard/AdminDashboard/AdminPayments";
import AdminReports from "../pages/Dashboard/AdminDashboard/AdminReports";
import AdminClasses from "../pages/Dashboard/AdminDashboard/AdminClasses";
import AdminReservations from "../pages/Dashboard/AdminDashboard/AdminReservations";
import AdminClubSettings from "../pages/Dashboard/AdminDashboard/AdminClubSettings";
import AdminProducts from "../pages/Dashboard/AdminDashboard/AdminProducts";
import AdminPricingSettings from "../pages/Dashboard/AdminDashboard/AdminPricingSettings";
import AdminProductForm from "../pages/Dashboard/AdminDashboard/AdminProductForm";
import AdminLogs from "../pages/Dashboard/AdminDashboard/AdminLogs";

// صفحات مربی
import CoachWorkouts from "../pages/Dashboard/CoachDashboard/CoachWorkouts";
import CoachWorkoutsEdit from "../pages/Dashboard/CoachDashboard/CoachWorkoutsEdit";
import CoachWorkoutsCreate from "../pages/Dashboard/CoachDashboard/CoachWorkoutsCreate";
import CoachAddWorkoutsToUsers from "../pages/Dashboard/CoachDashboard/CoachAddWorkoutsToUsers";
import CoachProgress from "../pages/Dashboard/CoachDashboard/CoachProgress";
import CoachClasses from "../pages/Dashboard/CoachDashboard/CoachClasses";
import CoachClassesCreate from "../pages/Dashboard/CoachDashboard/CoachClassesCreate";
import CoachClassesEdit from "../pages/Dashboard/CoachDashboard/CoachClassesEdit";
import CoachChat from "../pages/Dashboard/CoachDashboard/CoachChat";

// صفحات کاربر
import UserChat from "../pages/Dashboard/UserDashboard/UserChat";
import UserStore from "../pages/Dashboard/UserDashboard/UserStore";
import UserClasses from "../pages/Dashboard/UserDashboard/UserClasses";
// import UserProgress from "../pages/Dashboard/UserDashboard/UserProgress";
import UserPayments from "../pages/Dashboard/UserDashboard/UserPayments";
import UserWorkouts from "../pages/Dashboard/UserDashboard/UserWorkouts";
import UserSubscriptions from "../pages/Dashboard/UserDashboard/UserSubscriptions";
import UserWorkoutSession from "../pages/Dashboard/UserDashboard/UserWorkoutSession";

// صفحات عمومی
import AboutUs from "../pages/AboutUs";
import Store from "../pages/Store/Store";
import Cart from "../pages/Store/Cart";
import Articles from "../pages/Articles/Articles";
import ClassList from "../pages/Classes/ClassList";
// import WorkoutList from "../pages/WorkOuts/WorkoutList";
// import ClassBooking from "../pages/Classes/ClassBooking"
// import WorkoutDetail from "../pages/WorkOuts/WorkoutDetail";

import ProtectedRoute from "./ProtectedRoute";
import OrderSuccess from "../pages/Store/OrderSuccess";

export const router = createBrowserRouter([
  // صفحات عمومی
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  // داشبوردها
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      // --- مدیر ---
      {
        path: "admin",
        element: (
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute role="admin">
            <AdminUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users/create",
        element: (
          <ProtectedRoute role="admin">
            <AdminUsersCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/subscriptions",
        element: (
          <ProtectedRoute role="admin">
            <AdminSubscriptions />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/invoices",
        element: (
          <ProtectedRoute role="admin">
            <AdminInvoices />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/payments",
        element: (
          <ProtectedRoute role="admin">
            <AdminPayments />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/reports",
        element: (
          <ProtectedRoute role="admin">
            <AdminReports />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/classes",
        element: (
          <ProtectedRoute role="admin">
            <AdminClasses />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/reservations",
        element: (
          <ProtectedRoute role="admin">
            <AdminReservations />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/products/new",
        element: (
          <ProtectedRoute role="admin">
            <AdminProductForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/products/:id/edit",
        element: (
          <ProtectedRoute role="admin">
            <AdminProductForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/products",
        element: (
          <ProtectedRoute role="admin">
            <AdminProducts />
          </ProtectedRoute>
        ),
      },

      {
        path: "admin/settings",
        children: [
          {
            path: "club",
            element: (
              <ProtectedRoute role="admin">
                <AdminClubSettings />
              </ProtectedRoute>
            ),
          },
          {
            path: "pricing",
            element: (
              <ProtectedRoute role="admin">
                <AdminPricingSettings />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "admin/logs",
        element: (
          <ProtectedRoute role="admin">
            <AdminLogs />
          </ProtectedRoute>
        ),
      },

      // --- مربی ---
      {
        path: "coach",
        element: (
          <ProtectedRoute role="coach">
            <CoachDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "coach/workouts",
        element: (
          <ProtectedRoute role="coach">
            <CoachWorkouts />
          </ProtectedRoute>
        ),
      },
      {
        path: "coach/workouts/edit/:id",
        element: (
          <ProtectedRoute role="coach">
            <CoachWorkoutsEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "coach/workouts/create",
        element: (
          <ProtectedRoute role="coach">
            <CoachWorkoutsCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "coach/workouts/addworkoutstousers",
        element: (
          <ProtectedRoute role="coach">
            <CoachAddWorkoutsToUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "coach/progress",
        element: (
          <ProtectedRoute role="coach">
            <CoachProgress />
          </ProtectedRoute>
        ),
      },
      {
        path: "coach/classes",
        element: (
          <ProtectedRoute role="coach">
            <CoachClasses />
          </ProtectedRoute>
        ),
      },
      {
        path: "coach/classes/create",
        element: (
          <ProtectedRoute role="coach">
            <CoachClassesCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "coach/classes/edit/:id",
        element: (
          <ProtectedRoute role="coach">
            <CoachClassesEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "coach/chat",
        element: (
          <ProtectedRoute role="coach">
            <CoachChat />
          </ProtectedRoute>
        ),
      },

      // --- کاربر ---
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "user/userstore",
        element: (
          <ProtectedRoute>
            <UserStore />
          </ProtectedRoute>
        ),
      },
      {
        path: "user/workouts",
        element: (
          <ProtectedRoute>
            <UserWorkouts />
          </ProtectedRoute>
        ),
      },
      {
        path: "user/subscriptions",
        element: (
          <ProtectedRoute>
            <UserSubscriptions />
          </ProtectedRoute>
        ),
      },
      {
        path: "user/classes",
        element: (
          <ProtectedRoute>
            <UserClasses />
          </ProtectedRoute>
        ),
      },
      {
        path: "user/workouts/:workoutId/start",
        element: (
          <ProtectedRoute>
            <UserWorkoutSession />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "user/progress",
      //   element: (
      //     <ProtectedRoute>
      //       <UserProgress />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: "user/payments",
        element: (
          <ProtectedRoute>
            <UserPayments />
          </ProtectedRoute>
        ),
      },
      {
        path: "user/chat",
        element: (
          <ProtectedRoute>
            <UserChat />
          </ProtectedRoute>
        ),
      },

      // --- مشترک ---
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/edit",
        element: (
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // صفحات عمومی (خارج از داشبورد)
  // { path: "/workouts", element: <WorkoutList /> },
  // { path: "/workouts/:id", element: <WorkoutDetail /> },
  { path: "/classes", element: <ClassList /> },
  { path: "/store", element: <Store /> },
  { path: "/cart", element: <Cart /> },
  { path: "/about", element: <AboutUs /> },
  { path: "/articles", element: <Articles /> },
  { path: "/order-success", element: <OrderSuccess /> },
  // { path: "/classes/book/:id", element: <ClassBooking /> },
]);

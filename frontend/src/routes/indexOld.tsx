// import { createBrowserRouter } from "react-router-dom";
// import Login from "../pages/Auth/Login";
// import Register from "../pages/Auth/Register";
// import AdminDashboard from "../pages/Dashboard/AdminDashboard/AdminDashboard";
// import UserDashboard from "../pages/Dashboard/UserDashboard/UserDashboard";
// import CoachDashboard from "../pages/Dashboard/CoachDashboard";
// import Profile from "../pages/Profile";
// import Layout from "../pages/Dashboard/Layout";
// import ProtectedRoute from "./ProtectedRoute";
// import WorkoutList from "../pages/WorkOuts/WorkoutList";
// import WorkoutDetail from "../pages/WorkOuts/WorkoutDetail";
// import ClassList from "../pages/Classes/ClassList";
// import ClassBooking from "../pages/Classes/ClassBooking";
// import Home from "../pages/Home";
// import Test from "./Test";
// import AdminUsersEdit from "../pages/Dashboard/AdminDashboard/AdminUsersEdit";
// import AdminUsers from "../pages/Dashboard/AdminDashboard/AdminUsers";
// import UserClasses from "../pages/Dashboard/UserDashboard/UserClasses";
// import AdminUsersCreate from "../pages/Dashboard/AdminDashboard/AdminUsersCreate";

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />,
//   },
//   { path: "/login", element: <Login /> },
//   { path: "/register", element: <Register /> },
//   { path: "/test", element: <Test /> },

//   {
//     path: "/dashboard",
//     element: <Layout />,
//     children: [
//       {
//         path: "admin",
//         element: (
//           <ProtectedRoute role="admin">
//             <AdminDashboard />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "admin/users",
//         element: (
//           <ProtectedRoute role="admin">
//             <AdminUsers />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "admin/users/edit/:id",
//         element: (
//           <ProtectedRoute role="admin">
//             <AdminUsersEdit />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "admin/users/create",
//         element: (
//           <ProtectedRoute role="admin">
//             <AdminUsersCreate />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "coach",
//         element: (
//           <ProtectedRoute role="coach">
//             <CoachDashboard />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "user",
//         element: (
//           <ProtectedRoute>
//             <UserDashboard />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "user/classes",
//         element: (
//           <ProtectedRoute>
//             <UserClasses />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "profile",
//         element: (
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         ),
//       },
//     ],
//   },

//   { path: "/workouts", element: <WorkoutList /> },
//   { path: "/workouts/:id", element: <WorkoutDetail /> },
//   { path: "/classes", element: <ClassList /> },
//   { path: "/classes/book/:id", element: <ClassBooking /> },
// ]);

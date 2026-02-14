// App.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index";
import AppInitializer from "./components/AppInitializer";
import { RootDarkMode } from "./components/Features/RootDarkMode";

export default function App() {
  return (
    <>
      <AppInitializer />
      <RootDarkMode /> 
      <RouterProvider router={router} />
    </>
  );
}
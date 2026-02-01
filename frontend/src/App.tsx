import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index";
import AppInitializer from "./components/AppInitializer";

export default function App() {
  return (
    <>
      <AppInitializer />
      <RouterProvider router={router} />
    </>
  );
}

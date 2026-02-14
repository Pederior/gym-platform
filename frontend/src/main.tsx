import App from "./App.tsx";
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./components/Chat/SocketProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <App />
      </SocketProvider>
      <Toaster position="bottom-right" />
    </Provider>
  </StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router"; // <-- Cambiar BrowserRouter por HashRouter

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Home from "./pages/Home";
import PantallaInicio from "./components/PantallaInicio";

let router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/pantalla-inicio",
    element: <PantallaInicio />,
  }

]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
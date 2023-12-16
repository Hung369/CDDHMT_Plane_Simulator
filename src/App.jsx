import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ShowroomComponent from "./Showroom";
import StartMenu from "./Pages/StartMenu";
import ErrorPage from "./Pages/ErrorPage";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

//Set router
const router = createBrowserRouter([
  {
    path: "/",
    element: <StartMenu />,
  },

  {
    path: "/play",
    element: <ShowroomComponent />,
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

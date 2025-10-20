// src/router.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";

export const router = createBrowserRouter(
  [
    // Mount your existing App (with its <Routes>) at the root.
    { path: "/*", element: <App /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

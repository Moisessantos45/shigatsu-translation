import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite.min.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CustomProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={App} />
      </QueryClientProvider>
    </CustomProvider>
  </React.StrictMode>
);

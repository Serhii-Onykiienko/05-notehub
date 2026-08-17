import React from "react";
import ReactDOM from "react-dom/client";
import "modern-normalize";
import App from "./components/App/App";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>

    <Toaster position="top-center" />
  </React.StrictMode>,
);

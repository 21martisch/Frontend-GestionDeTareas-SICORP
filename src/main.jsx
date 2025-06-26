import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext";
import { CssBaseline } from '@mui/material';
import ErrorBoundary from "./ErrorBoundary";
import theme from "../theme";
import store, { persistor } from "./store/index";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from 'react-redux';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <ErrorBoundary>
                <CssBaseline />
                  <App />
              </ErrorBoundary>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>,
);
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/base.css";
import App from "./App.tsx";
// import * as Sentry from "@sentry/browser";

// if (import.meta.env.PROD) {
//     Sentry.init({
//         dsn: import.meta.env.VITE_SENTRY_DSN,
//         environment: 'production',
//         integrations: [],
//         tracesSampleRate: 0,
//     });
// }

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

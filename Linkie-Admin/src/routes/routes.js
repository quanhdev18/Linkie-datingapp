import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Errors from "../components/Errors";
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import Report from "../pages/Report";
import Setting from "../pages/Setting";
import User from "../pages/User";
import Login from "../pages/Login";

export const router = createBrowserRouter([
    {
        errorElement: <Errors />,
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "/analytics",
                element: <Analytics />,
            },
            {
                path: "/report",
                element: <Report />,
            },
            {
                path: "/settings",
                element: <Setting />,
            },
            {
                path: "/users",
                element: <User />,
            },
        ],

    },
    {
        path: "/login",
        element: <Login />
    }
]);
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/HomePage";
import MyNotes from "./pages/MyNotes";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import "./App.css";
import CreateNote from "./pages/CreateNote";
import AppLayout from "./pages/AppLayout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/myNotes",
        element: <MyNotes />,
      },
      {
        path: "/createNote",
        element: <CreateNote />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/forgot",
    element: <ForgotPassword />,
  },
  {
    path: "/reset/:token",
    element: <ResetPassword />,
  },
]);

function App() {
  return (
    <div className="container">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

import { useEffect, useMemo } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";

function App() {
  const { user } = useSelector((store) => store.auth); // Get the logged-in user
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  // Create socket connection only when the user is logged in
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:5000", {
        query: { userId: user?._id },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.disconnect();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.disconnect();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  // Routes logic
  const browserRouter = useMemo(
    () =>
      createBrowserRouter([
        {
          path: "/",
          element: user ? (
            <MainLayout /> // Show main layout if user is logged in
          ) : (
            <Navigate to="/login" replace /> // Redirect to login if not logged in
          ),
          children: [
            { path: "/", element: <Home /> },
            {
              path: "/profile/:id",
              element: user ? (
                <Profile /> // Show profile if user is logged in
              ) : (
                <Navigate to="/login" replace />
              ),
            },
          ],
        },
        {
          path: "/login",
          element: user ? <Navigate to="/" replace /> : <Login />, // Redirect to home if already logged in
        },
        {
          path: "/signup",
          element: user ? <Navigate to="/" replace /> : <Signup />, // Redirect to home if already logged in
        },
      ]),
    [user]
  );

  return <RouterProvider router={browserRouter} />;
}

export default App;

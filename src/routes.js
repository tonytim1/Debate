import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import LoginPage from './pages/LoginPage';
import Signup from './pages/SignupPage';
import Page404 from './pages/Page404';
import ExplorePage from './pages/ExplorePage';
import CreateRoomPage from './pages/CreateRoomPage';
import ConversationRoomPage from './pages/ConversationRoomPage';
import RoomPage from './pages/RoomPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/home" />, index: true },
        { path: 'home', element: <HomePage /> },
        { path: 'explore', element: <ExplorePage /> },
        { path: 'createRoom', element: <CreateRoomPage /> },
        { path: 'conversation', element: <ConversationRoomPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <Signup /> },
      ],
    },
    {
      path: 'room/:roomId',
      element: <RoomPage />,
    },
    {
      path: 'user/:userId',
      element: <ProfilePage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/home" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

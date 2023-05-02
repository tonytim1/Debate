import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import RecomendedPage from './pages/RecomendedPage';
import ExplorePage from './pages/ExplorePage';
import CreateRoomPage from './pages/CreateRoomPage'
import ConversationRoomPage from './pages/ConversationRoomPage';
import RoomPage from './pages/RoomPage';
import HomePage from './pages/HomePage';
import ProfilePage  from './pages/ProfilePage';
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/home" />, index: true },
        { path: 'home', element: <HomePage /> },
        { path: 'explore', element: <ExplorePage /> },
        { path: 'createRoom', element: <CreateRoomPage/> },
        { path: 'conversation', element: <ConversationRoomPage /> },
        { path: 'room', element: <RoomPage /> },
        { path: 'Profile', element: <ProfilePage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
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

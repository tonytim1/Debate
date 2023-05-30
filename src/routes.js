import { Routes, Route, Navigate, useRoutes, BrowserRouter } from 'react-router-dom';
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
  return (
    // <BrowserRouter>
      <Routes>
        <Route
            path="/"
            element={<Navigate to="/dashboard" />}
          />
        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        >
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/home" />}
            index
          />
          <Route
            path="home"
            element={<HomePage />}
          />
          <Route
            path="explore"
            element={<ExplorePage />}
          />
          <Route
            path="createRoom"
            element={<CreateRoomPage />}
          />
          <Route
            path="conversation"
            element={<ConversationRoomPage />}
          />
          <Route
            path="profile"
            element={<ProfilePage />}
          />
          <Route
            path="login"
            element={<LoginPage />}
          />
          <Route
            path="register"
            element={<Signup />}
          />
        </Route>
        <Route
          path="room/:roomId"
          element={<RoomPage />}
        />
        <Route
          path="conversation/:roomId"
          element={<ConversationRoomPage />}
        />
        <Route
          path="user/:userId"
          element={<ProfilePage />}
        />
        <Route
          element={<SimpleLayout />}
        >
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/home" />}
            index
          />
          <Route
            path="404"
            element={<Page404 />}
          />
          <Route
            path="*"
            element={<Navigate to="/404" />}
          />
        </Route>
        <Route
          path="*"
          element={<Navigate to="/404" replace />}
        />
      </Routes>
    // </BrowserRouter>
  );
}

// export default function Router() {
//   const routes = useRoutes([
//     {
//       path: '/dashboard',
//       element: <DashboardLayout />,
//       children: [
//         { element: <Navigate to="/dashboard/home" />, index: true },
//         { path: 'home', element: <HomePage /> },
//         { path: 'explore', element: <ExplorePage /> },
//         { path: 'createRoom', element: <CreateRoomPage /> },
//         { path: 'conversation', element: <ConversationRoomPage /> },
//         { path: 'profile', element: <ProfilePage /> },
//         { path: 'login', element: <LoginPage /> },
//         { path: 'register', element: <Signup /> },
//       ],
//     },
//     {
//       path: 'room/:roomId',
//       element: <RoomPage />,
//     },
//     {
//       path: 'conversation/:roomId',
//       component: { ConversationRoomPage },
//       //element: <ConversationRoomPage roomId={ "roomId" } />,
//     },
//     {
//       path: 'user/:userId',
//       element: <ProfilePage />,
//     },
//     {
//       element: <SimpleLayout />,
//       children: [
//         { element: <Navigate to="/dashboard/home" />, index: true },
//         { path: '404', element: <Page404 /> },
//         { path: '*', element: <Navigate to="/404" /> },
//       ],
//     },
//     {
//       path: '*',
//       element: <Navigate to="/404" replace />,
//     },
//   ]);

//   return routes;
// }

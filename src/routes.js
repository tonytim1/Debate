import { Routes, Route, Navigate, useRoutes, BrowserRouter } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import Page404 from './pages/Page404';
import RoomPage from './pages/RoomPage';
import HomePage from './pages/HomePage';
import ProfilePage from './components/Cards/ProfileCard';
import SuccessPage from './components/Cards/FirstTimeUser'

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
            path="profile"
            element={<ProfilePage />}
          />
        </Route>
        <Route
            path="success"
            element={<SuccessPage />}
          />
        
        <Route
          path="room/:roomId"
          element={<RoomPage />}
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
  );
}
import React from "react";

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoginPage from "../../pages/auth/login/LoginPage";
import HomePage from "../../pages/home/HomePage";
import AdminPage from "../../pages/admin/admin";
import BookingsPage from "../../pages/bookings/bookings";
import NotificationsPage from "../../pages/notifications/notifications";
import ParkingAreasPage from "../../pages/parking_areas/parking_areas";
import ProtectedRoute from "./ProtectedRoute";
import RegisterPage  from "../../pages/auth/register/RegisterPage";
import NotFoundPage from "../../pages/common/NotFoundPage";
import ProfilePage from "../../pages/profile/profile";
const MainRoutes = [
    {
      name: "Home",
      path: "/",
      exact: true,
      component: HomePage,
      protected: true
    },
    {
      name: "Register",
      path: "/register",
      exact: true,
      component: <RegisterPage />,
      protected: false
    },
    {
      name: "Login",
      path: "/login",
      exact: true,
      component: <LoginPage />,
      protected: false
    },
    {
      name: "Profile",
      path: "/profile",
      exact: true,
      component: ProfilePage,
      protected: true
    },

    {
      name: "Bookings",
      path: "/bookings",
      exact: true,
      component: BookingsPage,
      protected: true
    },
    {
      name: "Notifications",
      path: "/notifications",
      exact: true,
      component: NotificationsPage,
      protected: true
    },
    {
      name: "Parking Areas",
      path: "/parking-areas",
      exact: true,
      component: ParkingAreasPage,
      protected: true
    },
    {
      name: "Admin",
      path: "/admin",
      exact: true,
      component: AdminPage,
      protected: true
    },
  ];



export const RouterComponent = () => {
    return (
      <Router>
        <Routes>
          
        {MainRoutes.map((r, k) => {
            return (
              <Route
                exact={r.exact}
                key={k}
                path={r.path}
                element={r.protected ?  <ProtectedRoute component={r.component}/> :  r.component}
              />
            );
          })}

          <Route path="*" element={<NotFoundPage/>} />
        </Routes>
      </Router>
    );
  };
  
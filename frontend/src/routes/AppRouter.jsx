import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import DoctorsPage from "../pages/DoctorsPage.jsx";
import DoctorProfilePage from "../pages/DoctorProfilePage.jsx";
import DepartmentsPage from "../pages/DepartmentsPage.jsx";
import DepartmentDetailPage from "../pages/DepartmentDetailPage.jsx";
import BookAppointmentPage from "../pages/BookAppointmentPage.jsx";
import MyAppointmentsPage from "../pages/MyAppointmentsPage.jsx";
import ManageAppointmentsPage from "../pages/ManageAppointmentsPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:id" element={<DoctorProfilePage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route
          path="/departments/:id"
          element={<DepartmentDetailPage />}
        />
        <Route path="/appointments/book" element={<BookAppointmentPage />} />
        <Route path="/appointments" element={<MyAppointmentsPage />} />
        <Route
          path="/appointments/manage"
          element={<ManageAppointmentsPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

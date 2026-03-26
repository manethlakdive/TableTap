import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Dashboard    from "./pages/Dashboard";
import MenuManager  from "./pages/MenuManager";
import QRPage       from "./pages/QRPage";
import CustomerMenu from "./pages/CustomerMenu";

const AppRoutes = () => (
  <Routes>
    <Route path="/login"    element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/menu"      element={<ProtectedRoute><MenuManager /></ProtectedRoute>} />
    <Route path="/qr"        element={<ProtectedRoute><QRPage /></ProtectedRoute>} />

    <Route path="/order"     element={<CustomerMenu />} />

    <Route path="/"          element={<Navigate to="/login" replace />} />
    <Route path="*"          element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;

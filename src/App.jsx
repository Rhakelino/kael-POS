import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell";
import Cashier from "./pages/Cashier";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { AuthProvider } from "./components/AuthProvider";
import SettingsProvider from "./components/SettingsProvider";

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/cashier" replace />} />
            <Route path="cashier" element={<Cashier />} />
            <Route path="orders" element={<Orders />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </SettingsProvider>
    </AuthProvider>
  );
}

import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Navbar } from "./components/layout/Navbar";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ColorModeProvider } from "./components/ui/color-mode";
import { system } from "./theme";

export default function App() {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes — Navbar wraps all of them via Outlet */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Navbar />}>
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:id" element={<ProjectDetailPage />} />
                  <Route
                    path="/"
                    element={<Navigate to="/projects" replace />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/projects" replace />}
                  />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

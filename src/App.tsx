import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AddBlogPage } from "./pages/AddBlogPage";
import { BlogEditPage } from "./pages/BlogEditPage";
import { BlogDetailsPage } from "./pages/BlogDetailsPage";


<Route path="/blog/:slug" element={<BlogDetailsPage />} />


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blogs/new"
          element={
            <ProtectedRoute>
              <AddBlogPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        <Route path="/blogs/edit/:id" element={<BlogEditPage />} />
        <Route path="/blog/:slug" element={<BlogDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
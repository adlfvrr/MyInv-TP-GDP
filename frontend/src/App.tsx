import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import InicioPage from './pages/InicioPage';
import ProductosPage from './pages/ProductosPage';
import MovimientosPage from './pages/MovimientosPage';
import ReportesPage from './pages/ReportesPage';
import HistorialPage from './pages/HistorialPage';
import AccesoDenegadoPage from './pages/AccesoDenegadoPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<InicioPage />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="movimientos" element={<MovimientosPage />} />
            <Route path="reportes" element={<ReportesPage />} />
            <Route path="historial" element={<HistorialPage />} />
            <Route path="acceso-denegado" element={<AccesoDenegadoPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

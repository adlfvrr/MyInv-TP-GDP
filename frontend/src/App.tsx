import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import InicioPage from './pages/InicioPage';
import ProximamentePage from './pages/ProximamentePage';
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
            <Route path="productos" element={<ProximamentePage titulo="Productos" />} />
            <Route path="movimientos" element={<ProximamentePage titulo="Movimientos de stock" />} />
            <Route path="reportes" element={<ProximamentePage titulo="Reportes y alertas" />} />
            <Route path="acceso-denegado" element={<AccesoDenegadoPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

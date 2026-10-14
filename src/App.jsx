/**
 * Portfolio de Ángel Serrano Domínguez
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import DemoPage from './pages/DemoPage';
import PrivacidadSchematicLab from './pages/PrivacidadSchematicLab';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/proyecto/:slug" element={<ProjectDetail />} />
      <Route path="/demo/:slug" element={<DemoPage />} />
      <Route path="/privacidad/schematic-lab" element={<PrivacidadSchematicLab />} />
      {/* Rutas antiguas (la app se llamaba Litematica3D): el router cliente también las redirige. */}
      <Route path="/demo/litematica3d" element={<Navigate to="/demo/schematic-lab" replace />} />
      <Route path="/proyecto/litematica3d" element={<Navigate to="/proyecto/schematic-lab" replace />} />
      <Route path="/privacidad/litematica3d" element={<Navigate to="/privacidad/schematic-lab" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

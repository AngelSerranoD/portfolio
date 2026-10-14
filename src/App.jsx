/**
 * Portfolio de Ángel Serrano Domínguez
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import DemoPage from './pages/DemoPage';
import PrivacidadLitematica3d from './pages/PrivacidadLitematica3d';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/proyecto/:slug" element={<ProjectDetail />} />
      <Route path="/demo/:slug" element={<DemoPage />} />
      <Route path="/privacidad/litematica3d" element={<PrivacidadLitematica3d />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

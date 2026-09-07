/**
 * Portfolio de Ángel Serrano Domínguez
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

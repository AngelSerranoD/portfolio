/**
 * Demo de "Sangría" — esta es la aplicación real, no una recreación.
 * El código de src/demos/sangria/ es el mismo de la app publicada; lo único
 * que cambia es el hook de tema, aislado para no teñir el portfolio.
 *
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useState } from 'react';
import { StatusBar } from '../../components/PhoneFrame';
import { useTheme } from './hooks/useTheme';
import { MainScreen } from './screens/MainScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export default function SangriaDemo() {
  const { dark, toggle } = useTheme();
  const [screen, setScreen] = useState('main');

  return (
    <div
      className={`flex h-full w-full flex-col ${dark ? 'dark' : ''}`}
      style={{
        backgroundColor: dark ? '#0A0A0A' : '#F2F2F7',
        color: dark ? '#FFFFFF' : '#000000',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        WebkitFontSmoothing: 'antialiased',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Sustituye a la barra de estado del sistema, que la PWA sí tiene en el móvil. */}
      <StatusBar dark={dark} />

      <div className="no-scrollbar flex-1 overflow-y-auto">
        {screen === 'main' ? (
          <MainScreen
            dark={dark}
            onToggleTheme={toggle}
            onOpenSettings={() => setScreen('settings')}
          />
        ) : (
          <SettingsScreen
            dark={dark}
            onBack={() => setScreen('main')}
            onSaved={() => setScreen('main')}
          />
        )}
      </div>
    </div>
  );
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import QueryProvider from './providers/QueryProvider.tsx';

import { OverlayProvider, ToastPortal } from './components';

import './index.css';
import App from './App.tsx';
import { AntiCheatProvider } from './hooks/useAntiCheatContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <OverlayProvider>
          <AntiCheatProvider>
            <App />
          </AntiCheatProvider>
        </OverlayProvider>
      </QueryProvider>
      <ToastPortal />
    </BrowserRouter>
  </StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './AppRouter';
import { StoreProvider } from './domain/store';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  </StrictMode>,
);

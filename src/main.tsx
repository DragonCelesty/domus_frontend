import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { InitSession } from './components/InitSession.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <InitSession /> {/* Carga sesión aquí */}
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
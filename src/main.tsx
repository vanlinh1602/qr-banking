import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import App from './App.tsx';
import { Footer } from './components/Footer/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <App />
      </main>
      <Footer />
    </div>
    <Toaster />
  </StrictMode>
);

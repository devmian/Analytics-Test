import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { StockProvider } from './providers/StockProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <StockProvider>
      <App />
    </StockProvider>
  </React.StrictMode>
);

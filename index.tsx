
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Detect and handle PWA installation
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  // e.preventDefault();
  console.log('FluxOS is ready to be installed');
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

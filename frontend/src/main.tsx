import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

async function enableMocking() {
  const shouldEnableMocks =
    import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCKS !== 'false';

  if (!shouldEnableMocks) {
    return;
  }

  const { worker } = await import('./mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

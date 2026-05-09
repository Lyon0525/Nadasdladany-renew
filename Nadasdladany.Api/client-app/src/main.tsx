// main.tsx
import { createRoot } from 'react-dom/client';
import App from './App'; // Most már az App-ot importáljuk
import './index.css';

createRoot(document.getElementById('app')!).render(
    <App />
);
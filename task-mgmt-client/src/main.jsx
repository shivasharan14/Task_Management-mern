import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//simport './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ThemeProvider } from './components/context/ThemeContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <App />
    </ThemeProvider>
  </StrictMode>,
)

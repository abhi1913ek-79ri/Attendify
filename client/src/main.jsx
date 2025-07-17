import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { StudentProvider } from './store/StudentContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StudentProvider>
      <App />
    </StudentProvider>
  </BrowserRouter>
)

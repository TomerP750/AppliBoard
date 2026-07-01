import { createRoot } from 'react-dom/client'
import './index.css'
import { Layout } from './layout/Layout.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/authentication/contexts/AuthContext.tsx'
import { ThemeProvider } from './shared/context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>,
)

import { createRoot } from 'react-dom/client'
import './index.css'
import { Layout } from './layout/Layout.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/authentication/contexts/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <Layout />
    </AuthProvider>
  </BrowserRouter>,
)

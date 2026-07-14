import { createRoot } from 'react-dom/client'
import './index.css'
import { Layout } from './layout/Layout.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/authentication/contexts/AuthContext.tsx'
import { ThemeProvider } from './shared/context/ThemeContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import { ToastConfig } from './shared/util/ToastConfig.tsx'

const queryClient = new QueryClient();

axios.interceptors.request.use(function (config) {
  if (localStorage.token) {
    config.headers.Authorization = "Bearer " + localStorage.token;
  }
  return config;
});

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Layout />
          <ToastConfig />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </BrowserRouter>,
)

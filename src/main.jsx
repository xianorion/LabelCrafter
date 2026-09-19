import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import AuthGuard from './components/Auth/AuthGuard'
import PrivacyPolicyPage from './components/PrivacyPolicyPage.jsx'

const path = window.location.pathname

const renderApp = () => {
  if (path === '/privacy') {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <PrivacyPolicyPage />
      </StrictMode>,
    )
    return
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AuthProvider>
        <AuthGuard>
          <App />
        </AuthGuard>
      </AuthProvider>
    </StrictMode>,
  )
}

renderApp()

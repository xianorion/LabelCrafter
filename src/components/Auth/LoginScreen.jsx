import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { HelpGuideSteps } from './HelpModal'
import SubscriptionView from './SubscriptionView'
import '../../styles/LoginScreen.css'
import '../../styles/HelpModal.css'

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="google-icon">
      <path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.22Z" />
      <path fill="#34A853" d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.6Z" />
      <path fill="#FBBC05" d="M6.54 13.68a5.84 5.84 0 0 1 0-3.36V7.79H3.29a9.6 9.6 0 0 0 0 8.42l3.25-2.53Z" />
      <path fill="#EA4335" d="M12 6.29c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.36 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.71 5.39l3.25 2.53C7.31 8.01 9.46 6.29 12 6.29Z" />
    </svg>
  )
}

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth()
  const [error, setError] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [showPricing, setShowPricing] = useState(new URLSearchParams(window.location.search).get('route') === 'pricing')

  const openPricing = () => {
    window.history.pushState({}, '', '?route=pricing')
    setShowPricing(true)
  }

  const closePricing = () => {
    window.history.pushState({}, '', window.location.pathname)
    setShowPricing(false)
  }

  if (showPricing) {
    return <SubscriptionView onBack={closePricing} />
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setIsSigningIn(true)

    try {
      await signInWithGoogle()
    } catch (signInError) {
      setError(signInError.message || 'Google sign-in could not be started.')
      setIsSigningIn(false)
    }
  }

  return (
    <main className="login-screen">
      <header className="login-nav">
        <a className="brand-lockup" href="/" aria-label="ParseLab home">
          <img className="brand-logo" src="/ParseLabLogo.svg" alt="" />
          <span>ParseLab</span>
        </a>
        <nav aria-label="Account actions">
          <button type="button" className="nav-link" onClick={openPricing}>
            Pricing
          </button>
        </nav>
      </header>

      <section className="login-hero" aria-labelledby="login-title">
        <div className="login-hero-copy">
          <p className="login-kicker">Shipping, without the busywork</p>
          <h1 id="login-title">Turn packing slips into labels in a few clicks.</h1>
          <p className="login-copy">Bulk parse Etsy and Shopify packing slips, then turn every customer address into printable labels in a few clicks.</p>
          <div className="hero-actions">
            <button type="button" className="hero-cta" onClick={handleGoogleSignIn} disabled={isSigningIn}>
              <GoogleIcon />
              <span>{isSigningIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
              <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="rate-link" onClick={openPricing}>Check subscription rates</button>
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <p className="login-footnote">Start with one free parse. No card required.</p>
          <div className="privacy-note">
            <strong>Your address, processed—not stored.</strong>
            <p>We process customer addresses in real time when needed, without permanently storing them in our database. Less data retained means greater privacy for your customers.</p>
          </div>
        </div>

        <div className="login-hero-art">
          <img src="/images/ParseLabParserSnapshot.png" alt="ParseLab parsing workspace with printable address labels" />
        </div>
      </section>

      <section className="help-empty-state login-guide" aria-labelledby="login-guide-title">
        <h2 id="login-guide-title">How to prepare your labels</h2>
        <p>Bring Etsy or Shopify packing-slip PDFs here and turn them into printable labels.</p>
        <HelpGuideSteps compact />
      </section>
    </main>
  )
}

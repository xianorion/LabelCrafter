import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { TIER_CONFIG } from '../../config/tierConfig'
import SubscriptionView from './SubscriptionView'
import PrivacyPolicyPage from '../PrivacyPolicyPage'
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

  if (window.location.pathname === '/privacy') {
    return <PrivacyPolicyPage />
  }

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
        <a className="brand-lockup" href="/" aria-label="LabelCrafter home">
          <img className="brand-logo" src="/ParseLabLogo.svg" alt="" />
          <span>LabelCrafter</span>
        </a>
        <nav aria-label="Account actions">
          <a className="nav-link nav-anchor" href="#how-it-works">How It Works</a>
          <button type="button" className="nav-link" onClick={openPricing}>
            Pricing
          </button>
          <button type="button" className="nav-link" onClick={handleGoogleSignIn}>Sign In</button>
          <button type="button" className="nav-cta" onClick={handleGoogleSignIn}>Try Free</button>
        </nav>
      </header>

      <section className="login-hero" aria-labelledby="login-title">
        <div className="login-hero-copy">
          <p className="login-kicker">A tiny workshop for finished labels</p>
          <p className="hero-brand-name">LabelCrafter</p>
          <h1 id="login-title">Turn packing slips into printable labels.</h1>
          <p className="login-copy">Upload your packing slips. LabelCrafter extracts the customer addresses and turns them into clean, print-ready labels in seconds.</p>
          <div className="hero-actions">
            <button type="button" className="hero-cta" aria-label="Try LabelCrafter Free, sign in with Google" onClick={handleGoogleSignIn} disabled={isSigningIn}>
              <GoogleIcon />
              <span>{isSigningIn ? 'Connecting to Google...' : 'Try LabelCrafter Free'}</span>
              <span aria-hidden="true">→</span>
            </button>
            <a className="rate-link" href="#how-it-works">See How It Works</a>
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <p className="login-footnote">{TIER_CONFIG.free.addressLimit} free addresses every month · No credit card required</p>
          <div className="privacy-note">
            <strong>Your address, processed—not stored.</strong>
            <p>Customer addresses are processed when needed without permanently storing them in the database.</p>
          </div>
        </div>

        <div className="login-hero-art" aria-label="Packing slip transformed into a finished address label">
          <div className="craft-illustration">
            <div className="craft-paper"><span>PACKING SLIP</span><b>John Smith</b><small>123 Main Street</small></div>
            <div className="craft-arrow" aria-hidden="true">↓</div>
            <div className="craft-label"><span>LABEL</span><b>John Smith</b><small>123 Main Street</small></div>
          </div>
        </div>
      </section>

      <section className="landing-section problem-section" aria-labelledby="problem-title">
        <p className="section-kicker">Skip the busywork</p>
        <h2 id="problem-title">Still copying addresses by hand?</h2>
        <p className="section-intro">You already have the customer's address on the packing slip. Why spend time copying it into another document just to print a label? LabelCrafter handles the repetitive part for you.</p>
        <div className="problem-grid">
          <article><h3>No more copy &amp; paste</h3><p>Stop manually transferring addresses from packing slips.</p></article>
          <article><h3>No more Excel mail merges</h3><p>Skip the spreadsheet setup and formatting headaches.</p></article>
          <article><h3>No thermal printer required</h3><p>Print on standard paper or compatible label sheets.</p></article>
        </div>
      </section>

      <section className="landing-section steps-section" id="how-it-works" aria-labelledby="steps-title">
        <p className="section-kicker">From messy to ready</p>
        <h2 id="steps-title">From packing slip to label in three steps.</h2>
        <div className="steps-grid">
          <article><span>01</span><h3>Upload</h3><p>Upload your packing slip PDFs.</p></article>
          <article><span>02</span><h3>Craft</h3><p>LabelCrafter finds and organizes the customer shipping addresses.</p></article>
          <article><span>03</span><h3>Print</h3><p>Generate clean, print-ready labels.</p></article>
        </div>
      </section>

      <section className="landing-section feature-section" aria-labelledby="feature-title">
        <p className="section-kicker">The useful stuff</p>
        <h2 id="feature-title">Everything you need to make a label.</h2>
        <div className="feature-grid">
          <article><h3>Batch PDF Processing</h3><p>Process multiple packing slips in one go.</p></article>
          <article><h3>Print-Ready Labels</h3><p>Generate labels sized for real-world printing.</p></article>
          <article><h3>Custom Layouts</h3><p>Hobby and Unlimited users can customize label layouts.</p></article>
        </div>
      </section>

      <section className="landing-section pricing-section" aria-labelledby="landing-pricing-title">
        <p className="section-kicker">Simple plans</p>
        <h2 id="landing-pricing-title">Pick your pace.</h2>
        <div className="landing-pricing-grid">
          <article><h3>{TIER_CONFIG.free.name}</h3><strong>$0<small>/month</small></strong><p>{TIER_CONFIG.free.addressLimit} addresses/month</p></article>
          <article><h3>{TIER_CONFIG.hobby.name}</h3><strong>$5<small>/month</small></strong><p>{TIER_CONFIG.hobby.addressLimit} addresses/month · Custom label sizing</p></article>
          <article><h3>{TIER_CONFIG.unlimited.name}</h3><strong>$10<small>/month</small></strong><p>Unlimited addresses · Custom label sizing</p></article>
        </div>
      </section>

      <section className="landing-final-cta" aria-labelledby="final-cta-title">
        <h2 id="final-cta-title">Ready to stop copying addresses?</h2>
        <button type="button" className="hero-cta" onClick={handleGoogleSignIn} disabled={isSigningIn}>
          {isSigningIn ? 'Connecting...' : 'Try LabelCrafter Free'} <span aria-hidden="true">→</span>
        </button>
      </section>

      <footer className="site-footer">
        <a href="/privacy">Privacy Policy</a>
      </footer>
    </main>
  )
}

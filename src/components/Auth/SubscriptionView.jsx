import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import '../../styles/SubscriptionView.css'

export default function SubscriptionView({ onBack, currentTier = null }) {
  const { signInWithGoogle, user } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState('')
  const isFreePlan = currentTier === 'basic'
  const isPremiumPlan = currentTier === 'premium'
  const isCheckingCurrentPlan = Boolean(user && !currentTier)

  const startGoogleFlow = async (redirectPath) => {
    if (user) {
      window.history.pushState({}, '', redirectPath)
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }

    setError('')
    setIsSigningIn(true)

    try {
      await signInWithGoogle({ redirectTo: `${window.location.origin}${redirectPath}` })
    } catch (signInError) {
      setError(signInError.message || 'Google sign-in could not be started.')
      setIsSigningIn(false)
    }
  }

  return (
    <main className="subscription-screen">
      <button type="button" className="subscription-back" onClick={onBack}>
        ← {user ? 'Back to account' : 'Back to sign in'}
      </button>
      <section className="subscription-header" aria-labelledby="subscription-title">
        <p className="login-kicker">Choose your plan</p>
        <h1 id="subscription-title">A simple plan for every shipping desk.</h1>
        <p>Start free with one monthly parse, or unlock unlimited labels and custom layouts with Premium.</p>
      </section>

      <div className="subscription-grid">
        <article className="subscription-card">
          <p className="subscription-card-label">For trying it out</p>
          <h2>Free Tier</h2>
          <strong className="subscription-price">$0 <small>/ month</small></strong>
          <ul>
            <li>1 parse per month</li>
            <li>Standard label layout</li>
            <li>Google sign-in included</li>
          </ul>
          {isCheckingCurrentPlan ? (
            <p className="subscription-option-note">Checking your current plan...</p>
          ) : isFreePlan ? (
            <div className="current-plan-label">Current plan</div>
          ) : user ? (
            <p className="subscription-option-note">Your Premium plan is active. Contact support to change plans.</p>
          ) : (
            <button type="button" className="subscription-button secondary" onClick={() => startGoogleFlow('/')} disabled={isSigningIn}>
              {isSigningIn ? 'Connecting...' : 'Continue with Google'}
            </button>
          )}
        </article>

        <article className="subscription-card featured">
          <span className="subscription-badge">Recommended</span>
          <p className="subscription-card-label">For growing shops</p>
          <h2>Paid Subscription Tier</h2>
          <strong className="subscription-price">$5.99 <small>/ month</small></strong>
          <ul>
            <li>Unlimited label parses</li>
            <li>Custom dimensions and grids</li>
            <li>Flexible preview controls</li>
          </ul>
          {isCheckingCurrentPlan ? (
            <p className="subscription-option-note">Checking your current plan...</p>
          ) : isPremiumPlan ? (
            <div className="current-plan-label featured-current">Current plan</div>
          ) : (
            <button type="button" className="subscription-button primary" onClick={() => startGoogleFlow('/?route=billing')} disabled={isSigningIn}>
              {isSigningIn ? 'Connecting...' : user ? 'Continue to billing' : 'Sign in to set up billing'}
            </button>
          )}
        </article>
      </div>
      {error && <p className="login-error subscription-error" role="alert">{error}</p>}
    </main>
  )
}

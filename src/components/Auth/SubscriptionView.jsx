import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import '../../styles/SubscriptionView.css'

export default function SubscriptionView({ onBack, currentTier = null, tierLoading = false }) {
  const { signInWithGoogle, user } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState('')
  const isFreePlan = currentTier === 'free'
  const isHobbyPlan = currentTier === 'hobby'
  const isUnlimitedPlan = currentTier === 'unlimited'
  const isCheckingCurrentPlan = Boolean(user && tierLoading)

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
        <p className="login-kicker">Ready to get started?</p>
        <h1 id="subscription-title">Choose your plan</h1>
        <p>Choose the amount of label crafting that fits your shop.</p>
      </section>

      <div className="subscription-grid">
        <article className="subscription-card">
          <p className="subscription-card-label">For trying it out</p>
          <h2>Free</h2>
          <strong className="subscription-price">$0 <small>/ month</small></strong>
          <ul>
            <li>25 addresses per month</li>
            <li>PDF address extraction</li>
            <li>Printable labels</li>
            <li>Standard label sizing</li>
            <li>No credit card required</li>
          </ul>
          {isCheckingCurrentPlan ? (
            <p className="subscription-option-note">Checking your current plan...</p>
          ) : isFreePlan ? (
            <div className="current-plan-label">Current plan</div>
          ) : user ? (
            <p className="subscription-option-note">Your {currentTier} plan is active. Contact support to change plans.</p>
          ) : (
            <button type="button" className="subscription-button secondary" onClick={() => startGoogleFlow('/')} disabled={isSigningIn}>
              {isSigningIn ? 'Connecting...' : 'Start Free'}
            </button>
          )}
        </article>

        <article className="subscription-card featured">
          <span className="subscription-badge">Recommended</span>
          <p className="subscription-card-label">For regular batches</p>
          <h2>Hobby</h2>
          <strong className="subscription-price">$5 <small>/ month</small></strong>
          <ul>
            <li>250 addresses per month</li>
            <li>PDF address extraction</li>
            <li>Printable labels</li>
            <li>Custom label resizing</li>
            <li>Excellet for Hobbists</li>
          </ul>
          {isCheckingCurrentPlan ? (
            <p className="subscription-option-note">Checking your current plan...</p>
          ) : isHobbyPlan ? (
            <div className="current-plan-label featured-current">Current plan</div>
          ) : (
            <button type="button" className="subscription-button primary" onClick={() => startGoogleFlow('/?route=billing')} disabled={isSigningIn}>
              {isSigningIn ? 'Connecting...' : user ? 'Start Crafting' : 'Start Crafting'}
            </button>
          )}
        </article>

        <article className="subscription-card">
          <p className="subscription-card-label">For bigger batches</p>
          <h2>Unlimited</h2>
          <strong className="subscription-price">$10 <small>/ month</small></strong>
          <ul>
            <li>Unlimited addresses</li>
            <li>PDF address extraction</li>
            <li>Printable labels</li>
            <li>Custom label resizing</li>
            <li>For higher-volume sellers and creators</li>
          </ul>
          {isCheckingCurrentPlan ? (
            <p className="subscription-option-note">Checking your current plan...</p>
          ) : isUnlimitedPlan ? (
            <div className="current-plan-label">Current plan</div>
          ) : (
            <button type="button" className="subscription-button secondary" onClick={() => startGoogleFlow('/?route=billing')} disabled={isSigningIn}>
            {isSigningIn ? 'Connecting...' : 'Go Unlimited'}
            </button>
          )}
        </article>
      </div>
      {error && <p className="login-error subscription-error" role="alert">{error}</p>}
    </main>
  )
}

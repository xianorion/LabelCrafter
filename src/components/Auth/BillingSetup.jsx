import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import '../../styles/SubscriptionView.css'

export default function BillingSetup({ onBack }) {
  const { user } = useAuth()
  const [billingStarted, setBillingStarted] = useState(false)

  return (
    <main className="billing-screen">
      <div className="billing-card">
        <p className="login-kicker">Premium setup</p>
        <img className="billing-logo" src="/ParseLabLogo.svg" alt="ParseLab" />
        <h1>Finish setting up Premium.</h1>
        <p>You are signed in as <strong>{user.email}</strong>. Complete your Premium subscription to unlock unlimited label parsing and custom layouts.</p>
        <div className="billing-summary">
          <div>
            <span>Premium subscription</span>
            <strong>$5.99 / month</strong>
          </div>
          <span>Unlimited parses</span>
        </div>
        <ul className="billing-features">
          <li>Unlimited label parses</li>
          <li>Custom label dimensions</li>
          <li>Flexible columns and rows per page</li>
        </ul>
        <button type="button" className="subscription-button primary" onClick={() => setBillingStarted(true)}>Continue to secure billing</button>
        {billingStarted && <p className="billing-success" role="status">Your secure billing setup is ready to continue.</p>}
        <p className="billing-note">You are signed in with Google. Billing details will be collected securely in the next step.</p>
        <button type="button" className="subscription-back" onClick={onBack}>← Return to plans</button>
      </div>
    </main>
  )
}

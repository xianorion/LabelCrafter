import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import '../../styles/SubscriptionView.css'

export default function BillingSetup({ onBack }) {
  const { user } = useAuth()
  const [billingStarted, setBillingStarted] = useState(false)

  return (
    <main className="billing-screen">
      <div className="billing-card">
        <p className="login-kicker">Subscription setup</p>
        <img className="billing-logo" src="/ParseLabLogo.svg" alt="LabelCrafter" />
        <h1>Finish setting up LabelCrafter.</h1>
        <p>You are signed in as <strong>{user.email}</strong>. Continue to secure billing for your selected plan.</p>
        <div className="billing-summary">
          <div>
            <span>LabelCrafter subscription</span>
            <strong>Plan selected at checkout</strong>
          </div>
          <span>Printable labels</span>
        </div>
        <ul className="billing-features">
          <li>PDF address extraction</li>
          <li>Printable labels</li>
          <li>Plan-specific features</li>
        </ul>
        <button type="button" className="subscription-button primary" onClick={() => setBillingStarted(true)}>Continue to secure billing</button>
        {billingStarted && <p className="billing-success" role="status">Your secure billing setup is ready to continue.</p>}
        <p className="billing-note">You are signed in with Google. Billing details will be collected securely in the next step.</p>
        <button type="button" className="subscription-back" onClick={onBack}>← Return to plans</button>
      </div>
    </main>
  )
}

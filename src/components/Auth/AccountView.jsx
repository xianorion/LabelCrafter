import { useAuth } from '../../context/AuthContext'
import '../../styles/SubscriptionView.css'

export default function AccountView({ tierConfig, tierLoading, addressesProcessed, addressesRemaining, addressLimit, usageLoading, onBack, onManagePlan }) {
  const { user } = useAuth()
  const isUnlimited = tierConfig.addressLimit === Infinity
  const usageLabel = isUnlimited ? `${addressesProcessed ?? 0} addresses processed` : `${addressesProcessed ?? 0} / ${addressLimit ?? tierConfig.addressLimit} addresses processed`

  return (
    <main className="account-screen">
      <div className="account-page-header">
        <button type="button" className="subscription-back" onClick={onBack}>← Back to parser</button>
        <p className="login-kicker">Account center</p>
        <h1>Manage your workspace.</h1>
        <p>{user.email}</p>
      </div>

      <section className="account-summary-grid" aria-label="Account and plan details">
        <article className="account-summary-card">
          <span className="account-summary-label">Current plan</span>
          <h2>{tierConfig.name}</h2>
          <p>{tierLoading ? 'Checking your plan...' : `${tierConfig.name} plan with ${isUnlimited ? 'unlimited' : addressLimit ?? tierConfig.addressLimit} monthly addresses.`}</p>
          <button type="button" className="subscription-button primary" onClick={onManagePlan}>
            {isUnlimited ? 'Manage plan' : 'View plans'}
          </button>
        </article>
        <article className="account-summary-card">
          <span className="account-summary-label">Usage this month</span>
          <h2>{usageLoading ? 'Checking usage...' : usageLabel}</h2>
          <p>{isUnlimited ? 'Unlimited addresses' : `${addressesRemaining ?? Math.max(0, (addressLimit ?? tierConfig.addressLimit) - (addressesProcessed ?? 0))} addresses remaining`}</p>
          <button type="button" className="subscription-button secondary" onClick={onBack}>Open parser</button>
        </article>
      </section>
    </main>
  )
}

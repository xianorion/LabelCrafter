import { useAuth } from '../../context/AuthContext'
import '../../styles/SubscriptionView.css'

export default function AccountView({ tier, parseCount, usageLoading, onBack, onManagePlan }) {
  const { user } = useAuth()
  const isPremium = tier === 'premium'

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
          <h2>{isPremium ? 'Premium' : 'Free Tier'}</h2>
          <p>{isPremium ? 'Unlimited parses and custom layouts.' : 'One parse per month with the standard layout.'}</p>
          <button type="button" className="subscription-button primary" onClick={onManagePlan}>
            {isPremium ? 'Manage plan' : 'View Premium plan'}
          </button>
        </article>
        <article className="account-summary-card">
          <span className="account-summary-label">Usage this month</span>
          <h2>{isPremium ? 'Unlimited' : `${Math.max(0, 1 - (parseCount ?? 0))} / 1 remaining`}</h2>
          <p>{usageLoading ? 'Refreshing your usage...' : isPremium ? 'Your account has no monthly parse cap.' : `${parseCount ?? 0} parse${parseCount === 1 ? '' : 's'} used this month.`}</p>
          <button type="button" className="subscription-button secondary" onClick={onBack}>Open parser</button>
        </article>
      </section>
    </main>
  )
}

import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import HelpModal from './HelpModal'
import AccountView from './AccountView'
import BillingSetup from './BillingSetup'
import LoginScreen from './LoginScreen'
import SubscriptionView from './SubscriptionView'

export default function AuthGuard({ children }) {
  const { user, loading: authLoading, signOut, tier, tierConfig, tierLoading, addressesProcessed, addressesRemaining, addressLimit, usageLoading } = useAuth()
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const [route, setRoute] = useState(new URLSearchParams(window.location.search).get('route'))

  useEffect(() => {
    const handleRouteChange = () => setRoute(new URLSearchParams(window.location.search).get('route'))

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  if (authLoading) {
    return <div className="auth-loading" role="status">Loading your workspace...</div>
  }

  if (!user) {
    return <LoginScreen />
  }

  if (route === 'billing') {
    return <BillingSetup onBack={() => {
      window.history.pushState({}, '', '?route=pricing')
      setRoute('pricing')
    }} />
  }

  if (route === 'pricing') {
    return <SubscriptionView currentTier={tier} tierLoading={tierLoading} onBack={() => {
      const nextRoute = user ? 'account' : null
      window.history.pushState({}, '', nextRoute ? '?route=account' : window.location.pathname)
      setRoute(nextRoute)
    }} />
  }

  if (route === 'account') {
    return (
      <AccountView
        tier={tier}
        tierConfig={tierConfig}
        tierLoading={tierLoading}
        addressesProcessed={addressesProcessed}
        addressesRemaining={addressesRemaining}
        addressLimit={addressLimit}
        usageLoading={usageLoading}
        onBack={() => {
          window.history.pushState({}, '', window.location.pathname)
          setRoute(null)
        }}
        onManagePlan={() => {
          window.history.pushState({}, '', '?route=pricing')
          setRoute('pricing')
        }}
      />
    )
  }

  return (
    <div className="app-ui">
      <div className="account-bar">
        <a className="account-brand" href="/" aria-label="LabelCrafter home">
          <img src="/ParseLabLogo.svg" alt="" />
          <strong>LabelCrafter</strong>
        </a>
        <span>{user.user_metadata?.full_name || user.email}</span>
        <span className="usage-count">
          {usageLoading
            ? 'Checking parse allowance...'
            : tierConfig.addressLimit === Infinity
              ? `${addressesProcessed ?? 0} addresses processed · Unlimited addresses`
              : `${addressesProcessed ?? 0} / ${addressLimit ?? tierConfig.addressLimit} addresses processed`}
        </span>
        <button type="button" className="help-toolbar-button" onClick={() => setIsHelpModalOpen(true)}>
          <span className="help-circle-icon" aria-hidden="true">?</span>
          <span>Help &amp; Guide</span>
        </button>
        <button type="button" className="account-toolbar-button" onClick={() => {
          window.history.pushState({}, '', '?route=account')
          setRoute('account')
        }}>
          My account
        </button>
        <button type="button" className="sign-out-button" onClick={signOut}>Sign out</button>
      </div>
      {children}
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  )
}

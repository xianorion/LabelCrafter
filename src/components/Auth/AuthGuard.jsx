import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import HelpModal from './HelpModal'
import AccountView from './AccountView'
import BillingSetup from './BillingSetup'
import LoginScreen from './LoginScreen'
import SubscriptionView from './SubscriptionView'

export default function AuthGuard({ children }) {
  const { user, loading: authLoading, signOut } = useAuth()
  const [parseCount, setParseCount] = useState(null)
  const [tier, setTier] = useState(null)
  const [usageLoading, setUsageLoading] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const [route, setRoute] = useState(new URLSearchParams(window.location.search).get('route'))

  useEffect(() => {
    const handleRouteChange = () => setRoute(new URLSearchParams(window.location.search).get('route'))

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  useEffect(() => {
    let mounted = true

    const fetchUsage = async () => {
      if (!user) {
        setParseCount(null)
        return
      }

      setUsageLoading(true)
      const [{ data: usageData, error: usageError }, { data: tierData, error: tierError }] = await Promise.all([
        supabase.from('user_usage').select('parse_count').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_tiers').select('tier').eq('user_id', user.id).maybeSingle(),
      ])

      if (mounted) {
        setParseCount(usageError ? null : usageData?.parse_count ?? 0)
        setTier(tierError ? null : tierData?.tier ?? 'basic')
        setUsageLoading(false)
      }
    }

    fetchUsage()
    const handleUsageUpdated = () => {
      fetchUsage()
    }
    window.addEventListener('usage-updated', handleUsageUpdated)

    return () => {
      mounted = false
      window.removeEventListener('usage-updated', handleUsageUpdated)
    }
  }, [user])

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
    return <SubscriptionView currentTier={tier} onBack={() => {
      const nextRoute = user ? 'account' : null
      window.history.pushState({}, '', nextRoute ? '?route=account' : window.location.pathname)
      setRoute(nextRoute)
    }} />
  }

  if (route === 'account') {
    return (
      <AccountView
        tier={tier}
        parseCount={parseCount}
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
    <>
      <div className="account-bar">
        <span>{user.user_metadata?.full_name || user.email}</span>
        <span className="usage-count">
          {usageLoading
            ? 'Checking parse allowance...'
            : tier === 'premium'
              ? 'Unlimited parses'
              : `${Math.max(0, 1 - (parseCount ?? 0))} / 1 parses remaining`}
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
    </>
  )
}

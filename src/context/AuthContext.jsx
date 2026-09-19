import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getTierConfig, TIER_CONFIG } from '../config/tierConfig'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [userMetadata, setUserMetadata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tier, setTier] = useState('free')
  const [tierLoading, setTierLoading] = useState(false)
  const [tierError, setTierError] = useState(null)
  const [addressesProcessed, setAddressesProcessed] = useState(null)
  const [addressesRemaining, setAddressesRemaining] = useState(null)
  const [addressLimit, setAddressLimit] = useState(null)
  const [lastResetDate, setLastResetDate] = useState(null)
  const [usageLoading, setUsageLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    const updateAuthState = (nextSession) => {
      if (!mounted) {
        return
      }

      const nextUser = nextSession?.user || null
      setSession(nextSession)
      setUser(nextUser)
      setUserMetadata(nextUser?.user_metadata || null)
      setTierLoading(Boolean(nextUser))
      setUsageLoading(Boolean(nextUser))
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session: nextSession } }) => {
      updateAuthState(nextSession)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      updateAuthState(nextSession)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const loadAccountDetails = async () => {
      if (!user) {
        setTier('free')
        setTierError(null)
        setTierLoading(false)
        setAddressesProcessed(null)
        setAddressesRemaining(null)
        setAddressLimit(null)
        setLastResetDate(null)
        setUsageLoading(false)
        return
      }

      setTierLoading(true)
      setUsageLoading(true)
      let tierData
      let nextTierError
      let usageData
      let usageError

      try {
        const results = await Promise.all([
          supabase.from('user_tiers').select('tier').eq('user_id', user.id).maybeSingle(),
          supabase.rpc('get_user_usage'),
        ])
        tierData = results[0].data
        nextTierError = results[0].error
        usageData = results[1].data
        usageError = results[1].error
      } catch (accountError) {
        tierData = null
        nextTierError = accountError
        usageData = null
        usageError = accountError
      }

      if (!mounted) {
        return
      }

      const usageRecord = Array.isArray(usageData) ? usageData[0] : usageData
      const usageTier = usageRecord?.tier
      const nextTier = TIER_CONFIG[usageTier] ? usageTier : TIER_CONFIG[tierData?.tier] ? tierData.tier : 'free'
      setTier(nextTier)
      setTierError(nextTierError || usageError || (usageTier && !TIER_CONFIG[usageTier] ? new Error('Invalid tier') : null))
      setAddressesProcessed(usageError ? null : usageRecord?.addresses_processed ?? 0)
      setAddressesRemaining(usageError ? null : usageRecord?.addresses_remaining ?? null)
      setAddressLimit(usageError ? null : usageRecord?.address_limit ?? null)
      setLastResetDate(usageError ? null : usageRecord?.last_reset_date ?? null)
      setTierLoading(false)
      setUsageLoading(false)
    }

    loadAccountDetails()
    const handleUsageUpdated = () => loadAccountDetails()
    window.addEventListener('usage-updated', handleUsageUpdated)

    return () => {
      mounted = false
      window.removeEventListener('usage-updated', handleUsageUpdated)
    }
  }, [user])

  const signInWithGoogle = async ({ redirectTo = window.location.origin } = {}) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    })

    if (error) {
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  }

  const value = useMemo(() => ({
    session,
    user,
    userMetadata,
    loading,
    signInWithGoogle,
    signOut,
    tier,
    tierConfig: getTierConfig(tier),
    tierLoading,
    tierError,
    addressesProcessed,
    addressesRemaining,
    addressLimit,
    lastResetDate,
    usageLoading,
  }), [addressLimit, addressesProcessed, addressesRemaining, lastResetDate, loading, session, tier, tierError, tierLoading, usageLoading, user, userMetadata])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

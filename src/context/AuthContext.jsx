import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [userMetadata, setUserMetadata] = useState(null)
  const [loading, setLoading] = useState(true)

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
  }), [loading, session, user, userMetadata])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

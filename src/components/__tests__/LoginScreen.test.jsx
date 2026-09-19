import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { supabase } from '../../lib/supabaseClient'
import { AuthProvider, useAuth } from '../../context/AuthContext'
import LoginScreen from '../Auth/LoginScreen'

jest.mock('../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
    },
  },
}))

function renderLogin() {
  return render(
    <AuthProvider>
      <LoginScreen />
    </AuthProvider>,
  )
}

function AuthStateProbe() {
  const { user } = useAuth()

  return user ? <span>{user.user_metadata.full_name}</span> : null
}

describe('LoginScreen', () => {
  beforeEach(() => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } })
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } })
    supabase.auth.signInWithOAuth.mockResolvedValue({ data: { provider: 'google' }, error: null })
  })

  it('updates authentication state from onAuthStateChange', async () => {
    let authStateListener
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authStateListener = callback
      return { data: { subscription: { unsubscribe: jest.fn() } } }
    })

    render(
      <AuthProvider>
        <LoginScreen />
        <AuthStateProbe />
      </AuthProvider>,
    )

    await waitFor(() => expect(supabase.auth.onAuthStateChange).toHaveBeenCalled())
    await act(async () => {
      authStateListener('SIGNED_IN', {
        user: { id: 'user-1', email: 'jane.doe@example.com', user_metadata: { full_name: 'Jane Doe' } },
      })
    })

    await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument())
  })

  it('starts the Google OAuth redirect when the button is clicked', async () => {
    renderLogin()

    const button = await screen.findByRole('button', { name: /sign in with google/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })
    })
  })

  it('shows a privacy policy footer link on the landing page', () => {
    window.history.pushState({}, '', '/')
    renderLogin()

    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy')
  })

  it('renders the privacy policy page when the current path is /privacy', () => {
    window.history.pushState({}, '', '/privacy')
    renderLogin()

    expect(screen.getByRole('heading', { name: /^privacy policy$/i })).toBeInTheDocument()
  })
})

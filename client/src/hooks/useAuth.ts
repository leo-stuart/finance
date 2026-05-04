import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { DEMO_USER } from '../lib/demo'

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

export function useAuth() {
  const [user, setUser] = useState<User | null>(DEMO ? DEMO_USER : null)
  const [loading, setLoading] = useState(!DEMO)

  useEffect(() => {
    if (DEMO) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email: string, password: string) =>
    supabase.auth.signUp({ email, password })

  const signOut = () => supabase.auth.signOut()

  return { user, loading, signIn, signUp, signOut }
}

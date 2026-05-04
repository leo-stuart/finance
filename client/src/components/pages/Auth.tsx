import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../templates/AuthLayout'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { FormField } from '../molecules/FormField'
import { useAuth } from '../../hooks/useAuth'

export function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'login') {
      const { error: err } = await signIn(email, password)
      if (err) setError(err.message)
      else navigate('/')
    } else {
      const { error: err } = await signUp(email, password)
      if (err) setError(err.message)
      else setSuccess('Conta criada! Verifique seu email para confirmar.')
    }
    setLoading(false)
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="font-black text-wise-black" style={{ fontSize: '24px', lineHeight: '0.9' }}>
            {mode === 'login' ? 'Entrar' : 'Criar conta'}
          </h2>
          <p className="text-sm text-wise-gray">
            {mode === 'login' ? 'Acesse suas finanças' : 'Comece a controlar suas finanças'}
          </p>
        </div>

        <FormField label="Email" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="voce@email.com"
            autoComplete="email"
          />
        </FormField>

        <FormField label="Senha" htmlFor="password" required>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </FormField>

        {error && (
          <div className="bg-[rgba(208,50,56,0.08)] text-wise-danger text-sm px-3 py-2 rounded-[10px]">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-wise-mint text-wise-positive text-sm px-3 py-2 rounded-[10px]">
            {success}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full justify-center">
          {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
        </Button>

        <button
          type="button"
          onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}
          className="text-sm text-wise-gray hover:text-wise-black transition-colors text-center"
        >
          {mode === 'login' ? 'Não tem conta? Criar agora' : 'Já tem conta? Entrar'}
        </button>
      </form>
    </AuthLayout>
  )
}

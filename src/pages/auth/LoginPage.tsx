import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, getZodErrors, type LoginInput } from '@/lib/authUtils'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
  AuthPage,
  AuthCard,
  AuthLogo,
  AuthLogoCircle,
  AuthLogoText,
  AuthTitle,
  AuthSubtitle,
  AuthForm,
  AuthError,
  AuthLink,
  PasswordWrapper,
  PasswordToggle,
} from './AuthLayout'

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M1 11S4.5 4 11 4s10 7 10 7-3.5 7-10 7S1 11 1 11z" stroke="currentColor" strokeWidth="2" />
      <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M1 1l20 20M9.88 9.88A3 3 0 0 0 11 14a3 3 0 0 0 2.12-5.12M6.94 6.94C4.23 8.3 2.27 10.22 1 11c0 0 3.5 7 10 7a9.87 9.87 0 0 0 4.34-.98M9.9 4.24A9.12 9.12 0 0 1 11 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState<LoginInput>({ identifier: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginInput, string>>>({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (field: keyof LoginInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    if (serverError) setServerError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = loginSchema.safeParse(form)
    if (!result.success) {
      setFieldErrors(getZodErrors(result))
      return
    }

    setIsSubmitting(true)
    setServerError('')

    const res = await login(result.data)

    if (!res.success) {
      if (res.fieldErrors) setFieldErrors(res.fieldErrors as Partial<Record<keyof LoginInput, string>>)
      else setServerError(res.error ?? 'Erreur de connexion.')
      setIsSubmitting(false)
      return
    }

    navigate('/')
  }

  return (
    <AuthPage>
      <AuthCard>
        <AuthLogo>
          <AuthLogoCircle>B</AuthLogoCircle>
          <AuthLogoText>BookFlow</AuthLogoText>
        </AuthLogo>

        <AuthTitle>Connexion</AuthTitle>
        <AuthSubtitle>Accès réservé aux libraires</AuthSubtitle>

        {serverError && <AuthError role="alert">{serverError}</AuthError>}

        <AuthForm onSubmit={handleSubmit} noValidate>
          <Input
            id="identifier"
            label="Code client ou email"
            type="text"
            placeholder="LIB001 ou contact@malib.fr"
            value={form.identifier}
            onChange={handleChange('identifier')}
            error={fieldErrors.identifier}
            autoComplete="username"
            autoFocus
          />

          <div>
            <PasswordWrapper>
              <Input
                id="password"
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange('password')}
                error={fieldErrors.password}
                autoComplete="current-password"
                style={{ paddingRight: '44px' }}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                style={{ top: fieldErrors.password ? 'calc(50% - 10px)' : '50%' }}
              >
                <EyeIcon visible={showPassword} />
              </PasswordToggle>
            </PasswordWrapper>
          </div>

          <div style={{ textAlign: 'right', marginTop: '-4px' }}>
            <Link
              to="/forgot-password"
              style={{ fontSize: '0.875rem', color: '#1E3A5F', textDecoration: 'underline' }}
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Connexion…' : 'Se connecter'}
          </Button>
        </AuthForm>

        <AuthLink>
          Pas encore de compte ?{' '}
          <Link to="/register">Créer un accès</Link>
        </AuthLink>
      </AuthCard>
    </AuthPage>
  )
}

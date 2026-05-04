import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

const STORAGE_KEY = 'onboarding_done'

interface OnboardingContextValue {
  isDone: boolean
  shouldStart: boolean
  startTour: () => void
  markDone: () => void
  resetTour: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isDone, setIsDone] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true')
  const [shouldStart, setShouldStart] = useState(false)

  const markDone = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsDone(true)
    setShouldStart(false)
  }, [])

  const startTour = useCallback(() => {
    setShouldStart(true)
  }, [])

  const resetTour = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setIsDone(false)
    setShouldStart(true)
  }, [])

  return (
    <OnboardingContext.Provider value={{ isDone, shouldStart, startTour, markDone, resetTour }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}

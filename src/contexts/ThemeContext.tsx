import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { theme } from '@/lib/theme'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
}

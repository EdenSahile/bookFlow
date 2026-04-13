import styled from 'styled-components'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'

const LayoutRoot = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`

const Main = styled.main`
  padding-top: ${({ theme }) => theme.layout.headerHeight};
  padding-bottom: ${({ theme }) => theme.layout.bottomNavHeight};
  min-height: 100vh;

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding-left: ${({ theme }) => theme.layout.sidebarWidth};
    padding-bottom: 0;
  }
`

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <LayoutRoot>
      <Sidebar />
      <Header />
      <Main>{children}</Main>
      <BottomNav />
    </LayoutRoot>
  )
}

import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

/* ── Icons SVG inline (mêmes que BottomNav) ── */
function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M3 9.5L11 3l8 6.5V19a1 1 0 0 1-1 1H14v-5h-4v5H4a1 1 0 0 1-1-1V9.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M11 2l2.39 4.84 5.35.78-3.87 3.77.91 5.33L11 14.27l-4.78 2.51.91-5.33L3.26 7.62l5.35-.78L11 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M4 19V5a2 2 0 0 1 2-2h12v14H6a2 2 0 0 0-2 2zm0 0a2 2 0 0 0 2 2h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 7h6M9 11h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function TrendingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <polyline
        points="3,17 8,12 12,15 18,6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="14,6 18,6 18,10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="12" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="12" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="12" y="12" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

/* ── Styled ── */
const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({ theme }) => theme.layout.sidebarWidth};
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.navy};
  display: none;
  flex-direction: column;
  z-index: 101;
  box-shadow: ${({ theme }) => theme.shadows.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: flex;
  }
`

const SidebarLogo = styled.div`
  height: ${({ theme }) => theme.layout.headerHeight};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.10);
  user-select: none;
`

const LogoCircle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.navy};
  flex-shrink: 0;
`

const LogoText = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.white};
  letter-spacing: -0.02em;
`

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md} 0;
  flex: 1;
`

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 12px ${({ theme }) => theme.spacing.md};
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  border-left: 3px solid transparent;
  transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background-color: rgba(255, 255, 255, 0.07);
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    border-left-color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(255, 192, 0, 0.08);
    font-weight: ${({ theme }) => theme.typography.weights.semibold};
  }
`

/* ── Component ── */
const tabs = [
  { to: '/', label: 'Accueil', icon: <HomeIcon />, end: true },
  { to: '/nouveautes', label: 'Nouveautés', icon: <StarIcon /> },
  { to: '/fonds', label: 'Fonds', icon: <BookIcon /> },
  { to: '/top-ventes', label: 'Top Ventes', icon: <TrendingIcon /> },
  { to: '/selections', label: 'Sélections', icon: <GridIcon /> },
]

export function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarLogo>
        <LogoCircle>B</LogoCircle>
        <LogoText>BookFlow</LogoText>
      </SidebarLogo>
      <NavList aria-label="Navigation principale">
        {tabs.map(({ to, label, icon, end }) => (
          <StyledNavLink key={to} to={to} end={end}>
            {icon}
            {label}
          </StyledNavLink>
        ))}
      </NavList>
    </SidebarContainer>
  )
}

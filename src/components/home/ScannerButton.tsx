import styled, { keyframes } from 'styled-components'

function BarcodeIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* Barres verticales */}
      <rect x="4"  y="10" width="3" height="28" rx="1" fill="currentColor" />
      <rect x="10" y="10" width="2" height="28" rx="1" fill="currentColor" />
      <rect x="15" y="10" width="4" height="28" rx="1" fill="currentColor" />
      <rect x="22" y="10" width="2" height="28" rx="1" fill="currentColor" />
      <rect x="27" y="10" width="3" height="28" rx="1" fill="currentColor" />
      <rect x="33" y="10" width="2" height="28" rx="1" fill="currentColor" />
      <rect x="38" y="10" width="3" height="28" rx="1" fill="currentColor" />
      <rect x="44" y="10" width="3" height="28" rx="1" fill="currentColor" />
      {/* Ligne de scan animée */}
    </svg>
  )
}

const scanLine = keyframes`
  0%   { top: 18px; opacity: 1; }
  90%  { top: 30px; opacity: 1; }
  100% { top: 30px; opacity: 0; }
`

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 192, 0, 0.4); }
  50%       { box-shadow: 0 0 0 12px rgba(255, 192, 0, 0); }
`

const Button = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 200px;
  height: 200px;
  background-color: ${({ theme }) => theme.colors.navy};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.radii.xl};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  animation: ${pulse} 2.5s ease-in-out infinite;
  transition: transform 0.15s ease, background-color 0.15s ease;

  &:hover {
    transform: scale(1.04);
    background-color: ${({ theme }) => theme.colors.navyHover};
  }

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 180px;
    height: 180px;
  }
`

const ScanLine = styled.div`
  position: absolute;
  left: 24px;
  right: 24px;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 1px;
  animation: ${scanLine} 1.8s ease-in-out infinite;
`

const Label = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`

interface ScannerButtonProps {
  onClick?: () => void
}

export function ScannerButton({ onClick }: ScannerButtonProps) {
  return (
    <Button
      onClick={onClick}
      aria-label="Scanner un code-barres"
    >
      <BarcodeIcon />
      <ScanLine />
      <Label>Scanner</Label>
    </Button>
  )
}

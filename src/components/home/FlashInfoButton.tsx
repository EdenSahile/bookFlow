import styled, { keyframes } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { NumberBadge } from '@/components/ui/Badge'

function BellIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LightningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

const shake = keyframes`
  0%, 100% { transform: rotate(0deg); }
  20%       { transform: rotate(-12deg); }
  40%       { transform: rotate(12deg); }
  60%       { transform: rotate(-8deg); }
  80%       { transform: rotate(8deg); }
`

const Card = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 360px;
  background-color: ${({ theme }) => theme.colors.navy};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.15s ease, background-color 0.15s ease;
  text-align: left;

  &:hover {
    transform: translateY(-2px);
    background-color: ${({ theme }) => theme.colors.navyHover};

    .bell-icon {
      animation: ${shake} 0.5s ease;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
  }
`

const IconWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`

const BellWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: rgba(255, 192, 0, 0.15);
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.primary};
`

const BadgeWrapper = styled(NumberBadge)`
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.navy};
`

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`

const Title = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.white};
`

const Subtitle = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: rgba(255, 255, 255, 0.65);
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.25rem;
  flex-shrink: 0;
`

interface FlashInfoButtonProps {
  count?: number
}

export function FlashInfoButton({ count = 3 }: FlashInfoButtonProps) {
  const navigate = useNavigate()

  return (
    <Card
      onClick={() => navigate('/flash-infos')}
      aria-label={`Flash infos — ${count} nouvelle${count > 1 ? 's' : ''}`}
    >
      <IconWrapper>
        <BellWrapper className="bell-icon">
          <BellIcon />
        </BellWrapper>
        {count > 0 && <BadgeWrapper>{count > 99 ? '99+' : count}</BadgeWrapper>}
      </IconWrapper>

      <TextGroup>
        <Title>
          <LightningIcon /> Flash infos
        </Title>
        <Subtitle>
          {count} nouvelle{count > 1 ? 's' : ''} info{count > 1 ? 's' : ''} éditoriale{count > 1 ? 's' : ''}
        </Subtitle>
      </TextGroup>

      <Arrow>›</Arrow>
    </Card>
  )
}

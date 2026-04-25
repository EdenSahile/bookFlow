import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components'
import type { Shipment } from '@/data/mockOrders'

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`
const slideUp = keyframes`from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); }`

const Backdrop = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  animation: ${fadeIn} 0.15s ease;
`

const Panel = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.xl};
  width: 100%; max-width: 480px;
  max-height: 90vh; overflow-y: auto;
  animation: ${slideUp} 0.2s ease;
  display: flex; flex-direction: column;
`

const PanelHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  position: sticky; top: 0; background: ${({ theme }) => theme.colors.white};
  z-index: 1;
`

const PanelTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.navy};
  margin: 0;
`

const CloseBtn = styled.button`
  background: none; border: none; cursor: pointer;
  color: ${({ theme }) => theme.colors.gray[400]};
  display: flex; padding: 4px;
  font-size: 20px; line-height: 1;
  &:hover { color: ${({ theme }) => theme.colors.navy}; }
`

const PanelBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.lg};
`

const CarrierRow = styled.div`
  display: flex; align-items: center; gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
`

const TrackingNum = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamilyMono};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.navy};
  letter-spacing: 0.05em;
`

const ExternalLink = styled.a`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.success};
  text-decoration: none;
  display: flex; align-items: center; gap: 4px;
  &:hover { text-decoration: underline; }
`

const Timeline = styled.ol`
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-direction: column; gap: 0;
`

const TimelineItem = styled.li<{ $first: boolean }>`
  display: flex; gap: ${({ theme }) => theme.spacing.md};
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing.md};

  &::before {
    content: '';
    position: absolute;
    left: 7px; top: 18px;
    width: 2px;
    bottom: 0;
    background: ${({ theme }) => theme.colors.gray[200]};
    display: ${({ $first }) => $first ? 'none' : 'block'};
  }
`

const Dot = styled.div<{ $active: boolean }>`
  width: 16px; height: 16px;
  border-radius: 50%; flex-shrink: 0; margin-top: 2px;
  background: ${({ $active, theme }) => $active ? theme.colors.error : theme.colors.success};
  z-index: 1;
`

const EventContent = styled.div`
  flex: 1;
`

const EventLabel = styled.div<{ $active: boolean }>`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ $active, theme }) => $active ? theme.typography.weights.semibold : theme.typography.weights.normal};
  color: ${({ $active, theme }) => $active ? theme.colors.navy : theme.colors.gray[600]};
`

const EventMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.gray[400]};
  margin-top: 2px;
`

const EstimatedBox = styled.div`
  background: ${({ theme }) => theme.colors.navyLight};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.navy};
  display: flex; align-items: center; gap: 8px;
`

const CARRIER_LABELS: Record<string, string> = {
  laposte: 'La Poste',
  chronopost: 'Chronopost',
  ups: 'UPS',
  dpd: 'DPD',
}

function trackingUrl(carrier: string, trackingNumber: string): string {
  if (carrier === 'laposte') return `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`
  if (carrier === 'chronopost') return `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${trackingNumber}`
  return '#'
}

function formatDatetime(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

function formatDateLong(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date(iso))
}

interface TrackingModalProps {
  shipment: Shipment
  onClose: () => void
}

export function TrackingModal({ shipment, onClose }: TrackingModalProps) {
  return createPortal(
    <Backdrop onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <Panel>
        <PanelHeader>
          <PanelTitle>Suivi du colis</PanelTitle>
          <CloseBtn onClick={onClose} aria-label="Fermer">×</CloseBtn>
        </PanelHeader>

        <PanelBody>
          <CarrierRow>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6B6B68', marginBottom: 2 }}>Transporteur</div>
              <div style={{ fontWeight: 600, color: '#232f3e' }}>{CARRIER_LABELS[shipment.carrier] ?? shipment.carrier}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: '#6B6B68', marginBottom: 2 }}>N° de suivi</div>
              <TrackingNum>{shipment.trackingNumber}</TrackingNum>
            </div>
            <ExternalLink
              href={trackingUrl(shipment.carrier, shipment.trackingNumber)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Suivre ↗
            </ExternalLink>
          </CarrierRow>

          <Timeline>
            {shipment.events.map((event, i) => (
              <TimelineItem key={i} $first={i === shipment.events.length - 1}>
                <Dot $active={i === 0} />
                <EventContent>
                  <EventLabel $active={i === 0}>{event.label}</EventLabel>
                  <EventMeta>{event.location} · {formatDatetime(event.occurredAt)}</EventMeta>
                </EventContent>
              </TimelineItem>
            ))}
          </Timeline>

          {shipment.deliveredAt ? (
            <EstimatedBox>
              ✅ Livré le {formatDateLong(shipment.deliveredAt.split('T')[0])}
            </EstimatedBox>
          ) : (
            <EstimatedBox>
              🚚 Livraison estimée : {formatDateLong(shipment.estimatedDelivery)}
            </EstimatedBox>
          )}
        </PanelBody>
      </Panel>
    </Backdrop>,
    document.body
  )
}

import { useState } from 'react'
import styled from 'styled-components'
import type { TransmissionMode } from './checkoutSchemas'

/* ── Tooltip ── */
const TooltipWrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  cursor: help;
`

const TooltipIcon = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.colors.gray[400]};
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: 10px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`

const TooltipBox = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 260px;
  background: ${({ theme }) => theme.colors.navy};
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  line-height: 1.6;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  z-index: 50;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.navy};
  }
`

function EdiTooltip() {
  const [visible, setVisible] = useState(false)
  return (
    <TooltipWrap
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
      aria-label="En savoir plus sur l'EDI Dilicom"
    >
      <TooltipIcon aria-hidden="true">?</TooltipIcon>
      {visible && (
        <TooltipBox role="tooltip">
          L'EDI (Échange de Données Informatisé) via Dilicom permet une transmission automatisée
          de vos commandes vers le diffuseur, sans saisie manuelle. Norme FTP4 compatible avec tous
          les éditeurs référencés au GLN Librairies.
        </TooltipBox>
      )}
    </TooltipWrap>
  )
}

/* ── Styled components ── */
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.navy};
  margin: 0 0 2px;
`

const SectionDesc = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0 0 8px;
`

const OptionCard = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  border: 2px solid ${({ $selected, theme }) =>
    $selected ? theme.colors.navy : theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primaryLight : theme.colors.white};
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: ${({ $selected, theme }) =>
      $selected ? theme.colors.navy : theme.colors.gray[400]};
  }
`

const RadioInput = styled.input`
  margin-top: 2px;
  accent-color: ${({ theme }) => theme.colors.navy};
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  cursor: pointer;
`

const OptionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
`

const OptionLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.navy};
  display: flex;
  align-items: center;
  gap: 4px;
`

const OptionDesc = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`

const EdiTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  background: ${({ theme }) => theme.colors.accentLight};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 10px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.navy};
  letter-spacing: 0.04em;
`

const DefaultCheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 0 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-top: 4px;
`

const CheckInput = styled.input`
  accent-color: ${({ theme }) => theme.colors.navy};
  width: 15px;
  height: 15px;
  cursor: pointer;
  flex-shrink: 0;
`

/* ── Props ── */
interface Props {
  value: TransmissionMode
  onChange: (mode: TransmissionMode) => void
  saveAsDefault: boolean
  onSaveAsDefaultChange: (checked: boolean) => void
}

export function OrderTransmissionStep({
  value,
  onChange,
  saveAsDefault,
  onSaveAsDefaultChange,
}: Props) {
  return (
    <Section>
      <div>
        <SectionTitle>Mode de transmission</SectionTitle>
        <SectionDesc>Choisissez comment votre commande sera envoyée</SectionDesc>
      </div>

      <OptionCard $selected={value === 'FLOWDIFF'} htmlFor="tx-flowdiff">
        <RadioInput
          id="tx-flowdiff"
          type="radio"
          name="transmission"
          value="FLOWDIFF"
          checked={value === 'FLOWDIFF'}
          onChange={() => onChange('FLOWDIFF')}
        />
        <OptionContent>
          <OptionLabel>Envoyer via FlowDiff</OptionLabel>
          <OptionDesc>Commande via le diffuseur</OptionDesc>
        </OptionContent>
      </OptionCard>

      <OptionCard $selected={value === 'EDI'} htmlFor="tx-edi">
        <RadioInput
          id="tx-edi"
          type="radio"
          name="transmission"
          value="EDI"
          checked={value === 'EDI'}
          onChange={() => onChange('EDI')}
        />
        <OptionContent>
          <OptionLabel>
            Envoyer via EDI
            <EdiTag>Dilicom</EdiTag>
            <EdiTooltip />
          </OptionLabel>
          <OptionDesc>Transmission automatisée via Dilicom (échange de données informatisé)</OptionDesc>
        </OptionContent>
      </OptionCard>

      <DefaultCheckRow htmlFor="tx-default">
        <CheckInput
          id="tx-default"
          type="checkbox"
          checked={saveAsDefault}
          onChange={e => onSaveAsDefaultChange(e.target.checked)}
        />
        Utiliser ce mode par défaut pour mes prochaines commandes
      </DefaultCheckRow>
    </Section>
  )
}

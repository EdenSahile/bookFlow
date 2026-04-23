import { useState } from 'react'
import styled from 'styled-components'
import { useToast } from '@/contexts/ToastContext'

/* ── Types ── */
type Universe = 'BD/Mangas' | 'Jeunesse' | 'Littérature' | 'Adulte-pratique'

interface NotifPrefs {
  nouveautes: boolean
  flashInfos: boolean
  promotions: boolean
  universes: Record<Universe, boolean>
}

const DEFAULT_PREFS: NotifPrefs = {
  nouveautes: true,
  flashInfos: true,
  promotions: false,
  universes: {
    'BD/Mangas': true,
    'Jeunesse': true,
    'Littérature': true,
    'Adulte-pratique': false,
  },
}

const UNIVERSES: Universe[] = ['BD/Mangas', 'Jeunesse', 'Littérature', 'Adulte-pratique']

/* ── Styled ── */
const Page = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 540px;
  margin: 0 auto;
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const Section = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const SectionTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`

const Row = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`

const RowLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.navy};
`

/* Toggle switch */
const ToggleTrack = styled.span<{ $on: boolean }>`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  background-color: ${({ $on, theme }) => $on ? theme.colors.primary : theme.colors.gray[400]};
  border-radius: ${({ theme }) => theme.radii.full};
  transition: background-color 0.2s ease;
  flex-shrink: 0;
`

const ToggleThumb = styled.span<{ $on: boolean }>`
  position: absolute;
  top: 3px;
  left: ${({ $on }) => ($on ? '23px' : '3px')};
  width: 18px;
  height: 18px;
  background-color: #ffffff;
  border-radius: 50%;
  transition: left 0.2s ease;
  border: 1.5px solid rgba(0,0,0,0.12);
`

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`

const SaveButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: ${({ theme }) => theme.colors.navy};
  color: #fdfdfd;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  cursor: pointer;
  transition: background-color 0.15s ease;
  font-family: ${({ theme }) => theme.typography.fontFamily};

  &:hover {
    background-color: ${({ theme }) => theme.colors.navyHover};
  }
`

/* ── Toggle component ── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <ToggleTrack $on={checked}>
      <HiddenCheckbox
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <ToggleThumb $on={checked} />
    </ToggleTrack>
  )
}

/* ── Component ── */
export function ParametresPage() {
  const { showToast } = useToast()
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_PREFS)

  function setGlobal(key: keyof Omit<NotifPrefs, 'universes'>, val: boolean) {
    setPrefs(p => ({ ...p, [key]: val }))
  }

  function setUniverse(u: Universe, val: boolean) {
    setPrefs(p => ({ ...p, universes: { ...p.universes, [u]: val } }))
  }

  function handleSave() {
    showToast('Préférences enregistrées.')
  }

  return (
    <Page>
      <Title>Paramètres</Title>

      <Section>
        <SectionTitle>Notifications générales</SectionTitle>
        <Row>
          <RowLabel>Nouveautés du mois</RowLabel>
          <Toggle checked={prefs.nouveautes} onChange={v => setGlobal('nouveautes', v)} />
        </Row>
        <Row>
          <RowLabel>Flash Infos</RowLabel>
          <Toggle checked={prefs.flashInfos} onChange={v => setGlobal('flashInfos', v)} />
        </Row>
        <Row>
          <RowLabel>Offres & promotions</RowLabel>
          <Toggle checked={prefs.promotions} onChange={v => setGlobal('promotions', v)} />
        </Row>
      </Section>

      <Section>
        <SectionTitle>Univers suivis</SectionTitle>
        {UNIVERSES.map(u => (
          <Row key={u}>
            <RowLabel>{u}</RowLabel>
            <Toggle checked={prefs.universes[u]} onChange={v => setUniverse(u, v)} />
          </Row>
        ))}
      </Section>

      <SaveButton onClick={handleSave}>Enregistrer les préférences</SaveButton>
    </Page>
  )
}

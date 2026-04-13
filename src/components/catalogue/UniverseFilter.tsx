import styled from 'styled-components'
import type { Universe } from '@/data/mockBooks'
import { UNIVERSES } from '@/data/mockBooks'

const Bar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

const Pill = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 2px solid ${({ theme, $active }) => $active ? theme.colors.navy : theme.colors.gray[200]};
  background: ${({ theme, $active }) => $active ? theme.colors.navy : theme.colors.white};
  color: ${({ theme, $active }) => $active ? theme.colors.white : theme.colors.gray[600]};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme, $active }) => $active ? theme.typography.weights.semibold : theme.typography.weights.normal};
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.navy};
    color: ${({ theme }) => theme.colors.navy};
  }
`

interface Props {
  value: Universe | null
  onChange: (v: Universe | null) => void
  showAll?: boolean
}

export function UniverseFilter({ value, onChange, showAll = true }: Props) {
  return (
    <Bar role="group" aria-label="Filtrer par univers">
      {showAll && (
        <Pill $active={value === null} onClick={() => onChange(null)}>
          Tous
        </Pill>
      )}
      {UNIVERSES.map(u => (
        <Pill key={u} $active={value === u} onClick={() => onChange(u === value ? null : u)}>
          {u}
        </Pill>
      ))}
    </Bar>
  )
}

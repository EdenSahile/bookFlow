import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { DatePicker } from '../ui/DatePicker'
import type { PeriodPreset, UsePeriodFilterReturn } from '../../hooks/usePeriodFilter'

/* ─────────────────────────────────────────
   Labels & config des presets
───────────────────────────────────────── */

const PRESETS: { value: PeriodPreset; label: string }[] = [
  { value: 'this-month',  label: 'Ce mois-ci'        },
  { value: 'last-month',  label: 'Mois précédent'     },
  { value: '3-months',    label: '3 derniers mois'    },
  { value: '6-months',    label: '6 derniers mois'    },
  { value: 'this-year',   label: 'Cette année'        },
  { value: 'custom',      label: 'Période personnalisée' },
]

function presetLabel(p: PeriodPreset): string {
  return PRESETS.find(x => x.value === p)?.label ?? p
}

function fmtDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const today = new Date().toISOString().slice(0, 10)

/* ─────────────────────────────────────────
   Styled
───────────────────────────────────────── */

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 6px;
  }
`

const DropWrap = styled.div`
  position: relative;
`

const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.gray[800]};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 34px;
    padding: 0 10px;
    font-size: 0.8125rem;
  }
`

const ChevronIcon = styled.svg<{ $open: boolean }>`
  flex-shrink: 0;
  transition: transform 0.15s;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0)')};
`

const Menu = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 210px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 0;
  padding: 4px 0;
  z-index: 300;
`

const MenuItem = styled.li<{ $active?: boolean }>`
  padding: 9px 14px;
  font-size: 0.875rem;
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.gray[800])};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.typography.weights.semibold : theme.typography.weights.normal};
  background: ${({ $active, theme }) => ($active ? theme.colors.primaryLight : 'transparent')};
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`

const CustomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 4px;
  }
`

const RangeSep = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.gray[400]};
`

const PeriodLabel = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.gray[400]};
  white-space: nowrap;
`

/* ─────────────────────────────────────────
   Sous-composant : dropdown presets
───────────────────────────────────────── */

function PresetDropdown({
  preset,
  setPreset,
}: {
  preset: PeriodPreset
  setPreset: (p: PeriodPreset) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <DropWrap ref={ref}>
      <Trigger
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        {presetLabel(preset)}
        <ChevronIcon
          $open={open}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </ChevronIcon>
      </Trigger>

      {open && (
        <Menu role="listbox">
          {PRESETS.map(opt => (
            <MenuItem
              key={opt.value}
              role="option"
              aria-selected={preset === opt.value}
              $active={preset === opt.value}
              onClick={() => {
                setPreset(opt.value)
                setOpen(false)
              }}
            >
              {opt.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </DropWrap>
  )
}

/* ─────────────────────────────────────────
   Composant principal
───────────────────────────────────────── */

export type PeriodSelectorProps = Pick<
  UsePeriodFilterReturn,
  | 'preset'
  | 'setPreset'
  | 'period'
  | 'customStart'
  | 'setCustomStart'
  | 'customEnd'
  | 'setCustomEnd'
>

export function PeriodSelector({
  preset,
  setPreset,
  period,
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
}: PeriodSelectorProps) {
  const isCustom = preset === 'custom'

  /* Résumé de la période active pour les presets non-custom */
  const periodSummary = isCustom
    ? null
    : `${fmtDate(period.start.toISOString().slice(0, 10))} → ${fmtDate(period.end.toISOString().slice(0, 10))}`

  return (
    <Wrap>
      <PresetDropdown preset={preset} setPreset={setPreset} />

      {isCustom ? (
        <CustomRow>
          <DatePicker
            value={customStart}
            onChange={setCustomStart}
            max={customEnd || today}
            placeholder="Début"
          />
          <RangeSep>→</RangeSep>
          <DatePicker
            value={customEnd}
            onChange={setCustomEnd}
            min={customStart}
            max={today}
            placeholder="Fin"
          />
        </CustomRow>
      ) : (
        periodSummary && <PeriodLabel>{periodSummary}</PeriodLabel>
      )}
    </Wrap>
  )
}

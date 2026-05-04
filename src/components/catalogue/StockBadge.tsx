import styled, { css } from 'styled-components'
import type { StockStatut } from '@/data/mockBooks'

/* ──────────────────────────────────────
   Palette par statut
─────────────────────────────────────── */
const STATUT_STYLES: Record<StockStatut, { bg: string; fg: string; border: string }> = {
  disponible:   { bg: '#E6F4EC', fg: '#1E7045', border: '#B6DCC3' },   // Vert
  stock_limite: { bg: '#FDEBD0', fg: '#C04A00', border: '#F5C58A' },   // Orange
  sur_commande: { bg: '#E8EDF3', fg: '#1C3252', border: '#BCCADC' },   // Bleu/gris
  en_reimp:     { bg: '#FDEBD0', fg: '#B65A00', border: '#F5C58A' },   // Orange/gris
  epuise:       { bg: '#EAEAE6', fg: '#555550', border: '#C9C9C2' },   // Gris foncé
  rupture:      { bg: '#FDECEA', fg: '#C0392B', border: '#F5C5C0' },  // Rouge
}

export const STATUT_LIBELLES: Record<StockStatut, string> = {
  disponible:   '✅ Disponible',
  stock_limite: '⚠️ Stock limité',
  sur_commande: '🔄 Sur commande — Délai 7-15 jours',
  en_reimp:     '🔁 En réimpression',
  epuise:       '❌ Épuisé',
  rupture:      '⛔ Rupture de stock',
}

/* ──────────────────────────────────────
   Badge
─────────────────────────────────────── */
const BadgeBox = styled.span<{ $bg: string; $fg: string; $border: string; $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: ${({ $size }) => $size === 'md' ? '4px 10px' : '2px 8px'};
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  border: 1px solid ${({ $border }) => $border};
  border-radius: ${({ theme }) => theme.radii.xl};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ $size }) => $size === 'md' ? '12px' : '11px'};
  font-weight: 500;
  white-space: nowrap;
  line-height: 1.2;

  ${({ $size }) => $size === 'md' && css`letter-spacing: 0.01em;`}
`

interface StockBadgeProps {
  statut: StockStatut
  size?: 'sm' | 'md'
  className?: string
}

export function StockBadge({ statut, size = 'sm', className }: StockBadgeProps) {
  const styles = STATUT_STYLES[statut]
  return (
    <BadgeBox
      $bg={styles.bg}
      $fg={styles.fg}
      $border={styles.border}
      $size={size}
      className={className}
      aria-label={STATUT_LIBELLES[statut]}
    >
      {STATUT_LIBELLES[statut]}
    </BadgeBox>
  )
}

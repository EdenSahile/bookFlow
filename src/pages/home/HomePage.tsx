import React, { useEffect, useRef, useState } from 'react'
import { theme } from '@/lib/theme'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/contexts/CartContext'
import { MOCK_BOOKS } from '@/data/mockBooks'
import { BookCover } from '@/components/catalogue/BookCover'

const GREEN = theme.colors.success

const nouveautes = MOCK_BOOKS
  .filter(b => b.type === 'nouveaute')
  .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate))
  .slice(0, 4)


/* ── SVG Icons ── */
function IconPackage() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  )
}

function IconBooks() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconClipboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
  )
}

function IconChevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'left'
        ? <polyline points="15 18 9 12 15 6" />
        : <polyline points="9 18 15 12 9 6" />}
    </svg>
  )
}

function IconOrders() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

function IconReceipt() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  )
}

function IconAlertClock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconTruck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function IconCart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function IconEuro() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10h12M4 14h12" />
      <path d="M19.5 7A7.5 7.5 0 1 0 19.5 17" />
    </svg>
  )
}

function IconBox() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" /><line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  )
}

function IconBarChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  )
}

function fmtFrDate(date: Date): string {
  const day = date.getDate()
  const month = date.toLocaleDateString('fr-FR', { month: 'long' })
  const year = date.getFullYear()
  return `${day === 1 ? '1er' : day} ${month} ${year}`
}

/* ── Page layout ── */
const Page = styled.div`
  min-height: calc(100vh - ${({ theme }) => theme.layout.headerHeight});
  background-color: ${({ theme }) => theme.colors.gray[50]};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing['3xl']};
  }
`

const Content = styled.div`
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

/* ── Greeting row ── */
const GreetingRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`

const GreetingTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0;
`

const DateBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: right;
`

const DateText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const DateLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[400]};
  line-height: 1.2;
`

const DateValue = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[800]};
  line-height: 1.3;
`

function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ color: '#6B6B68', flexShrink: 0 }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ flexShrink: 0, color: '#6B6B68', marginTop: 1 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

/* ── Actions en attente ── */
const ActionsBox = styled.section`
  background: #FEF2F2;
  border: 1px solid #FECACA;
  padding: 16px 20px;
`

const ActionsHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 12px;
`

const ActionsLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

const ActionsTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ActionsTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0;
`

const ActionsBadge = styled.span`
  background: #EF4444;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 99px;
  line-height: 1.6;
`

const ActionsSubtitle = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
`

const SeeAllBtn = styled.button`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[800]};
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  &:hover { border-color: ${({ theme }) => theme.colors.gray[400]}; }
`

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const ActionCard = styled.button`
  background: white;
  border: 1px solid #FEE2E2;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  &:hover { border-color: #FECACA; }
`

const ActionIconWrap = styled.div<{ $bg: string; $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const ActionBody = styled.div`
  flex: 1;
`

const ActionCount = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[800]};
  line-height: 1.1;
  margin-bottom: 2px;
`

const ActionLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.3;
`

const ActionArrow = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray[400]};
  flex-shrink: 0;
`

/* ── Bilan du mois précédent ── */
const BilanSection = styled.section``

const BilanHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 12px;
`

const BilanTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const BilanTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0;
`

const BilanPeriod = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray[400]};
`

const BilanUpdate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[400]};
  white-space: nowrap;
`

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const KPICard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const KPITop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const KPIIconWrap = styled.div<{ $bg: string; $color: string }>`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const KPILabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.3;
`

const KPIValue = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[800]};
  line-height: 1.1;
`

const KPITrend = styled.div<{ $up: boolean }>`
  font-size: 12px;
  color: ${({ $up }) => $up ? '#16a34a' : '#DC2626'};
  display: flex;
  align-items: center;
  gap: 3px;
`

const KPILink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.success};
  cursor: pointer;
  text-align: left;
  margin-top: 2px;
  &:hover { text-decoration: underline; }
`

/* ── Ligne 3 colonnes (étapes 4-5-6 et 7-8-9) ── */
const ThreeColRow = styled.div`
  display: grid;
  grid-template-columns: 45fr 30fr 25fr;
  gap: 16px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const PanelCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: 16px;
`

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`

const PanelTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
`

const PanelSeeAll = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
  white-space: nowrap;
  &:hover { color: ${({ theme }) => theme.colors.navy}; }
`

/* ── Évolution des commandes ── */
const CHART_POINTS = [12,10,18,15,22,20,28,25,20,30,28,18,35,32,28,38,33,28,40,36,42,38,35,44,40,42,38,44,40,43,42]
const CHART_MAX_Y = 50
const CHART_W = 210
const CHART_H = 85
const CHART_OX = 25
const CHART_OY = 90

function buildPolyline(): string {
  return CHART_POINTS.map((v, i) => {
    const x = CHART_OX + (i / (CHART_POINTS.length - 1)) * CHART_W
    const y = CHART_OY - (v / CHART_MAX_Y) * CHART_H
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

const X_LABELS = [
  { i: 0,  label: '01/03' },
  { i: 7,  label: '08/03' },
  { i: 14, label: '15/03' },
  { i: 21, label: '22/03' },
  { i: 30, label: '31/03' },
]

const Y_TICKS = [0, 10, 20, 30, 40, 50]

function ChartEvolution() {
  const polyline = buildPolyline()
  return (
    <svg viewBox="0 0 260 105" width="100%" aria-label="Évolution des commandes">
      {/* Grille horizontale */}
      {Y_TICKS.map(v => {
        const y = CHART_OY - (v / CHART_MAX_Y) * CHART_H
        return (
          <g key={v}>
            <line x1={CHART_OX} y1={y} x2={CHART_OX + CHART_W} y2={y}
              stroke="#E5E7EB" strokeWidth="0.5" />
            <text x={CHART_OX - 4} y={y + 3.5} textAnchor="end"
              fontSize="7" fill="#9CA3AF">{v}</text>
          </g>
        )
      })}
      {/* Courbe */}
      <polyline points={polyline} fill="none" stroke="#16a34a" strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round" />
      {/* Axe X */}
      <line x1={CHART_OX} y1={CHART_OY} x2={CHART_OX + CHART_W} y2={CHART_OY}
        stroke="#D1D5DB" strokeWidth="0.8" />
      {X_LABELS.map(({ i, label }) => {
        const x = CHART_OX + (i / (CHART_POINTS.length - 1)) * CHART_W
        return (
          <text key={i} x={x} y={CHART_OY + 10} textAnchor="middle"
            fontSize="7" fill="#9CA3AF">{label}</text>
        )
      })}
      {/* Label */}
      <text x={CHART_OX} y="6" fontSize="7" fill="#9CA3AF">Nombre de commandes par jour</text>
    </svg>
  )
}

const ChartInner = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`

const ChartSvgWrap = styled.div`
  flex: 1;
  min-width: 0;
`

const ChartStatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 120px;
`

const ChartStatRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const ChartStatLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[400]};
`

const ChartStatValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const ChartStatIcon = styled.div<{ $bg: string; $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const ChartStatNum = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[800]};
`

const ChartStatDelta = styled.span<{ $up: boolean }>`
  font-size: 11px;
  color: ${({ $up }) => $up ? '#16a34a' : '#DC2626'};
`

function IconSend() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function IconXCircle() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

/* ── Donut chart ── */
const DONUT_SEGMENTS = [
  { percent: 45, color: '#3B82F6', label: 'BD / Mangas' },
  { percent: 30, color: '#22C55E', label: 'Littérature' },
  { percent: 15, color: '#EAB308', label: 'Jeunesse' },
  { percent: 10, color: '#9CA3AF', label: 'Autres' },
]
const DONUT_R    = 35
const DONUT_CX   = 50
const DONUT_CY   = 50
const DONUT_CIRC = 2 * Math.PI * DONUT_R

function ChartDonut() {
  let cumulative = 0
  return (
    <svg viewBox="0 0 100 100" width="110" height="110" aria-label="Répartition des achats">
      <circle cx={DONUT_CX} cy={DONUT_CY} r={DONUT_R}
        fill="none" stroke="#F3F4F6" strokeWidth="14" />
      {DONUT_SEGMENTS.map(({ percent, color }) => {
        const dash   = (percent / 100) * DONUT_CIRC
        const offset = DONUT_CIRC * 0.25 - cumulative
        cumulative  += dash
        return (
          <circle key={color}
            cx={DONUT_CX} cy={DONUT_CY} r={DONUT_R}
            fill="none" stroke={color} strokeWidth="14"
            strokeDasharray={`${dash.toFixed(2)} ${DONUT_CIRC.toFixed(2)}`}
            strokeDashoffset={offset.toFixed(2)}
          />
        )
      })}
    </svg>
  )
}

const DonutInner = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`

const DonutLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`

const LegendDot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`

const LegendLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[600]};
  flex: 1;
`

const LegendPct = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[800]};
`

/* ── Top éditeurs ── */
const TOP_EDITEURS = [
  { rank: 1, name: 'Éditeur 1',        pct: 35, amount: '4 358 €' },
  { rank: 2, name: 'Éditeur 2',        pct: 25, amount: '3 113 €' },
  { rank: 3, name: 'Éditeur 3',        pct: 15, amount: '1 868 €' },
  { rank: 4, name: 'Éditeur 4',        pct: 10, amount: '1 245 €' },
  { rank: 5, name: 'Autres éditeurs',  pct: 15, amount: '1 866 €' },
]

const TopEdList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

const TopEdRow = styled.div`
  display: grid;
  grid-template-columns: 16px 1fr 34px 56px;
  align-items: center;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};

  &:last-child { border-bottom: none; }
`

const TopEdRank = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[400]};
`

const TopEdName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[800]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TopEdPct = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[400]};
  text-align: right;
`

const TopEdAmount = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[800]};
  text-align: right;
`

const TopEdFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 24px;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`

const TopEdFooterLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray[400]};
`

/* ── Nouveautés du mois (panel) ── */
const UNIVERSE_BADGE_COLOR: Record<string, { bg: string; text: string }> = {
  'BD/Mangas':       { bg: '#EA580C', text: '#fff' },
  'Littérature':     { bg: '#166534', text: '#fff' },
  'Adulte-pratique': { bg: '#7C3AED', text: '#fff' },
  'Jeunesse':        { bg: '#0369A1', text: '#fff' },
}

const NovelScroll = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  position: relative;
`

const MiniCard = styled.div`
  flex-shrink: 0;
  width: 110px;
  cursor: pointer;
`

const MiniCoverWrap = styled.div`
  position: relative;
  margin-bottom: 6px;
`

const UniverseBadge = styled.span<{ $bg: string; $text: string }>`
  position: absolute;
  top: 5px;
  left: 0;
  background: ${({ $bg }) => $bg};
  color: ${({ $text }) => $text};
  font-size: 9px;
  font-weight: 600;
  padding: 2px 5px;
  line-height: 1.4;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const MiniTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[800]};
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 2px;
`

const MiniAuthor = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray[400]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const NovelPanelWrap = styled.div`
  position: relative;
`

const NovelArrow = styled.button<{ $side: 'left' | 'right'; $visible: boolean }>`
  position: absolute;
  top: 50px;
  ${({ $side }) => $side === 'right' ? 'right: -10px;' : 'left: -10px;'}
  z-index: 2;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.navy};
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  pointer-events: ${({ $visible }) => $visible ? 'auto' : 'none'};
`

/* ── Suivi des flux EDI ── */
const EdiStatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
`

const EdiStatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const EdiStatIcon = styled.div<{ $bg: string; $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const EdiStatNum = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[800]};
  line-height: 1.1;
`

const EdiStatLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.3;
`

const EdiMetricsRow = styled.div`
  display: flex;
  gap: 20px;
  padding: 10px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[100]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  margin-bottom: 12px;
  flex-wrap: wrap;
`

const EdiMetricLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[600]};
`

const EdiMetricValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-left: 4px;
`

const EdiLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.success};
  cursor: pointer;
  &:hover { text-decoration: underline; }
`

/* ── Footer info bar ── */
const FooterBar = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.gray[100]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 4px;
`

const FooterText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
  line-height: 1.5;
`

/* ── Shortcuts panel (step 9) ── */
const ShortcutList = styled.div`
  display: flex;
  flex-direction: column;
`

const ShortcutRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  text-decoration: none;
  color: inherit;
  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.gray[50]}; }
`

const ShortcutIconWrap = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const ShortcutRowLabel = styled.span`
  flex: 1;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray[800]};
`

const ShortcutChevron = styled.span`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.gray[400]};
  line-height: 1;
`

/* ── Shortcuts (old grid, kept for mobile bottom bar) ── */
const ShortcutsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const ShortcutCard = styled(Link)`
  background: ${({ theme }) => theme.colors.gray[100]};
  border: 0.5px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 12px;
  text-align: center;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.gray[600]};
  transition: border-color 0.15s;

  &:hover {
    border-color: ${GREEN};
  }
`

const ShortcutLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[600]};
`

/* ── Nouveautés ── */
const NouveautesSection = styled.section`
  width: 100%;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.navy};
`

const SeeAllLink = styled(Link)`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 500;
  color: ${GREEN};
  text-decoration: none;
  &:hover { text-decoration: underline; }
`

/* max-width = 4 cards × 230px + 3 gaps × 20px = 980px */
const CarouselWrapper = styled.div`
  position: relative;
  max-width: calc(4 * 230px + 3 * 20px);
`

const CardScroll = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 8px 4px 16px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

const CardSlot = styled.div`
  flex-shrink: 0;
  width: 230px;
`

const ArrowBtn = styled.button<{ $side: 'left' | 'right'; $visible: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $side }) => $side === 'left' ? 'left: -18px;' : 'right: -18px;'}
  z-index: 2;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.navy};
  transition: box-shadow 0.15s, opacity 0.15s;
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  pointer-events: ${({ $visible }) => $visible ? 'auto' : 'none'};

  &:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.18); }
`

/* ── Component ── */
export function HomePage() {
  const { user } = useAuth()
  const { totalItems: cartCount } = useCart()
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft,  setCanScrollLeft]  = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const novelRef = useRef<HTMLDivElement>(null)
  const [canNovLeft,  setCanNovLeft]  = useState(false)
  const [canNovRight, setCanNovRight] = useState(true)

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  const dateLabel = 'Aujourd\'hui'
  const dateValue = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  const prevMonthStart  = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthEnd    = new Date(now.getFullYear(), now.getMonth(), 0)
  const updateDate      = new Date(now.getFullYear(), now.getMonth(), 1)
  const nextMonthFirst  = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const bilanPeriod     = `${fmtFrDate(prevMonthStart)} – ${fmtFrDate(prevMonthEnd)}`
  const bilanUpdate     = `Mise à jour le ${fmtFrDate(updateDate)} ↻`
  const prevMonthName   = prevMonthStart.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  /* Raccourci / → focus champ de recherche du header */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== '/') return
      const active = document.activeElement
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return
      e.preventDefault()
      const headerInput = document.getElementById('header-search-input') as HTMLInputElement | null
      headerInput?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  /* Mise à jour des flèches au scroll */
  function updateArrows() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows)
    return () => el.removeEventListener('scroll', updateArrows)
  }, [])

  function scrollBy(delta: number) {
    scrollRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
    setTimeout(updateArrows, 50)
  }

  function updateNovArrows() {
    const el = novelRef.current
    if (!el) return
    setCanNovLeft(el.scrollLeft > 4)
    setCanNovRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = novelRef.current
    if (!el) return
    updateNovArrows()
    el.addEventListener('scroll', updateNovArrows)
    return () => el.removeEventListener('scroll', updateNovArrows)
  }, [])

  function scrollNovBy(delta: number) {
    novelRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
    setTimeout(updateNovArrows, 50)
  }

  return (
    <Page>
      <Content>

        {/* 1 — Greeting row */}
        <GreetingRow>
          <GreetingTitle>
            {greeting} {user?.nomLibrairie ?? 'Librairie'} 👋
          </GreetingTitle>
          <DateBlock>
            <DateText>
              <DateLabel>{dateLabel}</DateLabel>
              <DateValue>{dateValue}</DateValue>
            </DateText>
            <IconCalendar />
          </DateBlock>
        </GreetingRow>

        {/* 2 — Actions en attente */}
        <ActionsBox aria-label="Actions en attente">
          <ActionsHeader>
            <ActionsLeft>
              <ActionsTitleRow>
                <ActionsTitle>Actions en attente</ActionsTitle>
                <ActionsBadge>10</ActionsBadge>
              </ActionsTitleRow>
              <ActionsSubtitle>Ce sont des éléments qui nécessitent votre attention.</ActionsSubtitle>
            </ActionsLeft>
            <SeeAllBtn onClick={() => navigate('/historique')}>Voir toutes les actions →</SeeAllBtn>
          </ActionsHeader>
          <ActionsGrid>
            <ActionCard onClick={() => navigate('/panier')}>
              <ActionIconWrap $bg="#FFF7ED" $color="#EA580C"><IconOrders /></ActionIconWrap>
              <ActionBody>
                <ActionCount>{cartCount}</ActionCount>
                <ActionLabel>{cartCount <= 1 ? 'Ouvrage dans le panier' : 'Ouvrages dans le panier'}</ActionLabel>
              </ActionBody>
              <ActionArrow>→</ActionArrow>
            </ActionCard>
            <ActionCard onClick={() => navigate('/edi?filter=ORDRSP')}>
              <ActionIconWrap $bg="#FFFBEB" $color="#D97706"><IconReceipt /></ActionIconWrap>
              <ActionBody>
                <ActionCount>2</ActionCount>
                <ActionLabel>commandes à vérifier</ActionLabel>
              </ActionBody>
              <ActionArrow>→</ActionArrow>
            </ActionCard>
            <ActionCard onClick={() => navigate('/edi')}>
              <ActionIconWrap $bg="#FEF2F2" $color="#DC2626"><IconAlertClock /></ActionIconWrap>
              <ActionBody>
                <ActionCount>1</ActionCount>
                <ActionLabel>erreur EDI à corriger</ActionLabel>
              </ActionBody>
              <ActionArrow>→</ActionArrow>
            </ActionCard>
            <ActionCard onClick={() => navigate('/edi?filter=DESADV')}>
              <ActionIconWrap $bg="#EFF6FF" $color="#2563EB"><IconTruck /></ActionIconWrap>
              <ActionBody>
                <ActionCount>3</ActionCount>
                <ActionLabel>expéditions en retard</ActionLabel>
              </ActionBody>
              <ActionArrow>→</ActionArrow>
            </ActionCard>
          </ActionsGrid>
        </ActionsBox>

        {/* 3 — Bilan du mois précédent */}
        <BilanSection aria-label="Bilan du mois précédent">
          <BilanHeader>
            <BilanTitleGroup>
              <BilanTitle>Bilan du mois précédent</BilanTitle>
              <BilanPeriod>{bilanPeriod}</BilanPeriod>
            </BilanTitleGroup>
            <BilanUpdate>{bilanUpdate}</BilanUpdate>
          </BilanHeader>
          <KPIGrid>
            <KPICard>
              <KPITop>
                <KPIIconWrap $bg="#DCFCE7" $color="#16a34a"><IconCart /></KPIIconWrap>
                <KPILabel>Commandes passées</KPILabel>
              </KPITop>
              <KPIValue>32</KPIValue>
              <KPITrend $up={true}>▲ +12% vs {prevMonthName}</KPITrend>
              <KPILink onClick={() => navigate('/historique')}>Voir le détail →</KPILink>
            </KPICard>
            <KPICard>
              <KPITop>
                <KPIIconWrap $bg="#DCFCE7" $color="#16a34a"><IconEuro /></KPIIconWrap>
                <KPILabel>Montant total commandé</KPILabel>
              </KPITop>
              <KPIValue>12 450 €</KPIValue>
              <KPITrend $up={true}>▲ +8% vs {prevMonthName}</KPITrend>
              <KPILink onClick={() => navigate('/historique')}>Voir le détail →</KPILink>
            </KPICard>
            <KPICard>
              <KPITop>
                <KPIIconWrap $bg="#DCFCE7" $color="#16a34a"><IconBox /></KPIIconWrap>
                <KPILabel>Exemplaires commandés</KPILabel>
              </KPITop>
              <KPIValue>1 240</KPIValue>
              <KPITrend $up={true}>▲ +9% vs {prevMonthName}</KPITrend>
              <KPILink onClick={() => navigate('/historique')}>Voir le détail →</KPILink>
            </KPICard>
            <KPICard>
              <KPITop>
                <KPIIconWrap $bg="#EDE9FE" $color="#7C3AED"><IconBarChart /></KPIIconWrap>
                <KPILabel>Panier moyen</KPILabel>
              </KPITop>
              <KPIValue>389 €</KPIValue>
              <KPITrend $up={false}>▼ -2% vs {prevMonthName}</KPITrend>
              <KPILink onClick={() => navigate('/historique')}>Voir le détail →</KPILink>
            </KPICard>
          </KPIGrid>
        </BilanSection>

        {/* Ligne 4-5-6 */}
        <ThreeColRow>

          {/* 4 — Évolution des commandes */}
          <PanelCard>
            <PanelHeader>
              <PanelTitle>
                Évolution des commandes
                <IconCalendar />
              </PanelTitle>
            </PanelHeader>
            <ChartInner>
              <ChartSvgWrap><ChartEvolution /></ChartSvgWrap>
              <ChartStatsList>
                <ChartStatRow>
                  <ChartStatLabel>Commandes envoyées</ChartStatLabel>
                  <ChartStatValueRow>
                    <ChartStatIcon $bg="#DCFCE7" $color="#16a34a"><IconSend /></ChartStatIcon>
                    <ChartStatNum>32</ChartStatNum>
                    <ChartStatDelta $up={true}>▲ +12%</ChartStatDelta>
                  </ChartStatValueRow>
                </ChartStatRow>
                <ChartStatRow>
                  <ChartStatLabel>Commandes annulées</ChartStatLabel>
                  <ChartStatValueRow>
                    <ChartStatIcon $bg="#FEE2E2" $color="#DC2626"><IconXCircle /></ChartStatIcon>
                    <ChartStatNum>2</ChartStatNum>
                    <ChartStatDelta $up={false}>▼ -33%</ChartStatDelta>
                  </ChartStatValueRow>
                </ChartStatRow>
                <ChartStatRow>
                  <ChartStatLabel>Taux d'annulation</ChartStatLabel>
                  <ChartStatValueRow>
                    <ChartStatIcon $bg="#FEE2E2" $color="#DC2626"><IconXCircle /></ChartStatIcon>
                    <ChartStatNum>6,2 %</ChartStatNum>
                    <ChartStatDelta $up={false}>▼ -3,1 pts</ChartStatDelta>
                  </ChartStatValueRow>
                </ChartStatRow>
              </ChartStatsList>
            </ChartInner>
          </PanelCard>

          {/* 5 — Répartition des achats */}
          <PanelCard>
            <PanelHeader>
              <PanelTitle>Répartition de vos achats</PanelTitle>
            </PanelHeader>
            <DonutInner>
              <ChartDonut />
              <DonutLegend>
                {DONUT_SEGMENTS.map(({ label, color, percent }) => (
                  <LegendItem key={label}>
                    <LegendDot $color={color} />
                    <LegendLabel>{label}</LegendLabel>
                    <LegendPct>{percent}%</LegendPct>
                  </LegendItem>
                ))}
              </DonutLegend>
            </DonutInner>
          </PanelCard>

          {/* 6 — Top éditeurs */}
          <PanelCard>
            <PanelHeader>
              <PanelTitle>Top éditeurs</PanelTitle>
              <PanelSeeAll onClick={() => navigate('/fonds')}>Voir tout →</PanelSeeAll>
            </PanelHeader>
            <TopEdList>
              {TOP_EDITEURS.map(({ rank, name, pct, amount }) => (
                <TopEdRow key={rank}>
                  <TopEdRank>{rank}</TopEdRank>
                  <TopEdName>{name}</TopEdName>
                  <TopEdPct>{pct}%</TopEdPct>
                  <TopEdAmount>{amount}</TopEdAmount>
                </TopEdRow>
              ))}
            </TopEdList>
            <TopEdFooter>
              <TopEdFooterLabel>Part du montant</TopEdFooterLabel>
              <TopEdFooterLabel>Montant commandé</TopEdFooterLabel>
            </TopEdFooter>
          </PanelCard>

        </ThreeColRow>

        {/* Ligne 7-8-9 */}
        <ThreeColRow>

          {/* 7 — Suivi des flux EDI */}
          <PanelCard>
            <PanelHeader>
              <PanelTitle>Suivi des flux EDI</PanelTitle>
            </PanelHeader>
            <EdiStatsGrid>
              <EdiStatItem>
                <EdiStatIcon $bg="#DCFCE7" $color="#16a34a"><IconSend /></EdiStatIcon>
                <div>
                  <EdiStatNum>12</EdiStatNum>
                  <EdiStatLabel>Commandes envoyées</EdiStatLabel>
                </div>
              </EdiStatItem>
              <EdiStatItem>
                <EdiStatIcon $bg="#EFF6FF" $color="#2563EB"><IconTruck /></EdiStatIcon>
                <div>
                  <EdiStatNum>5</EdiStatNum>
                  <EdiStatLabel>Expéditions en cours</EdiStatLabel>
                </div>
              </EdiStatItem>
              <EdiStatItem>
                <EdiStatIcon $bg="#FFF7ED" $color="#EA580C"><IconReceipt /></EdiStatIcon>
                <div>
                  <EdiStatNum>3</EdiStatNum>
                  <EdiStatLabel>Factures reçues</EdiStatLabel>
                </div>
              </EdiStatItem>
              <EdiStatItem>
                <EdiStatIcon $bg="#FEF2F2" $color="#DC2626"><IconXCircle /></EdiStatIcon>
                <div>
                  <EdiStatNum>1</EdiStatNum>
                  <EdiStatLabel>Erreur EDI</EdiStatLabel>
                </div>
              </EdiStatItem>
            </EdiStatsGrid>
            <EdiMetricsRow>
              <div>
                <EdiMetricLabel>Délai moyen de livraison</EdiMetricLabel>
                <EdiMetricValue>3,2 jours</EdiMetricValue>
              </div>
              <div>
                <EdiMetricLabel>Taux de réception</EdiMetricLabel>
                <EdiMetricValue>92%</EdiMetricValue>
              </div>
            </EdiMetricsRow>
            <EdiLink onClick={() => navigate('/edi')}>Accéder au suivi EDI →</EdiLink>
          </PanelCard>

          {/* 8 — Nouveautés du mois */}
          <PanelCard>
            <PanelHeader>
              <PanelTitle>Nouveautés du mois</PanelTitle>
              <PanelSeeAll onClick={() => navigate('/nouveautes')}>Voir tout →</PanelSeeAll>
            </PanelHeader>
            <NovelPanelWrap>
              <NovelArrow $side="right" $visible={canNovRight}
                onClick={() => scrollNovBy(120)} aria-label="Suivant">
                <IconChevron dir="right" />
              </NovelArrow>
              <NovelScroll ref={novelRef}>
                {nouveautes.map(book => {
                  const badge = UNIVERSE_BADGE_COLOR[book.universe] ?? { bg: '#6B7280', text: '#fff' }
                  return (
                    <MiniCard key={book.id} onClick={() => navigate(`/livre/${book.id}`)}>
                      <MiniCoverWrap>
                        <BookCover
                          isbn={book.isbn}
                          alt={book.title}
                          width={110}
                          height={150}
                          universe={book.universe}
                          authors={book.authors}
                          publisher={book.publisher}
                        />
                        <UniverseBadge $bg={badge.bg} $text={badge.text}>
                          {book.universe}
                        </UniverseBadge>
                      </MiniCoverWrap>
                      <MiniTitle>{book.title}</MiniTitle>
                      <MiniAuthor>{book.authors[0]}</MiniAuthor>
                    </MiniCard>
                  )
                })}
              </NovelScroll>
            </NovelPanelWrap>
          </PanelCard>

          {/* 9 — Raccourcis */}
          <PanelCard>
            <PanelHeader>
              <PanelTitle>Raccourcis</PanelTitle>
            </PanelHeader>
            <ShortcutList>
              {([
                { icon: <IconPackage />, label: 'Passer une commande',      to: '/fonds'      },
                { icon: <IconCart />,    label: 'Accéder au panier',         to: '/panier'     },
                { icon: <IconClipboard />, label: 'Gérer mes listes',        to: '/compte'     },
                { icon: <IconOrders />, label: 'Consulter mon historique',   to: '/historique' },
              ] as { icon: React.ReactNode; label: string; to: string }[]).map(({ icon, label, to }) => (
                <ShortcutRow key={to} to={to}>
                  <ShortcutIconWrap>{icon}</ShortcutIconWrap>
                  <ShortcutRowLabel>{label}</ShortcutRowLabel>
                  <ShortcutChevron>›</ShortcutChevron>
                </ShortcutRow>
              ))}
            </ShortcutList>
          </PanelCard>

        </ThreeColRow>

        {/* 10 — Footer info bar */}
        <FooterBar>
          <IconInfo />
          <FooterText>
            Les statistiques affichées couvrent la période du {fmtFrDate(prevMonthStart)} au {fmtFrDate(prevMonthEnd)} et seront mises à jour le {fmtFrDate(nextMonthFirst)}.
          </FooterText>
        </FooterBar>

      </Content>
    </Page>
  )
}

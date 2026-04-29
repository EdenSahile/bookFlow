import type { PeriodKPI, DashboardOrder } from '@/data/mockDashboard'

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function fmtNum2(n: number): string {
  return n.toFixed(2).replace('.', ',')
}

function fmtNum1(n: number): string {
  return n.toFixed(1).replace('.', ',')
}

function cell(value: string): string {
  if (value.includes(';') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function buildDashboardCSV(
  kpi: PeriodKPI,
  orders: DashboardOrder[],
  period: { start: Date; end: Date },
  preset: string,
): string {
  const lines: string[] = []

  lines.push('=== Résumé KPIs ===')
  lines.push('Période;Du;Au;Commandes passées;Montant total TTC (€);Exemplaires commandés;Panier moyen (€);Délai moyen (j);Taux de rupture (%);Références distinctes')
  lines.push([
    cell(preset),
    isoDate(period.start),
    isoDate(period.end),
    kpi.nbCommandes,
    fmtNum2(kpi.montantTotal),
    kpi.nbExemplaires,
    fmtNum2(kpi.panierMoyen),
    fmtNum1(kpi.delaiMoyen),
    fmtNum1(kpi.tauxRupture * 100),
    kpi.nbReferences,
  ].join(';'))

  lines.push('')

  lines.push('=== Détail des commandes ===')
  lines.push('Date;Éditeur;Univers;Montant TTC (€);Nb exemplaires;Statut')
  for (const o of orders) {
    lines.push([
      o.date,
      cell(o.publisher),
      cell(o.universe),
      fmtNum2(o.montantTTC),
      o.nbExemplaires,
      o.cancelled ? 'Annulée' : 'Livrée',
    ].join(';'))
  }

  return '﻿' + lines.join('\n')
}

export function exportDashboardCSV(
  kpi: PeriodKPI,
  orders: DashboardOrder[],
  period: { start: Date; end: Date },
  preset: string,
): void {
  const csv  = buildDashboardCSV(kpi, orders, period, preset)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `bookflow-dashboard-${isoDate(new Date())}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

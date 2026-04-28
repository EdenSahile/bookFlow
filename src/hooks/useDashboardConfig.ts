import { useState, useCallback } from 'react'

export interface ConfigItem {
  id: string
  visible: boolean
}

export type DashboardZone = 'actionCards' | 'kpiCards' | 'mainPanels' | 'bottomPanels'

export interface DashboardConfig {
  actionCards:  ConfigItem[]
  kpiCards:     ConfigItem[]
  mainPanels:   ConfigItem[]
  bottomPanels: ConfigItem[]
}

/* ── Pure helpers (exported for tests) ── */

export function reorderItems(items: ConfigItem[], fromIdx: number, toIdx: number): ConfigItem[] {
  const arr = [...items]
  const [moved] = arr.splice(fromIdx, 1)
  arr.splice(toIdx, 0, moved)
  return arr
}

export function toggleItem(items: ConfigItem[], id: string): ConfigItem[] {
  const item = items.find(i => i.id === id)
  if (!item) return items
  const visibleCount = items.filter(i => i.visible).length
  if (item.visible && visibleCount <= 1) return items
  return items.map(i => i.id === id ? { ...i, visible: !i.visible } : i)
}

/* ── Default config ── */

export const DEFAULT_CONFIG: DashboardConfig = {
  actionCards: [
    { id: 'action-offices',     visible: true },
    { id: 'action-panier',      visible: true },
    { id: 'action-commandes',   visible: true },
    { id: 'action-edi-error',   visible: true },
    { id: 'action-expeditions', visible: true },
  ],
  kpiCards: [
    { id: 'kpi-commandes',    visible: true },
    { id: 'kpi-montant',      visible: true },
    { id: 'kpi-exemplaires',  visible: true },
    { id: 'kpi-panier-moyen', visible: true },
    { id: 'kpi-delai',        visible: true },
    { id: 'kpi-rupture',      visible: true },
    { id: 'kpi-references',   visible: true },
  ],
  mainPanels: [
    { id: 'panel-evolution', visible: true },
    { id: 'panel-donut',     visible: true },
    { id: 'panel-editeurs',  visible: true },
  ],
  bottomPanels: [
    { id: 'panel-edi',        visible: true },
    { id: 'panel-nouveautes', visible: true },
    { id: 'panel-raccourcis', visible: true },
  ],
}

/* ── localStorage ── */

const LS_KEY = 'flowdiff_dashboard_config'

function loadConfig(): DashboardConfig {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return DEFAULT_CONFIG
    return JSON.parse(raw) as DashboardConfig
  } catch {
    return DEFAULT_CONFIG
  }
}

function saveConfig(config: DashboardConfig): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(config))
  } catch {
    // quota or incognito — ignore
  }
}

/* ── Hook ── */

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig>(loadConfig)

  const reorder = useCallback((zone: DashboardZone, fromIdx: number, toIdx: number) => {
    setConfig(prev => {
      const next = { ...prev, [zone]: reorderItems(prev[zone], fromIdx, toIdx) }
      saveConfig(next)
      return next
    })
  }, [])

  const toggle = useCallback((zone: DashboardZone, id: string) => {
    setConfig(prev => {
      const updated = toggleItem(prev[zone], id)
      if (updated === prev[zone]) return prev
      const next = { ...prev, [zone]: updated }
      saveConfig(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    try { localStorage.removeItem(LS_KEY) } catch {}
    setConfig(DEFAULT_CONFIG)
  }, [])

  return { config, reorder, toggle, reset }
}

# Dashboard Customization — Design Spec
**Date:** 2026-04-28
**Scope:** FlowDiff — HomePage dashboard widgets

---

## Goal

Allow librarians to personalize their dashboard: reorder and show/hide every widget via a drawer, with the layout persisted in localStorage.

---

## Scope — Customizable zones

| Zone | Items | Count |
|------|-------|-------|
| Actions en attente | les 5 action cards internes | 5 |
| Tableau de bord — KPI | Commandes passées, Montant total, Exemplaires commandés, Panier moyen, Délai moyen, Taux de rupture, Références distinctes | 7 |
| Analyses (ligne haute) | Évolution des commandes, Répartition des achats, Top éditeurs | 3 |
| Widgets (ligne basse) | Suivi EDI, Nouveautés du mois, Raccourcis | 3 |

The "Actions en attente" **section itself** (header + red box) is not movable — only the 5 internal cards can be reordered/hidden.

---

## Data Model

```typescript
interface ConfigItem {
  id: string
  visible: boolean
}

interface DashboardConfig {
  actionCards:  ConfigItem[]
  kpiCards:     ConfigItem[]
  mainPanels:   ConfigItem[]
  bottomPanels: ConfigItem[]
}
```

Order in array = display order. `visible: false` = hidden from dashboard.

**localStorage key:** `flowdiff_dashboard_config`

### Widget IDs

**actionCards:**
- `action-offices` — Office à valider
- `action-panier` — Panier
- `action-commandes` — Commandes à vérifier
- `action-edi-error` — Erreur EDI
- `action-expeditions` — Expéditions en retard

**kpiCards:**
- `kpi-commandes` — Commandes passées
- `kpi-montant` — Montant total commandé
- `kpi-exemplaires` — Exemplaires commandés
- `kpi-panier-moyen` — Panier moyen
- `kpi-delai` — Délai moyen de livraison
- `kpi-rupture` — Taux de rupture
- `kpi-references` — Références distinctes

**mainPanels:**
- `panel-evolution` — Évolution des commandes
- `panel-donut` — Répartition des achats
- `panel-editeurs` — Top éditeurs

**bottomPanels:**
- `panel-edi` — Suivi des flux EDI
- `panel-nouveautes` — Nouveautés du mois
- `panel-raccourcis` — Raccourcis

---

## Architecture

### New files

#### `src/hooks/useDashboardConfig.ts`
- Loads config from localStorage on mount (falls back to `DEFAULT_CONFIG`)
- Exposes:
  - `config: DashboardConfig`
  - `reorder(zone, fromIdx, toIdx)` — moves item within a zone
  - `toggle(zone, id)` — flips `visible` for one item
  - `reset()` — restores `DEFAULT_CONFIG` and clears localStorage
- Saves to localStorage on every change
- Constraint: `toggle` is a no-op if it would hide the last visible item in a zone

#### `src/components/dashboard/CustomizerDrawer.tsx`
- Props: `open`, `onClose`, `config`, `onReorder`, `onToggle`, `onReset`
- Drawer 380px, slides from right via `transform: translateX`
- Semi-transparent overlay behind; click overlay = close
- Fixed header: "Personnaliser le tableau de bord" + ✕ button
- Fixed footer: "Réinitialiser par défaut" (left) + "Fermer" (right)
- Scrollable body with 4 labeled sections

**Each item row:**
```
[⠿ handle]  [👁 toggle]  Label
```
- Desktop: `draggable={true}`, HTML5 drag&drop within zone, cursor: grab
- Mobile (`max-width: 768px`): ↑ ↓ arrow buttons replace drag handle
- Dragging item: `opacity: 0.4`
- Drop target: blue `border-top: 2px solid #2563EB`
- Hidden item: label opacity 0.45, toggle icon = closed eye

### Modified file

#### `src/pages/home/HomePage.tsx`
- Import `useDashboardConfig` + `CustomizerDrawer`
- Add "⊞ Personnaliser" button in `BilanHeader` (right of `ComparaisonToggle`)
- Each of the 4 zones iterates over `config[zone]` to render items in config order, filtering `visible: false`
- Existing card render logic (JSX, data, navigation) is unchanged — only the ordering wrapper changes
- No new subcomponents: cards stay inline, wrapped in a `.map()` over config

---

## UX Behavior

- **Real-time feedback:** changes apply instantly on the dashboard visible behind the open drawer
- **Minimum visibility:** last visible item per zone cannot be toggled off (toggle button disabled)
- **Reset:** restores default order + all visible, confirmed with no modal (immediate)
- **Action cards business logic:** cards like "Panier" keep their `$empty` behavior regardless of position
- **Persistence:** every reorder/toggle auto-saves; reset clears the key

---

## Business constraints

- KPI values, trends, links, icons are all passed from existing `kpi` / `compareKpi` computed values — config only controls order and visibility, never data
- The `KPIGrid` CSS grid (`repeat(4, 1fr)`) stays; hidden cards are simply not rendered (no gap)
- `mainPanels` / `bottomPanels` use the existing `ThreeColRow` grid; if 1 or 2 items are visible the grid collapses naturally (CSS `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))` or similar)

---

## Out of scope

- Drag & drop on mobile (replaced by ↑↓ arrows)
- Custom card labels or colors
- Per-user server-side persistence (localStorage only)
- Adding new widget types

---

## Files summary

| File | Action |
|------|--------|
| `src/hooks/useDashboardConfig.ts` | Create |
| `src/components/dashboard/CustomizerDrawer.tsx` | Create |
| `src/pages/home/HomePage.tsx` | Modify |

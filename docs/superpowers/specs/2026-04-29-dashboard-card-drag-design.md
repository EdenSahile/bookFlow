# Dashboard Card Drag & Drop — Design Spec

**Date:** 2026-04-29  
**Scope:** `src/pages/home/HomePage.tsx` uniquement  
**Statut:** Approuvé

---

## Objectif

Permettre à l'utilisateur de réordonner les cards du tableau de bord directement depuis la page d'accueil, via un grip handle sur chaque card, sans passer par le CustomizerDrawer.

---

## Contraintes

- Utiliser exclusivement ce qui existe déjà dans le projet (HTML5 DnD, `useDashboardConfig`, styled-components)
- Coexister avec le CustomizerDrawer (drawer + cards partagent le même état)
- Aucune nouvelle dépendance
- Aucun nouveau fichier
- Desktop-first ; mobile géré par le drawer existant

---

## Architecture & état

### État ajouté dans `HomePage`

```ts
const cardDragRef = useRef<{ zone: DashboardZone; id: string } | null>(null)
const [cardDrag, setCardDrag] = useState<{ zone: DashboardZone; id: string } | null>(null)
const [cardDrop, setCardDrop] = useState<{ zone: DashboardZone; id: string } | null>(null)
```

`cardDragRef` évite les stale closures dans les event handlers DnD.  
`cardDrag` / `cardDrop` pilotent le rendu visuel (opacité, bordure).

### Helper de réordonnancement

```ts
function reorderByIds(zone: DashboardZone, fromId: string, toId: string) {
  if (fromId === toId) return
  const items = dashConfig.config[zone]
  const fromIdx = items.findIndex(i => i.id === fromId)
  const toIdx   = items.findIndex(i => i.id === toId)
  if (fromIdx === -1 || toIdx === -1) return
  dashConfig.reorder(zone, fromIdx, toIdx)
}
```

`dashConfig.reorder` persiste automatiquement dans `flowdiff_dashboard_config` (localStorage existant).

---

## Composants & styles

### Nouveaux styled components

#### `CardDragHandle` — partagé par toutes les zones

```ts
const CardDragHandle = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: none;
  border: none;
  padding: 5px;
  cursor: grab;
  color: ${({ theme }) => theme.colors.gray[400]};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s, background 0.15s;

  &:active { cursor: grabbing; }
  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`
```

Handle invisible par défaut → visible au hover de la card parente via `&:hover ${CardDragHandle}`.

### Modifications des cards existantes

#### `KPICard`

Ajout de `position: relative`, props `$dragging`/`$dropTarget`, et règle hover :

```ts
const KPICard = styled.div<{ $dragging?: boolean; $dropTarget?: boolean }>`
  /* styles existants */
  position: relative;
  opacity: ${({ $dragging }) => $dragging ? 0.4 : 1};
  border: 1px solid ${({ $dropTarget, theme }) =>
    $dropTarget ? theme.colors.navy : theme.colors.gray[200]};
  transition: opacity 0.1s, border-color 0.1s;

  &:hover ${CardDragHandle} { opacity: 1; }
`
```

#### `ActionCard`

`ActionCard` est un `button` — imbriquer un `button` (CardDragHandle) dedans est invalide HTML.

**Solution** : introduire `ActionCardWrap`, un `div` positionné en `relative` qui prend les attributs DnD et contient le `CardDragHandle` (absolu) + l'`ActionCard` button existant (inchangé) :

```tsx
<ActionCardWrap
  draggable
  onDragStart={...}
  onDragOver={...}
  onDrop={...}
  onDragEnd={...}
  $dragging={...}
  $dropTarget={...}
>
  <CardDragHandle>...</CardDragHandle>
  <ActionCard $empty={def.empty} onClick={...}>
    ...
  </ActionCard>
</ActionCardWrap>
```

`ActionCardWrap` est un `styled.div` avec `position: relative`, props `$dragging`/`$dropTarget`, et la règle `&:hover ${CardDragHandle} { opacity: 1; }`. `ActionCard` button reste strictement inchangé.

#### `PanelCard`

Ajout de `position: relative`, props `$dragging`/`$dropTarget`, même règle hover.  
Le `CardDragHandle` est placé en absolu top-right dans le `PanelCard`, au-dessus du `PanelHeader`.

### `IconGrip`

Copie de l'icône existante dans le CustomizerDrawer (6 cercles 2×3) — déclarée dans `HomePage.tsx` pour éviter un import croisé.

---

## Flux drag & drop

### Événements par card

```
draggable={true}
onDragStart → cardDragRef.current = { zone, id }
             setCardDrag({ zone, id })

onDragOver  → e.preventDefault()
             si cardDragRef.current?.zone === zone :
               setCardDrop({ zone, id })

onDrop      → reorderByIds(zone, fromId, toId)
             reset ref + états

onDragEnd   → reset ref + états (couvre abandon mid-drag)
```

### Guards

| Situation | Comportement |
|-----------|-------------|
| Drop sur soi-même | `fromId === toId` → ignoré |
| Drop sur une autre zone | `dragRef.zone !== zone` → ignoré |
| Card masquée | Non rendue → n'entre pas dans le flux DnD |
| Abandon mid-drag | `onDragEnd` nettoie l'état |

---

## Persistance

Aucun changement à la couche persistance. `dashConfig.reorder` → `saveConfig` → `localStorage.setItem('flowdiff_dashboard_config', ...)`.  
Drawer et cards en sync automatique via le même état React.

---

## Reset

Déjà disponible dans le CustomizerDrawer ("Réinitialiser par défaut"). Pas de bouton reset supplémentaire sur la page.

---

## Ce qui ne change pas

- `useDashboardConfig.ts` — inchangé
- `CustomizerDrawer.tsx` — inchangé
- Tous les autres fichiers — inchangés
- Comportement mobile — inchangé (flèches du drawer)

---

## Fichier modifié

| Fichier | Nature de la modification |
|---------|--------------------------|
| `src/pages/home/HomePage.tsx` | Ajout état DnD, `CardDragHandle`, modification `KPICard`/`ActionCard`/`PanelCard`, wiring DnD sur chaque zone |

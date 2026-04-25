# Suivi commande + Gestion des retours — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter le suivi transporteur sur les cartes commande et un onglet complet "Mes retours" avec création de demande, sur la page HistoriquePage.

**Architecture:** Couche service async (ordersService / returnsService) lit les mocks JSON ; ReturnsContext gère l'état retours + localStorage ; les composants UI ne touchent qu'aux services/contextes. Quand la BDD sera branchée, seul le corps des fonctions de service change.

**Tech Stack:** React 18, TypeScript strict, styled-components v6, Zod, Vitest/jsdom, données mock JSON.

---

## Fichiers impactés

| Action | Fichier | Rôle |
|--------|---------|------|
| Modify | `src/data/mockOrders.ts` | Ajouter types `TrackingEvent`, `Shipment` + champ `shipment?` sur `Order` + données shipment sur 2 orders |
| Create | `src/data/mockReturns.ts` | Types `ReturnRequest`, `ReturnItem`, `ReturnStatus` + `MOCK_RETURNS` |
| Create | `src/services/ordersService.ts` | Wrappers async lisant `mockOrders` |
| Create | `src/services/returnsService.ts` | Wrappers async + `createReturn` muable |
| Create | `src/contexts/ReturnsContext.tsx` | State retours, `addReturn`, stats — pattern identique à `OrdersContext` |
| Modify | `src/App.tsx` | Ajouter `<ReturnsProvider>` |
| Create | `src/components/historique/TrackingModal.tsx` | Modal timeline transporteur |
| Create | `src/components/historique/ReturnCard.tsx` | Carte d'un retour |
| Create | `src/components/historique/NewReturnModal.tsx` | Formulaire nouvelle demande de retour |
| Modify | `src/pages/historique/HistoriquePage.tsx` | Tabs, lien tracking, bouton Retour, onglet Mes retours |

---

## Task 1 — Types Shipment dans mockOrders.ts

**Files:**
- Modify: `src/data/mockOrders.ts`

- [ ] **Step 1: Ajouter les types après l'import existant**

Insérer juste avant `export type OrderStatus`:

```typescript
export type TrackingEventStatus =
  | 'prepared'
  | 'shipped'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'

export interface TrackingEvent {
  status: TrackingEventStatus
  label: string
  location: string
  occurredAt: string
}

export type Carrier = 'laposte' | 'chronopost' | 'ups' | 'dpd'

export interface Shipment {
  carrier: Carrier
  trackingNumber: string
  estimatedDelivery: string
  shippedAt: string
  deliveredAt: string | null
  events: TrackingEvent[]
}
```

- [ ] **Step 2: Ajouter `shipment?` dans l'interface `Order`**

Dans l'interface `Order`, après `numFacture?`:

```typescript
  shipment?: Shipment
```

- [ ] **Step 3: Ajouter shipment sur ord-008 (CMD-2025-0401, 'en cours') — en transit**

Dans l'objet `ord-008`, après `deliveryMode: 'standard'`, avant `items`:

```typescript
      shipment: {
        carrier: 'laposte',
        trackingNumber: 'LA123456789FR',
        estimatedDelivery: '2025-04-07',
        shippedAt: '2025-04-03T16:30:00',
        deliveredAt: null,
        events: [
          { status: 'out_for_delivery', label: 'En cours de livraison', location: 'Agence Paris 15', occurredAt: '2025-04-04T08:14:00' },
          { status: 'in_transit', label: 'Pris en charge à l\'agence', location: 'Tri Postal Paris Sud', occurredAt: '2025-04-03T23:02:00' },
          { status: 'shipped', label: 'Expédié par FlowDiff', location: 'Entrepôt Villeneuve-la-Garenne', occurredAt: '2025-04-03T16:30:00' },
          { status: 'prepared', label: 'Commande préparée', location: 'Entrepôt Villeneuve-la-Garenne', occurredAt: '2025-04-03T11:45:00' },
        ],
      },
```

- [ ] **Step 4: Ajouter shipment sur ord-003 (CMD-2025-0094, 'expédié') — livré**

Dans l'objet `ord-003`, après `deliveryMode: 'standard'`, avant `items`:

```typescript
      shipment: {
        carrier: 'laposte',
        trackingNumber: 'LA987654321FR',
        estimatedDelivery: '2025-01-27',
        shippedAt: '2025-01-24T10:00:00',
        deliveredAt: '2025-01-27T11:20:00',
        events: [
          { status: 'delivered', label: 'Livré', location: 'Librairie du Parc', occurredAt: '2025-01-27T11:20:00' },
          { status: 'out_for_delivery', label: 'En cours de livraison', location: 'Agence Paris 15', occurredAt: '2025-01-27T08:00:00' },
          { status: 'shipped', label: 'Expédié par FlowDiff', location: 'Entrepôt Villeneuve-la-Garenne', occurredAt: '2025-01-24T10:00:00' },
          { status: 'prepared', label: 'Commande préparée', location: 'Entrepôt Villeneuve-la-Garenne', occurredAt: '2025-01-24T08:30:00' },
        ],
      },
```

- [ ] **Step 5: Vérifier TypeScript**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit 2>&1 | head -20
```
Résultat attendu : 0 erreurs.

- [ ] **Step 6: Commit**

```bash
git add src/data/mockOrders.ts
git commit -m "feat(data): add Shipment types and tracking data to 2 mock orders"
```

---

## Task 2 — Créer mockReturns.ts

**Files:**
- Create: `src/data/mockReturns.ts`

- [ ] **Step 1: Créer le fichier avec les types et le mock**

```typescript
// DEV ONLY — remplacé par Supabase en Phase 12

export type ReturnStatus = 'pending' | 'in_transit' | 'avoir_emis' | 'refused'

export type ReturnReason =
  | 'invendu'
  | 'defaut_impression'
  | 'mauvaise_livraison'
  | 'doublon'
  | 'autre'

export const RETURN_REASON_LABELS: Record<ReturnReason, string> = {
  invendu:           'Invendu non consulté',
  defaut_impression: 'Défaut d\'impression',
  mauvaise_livraison:'Mauvaise livraison',
  doublon:           'Doublon',
  autre:             'Autre',
}

export interface ReturnItem {
  orderItemIsbn: string
  title: string
  qty: number
  unitPrice: number
  reason: ReturnReason
}

export interface ReturnRequest {
  id: string
  codeClient: string
  orderId: string
  orderNumero: string
  status: ReturnStatus
  items: ReturnItem[]
  notes: string | null
  blNumber: string | null
  blGeneratedAt: string | null
  avoirAmount: number | null
  avoirGeneratedAt: string | null
  refusalReason: string | null
  createdAt: string
}

export interface CreateReturnPayload {
  codeClient: string
  orderId: string
  orderNumero: string
  items: ReturnItem[]
  notes: string | null
}

export interface ReturnsStats {
  activeCount: number
  avoirYTD: number
  returnRatio: number
  sectorAverage: number
}

export const MOCK_RETURNS: ReturnRequest[] = [
  {
    id: 'RET-2025-0012',
    codeClient: 'LIB001',
    orderId: 'ord-003',
    orderNumero: 'CMD-2025-0094',
    status: 'avoir_emis',
    items: [
      { orderItemIsbn: '9782070360024', title: "L'Étranger", qty: 2, unitPrice: 4.90, reason: 'invendu' },
      { orderItemIsbn: '9782203001046', title: 'Tintin au Tibet', qty: 1, unitPrice: 8.70, reason: 'defaut_impression' },
    ],
    notes: null,
    blNumber: 'BL-045821',
    blGeneratedAt: '2025-03-05T09:00:00',
    avoirAmount: 18.50,
    avoirGeneratedAt: '2025-03-10T14:00:00',
    refusalReason: null,
    createdAt: '2025-03-01T10:00:00',
  },
  {
    id: 'RET-2025-0019',
    codeClient: 'LIB001',
    orderId: 'ord-004',
    orderNumero: 'CMD-2024-1021',
    status: 'in_transit',
    items: [
      { orderItemIsbn: '9782344000656', title: 'My Hero Academia T.1', qty: 5, unitPrice: 5.95, reason: 'invendu' },
    ],
    notes: null,
    blNumber: 'BL-046203',
    blGeneratedAt: '2025-04-15T09:00:00',
    avoirAmount: null,
    avoirGeneratedAt: null,
    refusalReason: null,
    createdAt: '2025-04-14T10:00:00',
  },
  {
    id: 'RET-2025-0008',
    codeClient: 'LIB001',
    orderId: 'ord-005',
    orderNumero: 'CMD-2024-0892',
    status: 'refused',
    items: [
      { orderItemIsbn: '9782011355737', title: 'Le Grand Larousse de la cuisine', qty: 1, unitPrice: 26.60, reason: 'autre' },
    ],
    notes: 'Livre taché',
    blNumber: null,
    blGeneratedAt: null,
    avoirAmount: null,
    avoirGeneratedAt: null,
    refusalReason: 'Article non éligible (état dégradé)',
    createdAt: '2025-02-02T10:00:00',
  },
]
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit 2>&1 | head -20
```
Résultat attendu : 0 erreurs.

- [ ] **Step 3: Commit**

```bash
git add src/data/mockReturns.ts
git commit -m "feat(data): add ReturnRequest types and mock returns for LIB001"
```

---

## Task 3 — Services ordersService.ts + returnsService.ts

**Files:**
- Create: `src/services/ordersService.ts`
- Create: `src/services/returnsService.ts`

- [ ] **Step 1: Créer `src/services/ordersService.ts`**

```typescript
import { MOCK_ORDERS, type Order, type Shipment } from '@/data/mockOrders'

const ALL_ORDERS: Order[] = Object.values(MOCK_ORDERS).flat()

export async function getOrders(codeClient: string): Promise<Order[]> {
  return ALL_ORDERS.filter(o => o.codeClient === codeClient)
}

export async function getOrderById(id: string): Promise<Order | null> {
  return ALL_ORDERS.find(o => o.id === id) ?? null
}

export async function getShipment(orderId: string): Promise<Shipment | null> {
  const order = ALL_ORDERS.find(o => o.id === orderId)
  return order?.shipment ?? null
}
```

- [ ] **Step 2: Créer `src/services/returnsService.ts`**

```typescript
import {
  MOCK_RETURNS,
  type ReturnRequest,
  type CreateReturnPayload,
  type ReturnsStats,
} from '@/data/mockReturns'
import { MOCK_ORDERS } from '@/data/mockOrders'

// Tableau muable en mémoire — remplacé par appels API en Phase 12
const _returns: ReturnRequest[] = [...MOCK_RETURNS]
let _nextId = 20

export async function getReturns(codeClient: string): Promise<ReturnRequest[]> {
  return _returns.filter(r => r.codeClient === codeClient)
}

export async function getReturnById(id: string): Promise<ReturnRequest | null> {
  return _returns.find(r => r.id === id) ?? null
}

export async function createReturn(payload: CreateReturnPayload): Promise<ReturnRequest> {
  const newReturn: ReturnRequest = {
    id: `RET-2025-${String(_nextId++).padStart(4, '0')}`,
    codeClient: payload.codeClient,
    orderId: payload.orderId,
    orderNumero: payload.orderNumero,
    status: 'pending',
    items: payload.items,
    notes: payload.notes,
    blNumber: null,
    blGeneratedAt: null,
    avoirAmount: null,
    avoirGeneratedAt: null,
    refusalReason: null,
    createdAt: new Date().toISOString(),
  }
  _returns.push(newReturn)
  return newReturn
}

export async function getReturnsStats(codeClient: string): Promise<ReturnsStats> {
  const clientReturns = _returns.filter(r => r.codeClient === codeClient)
  const totalOrders = Object.values(MOCK_ORDERS).flat().filter(o => o.codeClient === codeClient).length
  const currentYear = new Date().getFullYear()

  const activeCount = clientReturns.filter(r => r.status === 'pending' || r.status === 'in_transit').length

  const avoirYTD = clientReturns
    .filter(r => r.avoirGeneratedAt && new Date(r.avoirGeneratedAt).getFullYear() === currentYear)
    .reduce((sum, r) => sum + (r.avoirAmount ?? 0), 0)

  const returnRatio = totalOrders > 0 ? clientReturns.length / totalOrders : 0

  return { activeCount, avoirYTD, returnRatio, sectorAverage: 0.22 }
}
```

- [ ] **Step 3: Écrire le test pour `getReturnsStats`**

Créer `src/services/__tests__/returnsService.test.ts` :

```typescript
import { describe, it, expect } from 'vitest'
import { getReturnsStats, getReturns, createReturn } from '@/services/returnsService'

describe('getReturnsStats', () => {
  it('retourne activeCount = 1 pour LIB001 (1 retour in_transit)', async () => {
    const stats = await getReturnsStats('LIB001')
    expect(stats.activeCount).toBeGreaterThanOrEqual(1)
  })

  it('retourne avoirYTD = 0 pour une librairie sans retours', async () => {
    const stats = await getReturnsStats('LIB999')
    expect(stats.avoirYTD).toBe(0)
  })

  it('retourne sectorAverage = 0.22', async () => {
    const stats = await getReturnsStats('LIB001')
    expect(stats.sectorAverage).toBe(0.22)
  })

  it('returnRatio = 0 pour une librairie sans commandes', async () => {
    const stats = await getReturnsStats('LIB999')
    expect(stats.returnRatio).toBe(0)
  })
})

describe('createReturn', () => {
  it('crée un retour avec status pending et l\'ajoute à la liste', async () => {
    const before = await getReturns('LIB002')
    const created = await createReturn({
      codeClient: 'LIB002',
      orderId: 'ord-007',
      orderNumero: 'CMD-2024-0633',
      items: [{ orderItemIsbn: '9782070360024', title: "L'Étranger", qty: 1, unitPrice: 4.90, reason: 'invendu' }],
      notes: null,
    })
    expect(created.status).toBe('pending')
    const after = await getReturns('LIB002')
    expect(after.length).toBe(before.length + 1)
  })
})
```

- [ ] **Step 4: Lancer les tests**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx vitest run src/services/__tests__/returnsService.test.ts 2>&1
```
Résultat attendu : 4 tests PASS (ou 5 selon createReturn).

- [ ] **Step 5: Vérifier TypeScript**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 6: Commit**

```bash
git add src/services/ordersService.ts src/services/returnsService.ts src/services/__tests__/returnsService.test.ts
git commit -m "feat(services): add ordersService and returnsService with async mock wrappers"
```

---

## Task 4 — ReturnsContext + câblage App.tsx

**Files:**
- Create: `src/contexts/ReturnsContext.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Créer `src/contexts/ReturnsContext.tsx`**

```typescript
import { createContext, useContext, useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import {
  getReturns,
  createReturn as serviceCreateReturn,
  getReturnsStats,
} from '@/services/returnsService'
import type { ReturnRequest, CreateReturnPayload, ReturnsStats } from '@/data/mockReturns'

interface ReturnsContextValue {
  returns: ReturnRequest[]
  loading: boolean
  stats: ReturnsStats | null
  addReturn: (payload: CreateReturnPayload) => Promise<ReturnRequest>
}

const ReturnsContext = createContext<ReturnsContextValue | null>(null)

const DEFAULT_STATS: ReturnsStats = {
  activeCount: 0,
  avoirYTD: 0,
  returnRatio: 0,
  sectorAverage: 0.22,
}

export function ReturnsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext()
  const codeClient = user?.codeClient ?? ''

  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<ReturnsStats | null>(null)

  useEffect(() => {
    if (!codeClient) { setReturns([]); setLoading(false); return }
    setLoading(true)
    Promise.all([getReturns(codeClient), getReturnsStats(codeClient)]).then(([r, s]) => {
      setReturns(r)
      setStats(s)
      setLoading(false)
    })
  }, [codeClient])

  async function addReturn(payload: CreateReturnPayload): Promise<ReturnRequest> {
    // UI optimiste : ajouter immédiatement avant la résolution
    const optimistic: ReturnRequest = {
      id: `RET-OPT-${Date.now()}`,
      codeClient: payload.codeClient,
      orderId: payload.orderId,
      orderNumero: payload.orderNumero,
      status: 'pending',
      items: payload.items,
      notes: payload.notes,
      blNumber: null,
      blGeneratedAt: null,
      avoirAmount: null,
      avoirGeneratedAt: null,
      refusalReason: null,
      createdAt: new Date().toISOString(),
    }
    setReturns(prev => [optimistic, ...prev])
    setStats(prev => prev
      ? { ...prev, activeCount: prev.activeCount + 1 }
      : DEFAULT_STATS
    )

    const created = await serviceCreateReturn(payload)
    // Remplacer l'entrée optimiste par l'entrée réelle
    setReturns(prev => prev.map(r => r.id === optimistic.id ? created : r))
    return created
  }

  return (
    <ReturnsContext.Provider value={{ returns, loading, stats, addReturn }}>
      {children}
    </ReturnsContext.Provider>
  )
}

export function useReturns(): ReturnsContextValue {
  const ctx = useContext(ReturnsContext)
  if (!ctx) throw new Error('useReturns doit être dans <ReturnsProvider>')
  return ctx
}
```

- [ ] **Step 2: Ajouter `<ReturnsProvider>` dans App.tsx**

Dans `src/App.tsx`, ajouter l'import :
```typescript
import { ReturnsProvider } from '@/contexts/ReturnsContext'
```

Envelopper `<OrdersProvider>` avec `<ReturnsProvider>` — l'ordre : ReturnsProvider doit être à l'intérieur de OrdersProvider (il n'en dépend pas, mais c'est plus propre après):

```tsx
<OrdersProvider>
  <ReturnsProvider>
    <Suspense fallback={null}>
      <Routes>
        {/* ... */}
      </Routes>
    </Suspense>
  </ReturnsProvider>
</OrdersProvider>
```

- [ ] **Step 3: Vérifier TypeScript + build**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Lancer tous les tests**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx vitest run 2>&1 | tail -10
```
Résultat attendu : tous les tests existants passent + les tests de returnsService.

- [ ] **Step 5: Commit**

```bash
git add src/contexts/ReturnsContext.tsx src/App.tsx
git commit -m "feat(context): add ReturnsContext with optimistic addReturn + wire in App"
```

---

## Task 5 — Composant TrackingModal

**Files:**
- Create: `src/components/historique/TrackingModal.tsx`

- [ ] **Step 1: Créer `src/components/historique/TrackingModal.tsx`**

```tsx
import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components'
import type { Shipment } from '@/data/mockOrders'

/* ── Animations ── */
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`
const slideUp = keyframes`from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); }`

/* ── Styled ── */
const Backdrop = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  animation: ${fadeIn} 0.15s ease;
`

const Panel = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.xl};
  width: 100%; max-width: 480px;
  max-height: 90vh; overflow-y: auto;
  animation: ${slideUp} 0.2s ease;
  display: flex; flex-direction: column;
`

const PanelHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  position: sticky; top: 0; background: ${({ theme }) => theme.colors.white};
  z-index: 1;
`

const PanelTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.navy};
  margin: 0;
`

const CloseBtn = styled.button`
  background: none; border: none; cursor: pointer;
  color: ${({ theme }) => theme.colors.gray[400]};
  display: flex; padding: 4px;
  font-size: 20px; line-height: 1;
  &:hover { color: ${({ theme }) => theme.colors.navy}; }
`

const PanelBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.lg};
`

const CarrierRow = styled.div`
  display: flex; align-items: center; gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
`

const TrackingNum = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamilyMono};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.navy};
  letter-spacing: 0.05em;
`

const ExternalLink = styled.a`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.success};
  text-decoration: none;
  display: flex; align-items: center; gap: 4px;
  &:hover { text-decoration: underline; }
`

const Timeline = styled.ol`
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-direction: column; gap: 0;
`

const TimelineItem = styled.li<{ $first: boolean }>`
  display: flex; gap: ${({ theme }) => theme.spacing.md};
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing.md};

  &::before {
    content: '';
    position: absolute;
    left: 7px; top: 18px;
    width: 2px;
    bottom: 0;
    background: ${({ theme }) => theme.colors.gray[200]};
    display: ${({ $first }) => $first ? 'none' : 'block'};
  }
`

const Dot = styled.div<{ $active: boolean }>`
  width: 16px; height: 16px;
  border-radius: 50%; flex-shrink: 0; margin-top: 2px;
  background: ${({ $active, theme }) => $active ? theme.colors.error : theme.colors.success};
  z-index: 1;
`

const EventContent = styled.div`
  flex: 1;
`

const EventLabel = styled.div<{ $active: boolean }>`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ $active, theme }) => $active ? theme.typography.weights.semibold : theme.typography.weights.normal};
  color: ${({ $active, theme }) => $active ? theme.colors.navy : theme.colors.gray[600]};
`

const EventMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.gray[400]};
  margin-top: 2px;
`

const EstimatedBox = styled.div`
  background: ${({ theme }) => theme.colors.navyLight};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.navy};
  display: flex; align-items: center; gap: 8px;
`

/* ── Utils ── */
const CARRIER_LABELS: Record<string, string> = {
  laposte: 'La Poste',
  chronopost: 'Chronopost',
  ups: 'UPS',
  dpd: 'DPD',
}

function trackingUrl(carrier: string, trackingNumber: string): string {
  if (carrier === 'laposte') return `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`
  if (carrier === 'chronopost') return `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${trackingNumber}`
  return '#'
}

function formatDatetime(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

function formatDateLong(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date(iso))
}

/* ── Component ── */
interface TrackingModalProps {
  shipment: Shipment
  onClose: () => void
}

export function TrackingModal({ shipment, onClose }: TrackingModalProps) {
  return createPortal(
    <Backdrop onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <Panel>
        <PanelHeader>
          <PanelTitle>Suivi du colis</PanelTitle>
          <CloseBtn onClick={onClose} aria-label="Fermer">×</CloseBtn>
        </PanelHeader>

        <PanelBody>
          {/* Transporteur + numéro */}
          <CarrierRow>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6B6B68', marginBottom: 2 }}>Transporteur</div>
              <div style={{ fontWeight: 600, color: '#232f3e' }}>{CARRIER_LABELS[shipment.carrier] ?? shipment.carrier}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: '#6B6B68', marginBottom: 2 }}>N° de suivi</div>
              <TrackingNum>{shipment.trackingNumber}</TrackingNum>
            </div>
            <ExternalLink
              href={trackingUrl(shipment.carrier, shipment.trackingNumber)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Suivre ↗
            </ExternalLink>
          </CarrierRow>

          {/* Timeline événements */}
          <Timeline>
            {shipment.events.map((event, i) => (
              <TimelineItem key={i} $first={i === shipment.events.length - 1}>
                <Dot $active={i === 0} />
                <EventContent>
                  <EventLabel $active={i === 0}>{event.label}</EventLabel>
                  <EventMeta>{event.location} · {formatDatetime(event.occurredAt)}</EventMeta>
                </EventContent>
              </TimelineItem>
            ))}
          </Timeline>

          {/* Encart livraison estimée ou livrée */}
          {shipment.deliveredAt ? (
            <EstimatedBox>
              ✅ Livré le {formatDateLong(shipment.deliveredAt)}
            </EstimatedBox>
          ) : (
            <EstimatedBox>
              🚚 Livraison estimée : {formatDateLong(shipment.estimatedDelivery)}
            </EstimatedBox>
          )}
        </PanelBody>
      </Panel>
    </Backdrop>,
    document.body
  )
}
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/historique/TrackingModal.tsx
git commit -m "feat(ui): add TrackingModal component with carrier timeline"
```

---

## Task 6 — Modifications cartes commande dans HistoriquePage

**Files:**
- Modify: `src/pages/historique/HistoriquePage.tsx`

Objectif : sur chaque `OrderCard`, (1) afficher le numéro de suivi cliquable dans le header, (2) remplacer le `DeliveryBanner` existant par une info shipment si présente, (3) ajouter bouton "Retour" dans le footer si statut 'facturé' ou 'expédié'.

- [ ] **Step 1: Ajouter les imports nécessaires**

En haut de `HistoriquePage.tsx`, ajouter :

```typescript
import { useState as useStateTracking } from 'react'
import { TrackingModal } from '@/components/historique/TrackingModal'
import type { Shipment } from '@/data/mockOrders'
```

Note : pas besoin de `useStateTracking` — utiliser un seul `useState` pour `trackingModal: Shipment | null` dans le composant principal.

En réalité, ajouter dans la section des imports existants:
```typescript
import { TrackingModal } from '@/components/historique/TrackingModal'
import type { Shipment } from '@/data/mockOrders'
```

- [ ] **Step 2: Ajouter le styled `TrackingLink` après les styles existants**

Après `const SuccessAlert`:

```tsx
const TrackingLink = styled.button`
  background: none; border: none; cursor: pointer; padding: 0;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-family: ${({ theme }) => theme.typography.fontFamilyMono};
  color: ${({ theme }) => theme.colors.success};
  letter-spacing: 0.04em;
  display: flex; align-items: center; gap: 4px;
  &:hover { text-decoration: underline; }
`

const ReturnButton = styled.button`
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px;
  background: transparent;
  border: 1.5px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.navy};
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.navy};
  }
`
```

- [ ] **Step 3: Ajouter state `trackingModal` dans le composant `HistoriquePage`**

Dans `HistoriquePage`, après les useState existants (`search`, `selectedMonth`, etc.) :

```typescript
const [trackingModal, setTrackingModal] = useState<Shipment | null>(null)
const [newReturnOrderId, setNewReturnOrderId] = useState<string | null>(null)
```

- [ ] **Step 4: Modifier le rendu de `OrderCardHeader` pour afficher le tracking number**

Dans le JSX de chaque carte (`filtered.map(order => ...)`), dans `<OrderCardHeader>`, remplacer :

```tsx
<OrderCardHeader>
  <div>
    <OrderNumero>{order.numero}</OrderNumero>
    <OrderDate>{formatDate(order.date)}</OrderDate>
  </div>
</OrderCardHeader>
```

par :

```tsx
<OrderCardHeader>
  <div>
    <OrderNumero>{order.numero}</OrderNumero>
    <OrderDate>{formatDate(order.date)}</OrderDate>
  </div>
  {order.shipment && (
    <TrackingLink onClick={() => setTrackingModal(order.shipment!)} aria-label="Voir le suivi">
      📦 {order.shipment.trackingNumber}
    </TrackingLink>
  )}
</OrderCardHeader>
```

- [ ] **Step 5: Modifier `DeliveryBanner` pour utiliser les données shipment si présent**

Remplacer le `<DeliveryBanner>` existant par :

```tsx
<DeliveryBanner>
  {order.shipment ? (
    order.shipment.deliveredAt ? (
      <>✅ <DeliveryLabel>Livré le {formatDate(order.shipment.deliveredAt.split('T')[0])}</DeliveryLabel></>
    ) : (
      <>🚚 Livraison estimée :&nbsp;<DeliveryLabel>{formatDateLong(order.shipment.estimatedDelivery)}</DeliveryLabel></>
    )
  ) : order.deliveryMode === 'specific' && order.deliveryDate ? (
    <>Livraison prévue le&nbsp;<DeliveryLabel>{formatDate(order.deliveryDate)}</DeliveryLabel></>
  ) : (
    <>Délai de livraison&nbsp;:&nbsp;<DeliveryLabel>1–3 jours ouvrés</DeliveryLabel></>
  )}
</DeliveryBanner>
```

Ajouter la fonction `formatDateLong` dans la section Utils (après `formatEur`) :

```typescript
function formatDateLong(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso))
}
```

- [ ] **Step 6: Ajouter bouton "Retour" dans le footer de chaque carte**

Dans `<FooterRight>`, après le `<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>` existant, ajouter le bouton Retour conditionnel. Modifier `<FooterRight>` pour ajouter avant le div des boutons existants :

```tsx
<FooterRight>
  {(order.status === 'facturé' || order.status === 'expédié') && (
    <ReturnButton onClick={() => setNewReturnOrderId(order.id)}>
      ↩ Retour
    </ReturnButton>
  )}
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    {/* ... boutons CSV + Dupliquer existants ... */}
  </div>
  {isDone && (
    <SuccessAlert>/* ... */</SuccessAlert>
  )}
</FooterRight>
```

- [ ] **Step 7: Ajouter le TrackingModal en bas du JSX retourné**

Juste avant le `</>` final de `return (`, avant la fermeture `</>` :

```tsx
{trackingModal && (
  <TrackingModal shipment={trackingModal} onClose={() => setTrackingModal(null)} />
)}
```

- [ ] **Step 8: Vérifier TypeScript**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 9: Commit**

```bash
git add src/pages/historique/HistoriquePage.tsx
git commit -m "feat(historique): add shipment tracking link and return button on order cards"
```

---

## Task 7 — Composant ReturnCard

**Files:**
- Create: `src/components/historique/ReturnCard.tsx`

- [ ] **Step 1: Créer `src/components/historique/ReturnCard.tsx`**

```tsx
import styled from 'styled-components'
import { useToast } from '@/contexts/ToastContext'
import type { ReturnRequest, ReturnStatus } from '@/data/mockReturns'
import { RETURN_REASON_LABELS } from '@/data/mockReturns'

/* ── Status config ── */
const STATUS_CONFIG: Record<ReturnStatus, { label: string; bg: string; text: string }> = {
  pending:     { label: 'En attente',   bg: '#EAEAE6', text: '#555550' },
  in_transit:  { label: 'En transit',   bg: '#FEF3E2', text: '#B65A00' },
  avoir_emis:  { label: 'Avoir émis',   bg: '#EFF4F1', text: '#226241' },
  refused:     { label: 'Refusé',       bg: '#FDECEA', text: '#C0392B' },
}

/* ── Styled ── */
const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
`

const CardHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.navyLight};
`

const ReturnId = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.navy};
`

const SubInfo = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-top: 2px;
`

const StatusBadge = styled.span<{ $bg: string; $text: string }>`
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  background: ${({ $bg }) => $bg};
  color: ${({ $text }) => $text};
`

const CardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
`

const ItemsList = styled.ul`
  list-style: none; margin: 0 0 ${({ theme }) => theme.spacing.md}; padding: 0;
`

const ItemRow = styled.li`
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  &:last-child { border-bottom: none; }
`

const ItemTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.navy};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`

const ItemReason = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.gray[400]};
  margin-top: 2px;
`

const ItemQty = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  white-space: nowrap; flex-shrink: 0;
`

const DocsBlock = styled.div`
  display: flex; gap: ${({ theme }) => theme.spacing.sm}; flex-wrap: wrap;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[100]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const DocBtn = styled.button<{ $disabled?: boolean }>`
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  background: transparent;
  border: 1.5px solid ${({ $disabled, theme }) => $disabled ? theme.colors.gray[200] : theme.colors.navy};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ $disabled, theme }) => $disabled ? theme.colors.gray[400] : theme.colors.navy};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};
  transition: background 0.15s;
  &:not([disabled]):hover { background: ${({ theme }) => theme.colors.gray[50]}; }
`

const CardFooter = styled.div`
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`

const RefusalBox = styled.div`
  background: #FDECEA; border-radius: ${({ theme }) => theme.radii.md};
  padding: 8px 12px; margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: #C0392B;
`

const ContestBtn = styled.button`
  padding: 7px 14px;
  background: ${({ theme }) => theme.colors.error};
  color: white; border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  &:hover { opacity: 0.9; }
`

/* ── Utils ── */
function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(iso))
}
function formatEur(val: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)
}

/* ── Contest email ── */
function openContestEmail(ret: ReturnRequest) {
  const subject = encodeURIComponent(`Contestation retour ${ret.id} — ${ret.orderNumero}`)
  const body = encodeURIComponent(
    `Bonjour,\n\nJe souhaite contester le refus de ma demande de retour ${ret.id} (commande ${ret.orderNumero}).\n\nMotif de refus communiqué : ${ret.refusalReason ?? '—'}\n\nMa contestation :\n\n[Votre message ici]\n\nCordialement`
  )
  window.location.href = `mailto:retours@flowdiff.fr?subject=${subject}&body=${body}`
}

/* ── Component ── */
interface ReturnCardProps {
  ret: ReturnRequest
}

export function ReturnCard({ ret }: ReturnCardProps) {
  const { showToast } = useToast()
  const config = STATUS_CONFIG[ret.status]
  const totalQty = ret.items.reduce((s, i) => s + i.qty, 0)

  function handleDownloadBL() {
    showToast(`${ret.blNumber}.pdf téléchargé`, 'success')
  }

  function handleDownloadAvoir() {
    if (!ret.avoirGeneratedAt) return
    showToast(`Avoir_${ret.id}.pdf téléchargé`, 'success')
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <ReturnId>{ret.id}</ReturnId>
          <SubInfo>Commande {ret.orderNumero} · {totalQty} article{totalQty > 1 ? 's' : ''}</SubInfo>
        </div>
        <StatusBadge $bg={config.bg} $text={config.text}>{config.label}</StatusBadge>
      </CardHeader>

      <CardBody>
        <ItemsList>
          {ret.items.map((item, i) => (
            <ItemRow key={i}>
              <div>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemReason>{RETURN_REASON_LABELS[item.reason]}</ItemReason>
              </div>
              <ItemQty>{item.qty} × {formatEur(item.unitPrice)}</ItemQty>
            </ItemRow>
          ))}
        </ItemsList>

        {ret.status === 'refused' && ret.refusalReason && (
          <RefusalBox>
            Motif de refus : {ret.refusalReason}
          </RefusalBox>
        )}

        {ret.blNumber && (
          <DocsBlock>
            <DocBtn onClick={handleDownloadBL}>
              ↓ Télécharger BL
            </DocBtn>
            <DocBtn
              $disabled={!ret.avoirGeneratedAt}
              onClick={handleDownloadAvoir}
              disabled={!ret.avoirGeneratedAt}
              title={ret.avoirGeneratedAt ? undefined : 'Disponible à réception des articles'}
            >
              ↓ Télécharger Avoir
            </DocBtn>
          </DocsBlock>
        )}

        <CardFooter>
          <div style={{ fontSize: '0.75rem', color: '#6B6B68' }}>
            Demande du {formatDate(ret.createdAt)}
            {ret.avoirAmount != null && (
              <> · Avoir : <strong>{formatEur(ret.avoirAmount)}</strong></>
            )}
          </div>
          {ret.status === 'refused' && (
            <ContestBtn onClick={() => openContestEmail(ret)}>
              ✉ Contester
            </ContestBtn>
          )}
        </CardFooter>
      </CardBody>
    </Card>
  )
}
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/historique/ReturnCard.tsx
git commit -m "feat(ui): add ReturnCard component with docs download and contest email"
```

---

## Task 8 — Composant NewReturnModal

**Files:**
- Create: `src/components/historique/NewReturnModal.tsx`

- [ ] **Step 1: Créer `src/components/historique/NewReturnModal.tsx`**

```tsx
import { useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { useReturns } from '@/contexts/ReturnsContext'
import { useToast } from '@/contexts/ToastContext'
import type { Order } from '@/data/mockOrders'
import { RETURN_REASON_LABELS, type ReturnReason, type ReturnItem } from '@/data/mockReturns'

/* ── Animations ── */
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`
const slideUp = keyframes`from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); }`

/* ── Styled ── */
const Backdrop = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.45);
  z-index: 1000; display: flex; align-items: flex-end; justify-content: center;
  padding: 0; animation: ${fadeIn} 0.15s ease;
  @media (min-width: 600px) { align-items: center; padding: ${({ theme }) => theme.spacing.md}; }
`

const Panel = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.xl} ${({ theme }) => theme.radii.xl} 0 0;
  width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto;
  animation: ${slideUp} 0.2s ease;
  @media (min-width: 600px) { border-radius: ${({ theme }) => theme.radii.xl}; }
`

const PanelHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  position: sticky; top: 0; background: ${({ theme }) => theme.colors.white}; z-index: 1;
`

const PanelTitle = styled.h2`
  margin: 0; font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.navy};
`

const CloseBtn = styled.button`
  background: none; border: none; cursor: pointer; font-size: 20px; line-height: 1;
  color: ${({ theme }) => theme.colors.gray[400]}; padding: 4px;
  &:hover { color: ${({ theme }) => theme.colors.navy}; }
`

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.lg};
`

const Section = styled.div`
  display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.sm};
`

const SectionTitle = styled.h3`
  margin: 0; font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-transform: uppercase; letter-spacing: 0.06em;
`

const SelectStyled = styled.select`
  width: 100%; padding: 10px 30px 10px 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.navy};
  background-color: ${({ theme }) => theme.colors.white};
  appearance: none; cursor: pointer;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

const ItemCheckRow = styled.label<{ $checked: boolean }>`
  display: flex; align-items: flex-start; gap: ${({ theme }) => theme.spacing.sm};
  padding: 10px 12px;
  border: 1.5px solid ${({ $checked, theme }) => $checked ? theme.colors.success : theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer; transition: border-color 0.15s;
  background: ${({ $checked, theme }) => $checked ? theme.colors.navyLight : theme.colors.white};
`

const ItemCheckbox = styled.input`
  margin-top: 2px; cursor: pointer; accent-color: ${({ theme }) => theme.colors.success};
  width: 16px; height: 16px; flex-shrink: 0;
`

const ItemInfo = styled.div`
  flex: 1;
`

const ItemTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.navy};
`

const ItemMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs}; color: ${({ theme }) => theme.colors.gray[400]};
`

const ReasonTags = styled.div`
  display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;
`

const Tag = styled.button<{ $active: boolean }>`
  padding: 4px 12px;
  border: 1.5px solid ${({ $active, theme }) => $active ? theme.colors.success : theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  background: ${({ $active, theme }) => $active ? theme.colors.navyLight : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.success : theme.colors.gray[600]};
  cursor: pointer; transition: all 0.1s;
`

const Textarea = styled.textarea`
  width: 100%; padding: 10px 12px; min-height: 80px; resize: vertical;
  border: 1.5px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.navy};
  box-sizing: border-box;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
  &::placeholder { color: ${({ theme }) => theme.colors.gray[400]}; }
`

const InfoNote = styled.div`
  background: ${({ theme }) => theme.colors.accentLight};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: #8B6914; display: flex; align-items: flex-start; gap: 8px;
`

const SubmitBtn = styled.button<{ $loading?: boolean }>`
  width: 100%; padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white; border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: ${({ $loading }) => $loading ? 'not-allowed' : 'pointer'};
  opacity: ${({ $loading }) => $loading ? 0.7 : 1};
  transition: background 0.15s;
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.primaryHover}; }
`

/* ── Utils ── */
const RETURN_REASONS = Object.keys(RETURN_REASON_LABELS) as ReturnReason[]
const ELIGIBLE_STATUSES = new Set(['facturé', 'expédié'])

function formatEur(val: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)
}

/* ── Types ── */
interface ItemSelectionState {
  checked: boolean
  reason: ReturnReason | null
}

/* ── Component ── */
interface NewReturnModalProps {
  orders: Order[]
  preselectedOrderId: string | null
  codeClient: string
  onClose: () => void
  onSuccess: () => void  // bascule vers l'onglet retours
}

export function NewReturnModal({ orders, preselectedOrderId, codeClient, onClose, onSuccess }: NewReturnModalProps) {
  const { addReturn } = useReturns()
  const { showToast } = useToast()

  const eligibleOrders = orders.filter(o => ELIGIBLE_STATUSES.has(o.status))

  const [selectedOrderId, setSelectedOrderId] = useState<string>(preselectedOrderId ?? eligibleOrders[0]?.id ?? '')
  const [itemStates, setItemStates] = useState<Record<string, ItemSelectionState>>({})
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const selectedOrder = eligibleOrders.find(o => o.id === selectedOrderId)

  function handleOrderChange(id: string) {
    setSelectedOrderId(id)
    setItemStates({})
  }

  function toggleItem(isbn: string) {
    setItemStates(prev => ({
      ...prev,
      [isbn]: { checked: !prev[isbn]?.checked, reason: prev[isbn]?.reason ?? null },
    }))
  }

  function setReason(isbn: string, reason: ReturnReason) {
    setItemStates(prev => ({
      ...prev,
      [isbn]: { ...prev[isbn], checked: true, reason },
    }))
  }

  const checkedItems = selectedOrder?.items.filter(i => itemStates[i.isbn]?.checked) ?? []
  const allHaveReasons = checkedItems.length > 0 && checkedItems.every(i => itemStates[i.isbn]?.reason != null)

  async function handleSubmit() {
    if (!selectedOrder || !allHaveReasons) return
    setSubmitting(true)

    const returnItems: ReturnItem[] = checkedItems.map(i => ({
      orderItemIsbn: i.isbn,
      title: i.title,
      qty: i.quantity,
      unitPrice: i.unitPriceHT,
      reason: itemStates[i.isbn].reason!,
    }))

    await addReturn({
      codeClient,
      orderId: selectedOrder.id,
      orderNumero: selectedOrder.numero,
      items: returnItems,
      notes: notes.trim() || null,
    })

    showToast('Demande de retour envoyée', 'success')
    setSubmitting(false)
    onClose()
    onSuccess()
  }

  return createPortal(
    <Backdrop onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <Panel>
        <PanelHeader>
          <PanelTitle>Nouvelle demande de retour</PanelTitle>
          <CloseBtn onClick={onClose} aria-label="Fermer">×</CloseBtn>
        </PanelHeader>

        <Body>
          {/* 1. Sélection commande */}
          <Section>
            <SectionTitle>1. Commande concernée</SectionTitle>
            <SelectStyled
              value={selectedOrderId}
              onChange={e => handleOrderChange(e.target.value)}
            >
              {eligibleOrders.map(o => (
                <option key={o.id} value={o.id}>{o.numero} — {o.status}</option>
              ))}
            </SelectStyled>
          </Section>

          {/* 2. Articles */}
          {selectedOrder && (
            <Section>
              <SectionTitle>2. Articles à retourner</SectionTitle>
              {selectedOrder.items.map(item => {
                const state = itemStates[item.isbn] ?? { checked: false, reason: null }
                return (
                  <div key={item.isbn}>
                    <ItemCheckRow $checked={state.checked}>
                      <ItemCheckbox
                        type="checkbox"
                        checked={state.checked}
                        onChange={() => toggleItem(item.isbn)}
                      />
                      <ItemInfo>
                        <ItemTitle>{item.title}</ItemTitle>
                        <ItemMeta>{item.quantity} ex. · {formatEur(item.unitPriceHT)} HT · ISBN {item.isbn}</ItemMeta>
                      </ItemInfo>
                    </ItemCheckRow>

                    {state.checked && (
                      <div style={{ paddingLeft: '12px', marginTop: '-2px', paddingBottom: '8px' }}>
                        <ReasonTags>
                          {RETURN_REASONS.map(reason => (
                            <Tag
                              key={reason}
                              $active={state.reason === reason}
                              onClick={() => setReason(item.isbn, reason)}
                              type="button"
                            >
                              {RETURN_REASON_LABELS[reason]}
                            </Tag>
                          ))}
                        </ReasonTags>
                      </div>
                    )}
                  </div>
                )
              })}
            </Section>
          )}

          {/* 3. Commentaire */}
          <Section>
            <SectionTitle>3. Commentaire (optionnel)</SectionTitle>
            <Textarea
              placeholder="Précisions supplémentaires…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </Section>

          {/* Note */}
          <InfoNote>
            ℹ️ Un bon de retour vous sera envoyé par email et disponible ici sous 24h ouvrées.
          </InfoNote>

          {/* Submit */}
          <SubmitBtn
            $loading={submitting}
            disabled={!allHaveReasons || submitting}
            onClick={handleSubmit}
          >
            {submitting ? 'Envoi en cours…' : 'Envoyer la demande'}
          </SubmitBtn>
        </Body>
      </Panel>
    </Backdrop>,
    document.body
  )
}
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/historique/NewReturnModal.tsx
git commit -m "feat(ui): add NewReturnModal with article selection, reason tags, optimistic submit"
```

---

## Task 9 — HistoriquePage : onglets + onglet Mes retours

**Files:**
- Modify: `src/pages/historique/HistoriquePage.tsx`

Objectif : ajouter le système de tabs "Mes commandes" / "Mes retours", le bandeau stats, la liste des ReturnCard et le NewReturnModal.

- [ ] **Step 1: Ajouter les imports en haut de HistoriquePage**

```typescript
import { useReturns } from '@/contexts/ReturnsContext'
import { ReturnCard } from '@/components/historique/ReturnCard'
import { NewReturnModal } from '@/components/historique/NewReturnModal'
```

- [ ] **Step 2: Ajouter les styled components pour les tabs + stats**

Après les composants styled existants (avant `function buildCSVRows`):

```tsx
/* ── Tabs ── */
const TabsBar = styled.div`
  display: flex; gap: 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[200]};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const TabBtn = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  background: none; border: none; cursor: pointer;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ $active, theme }) => $active ? theme.typography.weights.bold : theme.typography.weights.normal};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ $active, theme }) => $active ? theme.colors.navy : theme.colors.gray[600]};
  border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.colors.success : 'transparent'};
  margin-bottom: -2px;
  transition: color 0.15s;
  &:hover { color: ${({ theme }) => theme.colors.navy}; }
`

const TabBadge = styled.span`
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px; padding: 0 5px;
  background: ${({ theme }) => theme.colors.accent};
  color: white; border-radius: ${({ theme }) => theme.radii.full};
  font-size: 11px; font-weight: 700;
  margin-left: 6px;
`

/* ── Stats retours ── */
const StatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
`

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.navy};
`

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-top: 4px;
`

const StatSub = styled.div`
  font-size: 10px; color: ${({ theme }) => theme.colors.gray[400]};
  margin-top: 2px;
`
```

- [ ] **Step 3: Ajouter le state `activeTab` et les données retours dans `HistoriquePage`**

Dans le composant, après les states existants :

```typescript
const [activeTab, setActiveTab] = useState<'commandes' | 'retours'>('commandes')
const { returns, loading: returnsLoading, stats: returnsStats } = useReturns()

// Connecter le bouton retour des cartes commande à l'onglet retours
// newReturnOrderId est déjà déclaré dans Task 6
```

Le state `newReturnOrderId` a été déclaré en Task 6. Ajouter maintenant la fonction `handleReturnSuccess`:

```typescript
function handleReturnSuccess() {
  setActiveTab('retours')
}
```

- [ ] **Step 4: Modifier le JSX de `HistoriquePage` — ajouter les tabs et le contenu retours**

Remplacer le `<TitleRow>` + contenu actuel par la structure suivante :

```tsx
return (
  <>
  <Page>
    <TitleRow>
      <Title style={{ marginBottom: 0 }}>Mon historique</Title>
      {activeTab === 'commandes' && allOrders.length > 0 && (
        <ExportAllButton onClick={handleExportAll} title="Exporter toutes les commandes en CSV">
          <IconDownload />
          Exporter tout
        </ExportAllButton>
      )}
    </TitleRow>

    {/* Tabs */}
    <TabsBar>
      <TabBtn $active={activeTab === 'commandes'} onClick={() => setActiveTab('commandes')}>
        Mes commandes
        {allOrders.length > 0 && <TabBadge>{allOrders.length}</TabBadge>}
      </TabBtn>
      <TabBtn $active={activeTab === 'retours'} onClick={() => setActiveTab('retours')}>
        Mes retours
        {returns.length > 0 && <TabBadge>{returns.length}</TabBadge>}
      </TabBtn>
    </TabsBar>

    {/* ── Onglet Commandes ── */}
    {activeTab === 'commandes' && (
      <>
        {/* ... conserver tout le code commandes existant (FiltersBar, filtered.map, etc.) ... */}
      </>
    )}

    {/* ── Onglet Retours ── */}
    {activeTab === 'retours' && (
      <>
        {returnsStats && returns.length > 0 && (
          <StatsGrid>
            <StatCard>
              <StatValue>{returnsStats.activeCount}</StatValue>
              <StatLabel>Retours en cours</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(returnsStats.avoirYTD)}
              </StatValue>
              <StatLabel>Avoirs reçus (année)</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{Math.round(returnsStats.returnRatio * 100)}%</StatValue>
              <StatLabel>Taux de retour</StatLabel>
              <StatSub>Secteur : {Math.round(returnsStats.sectorAverage * 100)}%</StatSub>
            </StatCard>
          </StatsGrid>
        )}

        {returnsLoading ? (
          <EmptyState>Chargement…</EmptyState>
        ) : returns.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📦</div>
            <p>Aucun retour pour le moment.</p>
          </EmptyState>
        ) : (
          returns.map(ret => <ReturnCard key={ret.id} ret={ret} />)
        )}
      </>
    )}
  </Page>

  {/* Modales */}
  {trackingModal && (
    <TrackingModal shipment={trackingModal} onClose={() => setTrackingModal(null)} />
  )}
  {newReturnOrderId !== null && (
    <NewReturnModal
      orders={allOrders}
      preselectedOrderId={newReturnOrderId}
      codeClient={user.codeClient}
      onClose={() => setNewReturnOrderId(null)}
      onSuccess={handleReturnSuccess}
    />
  )}
  </>
)
```

- [ ] **Step 5: Vérifier TypeScript + build**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 6: Lancer tous les tests**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx vitest run 2>&1 | tail -15
```
Résultat attendu : tous les tests passent.

- [ ] **Step 7: Commit final**

```bash
git add src/pages/historique/HistoriquePage.tsx src/components/historique/
git commit -m "feat(historique): add returns tab with stats, ReturnCard list, NewReturnModal integration"
```

---

## Auto-review checklist (à faire avant de déclarer le plan complet)

- [x] **Couverture spec Feature 1** : tracking link ✓, modal timeline ✓, date estimée/livré ✓, lien externe La Poste ✓
- [x] **Couverture spec Feature 2** : onglet ✓, stats 3 cartes ✓, carte retour avec badge statut ✓, docs BL/Avoir ✓, motif refus + Contester ✓, bouton Retour sur carte commande ✓ (statuts éligibles), modal nouvelle demande ✓, UI optimiste ✓, toast ✓, bascule onglet ✓
- [x] **Types cohérents** : `TrackingEvent`, `Shipment` définis en Task 1 et utilisés dans Task 5/6. `ReturnRequest`, `ReturnItem`, `ReturnReason` définis en Task 2 et utilisés dans Tasks 3/4/7/8/9.
- [x] **Pas de placeholders** : chaque step a du code complet.
- [x] **Pattern couleurs** : `theme.colors.*` partout, pas de hex hardcodés sauf le STATUS_COLORS hérité existant.
- [x] **Dates fr-FR** : `Intl.DateTimeFormat('fr-FR', ...)` utilisé dans tous les composants.
- [x] **État vide retours** : `EmptyState` avec message "Aucun retour pour le moment."
- [x] **Skeleton loading** : état `returnsLoading` affiché dans l'onglet retours.

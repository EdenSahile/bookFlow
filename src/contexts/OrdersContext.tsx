import { createContext, useContext, useState, useEffect } from 'react'
import { MOCK_ORDERS, ORDER_STATUSES, type Order, type OrderItem } from '@/data/mockOrders'
import type { CartItem } from '@/contexts/CartContext'
import { useAuthContext } from '@/contexts/AuthContext'

/* Hoisted — MOCK_ORDERS est statique, pas besoin de recalculer à chaque render */
const MOCK_IDS = new Set(Object.values(MOCK_ORDERS).flat().map(o => o.id))

function ordersKey(codeClient: string | undefined) {
  return `bookflow_orders_${codeClient ?? 'guest'}`
}

/* ── Génération numéro de commande ── */
function generateNumero(): string {
  const year = new Date().getFullYear()
  const rand = String(Math.floor(1000 + Math.random() * 9000))
  return `CMD-${year}-${rand}`
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

/* ── Context type ── */
interface OrdersContextValue {
  orders: Order[]
  addOrder: (params: {
    codeClient: string
    adresseLivraison: string
    items: CartItem[]
    subtotalHT: number
    remiseAmount: number
    netHT: number
    tva: number
    totalTTC: number
    deliveryMode: 'standard' | 'specific'
    deliveryDate?: string
  }) => Order
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

/* ── Provider ── */
function loadOrders(key: string): Order[] {
  const base = Object.values(MOCK_ORDERS).flat()
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      const parsed: Order[] = JSON.parse(stored)
      const validStatuses = new Set<string>(ORDER_STATUSES)
      const existingIds = new Set(base.map(o => o.id))
      const extras = parsed.filter(
        o => !existingIds.has(o.id) && validStatuses.has(o.status)
      )
      return [...base, ...extras]
    }
  } catch {
    localStorage.removeItem(key)
  }
  return base
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext()
  const key = ordersKey(user?.codeClient)

  const [orders, setOrders] = useState<Order[]>(() => loadOrders(ordersKey(user?.codeClient)))

  /* Re-charger les commandes quand l'utilisateur change */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrders(loadOrders(key))
  }, [key])

  /* Persister uniquement les nouvelles commandes (pas les mocks statiques) */
  useEffect(() => {
    const newOrders = orders.filter(o => !MOCK_IDS.has(o.id))
    localStorage.setItem(key, JSON.stringify(newOrders))
  }, [orders, key])

  function addOrder(params: {
    codeClient: string
    adresseLivraison: string
    items: CartItem[]
    subtotalHT: number
    remiseAmount: number
    netHT: number
    tva: number
    totalTTC: number
    deliveryMode: 'standard' | 'specific'
    deliveryDate?: string
  }): Order {
    const orderItems: OrderItem[] = params.items.map(({ book, quantity }) => ({
      bookId: book.id,
      title: book.title,
      author: book.authors.join(', '),
      publisher: book.publisher,
      isbn: book.isbn,
      quantity,
      unitPriceHT: book.price,
      universe: book.universe,
    }))

    const order: Order = {
      id: `ord-${Date.now()}`,
      numero: generateNumero(),
      date: todayISO(),
      status: 'en cours',
      codeClient: params.codeClient,
      adresseLivraison: params.adresseLivraison,
      deliveryMode: params.deliveryMode,
      deliveryDate: params.deliveryDate,
      items: orderItems,
      subtotalHT: params.subtotalHT,
      remiseAmount: params.remiseAmount,
      netHT: params.netHT,
      tva: params.tva,
      totalTTC: params.totalTTC,
    }

    setOrders(prev => [order, ...prev])
    return order
  }

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders doit être dans <OrdersProvider>')
  return ctx
}

/* Hook filtré par code client */
export function useClientOrders(codeClient: string): Order[] {
  const { orders } = useOrders()
  return orders.filter(o => o.codeClient === codeClient)
}

import { describe, it, expect } from 'vitest'
import {
  filterEDIMessages,
  getFluxCounts,
  formatEDITypeLabel,
  formatEDIStatusLabel,
  getBusinessStatus,
  generateEdifactPlaceholder,
  type EDIMessage,
} from '@/lib/ediUtils'

const BASE: EDIMessage[] = [
  { id: '1', type: 'ORDERS',  status: 'PENDING',  documentRef: 'CMD-001', diffuseur: 'Interforum', detail: '5 ex.', createdAt: '2026-04-24T10:00:00.000Z', payload: {} },
  { id: '2', type: 'ORDERS',  status: 'SENT',     documentRef: 'CMD-002', diffuseur: 'Hachette',   detail: '8 ex.', createdAt: '2026-04-25T11:00:00.000Z', payload: {} },
  { id: '3', type: 'ORDRSP',  status: 'RECEIVED', documentRef: 'ACK-001', diffuseur: 'Interforum', detail: 'Acceptée', createdAt: '2026-04-25T11:01:00.000Z', payload: {} },
  { id: '4', type: 'DESADV',  status: 'RECEIVED', documentRef: 'DES-001', diffuseur: 'Interforum', detail: '5 ex.', createdAt: '2026-04-26T09:00:00.000Z', payload: {} },
  { id: '5', type: 'INVOIC',  status: 'PENDING',  documentRef: 'INV-001', diffuseur: 'Hachette',   detail: '500 €', createdAt: '2026-04-26T09:01:00.000Z', payload: {} },
  { id: '6', type: 'ORDERS',  status: 'ERROR',    documentRef: 'CMD-003', diffuseur: 'Autodiff',   detail: '-',     createdAt: '2026-04-26T10:00:00.000Z', payload: {} },
]

describe('filterEDIMessages', () => {
  it('ALL returns all messages', () => {
    expect(filterEDIMessages(BASE, 'ALL')).toHaveLength(6)
  })
  it('ORDERS returns only ORDERS type', () => {
    const result = filterEDIMessages(BASE, 'ORDERS')
    expect(result).toHaveLength(3)
    expect(result.every(m => m.type === 'ORDERS')).toBe(true)
  })
  it('DESADV returns only DESADV', () => {
    expect(filterEDIMessages(BASE, 'DESADV')).toHaveLength(1)
  })
})

describe('getFluxCounts', () => {
  it('counts ORDERS PENDING correctly', () => {
    expect(getFluxCounts(BASE).orders).toBe(1)
  })
  it('counts all DESADV regardless of status', () => {
    expect(getFluxCounts(BASE).expeditions).toBe(1)
  })
  it('counts INVOIC PENDING correctly', () => {
    expect(getFluxCounts(BASE).factures).toBe(1)
  })
  it('counts ERROR status correctly', () => {
    expect(getFluxCounts(BASE).errors).toBe(1)
  })
})

describe('formatEDITypeLabel', () => {
  it('maps ORDERS to Commande (ORDERS)', () => {
    expect(formatEDITypeLabel('ORDERS')).toBe('Commande (ORDERS)')
  })
  it('maps ORDRSP to Accusé réception (ORDRSP)', () => {
    expect(formatEDITypeLabel('ORDRSP')).toBe('Accusé réception (ORDRSP)')
  })
  it('maps DESADV to Expédition (DESADV)', () => {
    expect(formatEDITypeLabel('DESADV')).toBe('Expédition (DESADV)')
  })
  it('maps INVOIC to Facture (INVOIC)', () => {
    expect(formatEDITypeLabel('INVOIC')).toBe('Facture (INVOIC)')
  })
})

describe('formatEDIStatusLabel', () => {
  it('SENT → Envoyé', ()   => expect(formatEDIStatusLabel('SENT')).toBe('Envoyé'))
  it('RECEIVED → Reçu', () => expect(formatEDIStatusLabel('RECEIVED')).toBe('Reçu'))
  it('PENDING → En attente', () => expect(formatEDIStatusLabel('PENDING')).toBe('En attente'))
  it('ERROR → Erreur', ()  => expect(formatEDIStatusLabel('ERROR')).toBe('Erreur'))
})

describe('getBusinessStatus', () => {
  it('ORDERS → Commande envoyée', () => {
    expect(getBusinessStatus('ORDERS')).toBe('Commande envoyée')
  })
  it('ORDRSP → Réponse commande reçue', () => {
    expect(getBusinessStatus('ORDRSP')).toBe('Réponse commande reçue')
  })
  it('DESADV → Info expédition reçue', () => {
    expect(getBusinessStatus('DESADV')).toBe('Info expédition reçue')
  })
  it('INVOIC → Facture reçue', () => {
    expect(getBusinessStatus('INVOIC')).toBe('Facture reçue')
  })
})

describe('generateEdifactPlaceholder', () => {
  const base = {
    id: 'edi-test-1',
    documentRef: 'CMD-2026-0426-001',
    diffuseur: 'Diffuseur 1',
    detail: '5 ex.',
    createdAt: '2026-04-26T14:32:00.000Z',
    payload: {},
  }

  it('ORDERS contient les segments UNH et BGM+220', () => {
    const msg = { ...base, type: 'ORDERS' as const, status: 'SENT' as const }
    const result = generateEdifactPlaceholder(msg)
    expect(result).toContain("UNH+1+ORDERS:D:96A:UN'")
    expect(result).toContain("BGM+220+CMD-2026-0426-001")
  })

  it('ORDRSP contient BGM+231', () => {
    const msg = { ...base, type: 'ORDRSP' as const, status: 'RECEIVED' as const }
    const result = generateEdifactPlaceholder(msg)
    expect(result).toContain("BGM+231+")
  })

  it('DESADV contient BGM+351 et CPS', () => {
    const msg = { ...base, type: 'DESADV' as const, status: 'RECEIVED' as const }
    const result = generateEdifactPlaceholder(msg)
    expect(result).toContain("BGM+351+")
    expect(result).toContain("CPS+1'")
  })

  it('INVOIC contient BGM+380 et TAX', () => {
    const msg = { ...base, type: 'INVOIC' as const, status: 'RECEIVED' as const }
    const result = generateEdifactPlaceholder(msg)
    expect(result).toContain("BGM+380+")
    expect(result).toContain("TAX+7+VAT")
  })

  it('retourne toujours UNB et UNZ', () => {
    const msg = { ...base, type: 'ORDERS' as const, status: 'SENT' as const }
    const result = generateEdifactPlaceholder(msg)
    expect(result).toContain("UNB+UNOA:1+")
    expect(result).toContain("UNZ+")
  })
})

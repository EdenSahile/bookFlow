import { describe, it, expect, vi } from 'vitest'

describe('ToastContext action payload', () => {
  it('accepte un payload message seul', () => {
    const payload = { message: 'Ajouté au panier' }
    expect(payload.message).toBe('Ajouté au panier')
    expect((payload as { action?: { label: string; onClick: () => void } }).action).toBeUndefined()
  })

  it('accepte un payload avec action', () => {
    const fn = vi.fn()
    const payload = { message: 'Ajouté', action: { label: 'Voir le panier →', onClick: fn } }
    expect(payload.action.label).toBe('Voir le panier →')
    payload.action.onClick()
    expect(fn).toHaveBeenCalledOnce()
  })
})

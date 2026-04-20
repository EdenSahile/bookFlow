import { describe, it, expect } from 'vitest'
import { isOrderable } from '@/lib/bookUtils'

describe('isOrderable', () => {
  it('retourne true pour un titre de fonds', () => {
    expect(isOrderable('fonds')).toBe(true)
  })

  it('retourne true pour une nouveauté du mois', () => {
    expect(isOrderable('nouveaute')).toBe(true)
  })

  it('retourne false pour un titre à paraître', () => {
    expect(isOrderable('a-paraitre')).toBe(false)
  })
})

import { describe, it, expect } from 'vitest'
import { CHECKOUT_STEPS, getNextStep, getPrevStep, isLastStep, getStepIndex, getStepLabel } from '../checkoutSteps'

describe('checkout stepper', () => {
  it('defines 4 steps in order', () => {
    expect(CHECKOUT_STEPS).toEqual(['recap', 'delivery-address', 'billing-address', 'final'])
  })

  it('getStepIndex returns correct position (0-based)', () => {
    expect(getStepIndex('recap')).toBe(0)
    expect(getStepIndex('delivery-address')).toBe(1)
    expect(getStepIndex('billing-address')).toBe(2)
    expect(getStepIndex('final')).toBe(3)
  })

  it('getNextStep returns the following step', () => {
    expect(getNextStep('recap')).toBe('delivery-address')
    expect(getNextStep('delivery-address')).toBe('billing-address')
    expect(getNextStep('billing-address')).toBe('final')
  })

  it('getNextStep returns null at the last step', () => {
    expect(getNextStep('final')).toBeNull()
  })

  it('getPrevStep returns the preceding step', () => {
    expect(getPrevStep('delivery-address')).toBe('recap')
    expect(getPrevStep('billing-address')).toBe('delivery-address')
    expect(getPrevStep('final')).toBe('billing-address')
  })

  it('getPrevStep returns null at the first step', () => {
    expect(getPrevStep('recap')).toBeNull()
  })

  it('isLastStep detects the final step', () => {
    expect(isLastStep('final')).toBe(true)
    expect(isLastStep('recap')).toBe(false)
    expect(isLastStep('delivery-address')).toBe(false)
    expect(isLastStep('billing-address')).toBe(false)
  })

  it('getStepLabel returns a non-empty French label for each step', () => {
    for (const s of CHECKOUT_STEPS) {
      expect(getStepLabel(s).length).toBeGreaterThan(0)
    }
  })
})

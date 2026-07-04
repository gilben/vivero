import '@testing-library/jest-dom'
import { vi } from 'vitest'

// jsdom no implementa estas APIs; las requieren motion/react (reduced-motion
// query), Radix (popper, menús) y recharts (ResponsiveContainer).

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

if (!window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof window.ResizeObserver
}

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

// vaul lee getComputedStyle().transform y le hace .match(); en jsdom viene ''
// (falsy) y su fallback termina en undefined → TypeError en cada pointerUp.
const originalGetComputedStyle = window.getComputedStyle.bind(window)
window.getComputedStyle = ((element: Element, pseudo?: string | null) => {
  const style = originalGetComputedStyle(element, pseudo)
  if (!style.transform) {
    Object.defineProperty(style, 'transform', { value: 'none', configurable: true })
  }
  return style
}) as typeof window.getComputedStyle
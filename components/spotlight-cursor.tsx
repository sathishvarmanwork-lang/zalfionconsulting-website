'use client'

import { useEffect, useRef } from 'react'

export function SpotlightCursor() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = root.current
    if (!layer) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const mouse = matchMedia('(hover: hover) and (pointer: fine)')
    const ring = layer.querySelector<HTMLElement>('.cursor-ring')!
    const dot = layer.querySelector<HTMLElement>('.cursor-dot')!
    const glow = layer.querySelector<HTMLElement>('.cursor-glow')!
    let frame = 0
    let x = 0, y = 0, ringX = 0, ringY = 0, glowX = 0, glowY = 0
    let active = false
    let previousFrame = 0
    const allowed = () => mouse.matches && !preference.matches

    function clear() {
      active = false
      layer!.classList.remove('cursor-visible')
      document.documentElement.classList.remove('spotlight-cursor-active')
      cancelAnimationFrame(frame)
      frame = 0
    }

    function draw(now: number) {
      frame = 0
      if (!allowed()) return
      const elapsed = Math.min(now - previousFrame || 16, 50)
      previousFrame = now
      const smoothing = 1 - Math.exp(-elapsed / 75)
      ringX += (x - ringX) * smoothing
      ringY += (y - ringY) * smoothing
      ring.style.transform = `translate3d(${ringX}px,${ringY}px,0)`
      const glowSmoothing = 1 - Math.exp(-elapsed / 130)
      glowX += (x - glowX) * glowSmoothing
      glowY += (y - glowY) * glowSmoothing
      glow.style.transform = `translate3d(${glowX}px,${glowY}px,0)`
      const moving = Math.hypot(x - ringX, y - ringY) > 0.1 || Math.hypot(x - glowX, y - glowY) > 0.1
      if (moving && active) frame = requestAnimationFrame(draw)
    }

    function move(event: PointerEvent) {
      if (!allowed() || event.pointerType !== 'mouse' || (event.target instanceof Element && event.target.closest('dialog'))) { clear(); return }
      x = event.clientX
      y = event.clientY
      if (!active) { ringX = glowX = x; ringY = glowY = y; active = true }
      layer!.classList.add('cursor-visible')
      document.documentElement.classList.add('spotlight-cursor-active')
      dot.style.transform = `translate3d(${x}px,${y}px,0)`
      const target = event.target instanceof Element ? event.target : null
      layer!.classList.toggle('cursor-link', Boolean(target?.closest('a,button,summary,input,select,textarea,label')))
      const now = performance.now()
      if (!frame) { previousFrame = now; frame = requestAnimationFrame(draw) }
    }
    const key = (event: KeyboardEvent) => { if (event.key === 'Tab') clear() }
    const visibility = () => { if (document.hidden) clear() }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', clear)
    window.addEventListener('blur', clear)
    window.addEventListener('scroll', clear, { passive: true })
    window.addEventListener('keydown', key)
    document.addEventListener('visibilitychange', visibility)
    preference.addEventListener('change', clear)
    mouse.addEventListener('change', clear)
    return () => {
      clear()
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', clear)
      window.removeEventListener('blur', clear)
      window.removeEventListener('scroll', clear)
      window.removeEventListener('keydown', key)
      document.removeEventListener('visibilitychange', visibility)
      preference.removeEventListener('change', clear)
      mouse.removeEventListener('change', clear)
    }
  }, [])

  return <div ref={root} className="spotlight-cursor" aria-hidden="true">
    <div className="cursor-glow" />
    <div className="cursor-ring" /><div className="cursor-dot" />
  </div>
}

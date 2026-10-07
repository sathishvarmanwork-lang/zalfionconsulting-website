'use client'

import type { PointerEvent, ReactNode } from 'react'

export function DepthPanel({ children, className }: { children: ReactNode, className: string }) {
  function move(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--panel-light', `${(event.clientX-bounds.left)/bounds.width*100}%`)
    event.currentTarget.style.setProperty('--panel-x', `${-(event.clientY - bounds.top - bounds.height / 2) / bounds.height * 4}deg`)
    event.currentTarget.style.setProperty('--panel-y', `${(event.clientX - bounds.left - bounds.width / 2) / bounds.width * 6}deg`)
  }
  return <article className={`${className} depth-panel`} onPointerMove={move} onPointerLeave={event => { event.currentTarget.style.setProperty('--panel-x', '0deg'); event.currentTarget.style.setProperty('--panel-y', '0deg') }}>{children}</article>
}

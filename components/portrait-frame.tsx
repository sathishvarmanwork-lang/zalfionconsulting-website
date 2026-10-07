'use client'

import type { PointerEvent, ReactNode } from 'react'

export function PortraitFrame({children,large=false}:{children:ReactNode,large?:boolean}) {
  function move(event:PointerEvent<HTMLSpanElement>) {
    if(event.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const box=event.currentTarget.getBoundingClientRect()
    const x=(event.clientX-box.left)/box.width,y=(event.clientY-box.top)/box.height
    event.currentTarget.style.setProperty('--portrait-x',`${-(y-.5)*8}deg`)
    event.currentTarget.style.setProperty('--portrait-y',`${(x-.5)*10}deg`)
    event.currentTarget.style.setProperty('--portrait-light',`${x*100}%`)
  }
  function reset(event:PointerEvent<HTMLSpanElement>) {
    event.currentTarget.style.setProperty('--portrait-x','0deg')
    event.currentTarget.style.setProperty('--portrait-y','0deg')
    event.currentTarget.style.setProperty('--portrait-light','30%')
  }
  return <span className={`portrait-frame ${large?'frame-large':''}`} onPointerMove={move} onPointerLeave={reset}>{children}</span>
}

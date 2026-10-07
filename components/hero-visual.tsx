'use client'

import { useState } from 'react'
import { WorkspaceScene } from './workspace-scene'

export function HeroVisual() {
  const [paused,setPaused]=useState(false)
  return <figure className="hero-visual" aria-labelledby="report-caption">
    <div className="visual-heading"><span className="eyebrow">Your connected workspace</span><span className="visual-index" aria-hidden="true">01 / 01</span></div>
    <WorkspaceScene paused={paused} />
    <figcaption id="report-caption"><h3>Scattered information.<br />One clear business view.</h3><p>Sales, stock, and team updates brought together.</p></figcaption>
    <div className="visual-footer"><span>Illustrative example</span><button type="button" onClick={()=>setPaused(v=>!v)} aria-pressed={paused} aria-label={paused?'Resume reporting animation':'Pause reporting animation'}><span aria-hidden="true">{paused?'▷':'Ⅱ'}</span>{paused?'Resume':'Pause'}</button></div>
  </figure>
}

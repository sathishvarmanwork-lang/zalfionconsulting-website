'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BrainScene, type BrainAnchor } from '../brain-scene'
import { Arrow } from '../ui'
import styles from './home.module.css'

const examples = [
  { area: 'Sales', question: 'Which leads need a follow-up today?', title: 'Know who to follow up with next.', body: 'Your enquiries and conversation history become a prioritised follow-up list.' },
  { area: 'Operations', question: 'What needs my attention across the business?', title: 'See what needs your attention today.', body: 'Your sales records, stock updates and team reports become one daily business summary.' },
  { area: 'Company Knowledge', question: 'Where can my team find the right answer?', title: 'Give your team a clear answer.', body: 'Your company procedures and product information become relevant answers linked to their sources.' }
]

export function EditorialHero() {
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const [focused, setFocused] = useState<number | null>(null)
  const [activation, setActivation] = useState(0)
  const [shown, setShown] = useState(0)
  const [pending, setPending] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hotspots = useRef<(HTMLButtonElement | null)[]>([])
  const hotspotLayer = useRef<HTMLDivElement>(null)
  const hotspotSize = useRef({ width: 0, height: 0 })
  useEffect(() => {
    const layer = hotspotLayer.current
    if (!layer) return
    const observer = new ResizeObserver(([entry]) => {
      hotspotSize.current = { width: entry.contentRect.width, height: entry.contentRect.height }
    })
    observer.observe(layer)
    return () => observer.disconnect()
  }, [])
  const locked = hovered !== null || focused !== null
  const active = pending ? selected : hovered ?? focused ?? selected
  const select = (index: number) => {
    if (timer.current) clearTimeout(timer.current)
    setSelected(index)
    setActivation(value => value + 1)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(index); setPending(false)
    } else {
      setPending(true)
      timer.current = setTimeout(() => { setShown(index); setPending(false) }, 1500)
    }
  }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  const positionAnchors = useCallback((anchors: BrainAnchor[]) => {
    if (locked) return
    anchors.forEach((anchor, index) => {
      const hotspot = hotspots.current[index]
      if (hotspot) {
        const [originX, originY] = [[.65, .35], [.40, .65], [.30, .30]][index]
        const x = (Math.max(.12, Math.min(.88, anchor.x)) - originX) * hotspotSize.current.width
        const y = (Math.max(.12, Math.min(.88, anchor.y)) - originY) * hotspotSize.current.height
        hotspot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      }

    })
  }, [locked])

  return <section className={styles.hero} aria-labelledby="hero-heading">
    <p className={styles.preheadline}>Singapore’s #1 AI Implementation Team</p>
    <div className={styles.heroGrid}>
      <div className={styles.heroCopy}>
        <h1 id="hero-heading">We Build &amp; Deploy<br /><span>AI 2nd Brains <span className={styles.emoji}>🧠</span></span><br /><span className={styles.lastLine}>in 24 Hours</span></h1>
        <p className={styles.description}>Connect your company’s knowledge, tools and workflows in one AI system.</p>
        <p className={styles.support}>Build a brain that runs your company better than you<svg viewBox="0 0 500 14" preserveAspectRatio="none" aria-hidden="true"><path d="M3 10 C110 1 190 13 296 7 S440 3 497 9" /></svg></p>
        <div className={styles.actions}><a className={styles.primary} href="#book-a-call">Book a discovery call <Arrow direction="right" /></a><a className={styles.secondary} href="#how-it-works">See how it works</a></div>
        <ul className={styles.features}><li>Your company knowledge</li><li>Your tools &amp; workflows</li><li>Built around your business</li></ul>
      </div>
      <div className={styles.brainStage} id="ai-second-brain">
        <BrainScene selected={active} activation={activation} locked={locked} onAnchors={positionAnchors} paused={false} fallback={<img src="/images/brain-network-fallback.svg" width="530" height="530" fetchPriority="high" alt="A network of connected company knowledge" />} />
        <div ref={hotspotLayer} className={styles.hotspots} role="group" aria-label="Explore brain areas">
          {examples.map((item, index) => <button key={item.area} ref={element => { hotspots.current[index] = element }} type="button" className={styles.hotspot} data-area={index} aria-label={`${item.area}: ${item.question}`} aria-pressed={selected === index} aria-controls="hero-brain-example" onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(index) }} onPointerLeave={() => setHovered(null)} onFocus={() => setFocused(index)} onBlur={() => setFocused(null)} onClick={() => select(index)}><span aria-hidden="true" /></button>)}
        </div>
      </div>
    </div>
    <div className={styles.brainBand}>
      <div className={styles.questions} role="group" aria-label="Explore what your AI 2nd Brain can do">{examples.map((item,index) => <button key={item.area} className={styles.question} aria-pressed={selected===index} aria-controls="hero-brain-example" onFocus={()=>setFocused(index)} onBlur={()=>setFocused(null)} onClick={()=>select(index)}><span>{item.area}</span>{item.question}<Arrow direction="right" /></button>)}</div>
      <div id="hero-brain-example" className={styles.outcome} role="region" aria-label="Business area example" aria-live="polite" aria-atomic="true" aria-busy={pending}>{pending ? <p>Connecting your {examples[selected].area.toLowerCase()} knowledge…</p> : <div><h2>{examples[shown].title}</h2><p>{examples[shown].body}</p></div>}</div>
    </div>
  </section>
}

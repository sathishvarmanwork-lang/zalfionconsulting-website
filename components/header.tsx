'use client'
import { useEffect, useRef, useState } from 'react'
import { Arrow } from './ui'
import { industries } from '@/lib/industries'
import styles from './header.module.css'

const links = [['About Us', 'about-us'], ['Case Studies', 'case-studies'], ['Solutions', 'solutions'], ['Partners', 'partners']]
export function Header({ page = 'home' }: { page?: 'home' | 'about' | 'industries' }) {
  const homeHref = (id: string) => page === 'home' ? `#${id}` : `/#${id}`
  const [open, setOpen] = useState(false)
  const [industriesOpen, setIndustriesOpen] = useState(false)
  const [active, setActive] = useState('')
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const industryToggle = useRef<HTMLButtonElement>(null)
  function close() { setOpen(false); setIndustriesOpen(false) }
  useEffect(() => {
    function escape(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (industriesOpen) { setIndustriesOpen(false); industryToggle.current?.focus() }
      else if (open) { setOpen(false); toggle.current?.focus() }
    }
    function outside(e: PointerEvent) { if (!header.current?.contains(e.target as Node)) close() }
    window.addEventListener('keydown', escape)
    window.addEventListener('pointerdown', outside)
    return () => { window.removeEventListener('keydown', escape); window.removeEventListener('pointerdown', outside) }
  }, [open, industriesOpen])
  useEffect(() => {
    const query = matchMedia('(min-width:1200px)')
    query.addEventListener('change', close)
    return () => query.removeEventListener('change', close)
  }, [])
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main>section'))
    let frame = 0
    function update() {
      frame = 0
      const current = sections.find(section => { const bounds = section.getBoundingClientRect(); return bounds.top <= innerHeight * .35 && bounds.bottom > innerHeight * .35 })
      setActive(current?.id ?? '')
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [])
  return <header ref={header} className={`site-header shell ${styles.header}`}>
    <a href={homeHref('top')} className="brand" aria-label="Zalfion Consulting home"><img src="/images/logo.jpg" alt="" width="56" height="56" /><span>Zalfion<small>Consulting</small></span></a>
    <button ref={toggle} className={`menu-toggle ${styles.menuToggle} ${open ? 'is-open' : ''}`} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => { setOpen(!open); setIndustriesOpen(false) }}><span /><span /></button>
    <nav id="main-navigation" className={`navigation ${styles.nav} ${open ? 'is-open' : ''}`} aria-label="Main navigation" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget) && e.relatedTarget !== toggle.current) close() }}>
      {links.map(([label, id]) => <a key={id} href={id === 'about-us' ? '/about-us' : homeHref(id)} aria-current={id === 'about-us' && page === 'about' ? 'page' : page === 'home' && active === id ? 'location' : undefined} onClick={close}>{label}</a>)}
      <div className={styles.industryGroup}
        onPointerEnter={e => { if (e.pointerType === 'mouse' && matchMedia('(min-width:1200px) and (hover:hover)').matches) setIndustriesOpen(true) }}
        onPointerLeave={e => { if (e.pointerType === 'mouse' && matchMedia('(min-width:1200px)').matches && !e.currentTarget.contains(document.activeElement)) setIndustriesOpen(false) }}
        onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setIndustriesOpen(false) }}>
        <button ref={industryToggle} className={styles.industryToggle} data-current={page === 'industries'} aria-expanded={industriesOpen} aria-controls="industry-navigation" onClick={e => { if (e.detail > 0 && matchMedia('(min-width:1200px) and (hover:hover) and (pointer:fine)').matches) setIndustriesOpen(true); else setIndustriesOpen(!industriesOpen) }}>Industries <span aria-hidden="true">{industriesOpen ? '−' : '+'}</span></button>
        <div id="industry-navigation" className={styles.dropdown} hidden={!industriesOpen}>
          <a className={styles.overview} href="/industries" aria-current={page === 'industries' ? 'page' : undefined} onClick={close}>Explore all industries <Arrow direction="right" /></a>
          <ul>{industries.map(industry => <li key={industry.id}><a href={`/industries#${industry.id}`} onClick={close}>{industry.name}</a></li>)}</ul>
        </div>
      </div>
      <a className="nav-book" href={homeHref('book-a-call')} aria-current={active === 'book-a-call' ? 'location' : undefined} onClick={close}>Book a discovery call <Arrow /></a>
    </nav>
  </header>
}

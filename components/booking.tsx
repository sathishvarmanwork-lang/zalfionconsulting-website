'use client'
import { useEffect, useRef, useState, type FormEvent, type CSSProperties } from 'react'
import { Arrow, Eyebrow } from './ui'
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const zones = ['Asia/Singapore', 'Asia/Kuala_Lumpur', 'Asia/Kolkata', 'Asia/Dubai', 'Europe/London', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Australia/Sydney', 'UTC']
const times = ['10:00 AM', '11:00 AM', '2:00 PM']
export function Booking({ assessmentSummary }: { assessmentSummary: string }) {
  const [stage, setStage] = useState<'time' | 'details' | 'preview'>('time')
  const [month, setMonth] = useState(8)
  const [year, setYear] = useState(2026)
  const [today, setToday] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [zone, setZone] = useState('Asia/Singapore')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [context, setContext] = useState('')
  const [error, setError] = useState('')
  const panel = useRef<HTMLDivElement>(null)
  const privacy = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const now = new Date()
    setMonth(now.getMonth()); setYear(now.getFullYear())
    setToday(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`)
    setZone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Singapore')
  }, [])
  const zoneOptions = [...new Set([zone, ...zones])]
  const days = new Date(year, month + 1, 0).getDate()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const dateLabel = date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : ''
  const zoneLabel = zone.replaceAll('_', ' ').replace('/', ' / ')
  function focusPanel() { requestAnimationFrame(() => { panel.current?.focus({ preventScroll: true }); panel.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }) }) }
  function moveMonth(delta: number) { const d = new Date(year, month + delta, 1); setMonth(d.getMonth()); setYear(d.getFullYear()); setError('') }
  function continueBooking() {
    if (!date || !time) { setError('Choose a date and time to continue.'); return }
    setError(''); setStage('details'); focusPanel()
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) { setError('Enter your name.'); return }
    setError(''); setStage('preview'); focusPanel()
  }
  return <section id="book-a-call" className="section muted" aria-labelledby="booking-heading"><div className="shell split-section booking-section">
    <div className="split-intro"><Eyebrow>Book a Call</Eyebrow><h2 id="booking-heading">Let’s scope your<br />AI 2nd Brain.</h2><p>Tell us where you want to improve revenue or operations. We’ll explore how an AI 2nd Brain could help.</p><div className="call-agenda"><Eyebrow>What we’ll discuss</Eyebrow><ul><li>The business outcome you want to improve.</li><li>The knowledge, tools, and workflows involved.</li><li>A starting scope for your AI 2nd Brain.</li></ul><p>Bring one or two examples, or your AI 2nd Brain assessment result.</p></div></div>
    <div ref={panel} className="white-panel booking-panel" tabIndex={-1} aria-label={stage === 'time' ? 'Choose a time' : stage === 'details' ? 'Your details' : 'Booking preview complete'}>
      <p className="demo-notice">Local booking preview. No appointment will be created.</p>
      <ol className="booking-progress" aria-label="Booking steps" style={{ '--booking-step': stage === 'time' ? 0 : stage === 'details' ? 1 : 2 } as CSSProperties}>{['Choose a time', 'Your details', 'Preview'].map((label, index) => <li key={label} aria-current={index === (stage === 'time' ? 0 : stage === 'details' ? 1 : 2) ? 'step' : undefined}><span>0{index + 1}</span>{label}</li>)}</ol>
      <div key={stage} className="booking-stage">
      {stage === 'time' ? <><Eyebrow>Choose a time</Eyebrow><h3 className="panel-title">AI 2nd Brain discovery call</h3><div className="calendar-head"><h4 aria-live="polite">{months[month]} {year}</h4><div><button type="button" aria-label="Previous month" onClick={() => moveMonth(-1)}>‹</button><button type="button" aria-label="Next month" onClick={() => moveMonth(1)}>›</button></div></div><div className="calendar" role="group" aria-label="Choose an example date"><div className="weekdays" aria-hidden="true">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => <span key={i}>{day}</span>)}</div><div className="calendar-days">{Array.from({ length: offset }, (_, i) => <span key={`empty-${i}`} />)}{Array.from({ length: days }, (_, i) => {
        const day = i + 1, iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const weekday = new Date(year, month, day).getDay(), disabled = iso < today || weekday === 0 || weekday === 6
        return <button type="button" key={iso} disabled={disabled} className={date === iso ? 'chosen' : ''} aria-pressed={date === iso} aria-label={`${day} ${months[month]} ${year}`} onClick={() => { setDate(iso); setTime(''); setError('') }}>{day}</button>
      })}</div></div><label className="field zone-field"><span>Time zone</span><select value={zone} onChange={e => { setZone(e.target.value); setTime(''); setError('') }}>{zoneOptions.map(z => <option key={z} value={z}>{z.replaceAll('_', ' ').replace('/', ' / ')}</option>)}</select></label>{date ? <fieldset className="time-slots"><legend>{dateLabel}</legend><p className="small">Example times in {zoneLabel}.</p><div>{times.map(t => <label key={t} className={`time-choice ${time === t ? 'selected' : ''}`}><input type="radio" name="booking-time" value={t} checked={time === t} onChange={() => { setTime(t); setError('') }} />{t}</label>)}</div></fieldset> : <p className="small choose-date-hint">Choose a date to see example times.</p>}{error && <p className="field-error" role="alert">{error}</p>}<button className="button w-full" onClick={continueBooking}>Continue <Arrow /></button></> : stage === 'details' ? <><Eyebrow>Your details</Eyebrow><h3 className="panel-title">AI 2nd Brain discovery call</h3><div className="appointment-summary"><p>{dateLabel}</p><p>{time} · {zoneLabel}</p><button className="inline-link" onClick={() => { setStage('time'); focusPanel() }}>Change date or time</button></div><form onSubmit={submit}><label className="field"><span>Your name</span><input name="name" autoComplete="name" required value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" /></label><label className="field"><span>Email address</span><input name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" /></label><label className="field"><span>Company name <span className="optional">(optional)</span></span><input name="company" autoComplete="organization" value={company} onChange={e => setCompany(e.target.value)} placeholder="Enter your company name" /></label><label className="field"><span>What would you like your AI 2nd Brain to help with? <span className="optional">(optional)</span></span><textarea name="context" rows={4} value={context} onChange={e => setContext(e.target.value)} placeholder="A short example is enough." /></label>{assessmentSummary && <button type="button" className="inline-link context-button" onClick={() => setContext(assessmentSummary)}>Use my AI 2nd Brain assessment summary</button>}<p className="small">This preview keeps your details in this tab only. Nothing is sent.</p><button className="inline-link privacy-link" type="button" onClick={() => privacy.current?.showModal()}>Privacy information</button>{error && <p className="field-error" role="alert">{error}</p>}<button className="button w-full" type="submit">Preview confirmation <Arrow /></button></form></> : <div className="booking-success"><Eyebrow>Preview complete</Eyebrow><h3 className="result-title">Your AI 2nd Brain call preview.</h3><p className="appointment-summary">{dateLabel}<br />{time} · {zoneLabel}</p><p>No call has been booked and no email has been sent. The live calendar will be connected later.</p><button className="button w-full" onClick={() => { setStage('time'); focusPanel() }}>Try another date <Arrow /></button><button className="quiet-link" onClick={() => { setStage('time'); setDate(''); setTime(''); setName(''); setEmail(''); setCompany(''); setContext(''); setError(''); focusPanel() }}>Clear preview details</button></div>}
      </div>
    </div>
    <dialog ref={privacy} className="privacy-dialog" aria-labelledby="privacy-title" onClick={e => { if (e.target === e.currentTarget) privacy.current?.close() }}><div className="dialog-heading"><h3 id="privacy-title">Local preview privacy</h3><button aria-label="Close privacy information" onClick={() => privacy.current?.close()}>×</button></div><p>The assessment and booking preview run in your browser. Your answers and form entries are held only in this open page and are not submitted, stored in a database, or sent by email.</p><p>Reloading the page clears these entries. The live booking provider and company privacy policy will be connected before launch.</p><button className="button" onClick={() => privacy.current?.close()}>Return to booking <Arrow /></button></dialog>
  </div></section>
}

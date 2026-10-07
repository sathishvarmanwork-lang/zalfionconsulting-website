'use client'
import { useState } from 'react'

export function FaqItem({ item, initiallyOpen }: { item: { key: string, question: string, answer: string }, initiallyOpen: boolean }) {
  const [open, setOpen] = useState(initiallyOpen)
  return <div className={`faq-item${open ? ' is-open' : ''}`}><h3><button id={`faq-question-${item.key}`} aria-expanded={open} aria-controls={`faq-answer-${item.key}`} onClick={() => setOpen(value => !value)}>{item.question}<span className="faq-toggle" aria-hidden="true" /></button></h3><div id={`faq-answer-${item.key}`} role="region" aria-labelledby={`faq-question-${item.key}`} aria-hidden={!open} inert={!open} className="faq-answer"><div><p>{item.answer}</p></div></div></div>
}

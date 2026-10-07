'use client'
import { useState } from 'react'
import { Assessment } from './assessment'
import { FaqItem } from './faq-item'
import { Booking } from './booking'
import { BookingLink, Eyebrow } from './ui'
export function Journey({ faqs }: { faqs: { key: string, question: string, answer: string }[] }) {
  const [summary, setSummary] = useState('')
  return <><Assessment onResult={setSummary} /><section id="faqs" className="section shell faq-section" aria-labelledby="faq-heading"><div className="faq-intro"><Eyebrow>FAQs</Eyebrow><h2 id="faq-heading">Your AI 2nd Brain.<br />Questions answered.</h2><p className="section-intro">Understand the offer, your data, and what happens after deployment.</p></div><div className="faq-list">{faqs.map((item, i) => <FaqItem key={item.key} item={item} initiallyOpen={i === 0} />)}</div><div className="faq-cta"><h3>Still have a question?</h3><p>Let’s discuss what an AI 2nd Brain could do for your business.</p><BookingLink /></div></section><Booking assessmentSummary={summary} /></>
}

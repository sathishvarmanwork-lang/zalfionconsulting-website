'use client'
import { useEffect, useRef, useState } from 'react'
import { clientCases, clientImage } from '@/lib/client-cases'
import content from '@/lib/content.json'
import faqs from '@/lib/faqs.json'
import { Assessment } from './assessment'
import { Booking } from '../booking'
import s from './home.module.css'

export function Navigation() {
 const [open,setOpen]=useState(false), toggle=useRef<HTMLButtonElement>(null)
 useEffect(()=>{if(!open)return;const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);toggle.current?.focus()}};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape)},[open])
 return <header className={`${s.shell} ${s.header}`}><a href="#top" className={s.brand}><img src="/images/logo.jpg" alt="" width="48" height="48" /><span>Zalfion<small>Consulting</small></span></a><button ref={toggle} className={s.menu} aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="home-navigation" onClick={()=>setOpen(!open)}><span /> <span /></button><nav id="home-navigation" className={s.nav} data-open={open} aria-label="Main navigation">{[['team','Team'],['case-studies','Case Studies'],['solutions','Solutions'],['partners','Partners'],['book-a-call','Book a discovery call ↗']].map(([id,label])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{label}</a>)}</nav></header>
}
export function Cases() {
 const [selected,setSelected]=useState(0),client=clientCases[selected]
 return <div className={s.cases}><div className={s.caseIndex} role="group" aria-label="Choose a case study">{clientCases.map((item,i)=><button key={item.id} aria-pressed={selected===i} aria-controls="case-detail" onClick={()=>setSelected(i)}>{item.name}<span aria-hidden="true">↗</span></button>)}</div><div className={s.caseSelect}><label htmlFor="mobile-case">Choose a case study</label><select id="mobile-case" value={selected} onChange={e=>setSelected(Number(e.target.value))}>{clientCases.map((c,i)=><option key={c.id} value={i}>{c.name}</option>)}</select></div><article id="case-detail" className={s.caseDetail} aria-live="polite" aria-atomic="true"><div key={client.id} className={s.caseStory}><div className={s.caseIdentity}><div><p className={s.label}>{client.category}</p><h3>{client.name}</h3></div>{client.kind!=='private'&&<img src={clientImage(client.id)} alt={client.kind==='logo'?`${client.name} logo`:client.name} width="140" height="100" />}</div><p className={s.value}>{client.value}</p><p className={s.qualifier}>{client.estimated?'Estimated annual value':'Reported annual value at the current monthly rate'}</p><div className={s.caseWords}><div><h4>What changed</h4><p>{client.solution}</p></div><div><h4>The business benefit</h4><p>{client.benefit}</p></div></div></div></article></div>
}
function SolutionDetail({index}:{index:number}) {
 const item=content.problems[index]
 return <div className={s.solutionDetail}><svg className={s.solutionDiagram} viewBox="0 0 300 120" aria-hidden="true"><path d={['M20 25H90V60H210V95H280','M20 25H150V95H280M20 95H90V60H280','M20 25H90Q120 25 120 60M20 95H90Q120 95 120 60M120 60H280','M20 60H150M150 60V25H280M150 60V95H280'][index]} />{[[[20,25],[150,60],[280,95]],[[20,25],[20,95],[150,60],[280,60],[280,95]],[[20,25],[20,95],[150,60],[280,60]],[[20,60],[150,60],[280,25],[280,95]]][index].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={x===150?18:7}/>)}</svg><h3>{item[3]}</h3><p>{item[4]}</p></div>
}
export function Solutions(){
 const [selected,setSelected]=useState<number|null>(0)
 return <div className={s.solutions}>{content.problems.map(([id,title,sub],i)=><div className={s.solutionItem} key={id} data-selected={selected===i}><button id={`solution-${id}`} aria-expanded={selected===i} aria-controls={`answer-${id}`} onClick={()=>setSelected(selected===i?null:i)}><span>{title}<small>{sub}</small></span><span aria-hidden="true">{selected===i?'−':'+'}</span></button><div id={`answer-${id}`} role="region" aria-labelledby={`solution-${id}`} hidden={selected!==i}><SolutionDetail index={i}/></div></div>)}</div>
}
export function ProcessDiagram({stage}:{stage:number}){
 const ref=useRef<SVGSVGElement>(null)
 useEffect(()=>{const el=ref.current;if(!el)return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){el.dataset.seen='true';observer.disconnect()}},{threshold:.5});observer.observe(el);return()=>observer.disconnect()},[])
 return <svg ref={ref} className={s.processDiagram} viewBox="0 0 300 150" aria-hidden="true"><g>{stage===0?<><path d="M35 35H130V75H235M35 115H130V75"/><rect x="20" y="20" width="30" height="30" rx="4"/><rect x="20" y="100" width="30" height="30" rx="4"/><circle cx="235" cy="75" r="30"/><circle cx="235" cy="75" r="8"/></>:stage===1?<><path d="M30 75H100M160 75H270M130 20V45M130 105V135"/><rect x="100" y="45" width="60" height="60" rx="8"/><circle cx="30" cy="75" r="8"/><circle cx="270" cy="75" r="8"/><circle cx="130" cy="20" r="8"/><circle cx="130" cy="135" r="8"/></>:<><path d="M60 75H230M230 75V30H60V75M60 75V120H230V75"/><circle cx="60" cy="75" r="12"/><circle cx="230" cy="75" r="12"/><path d="m145 23 10 7-10 7m0 76-10 7 10 7"/></>}</g></svg>
}
export function Journey(){
 const [summary,setSummary]=useState(''),[expanded,setExpanded]=useState<string[]>([faqs[0].key])
 return <div className={s.journey}><Assessment onResult={setSummary}/><section id="faqs" className={`${s.section} ${s.faqs}`} aria-labelledby="faq-heading"><div><p className={s.label}>FAQs</p><h2 id="faq-heading">Your AI 2nd Brain.<br />Questions answered.</h2><p className={s.intro}>Understand the offer, your data, and what happens after deployment.</p><div className={s.faqCall}><h3>Still have a question?</h3><p>Let’s discuss what an AI 2nd Brain could do for your business.</p><a className={s.next} href="#book-a-call">Book a discovery call ↗</a></div></div><div>{faqs.map(item=><article className={s.faqItem} key={item.key}><h3><button aria-expanded={expanded.includes(item.key)} aria-controls={`faq-${item.key}`} onClick={()=>setExpanded(items=>items.includes(item.key)?items.filter(x=>x!==item.key):[...items,item.key])}>{item.question}<span aria-hidden="true">{expanded.includes(item.key)?'−':'+'}</span></button></h3><div id={`faq-${item.key}`} hidden={!expanded.includes(item.key)}><p>{item.answer}</p></div></article>)}</div></section><Booking assessmentSummary={summary}/></div>
}

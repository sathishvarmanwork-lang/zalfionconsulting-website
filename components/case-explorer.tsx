'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { clientCases, clientImage } from '@/lib/client-cases'
import styles from './client-evidence.module.css'
export function CaseExplorer() {
 const [selected,setSelected]=useState(0)
 useEffect(() => {
  function readCase() {
   const id = new URLSearchParams(window.location.search).get('case')
   const index = clientCases.findIndex(client => client.id === id)
   if (index >= 0) setSelected(index)
  }
  readCase()
  window.addEventListener('popstate', readCase)
  return () => window.removeEventListener('popstate', readCase)
 }, [])
 const client=clientCases[selected]
 return <div className={styles.explorer}>
  <div className={styles.choices} role="group" aria-label="Choose a case study">{clientCases.map((item,index)=><button type="button" key={item.id} aria-pressed={selected===index} aria-controls="case-detail" onClick={()=>setSelected(index)}>{item.name}</button>)}</div>
  <article id="case-detail" className={styles.detail} aria-labelledby="selected-client-name">
   <div className={`${styles.visual} ${client.kind==='logo'?styles.brand:client.kind==='portrait'?styles.portrait:styles.privateVisual}`}><div className={styles.imageFrame} key={client.id}><Image className={client.id==='gourmet-factor'?styles.gourmetLogo:(client.id==='strengths-school'||client.id==='pocket-creative')?styles.suppliedLogo:undefined} onLoad={event=>event.currentTarget.dataset.loaded='true'} src={clientImage(client.id)} alt={client.kind==='logo'?`${client.name} logo`:client.kind==='private'?'Client identity protected under NDA':`${client.name}, pictured in Zalfion’s case-study document`} width={840} height={840} sizes="(max-width: 767px) 75vw, 340px"/></div></div>
   <div aria-live="polite" aria-atomic="true"><div key={client.id} className={styles.story}><p className={styles.category}>{client.category}</p><h3 id="selected-client-name">{client.name}</h3><div className={styles.value}><strong>{client.value}</strong><span>{client.estimated?'Estimated annual value':'Reported annual value at the current monthly rate'}</span></div><h4>What changed</h4><p>{client.solution}</p><h4>The business benefit</h4><p className={styles.benefit}>{client.benefit}</p></div></div>
  </article>
 </div>
}

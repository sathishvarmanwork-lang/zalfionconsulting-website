'use client'

import { useId, useState } from 'react'
import styles from './brain-explainer.module.css'
import { BrainScene } from './brain-scene'

export const brainAreas = [
  { name: 'Sales', question: 'Which leads need a follow-up?', information: 'Enquiries, conversation history, and follow-up records.', output: 'A prioritised follow-up list with suggested next actions.', benefit: 'Give your sales team a clear place to start the next conversation.' },
  { name: 'Operations', question: 'What needs attention in the business today?', information: 'Sales records, stock updates, and team reports.', output: 'A shared daily summary that highlights changes and items to review.', benefit: 'Spend less time gathering updates and more time acting on them.' },
  { name: 'Company Knowledge', question: 'How do we handle this customer request?', information: 'Company procedures, product information, and approved guidance.', output: 'A relevant answer with links to the company information behind it.', benefit: 'Help your team find answers without always waiting for the owner.' }
]

export function BrainExplainer() {
  const [selected,setSelected]=useState(0)
  const id=useId()
  const area=brainAreas[selected]
  return <section id="ai-second-brain" className={styles.explainer} aria-labelledby={`${id}-heading`}>
    <header className={styles.intro}>
      <p className={styles.eyebrow}><span /> Connected knowledge. Useful action.</p>
      <h2 id={`${id}-heading`}>What is an<br className={styles.desktopBreak} /> AI 2nd Brain 🧠?</h2>
      <p className={styles.description}>Your company’s knowledge, tools, and workflows, connected in one AI system. It helps your team find answers, follow up with customers, and get work done.</p>
    </header>
    <div className={styles.experience}>
      <div className={styles.choices} role="group" aria-label="Choose a business area">
        <p className={styles.label}>Explore a business area</p>
        <div>{brainAreas.map((item,index)=><button key={item.name} type="button" aria-pressed={selected===index} aria-controls={`${id}-example`} onClick={()=>setSelected(index)} className={selected===index?styles.selected:''}><span aria-hidden="true">0{index+1}</span>{item.name}</button>)}</div>
      </div>
      <figure className={styles.visual}>
        <BrainScene selected={selected} paused={false} fallback={<p className={styles.label}>Connecting company knowledge</p>} />
        <figcaption>
          <span><i />{area.name} connections</span>
        </figcaption>
      </figure>
      <div id={`${id}-example`} className={styles.example} role="region" aria-label="Business area example" aria-live="polite" aria-atomic="true">
        <p className={styles.label}>An example question</p>
        <h3>{area.question}</h3>
        <dl>
          <div><dt><span>01</span>Information it connects</dt><dd>{area.information}</dd></div>
          <div><dt><span>02</span>What it helps you do</dt><dd>{area.output}</dd></div>
        </dl>
        <p className={styles.benefit}>{area.benefit}</p>
        <p className={styles.note}>Illustrative examples. Your AI 2nd Brain is scoped around your business.</p>
      </div>
    </div>
    <p className={styles.closing}><strong>One connected brain.</strong> Built around the way your company works.</p>
  </section>
}

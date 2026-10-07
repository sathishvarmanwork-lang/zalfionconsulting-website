'use client'

import { useState } from 'react'
import content from '@/lib/content.json'
import { ImmersiveWorkflow } from './immersive-workflow'

const scenes = [
  { sources: ['Website enquiry', 'Email enquiry', 'Team message'], title: 'Your follow-up queue', rows: ['New enquiry', 'Next action', 'Follow-up due'], icon: '↗' },
  { sources: ['Sales records', 'Manual entry', 'Weekly report'], title: 'Your reporting workflow', rows: ['Records organised', 'Report prepared', 'Ready for review'], icon: '≡' },
  { sources: ['Sales spreadsheet', 'Stock system', 'Team update'], title: 'Your shared business view', rows: ['Sales overview', 'Stock changes', 'Latest updates'], icon: '⌕' },
  { sources: ['Company handbook', 'Team question', 'Process notes'], title: 'Your company knowledge', rows: ['Ask a question', 'Find a procedure', 'See the source'], icon: '↳' }
]

export function SolutionExplorer() {
  const [selected, setSelected] = useState(0)
  const scene = scenes[selected]
  const problem = content.problems[selected]
  return <div className="solution-explorer">
    <div className="problem-choices" role="group" aria-label="Choose a business problem">
      <p className="eyebrow">Start with your challenge</p>
      {content.problems.map(([key, title, detail], index) => <button key={key} type="button" id={`problem-${key}`} aria-pressed={selected === index} aria-controls="solution-preview" onClick={() => { setSelected(index) }} className={`problem-choice${selected === index ? ' is-selected' : ''}`}><span className="row-number">0{index + 1}</span><span><strong>{title}</strong><span>{detail}</span></span><span className="choice-arrow" aria-hidden="true">↗</span></button>)}
    </div>
    <div className="solution-preview" id="solution-preview" role="region" aria-labelledby={`problem-${problem[0]}`}>
      <ImmersiveWorkflow label="From information to action" config={{title:scene.title,sources:scene.sources,rows:scene.rows.map(row=>[row,'']),mode:'connected'}} />
      <div className="solution-explanation" aria-live="polite" aria-atomic="true"><p className="eyebrow">Your AI 2nd Brain in action</p><h3>{problem[3]}</h3><p>{problem[4]}</p></div>
      <p className="small scene-note">Illustrative workflow. Select a challenge to explore.</p>
    </div>
  </div>
}

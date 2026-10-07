'use client'

import { useEffect, useRef, useState } from 'react'
import content from '@/lib/content.json'
import { ImmersiveWorkflow } from './immersive-workflow'
import type { WorkspaceConfig } from './workspace-scene'

const processScenes: WorkspaceConfig[] = [
  {title:'One clear business priority.',sources:['Your goals','Current workflow','Company knowledge'],rows:[['Business outcome','Choose the work that matters.'],['Information','Map the tools and knowledge.'],['Starting scope','Define the first workflow.']],mode:'scope'},
  {title:'Your connected system.',sources:['Your knowledge','Your tools','Your workflows'],rows:[['Connect','Bring the information together.'],['Test','Review with your team.'],['Deploy','Put the workflow to work.']],mode:'build'},
  {title:'Improve with real use.',sources:['Team feedback','Workflow review','Refined knowledge'],rows:[['Use','See how the team works.'],['Review','Find the useful refinements.'],['Improve','Update knowledge and workflows.']],mode:'improve'}
]
function ProcessObject({stage, mobile=false}:{stage:number, mobile?:boolean}) {
  return <ImmersiveWorkflow mobileProcess={mobile} label={['Scope your AI 2nd Brain','Build, test, and deploy','Improve with team feedback'][stage]} config={processScenes[stage]} />
}

export function ProcessExperience() {
  const [stage, setStage] = useState(0)
  const list = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const items = Array.from(list.current?.children ?? [])
    let frame = 0
    function update() {
      frame = 0
      const focus = innerHeight * 0.48
      let closest = 0
      let distance = Infinity
      items.forEach((item, index) => {
        const bounds = item.getBoundingClientRect()
        const next = Math.abs(bounds.top + bounds.height / 2 - focus)
        if (next < distance) { closest = index; distance = next }
      })
      setStage(closest)
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [])
  return <div className="process-experience">
    <div className="process-sticky"><ProcessObject stage={stage} /></div>
    <ol ref={list} className="process-chapters">{content.steps.map(([key, title, strap, body, outcome], index) => <li key={key} className={stage === index ? 'is-current' : ''}><div className="process-chapter-heading"><span className="step-number">{index + 1}</span><h3>{title}</h3></div><h4>{strap}</h4><p>{body}</p><p className="outcome">{outcome}</p><div className="process-mobile-object"><ProcessObject stage={index} mobile /></div></li>)}</ol>
  </div>
}

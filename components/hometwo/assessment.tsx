'use client'
import { useRef, useState } from 'react'
import { questions, getAssessmentResult } from '@/lib/assessment'
import { Arrow, Eyebrow } from '../ui'
export function Assessment({ onResult }: { onResult: (summary: string) => void }) {
  const [answers, setAnswers] = useState<number[]>([-1, -1, -1, -1])
  const [step, setStep] = useState(0)
  const [resultShown, setResultShown] = useState(false)
  const [error, setError] = useState('')
  const panel = useRef<HTMLDivElement>(null)
  function focusPanel() { requestAnimationFrame(() => { panel.current?.focus({ preventScroll: true }); panel.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }) }) }
  function next() {
    if (answers[step] === -1) { setError('Choose an answer to continue.'); return }
    setError('')
    if (step === 3) { setResultShown(true); onResult(getAssessmentResult(answers).context) } else setStep(step + 1)
    focusPanel()
  }
  const result = resultShown ? getAssessmentResult(answers) : null
  return <section id="assessment" className="section muted" aria-labelledby="assessment-heading"><div className="shell split-section">
    <div className="split-intro"><Eyebrow>AI 2nd Brain Assessment</Eyebrow><h2 id="assessment-heading">{result ? <>Your AI 2nd Brain.<br />A starting point.</> : <>Where could your<br />AI 2nd Brain help?</>}</h2><p>{result ? 'Here is a possible AI 2nd Brain application based on your answers.' : 'Answer four short questions to explore how an AI 2nd Brain could support your revenue or operations.'}</p>{!result && <><div className="assessment-effort"><p className="gold">About 2 minutes. 4 questions.</p><p className="small">No contact details needed to see your result.</p></div><div className="assessment-bypass"><p>Already know what you need?</p><a className="inline-link" href="#book-a-call">Book a discovery call ↗</a></div></>}</div>
    <div className="white-panel assessment-panel" ref={panel} tabIndex={-1} aria-label={result ? 'Your suggested AI 2nd Brain application' : `Question ${step + 1} of 4`}>

      {result ? <><Eyebrow>Your suggested starting point</Eyebrow><h3 className="result-title">{result.title}</h3><div className="result-block"><Eyebrow>Why this fits</Eyebrow><p>{result.why}</p></div><div className="result-block"><Eyebrow>What your AI 2nd Brain could do</Eyebrow><p>{result.solution}</p><ol className="result-steps">{result.steps.map((s, i) => <li key={s}><span>{String(i + 1).padStart(2, '0')}</span>{s}</li>)}</ol></div><div className="result-booking"><Eyebrow>Make it specific to your business</Eyebrow><p>Book a discovery call to scope your AI 2nd Brain around this workflow and the business outcome you want.</p><a href="#book-a-call" className="button">Book a discovery call <Arrow /></a></div><div className="result-review"><button className="inline-link" onClick={() => { setResultShown(false); setStep(0); focusPanel() }}>Review my answers</button><button className="quiet-link" onClick={() => { setAnswers([-1, -1, -1, -1]); setStep(0); setResultShown(false); setError(''); onResult(''); focusPanel() }}>Start again</button></div></> : <>
      <p className="eyebrow">Question {step + 1} of 4</p><div className="progress" aria-hidden="true">{questions.map((_, i) => <span key={i} className={i <= step ? 'complete' : ''} />)}</div>
      <fieldset><legend>{questions[step].title}</legend><p className="choice-hint">Choose one.</p><div className="choices">{questions[step].options.map((option, i) => <label key={`${step}-${i}`} className={`choice ${answers[step] === i ? 'selected' : ''}`}><input type="radio" name={`question-${step}`} checked={answers[step] === i} value={i} onChange={() => { setAnswers(a => a.map((v, j) => j === step ? i : v)); setError('') }} />{option}</label>)}</div></fieldset>
      {error && <p role="alert" className="field-error">{error}</p>}<button className="button w-full" onClick={next}>{step === 3 ? 'Show my AI 2nd Brain direction' : 'Continue'}<Arrow /></button>{step > 0 && <button className="quiet-link back-button" onClick={() => { setStep(step - 1); setError(''); focusPanel() }}>← Back</button>}
      </>}
    </div>{!result && <div className="assessment-bypass mobile-bypass"><p>Already know what you need?</p><a className="inline-link" href="#book-a-call">Book a discovery call ↗</a></div>}
  </div></section>
}

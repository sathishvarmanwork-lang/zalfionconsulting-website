import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getAssessmentResult, questions } from '../lib/assessment.ts'
test('the approved daily spreadsheet example matches the report', () => {
  const r = getAssessmentResult([1, 0, 0, 0])
  assert.equal(r.title, 'Routine reporting, with less manual work.')
  assert.equal(r.why, 'You spend time on admin every day, use spreadsheets, and want more time for customers.')
  assert.ok(r.steps.includes('Prepare a daily report automatically.'))
})
test('all answer combinations produce a result without claiming unsupported savings', () => {
  let count = 0
  for (let a = 0; a < 5; a++) for (let b = 0; b < 6; b++) for (let c = 0; c < 5; c++) for (let d = 0; d < 6; d++) {
    const r = getAssessmentResult([a,b,c,d])
    assert.ok(r.title && r.solution && r.why && r.context)
    assert.equal(r.steps.length, 3)
    assert.doesNotMatch(JSON.stringify(r), /guaranteed|S\$|\d+%/)
    if (b === 3) assert.match(r.steps[0], /digitise/)
    if (c !== 0) assert.doesNotMatch(r.solution, /daily/)
    count++
  }
  assert.equal(count, 900)
})
test('unsure responses do not invent tools, frequency, or goals', () => {
  const r = getAssessmentResult([4,5,4,5])
  assert.match(r.title, /Find one workflow/)
  assert.doesNotMatch(r.why, /spreadsheets|every day|want more time/)
})
test('primary problem remains the focus when the desired benefit differs', () => {
  assert.equal(getAssessmentResult([0,0,0,3]).title, 'A clearer follow-up workflow.')
  assert.equal(getAssessmentResult([3,0,0,1]).title, 'Company knowledge the team can use.')
})
test('incomplete and invalid responses cannot produce a result', () => {
  for (const a of [[], [-1,0,0,0], [5,0,0,0], [1,6,0,0], [1,0,5,0], [1,0,0,6], [1,0,0,0.5]]) assert.throws(() => getAssessmentResult(a))
  assert.equal(questions.length, 4)
})

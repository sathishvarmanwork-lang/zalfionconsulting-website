import { ImmersiveWorkflow } from './immersive-workflow'

export function AssessmentVisual({ answers, result }: { answers: number[], result: boolean }) {
  const count = answers.filter(answer => answer >= 0).length
  const routes = [
    ['Enquiries', 'Next actions', 'Follow-ups'],
    ['Records', 'Repeat task', 'Team review'],
    ['Information', 'Shared view', 'Updates'],
    ['Procedures', 'Search', 'Source material'],
    ['Recurring task', 'Map the steps', 'First improvement']
  ]
  const route = [...(routes[answers[0]] ?? routes[4])]
  if (answers[0] === 1 && answers[1] === 0 && answers[2] === 0) route[1] = 'Daily report'
  if (answers[1] === 3) route[0] = 'Digitise records'
  return <ImmersiveWorkflow compact label={result?'Your suggested workflow':`Your starting point · ${count} of 4`} config={result?{
    title:'Your suggested workflow', sources:route, rows:route.map(item=>[item,'']), mode:'route'
  }:{
    title:'Your AI 2nd Brain brief', sources:['Your challenge','Your tools','Your rhythm','Your goal'], rows:[['Challenge','Choose a starting priority.'],['Context','Connect the relevant information.'],['Outcome','Focus on a business benefit.']], mode:'blueprint',completed:count
  }} />
}

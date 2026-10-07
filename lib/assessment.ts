export const questions = [
  { title: 'Which business challenge should your AI 2nd Brain help with?', options: ['Leads and follow-ups get missed.', 'Repetitive admin takes too much time.', 'Information is scattered across tools.', 'The team relies on me for answers.', 'I’m not sure where to start.'] },
  { title: 'Where does this work mainly happen today?', options: ['Spreadsheets.', 'Email or messaging apps.', 'Business software.', 'Paper or manual records.', 'A mix of places.', 'I’m not sure.'] },
  { title: 'How often does this slow your team down?', options: ['Every day.', 'A few times a week.', 'A few times a month.', 'It varies.', 'I’m not sure.'] },
  { title: 'What business outcome matters most to you?', options: ['Have more time for customers.', 'Follow up more consistently.', 'Make faster decisions.', 'Help the team work independently.', 'Reduce mistakes and repeated work.', 'I’m not sure yet.'] }
]
const directions = [
  { title: 'A clearer follow-up workflow.', solution: 'An AI 2nd Brain for sales follow-ups that brings enquiries together and tracks the next action so your team can keep sales conversations moving.', steps: ['Bring enquiries into one place.', 'Organise the next action for each lead.', 'Prompt the team when a follow-up is due.'] },
  { title: 'Less manual work in a recurring task.', solution: 'An AI 2nd Brain for routine operations that organises incoming records, automates a repeat step, and flags items for review so your team spends less time on manual admin.', steps: ['Organise incoming records.', 'Automate a repeat step such as a report.', 'Flag items for your team to review.'] },
  { title: 'A shared view of business information.', solution: 'An AI 2nd Brain that brings relevant business information into a shared view so your team can find updates and make informed operational decisions.', steps: ['Bring relevant information together.', 'Organise it around your team’s needs.', 'Make updates easier to find.'] },
  { title: 'Company knowledge the team can use.', solution: 'An AI 2nd Brain that helps your team find company procedures and their source material so everyday work can move forward without always waiting for the owner.', steps: ['Organise company information and procedures.', 'Make that knowledge easy to search.', 'Link answers to relevant source material.'] },
  { title: 'Find one workflow worth improving.', solution: 'Scope an AI 2nd Brain around one recurring task. Map the handoffs and delays, then identify where connected knowledge or automation could help revenue or operations.', steps: ['Choose a recurring task to explore.', 'Map the steps and where work gets delayed.', 'Discuss a practical first improvement.'] }
]
export function getAssessmentResult(answers: number[]) {
  if (answers.length !== 4 || answers.some((a, i) => !Number.isInteger(a) || a < 0 || a >= questions[i].options.length)) throw new Error('Complete all four questions first.')
  const [problem, tools, frequency, goal] = answers
  const result = { ...directions[problem], steps: [...directions[problem].steps] }
  const problems = ['You want to keep leads and follow-ups moving.', 'You spend time on repetitive admin.', 'Your business information is scattered.', 'Your team relies on you for answers.', 'You are still exploring where to start.']
  const toolsCopy = ['This work mainly happens in spreadsheets.', 'This work mainly happens in email or messaging apps.', 'This work mainly happens in business software.', 'This work relies on paper or manual records.', 'This work happens across a mix of places.', 'We can explore which tools and information are involved on the call.']
  const frequencyCopy = ['The problem affects your team every day.', 'The problem affects your team a few times a week.', 'The problem affects your team a few times a month.', 'How often it affects your team varies.', 'We can explore how frequently it affects your team.']
  const goals = ['You want more time for customers.', 'You want more consistent follow-ups.', 'You want to make faster decisions.', 'You want the team to work more independently.', 'You want fewer mistakes and less repeated work.', 'The call can help clarify the benefit that matters most to you.']
  let why = [problems[problem], toolsCopy[tools], frequencyCopy[frequency], goals[goal]].join(' ')
  if (problem === 1 && tools === 0 && frequency === 0) {
    result.title = 'Routine reporting, with less manual work.'
    result.solution = 'An AI 2nd Brain for reporting that brings spreadsheet information into one daily summary so your team spends less time preparing reports and more time acting on them.'
    result.steps = ['Bring the relevant records together.', 'Prepare a daily report automatically.', 'Flag items for your team to review.']
    if (goal === 0) why = 'You spend time on admin every day, use spreadsheets, and want more time for customers.'
  }
  if (tools === 3) result.steps[0] = 'Organise or digitise the relevant manual records.'
  const context = `Suggested AI 2nd Brain application: ${result.title}\n${questions.map((q, i) => `${q.title} ${q.options[answers[i]]}`).join('\n')}`
  return { ...result, why, context }
}

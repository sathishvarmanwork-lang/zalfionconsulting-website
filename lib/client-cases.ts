export const clientCases = [
 {id:'treoo',name:'TREOO Group',kind:'logo',category:'Sales and product reporting',value:'S$200k to S$300k',estimated:true,solution:'Sales and product reports now run automatically through the AI 2nd Brain.',benefit:'Less reporting. Faster decisions. More sales.'},
 {id:'strengths-school',name:'Strengths School',kind:'logo',category:'Workshop operations',value:'S$150k',estimated:true,solution:'Reports, workshop updates and client information now sit in one system.',benefit:'Less admin. More workshops delivered. More revenue.'},
 {id:'gourmet-factor',name:'The Gourmet Factor',kind:'logo',category:'Business reporting',value:'S$200k',estimated:true,solution:'HR, payroll, sales and finance now flow into one daily dashboard.',benefit:'One view of the business. Faster action. Less money lost.'},
 {id:'money-maverick',name:'Money Maverick',kind:'logo',category:'Client administration',value:'S$48k',estimated:false,solution:'Client forms and contract renewals now run through one simple system.',benefit:'Less chasing. More renewals. More money kept.'},
 {id:'sean-lim',name:'Sean Lim Fitness',kind:'portrait',category:'Fitness business operations',value:'S$40k to S$60k',estimated:true,solution:'Client records, fitness data and content now sit in one system.',benefit:'Less searching. More clients served. More revenue.'},
 {id:'pocket-creative',name:'Pocket Creative',kind:'logo',category:'Creative team workflows',value:'S$100k to S$200k',estimated:true,solution:'The team serving property agents now finds company information and finishes work without waiting for one person.',benefit:'Less delay. Faster content. More property agents served.'},
 {id:'alvin-foo',name:'Alvin Foo',kind:'portrait',category:'Document automation',value:'S$60k',estimated:false,solution:'Client documents now move from WhatsApp into the right systems automatically.',benefit:'Less copying. Faster work. More clients handled.'},
 {id:'jason-chuang',name:'Jason Chuang',kind:'portrait',category:'Client relationship management',value:'S$150k',estimated:true,solution:'Client follow-ups, policy work and management tasks are organised across about 700 client relationships.',benefit:'Fewer missed follow-ups. More client reviews. More revenue.'},
 {id:'confidential-accounting',name:'Confidential accounting client',kind:'private',category:'Accounting workflows',value:'S$100k',estimated:true,solution:'Documents, client questions and repeat accounting work are handled faster. The client’s identity is protected.',benefit:'Less admin. More paid work completed.'},
 {id:'ben-chew',name:'Ben Chew',kind:'portrait',category:'Property team workflows',value:'S$100k',estimated:true,solution:'WhatsApp leads, appointments and follow-ups are organised across a team of three assistants.',benefit:'Fewer forgotten leads. More property deals closed.'}
] as const

// Updated assets use new URLs to avoid retaining older optimised images.
export function clientImage(id: string) {
 if (id === 'strengths-school' || id === 'pocket-creative') return `/images/clients/${id}-supplied.png`
 if (id === 'treoo') return '/images/clients/treoo-verified.webp'
 if (id === 'gourmet-factor') return '/images/clients/gourmet-factor-verified.webp'
 return `/images/clients/${id}.webp`
}

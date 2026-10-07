import content from '@/lib/content.json'
import faqs from '@/lib/faqs.json'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Arrow, BookingLink, Eyebrow, Portrait, SectionCall, SectionHeading } from '@/components/ui'
import { CaseExplorer } from '@/components/case-explorer'
import { DepthPanel } from '@/components/depth-panel'
import { PortraitMotion } from '@/components/portrait-motion'
import { SolutionExplorer } from '@/components/solution-explorer'
import { ProcessExperience } from '@/components/process-experience'
import { ClientLogos } from '@/components/client-logos'
import { HeroBrain } from '@/components/hero-brain'
import { Journey } from '@/components/journey'
export default function Home() {
  return <><a className="skip-link" href="#main">Skip to content</a><div id="top" /><Header /><main id="main">
    <HeroBrain />
    <ClientLogos />
    <section id="team" className="section shell" aria-labelledby="about-title"><Eyebrow>About Zalfion</Eyebrow><div className="section-heading"><h2 id="about-title">The team behind<br />your AI 2nd Brain.</h2><div><p className="section-intro">We are an AI 2nd Brain company. Meet the directors, relationship managers, AI engineers, and media team behind Zalfion.</p><a className="section-next" href="/about-us">About Zalfion <Arrow direction="right" /></a></div></div></section>
    <section id="case-studies" className="section shell" aria-labelledby="cases-title"><SectionHeading number="02" label="Case Studies" title={<span id="cases-title">AI 2nd Brains.<br />Real business applications.</span>}>See the work behind the AI 2nd Brain offer. These projects connect business information to sales reporting, daily operations, and client renewals.</SectionHeading>
      <CaseExplorer />
      <SectionCall>Where could an AI 2nd Brain help your business?</SectionCall>
    </section>
    <section id="solutions" className="section shell" aria-labelledby="solutions-title"><SectionHeading number="03" label="Your AI 2nd Brain at work" title={<span id="solutions-title">Built for revenue.<br />Built for operations.</span>}>Your AI 2nd Brain connects your company’s knowledge, tools, and workflows. From following up with leads to preparing reports, we build it around the work that moves your business forward.</SectionHeading>
      <SolutionExplorer /><SectionCall>What would you put your AI 2nd Brain to work on?</SectionCall>
    </section>
    <section id="how-it-works" className="section muted" aria-labelledby="process-title"><div className="shell"><SectionHeading number="04" label="How It Works" title={<span id="process-title">Your AI 2nd Brain.<br />From scope to deployment.</span>}>We scope, build, and deploy your AI 2nd Brain around a clear business priority, then refine it with your team.</SectionHeading><ProcessExperience /><SectionCall>Let’s scope your AI 2nd Brain.</SectionCall></div></section>
    <section id="partners" className="section muted" aria-labelledby="partners-title"><div className="shell"><SectionHeading number="05" label="Partners" title={<span id="partners-title">Specialist expertise.<br />For your AI 2nd Brain.</span>}>Your AI 2nd Brain needs to fit the way your business works. Our partner network brings experience in enterprise systems, software engineering, and healthcare platforms to inform that work.</SectionHeading><div className="partner-grid">{content.partners.map(([key, company, name, role, category, body]) => <DepthPanel key={key} className="partner"><div className="partner-person"><Portrait name={key === 'orion' ? 'Shervin' : name} /><div><p>{name}</p><span>{role}</span></div></div><Eyebrow>{category}</Eyebrow><h3>{company}</h3><p>{body}</p></DepthPanel>)}</div><a className="section-next" href="#assessment">Find where an AI 2nd Brain could help <Arrow direction="down" /></a></div></section>
    <Journey faqs={faqs} /><PortraitMotion />
  </main><Footer /></>
}

import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Arrow, Eyebrow } from '@/components/ui'
import { industries } from '@/lib/industries'
import { clientCases } from '@/lib/client-cases'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Industries | Zalfion Consulting',
  description: 'Explore practical AI 2nd Brain applications across food and beverage, ecommerce, corporate training, accounting, marketing, banking, finance, gyms and construction.'
}

export default function Industries() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a><div id="top" />
    <Header page="industries" />
    <main id="main" className={styles.page}>
      <section className={`shell ${styles.hero}`} aria-labelledby="industries-heading">
        <div><Eyebrow>Industries</Eyebrow><h1 id="industries-heading">Your industry.<br />Your AI 2nd Brain.</h1></div>
        <div className={styles.intro}><p>Different businesses. Different daily challenges. We build around the knowledge, tools and workflows that matter to yours.</p><p>Explore potential applications below. We’ll scope the right starting point with your team.</p></div>
      </section>
      <nav className={`shell ${styles.index}`} aria-label="Explore industries">{industries.map(industry => <a key={industry.id} href={`#${industry.id}`}>{industry.name}<Arrow direction="down" /></a>)}</nav>
      <div>{industries.map(industry => {
        const example = 'caseId' in industry ? clientCases.find(client => client.id === industry.caseId) : undefined
        return <section key={industry.id} id={industry.id} className={styles.industry} aria-labelledby={`${industry.id}-heading`}>
          <div className={`shell ${styles.industryInner}`}>
            <div className={styles.sector}><Eyebrow>{industry.name}</Eyebrow><h2 id={`${industry.id}-heading`}>{industry.headline}</h2><p>{industry.challenge}</p><a className={styles.link} href="/#book-a-call">Let’s talk about your business <Arrow /></a></div>
            <div className={styles.detail}><h3>Where an AI 2nd Brain could help</h3><ul>{industry.applications.map(application => <li key={application}>{application}</li>)}</ul>
              {example && <aside className={styles.example} aria-label={`Related work: ${example.name}`}><Eyebrow>Related client work</Eyebrow><h3>{example.name}</h3><p>{example.solution}</p><a className={styles.link} href={`/?case=${example.id}#case-studies`}>Explore the case study <Arrow direction="right" /></a></aside>}
            </div>
          </div>
        </section>
      })}</div>
      <section className={`shell ${styles.closing}`} aria-labelledby="industry-call"><div><Eyebrow>Start with your business</Eyebrow><h2 id="industry-call">What would you put your<br />AI 2nd Brain to work on?</h2><p>Let’s find a starting point around a clear business priority.</p></div><a className="button" href="/#book-a-call">Book a discovery call <Arrow /></a></section>
    </main>
    <Footer />
  </>
}

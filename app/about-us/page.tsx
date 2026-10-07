import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Arrow, Eyebrow, Portrait } from '@/components/ui'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'About Us | Zalfion Consulting',
  description: 'Meet the leadership, relationship managers, AI engineers and media team behind Zalfion Consulting and your AI 2nd Brain.'
}

const groups = [
  { title: 'Relationship managers', people: ['Alvin', 'Syahmi', 'Dylon'] },
  { title: 'AI engineers', people: ['Sky', 'Thien', 'Mithun'] },
  { title: 'Media', people: ['Vince'] }
]

export default function AboutUs() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top" />
    <Header page="about" />
    <main id="main" className={styles.page}>
      <section className={`shell ${styles.intro}`} aria-labelledby="about-heading">
        <div><Eyebrow>About us</Eyebrow><h1 id="about-heading">The team behind<br />your AI 2nd Brain.</h1></div>
        <div className={styles.introCopy}><p>We are an AI 2nd Brain company. Meet the directors, relationship managers, AI engineers, and media team behind Zalfion.</p><p>We build and deploy AI 2nd Brains for revenue and operations. Connect your company knowledge, tools, and workflows with Zalfion Consulting.</p><a className={styles.textLink} href="#leadership">Meet the team <Arrow direction="down" /></a></div>
      </section>
      <section className={styles.mission} aria-labelledby="mission-heading"><div className={`shell ${styles.missionInner}`}><h2 id="mission-heading">Our mission</h2><p>Building toward <span>$1B+</span> in measurable economic value for our partners through applied AI.</p></div></section>
      <section id="leadership" className={`shell ${styles.leadership}`} aria-labelledby="leadership-heading">
        <div><Eyebrow>Our team</Eyebrow><h2 id="leadership-heading">Leadership</h2></div>
        <div className={styles.leaders}>{[['Simon', 'Founder and Director'], ['Erdem', 'Director']].map(([name, role]) => <article key={name}><Portrait name={name} large /><h3>{name}</h3><p>{role}</p></article>)}</div>
      </section>
      <div className={`shell ${styles.groups}`}>{groups.map((group, i) => <section key={group.title} className={styles.group} aria-labelledby={`group-${i}`}><h2 id={`group-${i}`}>{group.title}</h2><div className={styles.people}>{group.people.map(name => <article key={name}><Portrait name={name} /><h3>{name}</h3>{name === 'Vince' && <p>Media Director</p>}</article>)}</div></section>)}</div>
      <section className={`shell ${styles.closing}`} aria-labelledby="call-heading"><div><Eyebrow>Let’s talk</Eyebrow><h2 id="call-heading">Let’s talk about<br />your AI 2nd Brain.</h2></div><a className="button" href="/#book-a-call">Book a discovery call <Arrow /></a></section>
    </main>
    <Footer />
  </>
}

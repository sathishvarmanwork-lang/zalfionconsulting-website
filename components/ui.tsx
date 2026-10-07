import type { ReactNode } from 'react'
import { PortraitFrame } from './portrait-frame'
export function Arrow({ direction = 'up' }: { direction?: 'up' | 'down' | 'right' }) {
  return <span aria-hidden="true" className="arrow">{direction === 'down' ? '↓' : direction === 'right' ? '→' : '↗'}</span>
}
export function BookingLink({ children = 'Book a discovery call', className = '' }: { children?: ReactNode, className?: string }) {
  return <a className={`button ${className}`} href="#book-a-call">{children}<Arrow /></a>
}
export function Eyebrow({ children }: { children: ReactNode }) { return <p className="eyebrow">{children}</p> }
export function SectionHeading({ number, label, title, children }: { number: string, label: string, title: ReactNode, children?: ReactNode }) {
  return <><Eyebrow>{label}</Eyebrow><div className="section-heading"><h2>{title}</h2>{children && <p className="section-intro">{children}</p>}</div></>
}
export function SectionCall({ children }: { children: ReactNode }) {
  return <div className="section-call"><p>{children}</p><BookingLink /></div>
}
export function Portrait({ name, large = false }: { name: string, large?: boolean }) {
  const available = ['Simon', 'Erdem', 'Syahmi', 'Dylon', 'Sky', 'Thien', 'Vince', 'Shervin']
  return <PortraitFrame large={large}>{available.includes(name) ? <img className={`portrait ${large ? 'portrait-large' : ''}`} src={`/images/${name.toLowerCase()}.webp`} width={large ? 240 : 86} height={large ? 296 : 106} alt={name} loading="lazy" /> : <div className={`portrait initials ${large ? 'portrait-large' : ''}`} aria-label={`${name}, portrait unavailable`}>{name.split(' ').map(x => x[0]).join('')}</div>}</PortraitFrame>
}

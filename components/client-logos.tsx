import Image from 'next/image'
import { clientCases, clientImage } from '@/lib/client-cases'
import styles from './client-evidence.module.css'
export function ClientLogos() {
 const clients=clientCases.filter(client=>client.kind!=='private')
 return <section className={`${styles.strip} shell`} aria-labelledby="client-strip-title">
  <h2 id="client-strip-title">Businesses we have worked with</h2>
  <div className={styles.marquee} tabIndex={0} aria-label="Client logos">
   <div className={styles.track}>{[0,1].map(copy=><ul className={styles.logos} key={copy} aria-hidden={copy===1?true:undefined}>{clients.map(client=><li key={client.id}>
    {client.kind==='logo'?<Image className={`${styles.marqueeLogo} ${(client.id==='strengths-school'||client.id==='pocket-creative')?styles.suppliedLogo:client.id==='gourmet-factor'?styles.gourmetLogo:''}`} src={clientImage(client.id)} alt={copy===0?`${client.name} logo`:''} width={200} height={90}/>:<><span className={styles.avatar}><Image src={clientImage(client.id)} alt="" width={84} height={84}/></span><span className={styles.clientName}>{client.name}</span></>}
   </li>)}</ul>)}</div>
  </div>
 </section>
}

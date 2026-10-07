
import { WorkspaceScene, type WorkspaceConfig } from './workspace-scene'
import styles from './workspace-scene.module.css'

export function ImmersiveWorkflow({ config, label, compact=false, mobileProcess=false }: { config:WorkspaceConfig, label:string, compact?:boolean, replay?:boolean, mobileProcess?:boolean }) {
  return <div className={`${styles.workflow} ${mobileProcess ? styles.processMobile : ''}`}>
    <p className={styles.sceneLabel}>{label}</p>
    <WorkspaceScene config={config} paused={false} compact={compact}/>
  </div>
}

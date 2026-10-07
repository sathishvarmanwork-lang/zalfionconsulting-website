'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './brain-explainer.module.css'
import { softwareRenderer } from './brain-software-renderer'

export type BrainAnchor = { x: number, y: number, depth: number }
type Props = { selected: number, paused: boolean, fallback: ReactNode, activation?: number,
  locked?: boolean, onAnchors?: (anchors: BrainAnchor[]) => void }

export function BrainScene({ selected, paused, fallback, activation = 0, locked = false, onAnchors }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const options = useRef({ selected, paused, activation, locked, onAnchors })
  const [ready, setReady] = useState(false)
  useEffect(() => { options.current = { selected, paused, activation, locked, onAnchors } }, [selected, paused, activation, locked, onAnchors])
  useEffect(() => {
    const element = host.current
    if (!element) return
    let cancelled = false
    let dispose: (() => void) | undefined
    const load = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return
      load.disconnect()
      void Promise.all([import('three'), fetch('/models/brain-network.json').then(response => {
        if (!response.ok) throw new Error('Brain geometry unavailable')
        return response.json() as Promise<number[][]>
      })]).then(([T, cloud]) => {
        if (cancelled) return
        let renderer: InstanceType<typeof T.WebGLRenderer> | ReturnType<typeof softwareRenderer>
        try {
          const canvas=document.createElement('canvas')
          const context=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'})
          renderer=context?new T.WebGLRenderer({canvas,context,alpha:true,antialias:true}):softwareRenderer(T)
        }
        catch { renderer = softwareRenderer(T) }
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75))
        renderer.setClearColor(0xffffff, 0)
        renderer.outputColorSpace = T.SRGBColorSpace
        element.appendChild(renderer.domElement)
        const scene = new T.Scene()
        const camera = new T.PerspectiveCamera(36, 1, .1, 30)
        camera.position.set(0, .35, 6.6)
        camera.lookAt(0, -.05, 0)
        const brain = new T.Group()
        brain.rotation.set(.12,-.38,0)
        scene.add(brain)
        scene.add(new T.HemisphereLight(0xffffff, 0xb2a68a, 2.8))
        const light = new T.DirectionalLight(0xffedbd, 3)
        light.position.set(-3, 4, 5)
        scene.add(light)
        const fill = new T.DirectionalLight(0xffffff, 2)
        fill.position.set(4, 1, -3)
        scene.add(fill)
        const resources: { dispose: () => void }[] = []
        const keep = <V extends { dispose: () => void }>(v: V): V => { resources.push(v); return v }
        const gold = new T.Color('#ba851a'), charcoal = new T.Color('#485253')
        const materials = [0,1,2].map(i => keep(new T.LineBasicMaterial({color:i===selected?gold:charcoal,transparent:true,opacity:i===selected?.18:.075})))
        const pointMaterials = [0,1,2].map(i => keep(new T.PointsMaterial({color:i===selected?gold:charcoal,size:i===selected?.025:.020,transparent:true,opacity:i===selected?.85:.48,sizeAttenuation:true})))
        // Points sampled from a licensed anatomical atlas retain both hemispheres,
        // the central fissure and the brainstem without rounded outer shells.
        const nodes = cloud.map(([x,y,z]) => ({
          v: new T.Vector3(x,y,z), region: x > .35 ? 0 : y < -.15 ? 1 : 2
        }))
        // Round particles stay crisp at different pixel densities.
        const sprite=document.createElement('canvas');sprite.width=32;sprite.height=32
        const ink=sprite.getContext('2d')!
        ink.fillStyle='white';ink.beginPath();ink.arc(16,16,13,0,Math.PI*2);ink.fill()
        const texture=keep(new T.CanvasTexture(sprite))
        pointMaterials.forEach(material=>{material.map=texture;material.alphaTest=.1;material.depthWrite=false})
        const adjacency: number[][] = nodes.map(() => [])
        for(let region=0;region<3;region++) {
          const coords:number[]=[], lines:number[]=[]
          nodes.forEach((node,i)=>{
            if(node.region!==region)return
            coords.push(...node.v.toArray())
            const nearby=nodes.map((n,j)=>({n,j,d:node.v.distanceTo(n.v)})).filter(x=>x.j>i&&x.d<.29).sort((a,b)=>a.d-b.d).slice(0,2)
            nearby.forEach(({n,j})=>{
              lines.push(...node.v.toArray(),...n.v.toArray())
              adjacency[i].push(j); adjacency[j].push(i)
            })
          })
          brain.add(new T.Points(keep(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(coords,3))),pointMaterials[region]))
          brain.add(new T.LineSegments(keep(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(lines,3))),materials[region]))
        }
        // Signals walk the actual edge graph, continuing at each junction.
        const starts = nodes.map((_,i)=>i).filter(i=>adjacency[i].length)
        const anchors = [new T.Vector3(.85,.5,.7),new T.Vector3(-.65,-.5,.65),new T.Vector3(-.7,.65,.5)].map((target,region)=>
          starts.filter(i=>nodes[i].region===region).sort((a,b)=>nodes[a].v.distanceToSquared(target)-nodes[b].v.distanceToSquared(target))[0] ?? starts[0])
        const haloCanvas=document.createElement('canvas');haloCanvas.width=64;haloCanvas.height=64
        const haloInk=haloCanvas.getContext('2d')!
        const glow=haloInk.createRadialGradient(32,32,0,32,32,32)
        glow.addColorStop(0,'rgba(255,255,240,1)');glow.addColorStop(.15,'rgba(255,210,95,1)');glow.addColorStop(.4,'rgba(229,163,37,.55)');glow.addColorStop(1,'rgba(229,163,37,0)')
        haloInk.fillStyle=glow;haloInk.fillRect(0,0,64,64)
        const haloTexture=keep(new T.CanvasTexture(haloCanvas))
        const haloMaterial=keep(new T.SpriteMaterial({map:haloTexture,transparent:true,depthWrite:false,depthTest:false}))
        const signals=Array.from({length:16},(_,i)=>{
          const from=starts[(i*47)%starts.length]
          const glow=new T.Sprite(haloMaterial);glow.scale.setScalar(.13);brain.add(glow)
          return {glow,from,to:adjacency[from][0],previous:-1,t:i/16,speed:.65+(i%4)*.15}
        })
        const burst=new T.Sprite(haloMaterial);burst.scale.setScalar(.24);burst.visible=false;brain.add(burst)
        const routeMaterial=keep(new T.LineBasicMaterial({color:0xe5a325,transparent:true,opacity:.8,depthTest:false}))
        const routeGeometry=keep(new T.BufferGeometry())
        const routeLine=new T.Line(routeGeometry,routeMaterial);routeLine.visible=false;brain.add(routeLine)
        let route:number[]=[], burstTime=2
        function startBurst(region:number){
          route=[anchors[region]]
          for(let i=0;i<8;i++){
            const options=adjacency[route[route.length-1]]
            const fresh=options.filter(n=>!route.includes(n))
            const forward=options.filter(n=>n!==route[route.length-2])
            route.push((fresh.length?fresh:forward.length?forward:options)[i%(fresh.length||forward.length||options.length)])
          }
          routeGeometry.setFromPoints(route.map(i=>nodes[i].v))
          routeGeometry.setDrawRange(0,1);burstTime=0
        }
        const media=matchMedia('(prefers-reduced-motion: reduce)')
        let reduced=media.matches, dragging=false, pointerId=-1, lastX=0, lastY=0, dragY=0, dragX=0, pointerX=0, pointerY=0
        let elapsed=0, lastTime=0, lastSelected=-1, lastActivation=0, selectionPulse=0, visible=true, spin=0, manualUntil=0
        const onMotion=()=>{reduced=media.matches}
        media.addEventListener('change',onMotion)
        const resize=()=>{const w=element.clientWidth,h=element.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}
        const ro=new ResizeObserver(resize);ro.observe(element);resize()
        const down=(e:PointerEvent)=>{manualUntil=performance.now()+3000;dragging=true;pointerId=e.pointerId;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)}
        const move=(e:PointerEvent)=>{
          if(dragging){manualUntil=performance.now()+3000;dragY+=(e.clientX-lastX)*.009;dragX=Math.max(-.55,Math.min(.55,dragX+(e.clientY-lastY)*.006));lastX=e.clientX;lastY=e.clientY}
          else if(e.pointerType==='mouse'){const r=element.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width-.5;pointerY=(e.clientY-r.top)/r.height-.5}
        }
        const up=()=>{manualUntil=performance.now()+3000;dragging=false;pointerId=-1}
        const leave=()=>{pointerX=0;pointerY=0}
        const key=(e:KeyboardEvent)=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)){e.preventDefault();manualUntil=performance.now()+3000;if(e.key==='Home'){dragX=0;dragY=0;spin=0}else if(e.key==='ArrowLeft')dragY-=.18;else if(e.key==='ArrowRight')dragY+=.18;else if(e.key==='ArrowUp')dragX=Math.max(-.55,dragX-.12);else dragX=Math.min(.55,dragX+.12)}}
        element.addEventListener('keydown',key)
        renderer.domElement.addEventListener('pointerdown',down)
        renderer.domElement.addEventListener('pointermove',move)
        renderer.domElement.addEventListener('pointerup',up)
        renderer.domElement.addEventListener('pointercancel',up)
        renderer.domElement.addEventListener('pointerleave',leave)
        const lost=(e:Event)=>{e.preventDefault();setReady(false);renderer.setAnimationLoop(null)}
        renderer.domElement.addEventListener('webglcontextlost',lost)
        let firstFrame=true
        function frame(time:number){
          if(!visible||document.hidden){lastTime=time;return}
          const dt=Math.min((time-lastTime)/1000,.05);lastTime=time
          const {selected,paused,activation,locked,onAnchors}=options.current
          if(!paused&&!reduced)elapsed+=dt
          if(selected!==lastSelected){selectionPulse=1;lastSelected=selected}
          if(activation!==lastActivation){startBurst(selected);lastActivation=activation;selectionPulse=1}
          const automatic=!paused&&!reduced&&!locked&&!dragging&&time>manualUntil
          if(automatic)spin+=dt*.09
          selectionPulse=Math.max(0,selectionPulse-dt*1.6)
          const emphasis=!paused&&!reduced?Math.sin(selectionPulse*Math.PI):0
          const targetY=-.38+spin+dragY+(!paused&&!reduced&&!locked?pointerX*.35:0)
          const targetX=.12+dragX+(!paused&&!reduced?pointerY*.25:0)
          const smooth=reduced?1:1-Math.exp(-dt*5)
          brain.rotation.y+=(targetY-brain.rotation.y)*smooth
          brain.rotation.x+=(targetX-brain.rotation.x)*smooth
          brain.position.y=!paused&&!reduced?Math.sin(elapsed*.65)*.035:brain.position.y
          for(let i=0;i<3;i++){
            materials[i].color.lerp(i===selected?gold:charcoal,smooth)
            materials[i].opacity=i===selected?.18+emphasis*.08:.075
            pointMaterials[i].color.lerp(i===selected?gold:charcoal,smooth)
            pointMaterials[i].size=i===selected?.025+emphasis*.009:.020
            pointMaterials[i].opacity=i===selected?.85:.48
          }
          signals.forEach(signal=>{
            if(!paused&&!reduced){
              signal.t+=dt*signal.speed
              if(signal.t>=1){
                signal.t-=1;signal.previous=signal.from;signal.from=signal.to
                const next=adjacency[signal.from].filter(n=>n!==signal.previous)
                signal.to=next.length?next[Math.floor(Math.random()*next.length)]:signal.previous
              }
            }
            signal.glow.position.copy(nodes[signal.from].v).lerp(nodes[signal.to].v,signal.t)
            signal.glow.visible=!reduced
          })
          if(!paused&&!reduced)burstTime+=dt
          const travelling=burstTime<1.5&&!reduced
          burst.visible=travelling;routeLine.visible=travelling
          if(travelling&&route.length){
            const progress=Math.min(burstTime/1.5*(route.length-1),route.length-1-.0001)
            const step=Math.floor(progress)
            burst.position.copy(nodes[route[step]].v).lerp(nodes[route[step+1]].v,progress-step)
            routeGeometry.setDrawRange(0,step+2)
            routeMaterial.opacity=.7*(1-burstTime/2)
          }
          brain.updateMatrixWorld(true);camera.updateMatrixWorld(true)
          onAnchors?.(anchors.map(i=>{
            const world=nodes[i].v.clone().applyMatrix4(brain.matrixWorld)
            const depth=world.z, p=world.project(camera)
            return {x:(p.x+1)/2,y:(1-p.y)/2,depth}
          }))
          renderer.render(scene,camera)
          if(firstFrame){firstFrame=false;setReady(true)}
        }
        const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;renderer.setAnimationLoop(visible?frame:null)},{rootMargin:'80px'})
        visibility.observe(element)
        renderer.setAnimationLoop(frame)
        dispose=()=>{
          visibility.disconnect();ro.disconnect();media.removeEventListener('change',onMotion)
          element.removeEventListener('keydown',key)
          if(pointerId>=0&&renderer.domElement.hasPointerCapture(pointerId))renderer.domElement.releasePointerCapture(pointerId)
          renderer.domElement.removeEventListener('webglcontextlost',lost)
          renderer.setAnimationLoop(null);resources.forEach(r=>r.dispose());renderer.dispose();renderer.domElement.remove()
        }
      }).catch(()=>{if(!cancelled)setReady(false)})
    },{rootMargin:'250px'})
    load.observe(element)
    return()=>{cancelled=true;load.disconnect();dispose?.()}
  },[])
  return <div className={styles.scene}>
    <div ref={host} className={styles.canvas} role="img" aria-hidden={!ready} aria-label="Interactive 3D brain. Drag to rotate, or use arrow keys. Home resets the view." tabIndex={ready?0:-1} style={{opacity:ready?1:0}} />
    <div className={styles.fallback} aria-hidden={ready} style={{opacity:ready?0:1}}>{fallback}</div>
  </div>
}

'use client'

import { useEffect, useRef, useState } from 'react'
import type * as Three from 'three'
import styles from './workspace-scene.module.css'

export type WorkspaceConfig = {
  title: string
  sources: string[]
  rows: [string, string][]
  mode?: 'connected' | 'scope' | 'build' | 'improve' | 'case' | 'blueprint' | 'route'
  completed?: number
}
const heroConfig: WorkspaceConfig = {
  title: 'Your daily business view.', sources: ['Sales records','Stock updates','Team messages'],
  rows: [['Sales','Your latest sales, summarised.'],['Stock','Changes worth a closer look.'],['Next steps','Follow-ups that need your team.']]
}

function panelTexture(title: string, dashboard = false, rows: [string,string][] = heroConfig.rows, status = 'CONNECTED INPUT') {
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=dashboard?660:380
  const c=canvas.getContext('2d')!
  c.fillStyle='#fffefa';c.fillRect(0,0,canvas.width,canvas.height)
  c.strokeStyle='#ded8c8';c.lineWidth=3;c.strokeRect(2,2,canvas.width-4,canvas.height-4)
  c.fillStyle='#947019';c.font='500 23px sans-serif';c.fillText(dashboard?'Z / AI 2ND BRAIN':status,42,56)
  c.fillStyle='#20262a';c.font=`500 ${dashboard?49:53}px sans-serif`;let size=dashboard?49:53;while(c.measureText(title).width>680&&size>24){size-=1;c.font=`500 ${size}px sans-serif`}c.fillText(title,42,dashboard?137:143)
  if(dashboard){
    c.fillStyle='#656b70';c.font='25px sans-serif';c.fillText('The essentials. All together.',42,186)
    rows.forEach(([name,body],i)=>{const y=245+i*105;c.strokeStyle='#e5e0d5';c.beginPath();c.moveTo(42,y);c.lineTo(726,y);c.stroke();c.fillStyle='#bb8d20';c.fillRect(43,y+23,6,42);c.fillStyle='#252a2b';c.font='500 28px sans-serif';c.fillText(name,72,y+41);c.fillStyle='#626970';c.font='23px sans-serif';c.fillText(body,72,y+78)})
    c.fillStyle='#8f6a15';c.font='22px sans-serif';c.fillText('Built around your business',42,618)
  }else{
    c.fillStyle='#dad5c9';[.9,.66,.78].forEach((length,i)=>c.fillRect(42,207+i*36,620*length,9))
    c.fillStyle='#c79829';c.fillRect(42,207,150,9)
  }
  return canvas
}

function softwareWorkspace(T: typeof Three) {
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!
  let w=1,h=1,dpr=1,raf=0,cb:((t:number)=>void)|null=null
  const loop=(t:number)=>{if(cb){cb(t);raf=requestAnimationFrame(loop)}}
  const point=(p:Three.Vector3,c:Three.Camera)=>{const v=p.project(c);return{x:(v.x+1)*w/2,y:(1-v.y)*h/2,z:v.z}}
  function triangle(image:HTMLCanvasElement,src:number[][],dst:{x:number,y:number}[]){
    const [a,b,c]=src,[p,q,r]=dst
    const det=a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1])
    const coeff=(u:number,v:number,z:number)=>[(u*(b[1]-c[1])+v*(c[1]-a[1])+z*(a[1]-b[1]))/det,(u*(c[0]-b[0])+v*(a[0]-c[0])+z*(b[0]-a[0]))/det,(u*(b[0]*c[1]-c[0]*b[1])+v*(c[0]*a[1]-a[0]*c[1])+z*(a[0]*b[1]-b[0]*a[1]))/det]
    const x=coeff(p.x,q.x,r.x),y=coeff(p.y,q.y,r.y)
    ctx.save();ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.lineTo(r.x,r.y);ctx.closePath();ctx.clip();ctx.transform(x[0],y[0],x[1],y[1],x[2],y[2]);ctx.drawImage(image,0,0);ctx.restore()
  }
  return {domElement:canvas,outputColorSpace:'',setPixelRatio(v:number){dpr=v},setClearColor(_c:number,_a:number){},setSize(width:number,height:number){w=width;h=height;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px'},setAnimationLoop(fn:((t:number)=>void)|null){cancelAnimationFrame(raf);cb=fn;if(fn)raf=requestAnimationFrame(loop)},dispose(){cb=null;cancelAnimationFrame(raf)},render(scene:Three.Scene,camera:Three.Camera){
    scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h)
    const panels:Three.Mesh[]=[],lines:Three.Line[]=[],dots:Three.Mesh[]=[]
    scene.traverse(o=>{if(!o.visible)return;if(o instanceof T.Mesh&&o.userData.image)panels.push(o);else if(o instanceof T.Line)lines.push(o);else if(o instanceof T.Mesh&&o.userData.pulse)dots.push(o)})
    lines.forEach(o=>{const mat=o.material as Three.LineBasicMaterial;ctx.globalAlpha=mat.opacity;ctx.strokeStyle=mat.color.getStyle();ctx.lineWidth=1.2;ctx.beginPath();const pos=o.geometry.attributes.position;for(let i=0;i<pos.count;i++){const p=point(new T.Vector3().fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld),camera);if(i)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y)}ctx.stroke()})
    panels.sort((a,b)=>new T.Vector3().setFromMatrixPosition(b.matrixWorld).distanceTo(camera.position)-new T.Vector3().setFromMatrixPosition(a.matrixWorld).distanceTo(camera.position)).forEach(o=>{
      const {width,height,image}=o.userData as {width:number,height:number,image:HTMLCanvasElement}
      const quad=[[-1,1],[1,1],[1,-1],[-1,-1]].map(([x,y])=>point(new T.Vector3(x*width/2,y*height/2,0).applyMatrix4(o.matrixWorld),camera))
      ctx.globalAlpha=(o.material as Three.MeshBasicMaterial).opacity
      ctx.save();ctx.shadowColor='#30271930';ctx.shadowBlur=22;ctx.shadowOffsetY=17;ctx.fillStyle='#d2cbbb';ctx.beginPath();quad.forEach((p,i)=>i?ctx.lineTo(p.x+3,p.y+5):ctx.moveTo(p.x+3,p.y+5));ctx.closePath();ctx.fill();ctx.restore()
      triangle(image,[[0,0],[image.width,0],[image.width,image.height]],[quad[0],quad[1],quad[2]])
      triangle(image,[[0,0],[image.width,image.height],[0,image.height]],[quad[0],quad[2],quad[3]])
    })
    dots.forEach(o=>{const p=point(new T.Vector3().setFromMatrixPosition(o.matrixWorld),camera);ctx.globalAlpha=1;ctx.fillStyle='#cc981d';ctx.shadowBlur=7;ctx.shadowColor='#e4b343';ctx.beginPath();ctx.arc(p.x,p.y,2.4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0});ctx.globalAlpha=1
  }}
}

export function WorkspaceScene({ paused, config = heroConfig, compact = false }: {paused:boolean, config?:WorkspaceConfig, compact?:boolean}) {
  const host=useRef<HTMLDivElement>(null), pause=useRef(paused)
  const [ready,setReady]=useState(false)
  const configKey=JSON.stringify(config)
  useEffect(()=>{pause.current=paused},[paused])
  useEffect(()=>{
    const element=host.current;if(!element)return
    let cancelled=false,cleanup:(()=>void)|undefined
    const settings=JSON.parse(configKey) as WorkspaceConfig
    const mode=settings.mode??'connected'
    setReady(false)
    const start=new IntersectionObserver(entries=>{
    if(!entries.some(e=>e.isIntersecting)||element.clientWidth===0)return
    start.disconnect()
    void import('three').then(T=>{
      if(cancelled)return
      const resources:{dispose:()=>void}[]=[]
      const keep=<V extends {dispose:()=>void}>(v:V):V=>{resources.push(v);return v}
      let renderer:Three.WebGLRenderer|ReturnType<typeof softwareWorkspace>
      try {const canvas=document.createElement('canvas'),context=canvas.getContext('webgl2',{alpha:true,antialias:true});renderer=context?new T.WebGLRenderer({canvas,context,alpha:true,antialias:true}):softwareWorkspace(T)}catch{renderer=softwareWorkspace(T)}
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0xffffff,0);renderer.outputColorSpace=T.SRGBColorSpace;element.appendChild(renderer.domElement)
      const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1,.1,30),group=new T.Group()
      camera.position.set(0,.45,8.4);camera.lookAt(0,.15,0);scene.add(group)
      scene.add(new T.HemisphereLight(0xffffff,0xb9a77e,2.5));const light=new T.DirectionalLight(0xffffff,3);light.position.set(-3,5,4);scene.add(light)
      function panel(title:string,width:number,height:number,dashboard=false,status='CONNECTED INPUT'){
        const image=panelTexture(title,dashboard,settings.rows,status),texture=keep(new T.CanvasTexture(image));texture.colorSpace=T.SRGBColorSpace
        const mesh=new T.Mesh(keep(new T.PlaneGeometry(width,height)),keep(new T.MeshBasicMaterial({map:texture,transparent:true,side:T.DoubleSide})))
        mesh.userData={image,width,height};group.add(mesh)
        const back=new T.Mesh(keep(new T.BoxGeometry(width,height,.065)),keep(new T.MeshStandardMaterial({color:0xe1d9c7,metalness:.2,roughness:.35,transparent:true})));back.position.z=-.038;mesh.add(back)
        return mesh
      }
      const dashboard=panel(settings.title,2.7,2.32,true)
      dashboard.position.set(.25,-.28,.1);dashboard.rotation.set(-.07,-.12,-.035)
      const layered=mode==='build'||mode==='blueprint'
      const route=mode==='route'
      const starts=settings.sources.map((_,i)=>{
        if(layered)return new T.Vector3((i%2?1:-1)*.35,1.25-i*.67,(i-1)*.3)
        if(route)return new T.Vector3(-1.5+i*1.5,(i===1?.3:-.05),i*.14)
        if(mode==='improve'){const angle=i/settings.sources.length*Math.PI*2;return new T.Vector3(Math.cos(angle)*1.65,Math.sin(angle)*1.15+.2,.7)}
        if(mode==='case')return new T.Vector3(i%2?1.2:-1.2,settings.sources.length>2?2-Math.floor(i/2)*.9:1.55,-.1)
        return [new T.Vector3(-1.4,1.65,.1),new T.Vector3(1.5,1.25,-.2),new T.Vector3(-1.6,-.3,.9),new T.Vector3(1.5,-.6,.8)][i%4]
      })
      const cards=settings.sources.map((name,i)=>{
        const status=mode==='blueprint'?(i<(settings.completed??0)?'CONNECTED':'AWAITING YOUR ANSWER'):mode==='route'?`STEP 0${i+1}`:'CONNECTED INPUT'
        const p=panel(name,layered?2.75:route?1.48:1.62,layered?.74:route?1.15:.8,false,status)
        p.rotation.set(layered?-.25:.06,(i-1)*-.12,layered?-.07:(i-1)*.07)
        return p
      })
      if(layered||route)dashboard.visible=false
      if(mode==='case'&&settings.sources.length>2)dashboard.position.y=-.75
      if(mode==='scope'){dashboard.position.set(.1,-.1,.35);dashboard.rotation.z=-.05}
      const curves=starts.map((v,i)=>new T.CatmullRomCurve3(route?[v,v.clone().lerp(starts[(i+1)%starts.length],.5).add(new T.Vector3(0,-.25,.2)),starts[(i+1)%starts.length]]:[v,new T.Vector3(v.x*.7,.7,1),new T.Vector3(.25,.2,.5)]))
      const connections=curves.map(curve=>{const line=new T.Line(keep(new T.BufferGeometry().setFromPoints(curve.getPoints(50))),keep(new T.LineBasicMaterial({color:0xc69a2b,transparent:true,opacity:.4})));group.add(line);return line})
      const pulses=curves.flatMap(curve=>[0,.5].map(offset=>{const dot=new T.Mesh(keep(new T.SphereGeometry(.026,8,6)),keep(new T.MeshBasicMaterial({color:0xe5b433})));dot.userData.pulse=true;group.add(dot);return{dot,curve,offset}}))
      const ringPoints=Array.from({length:101},(_,i)=>new T.Vector3(Math.cos(i/100*Math.PI*2)*2.1,-1.65,Math.sin(i/100*Math.PI*2)*1.25))
      group.add(new T.Line(keep(new T.BufferGeometry().setFromPoints(ringPoints)),keep(new T.LineBasicMaterial({color:0xc9be9f,transparent:true,opacity:.4}))))
      const media=matchMedia('(prefers-reduced-motion: reduce)');let reduced=media.matches,visible=true,time=0,last=0,dragging=false,x=0,y=0,turn=0,tip=0,hoverX=0,hoverY=0
      const motion=()=>{reduced=media.matches};media.addEventListener('change',motion)
      const resize=()=>{const w=element.clientWidth,h=element.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=Math.max(8.4,7.5/camera.aspect);camera.lookAt(0,.15,0);camera.updateProjectionMatrix()};const ro=new ResizeObserver(resize);ro.observe(element);resize()
      const down=(e:PointerEvent)=>{dragging=true;x=e.clientX;y=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)}
      const move=(e:PointerEvent)=>{if(dragging){turn=Math.max(-.5,Math.min(.5,turn+(e.clientX-x)*.006));tip=Math.max(-.25,Math.min(.25,tip+(e.clientY-y)*.004));x=e.clientX;y=e.clientY}else if(e.pointerType==='mouse'){const b=element.getBoundingClientRect();hoverX=(e.clientX-b.left)/b.width-.5;hoverY=(e.clientY-b.top)/b.height-.5}}
      const up=()=>{dragging=false},leave=()=>{hoverX=0;hoverY=0}
      const key=(e:KeyboardEvent)=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)){e.preventDefault();if(e.key==='Home'){turn=0;tip=0}else if(e.key==='ArrowLeft')turn=Math.max(-.5,turn-.1);else if(e.key==='ArrowRight')turn=Math.min(.5,turn+.1);else if(e.key==='ArrowUp')tip=Math.max(-.25,tip-.1);else tip=Math.min(.25,tip+.1)}}
      element.addEventListener('keydown',key);renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',up);renderer.domElement.addEventListener('pointerleave',leave)
      function frame(now:number){const dt=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden)return;if(!pause.current&&!reduced)time+=dt
        const phase=(time%5.5)/5.5
        const smooth=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t)}
        const assembly=mode==='connected'||mode==='case'?(reduced?1:phase<.35?0:phase<.62?smooth((phase-.35)/.27):phase<.88?1:1-smooth((phase-.88)/.12)):0
        cards.forEach((card,i)=>{
          card.position.copy(starts[i]).lerp(new T.Vector3(.15,-.1,-.25-i*.07),assembly)
          const enter=1
          if(layered){card.position.y+=(1-enter)*.4;card.position.z+=!reduced?Math.sin(time*.5+i)*.035:0}
          if(mode==='improve')card.position.y+=!reduced?Math.sin(time*.5+i)*.08:0
          card.scale.setScalar(1-assembly*.35)
          const opacity=(1-assembly)*(mode==='blueprint'&&i>=(settings.completed??0)?.3:1)*enter
          ;(card.material as Three.MeshBasicMaterial).opacity=opacity
          ;((card.children[0] as Three.Mesh).material as Three.MeshStandardMaterial).opacity=opacity
          card.visible=assembly<.995
        })
        dashboard.scale.setScalar(.92+assembly*.08)
        connections.forEach((line,i)=>{line.visible=!layered&&(mode!=='route'||i<starts.length-1)})
        pulses.forEach(({dot,curve,offset},i)=>{dot.position.copy(curve.getPoint((time*.45+offset)%1));dot.visible=!reduced&&assembly<.92&&!layered&&(mode!=='route'||Math.floor(i/2)<starts.length-1)})
        const targetY=turn+(!pause.current&&!reduced?hoverX*.16+Math.sin(time*.42)*.055:0),targetX=tip+(!pause.current&&!reduced?hoverY*.08:0)
        group.rotation.y+=(targetY-group.rotation.y)*(reduced?1:.08);group.rotation.x+=(targetX-group.rotation.x)*(reduced?1:.08)
        renderer.render(scene,camera)
      }
      const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;renderer.setAnimationLoop(visible?frame:null)},{rootMargin:'80px'});io.observe(element);renderer.setAnimationLoop(frame);setReady(true)
      const lost=(e:Event)=>{e.preventDefault();renderer.setAnimationLoop(null);setReady(false)};renderer.domElement.addEventListener('webglcontextlost',lost)
      cleanup=()=>{io.disconnect();ro.disconnect();media.removeEventListener('change',motion);element.removeEventListener('keydown',key);renderer.domElement.removeEventListener('webglcontextlost',lost);renderer.setAnimationLoop(null);resources.forEach(r=>r.dispose());renderer.dispose();if(renderer instanceof T.WebGLRenderer)renderer.forceContextLoss();renderer.domElement.remove()}
    }).catch(()=>{if(!cancelled)setReady(false)})
    },{rootMargin:'150px'})
    start.observe(element)
    return()=>{cancelled=true;start.disconnect();cleanup?.()}
  },[configKey])
  return <div className={`${styles.scene}${compact?` ${styles.compact}`:''}`} data-scene={config.mode??'connected'}>
    <div ref={host} className={styles.canvas} style={{opacity:ready?1:0}} tabIndex={ready?0:-1} role="img" aria-hidden={!ready} aria-label={`3D workspace: ${config.title} Drag or use arrow keys to rotate. Home resets the view.`} />
    {!ready&&<div className={styles.fallback}><span>Z / AI 2ND BRAIN</span><h3>{config.title}</h3><p>{config.sources.join(' · ')}</p><hr/>{config.rows.map(([title,description])=><p key={title}>{title}{description?`: ${description}`:''}</p>)}</div>}
  </div>
}

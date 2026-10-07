// Generate a static first pose from the same licensed geometry and projection as BrainScene.
import { readFile, writeFile } from 'node:fs/promises'
import * as T from 'three'
const cloud=JSON.parse(await readFile(new URL('../public/models/brain-network.json',import.meta.url),'utf8'))
const nodes=cloud.map(([x,y,z])=>({v:new T.Vector3(x,y,z),region:x>.35?0:y<-.15?1:2}))
const camera=new T.PerspectiveCamera(36,1,.1,30)
camera.position.set(0,.35,6.6);camera.lookAt(0,-.05,0);camera.updateMatrixWorld()
const brain=new T.Group();brain.rotation.set(.12,-.38,0);brain.updateMatrixWorld()
const project=v=>{const p=v.clone().applyMatrix4(brain.matrixWorld).project(camera);return {x:(p.x+1)*265,y:(1-p.y)*265}}
const fmt=n=>n.toFixed(2)
const adjacency=nodes.map(()=>[])
const lines=[]
nodes.forEach((node,i)=>{
 const nearby=nodes.map((n,j)=>({n,j,d:node.v.distanceTo(n.v)})).filter(x=>x.j>i&&x.d<.29).sort((a,b)=>a.d-b.d).slice(0,2)
 const a=project(node.v)
 nearby.forEach(({n,j})=>{adjacency[i].push(j);adjacency[j].push(i);const b=project(n.v);lines.push(`<path d="M${fmt(a.x)} ${fmt(a.y)}L${fmt(b.x)} ${fmt(b.y)}" stroke="${node.region===0?'#ba851a':'#485253'}" opacity="${node.region===0?.18:.075}"/>`)})
})
const dots=nodes.map(n=>{const p=project(n.v);return `<circle cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="${n.region===0?1.5:1.1}" fill="${n.region===0?'#ba851a':'#485253'}" opacity="${n.region===0?.85:.48}"/>`})
const starts=nodes.map((_,i)=>i).filter(i=>adjacency[i].length)
const glows=Array.from({length:16},(_,i)=>{const from=starts[(i*47)%starts.length],to=adjacency[from][0];const p=project(nodes[from].v.clone().lerp(nodes[to].v,i/16));return `<circle cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="7" fill="url(#signal)"/>`})
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 530 530"><defs><radialGradient id="signal"><stop stop-color="#fff9dc"/><stop offset=".2" stop-color="#ffd36a"/><stop offset=".5" stop-color="#e5a325" stop-opacity=".53"/><stop offset="1" stop-color="#e5a325" stop-opacity="0"/></radialGradient></defs><g fill="none" stroke-width=".65">${lines.join('')}</g>${dots.join('')}${glows.join('')}</svg>`
await writeFile(new URL('../public/images/brain-network-fallback.svg',import.meta.url),svg)
console.log(`Generated network fallback with ${nodes.length} nodes and ${lines.length} connections.`)

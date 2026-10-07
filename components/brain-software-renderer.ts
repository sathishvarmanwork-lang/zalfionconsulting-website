import type * as Three from 'three'

// Project the same 3D scene onto Canvas 2D when hardware WebGL is unavailable.
export function softwareRenderer(T: typeof Three) {
  const canvas=document.createElement('canvas')
  const ctx=canvas.getContext('2d')
  if(!ctx) throw new Error('Canvas unavailable')
  let width=1,height=1,ratio=1,frame=0,callback:((time:number)=>void)|null=null
  const vector=new T.Vector3()
  function project(v: Three.Vector3, camera: Three.Camera) {
    const p=v.clone().project(camera)
    return {x:(p.x+1)*width/2,y:(1-p.y)*height/2,z:p.z}
  }
  function loop(time:number){if(!callback)return;callback(time);frame=requestAnimationFrame(loop)}
  return {
    domElement:canvas,
    outputColorSpace:'',
    setPixelRatio(value:number){ratio=value},
    setClearColor(_color:number,_alpha:number){},
    setSize(w:number,h:number){width=w;height=h;canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);canvas.style.width=w+'px';canvas.style.height=h+'px'},
    setAnimationLoop(next:((time:number)=>void)|null){cancelAnimationFrame(frame);callback=next;if(next)frame=requestAnimationFrame(loop)},
    render(scene:Three.Scene,camera:Three.Camera){
      scene.updateMatrixWorld(true);camera.updateMatrixWorld(true)
      ctx!.setTransform(ratio,0,0,ratio,0,0);ctx!.clearRect(0,0,width,height)
      const strokes:{points:{x:number,y:number,z:number}[],color:string,alpha:number,width:number,z:number}[]=[]
      const dots:{x:number,y:number,z:number,color:string,alpha:number,r:number,glow?:boolean}[]=[]
      scene.traverse(obj=>{
        if(!obj.visible)return
        if(obj instanceof T.LineSegments||obj instanceof T.Line){
          const mat=obj.material as Three.LineBasicMaterial,pos=obj.geometry.attributes.position
          const end=Math.min(pos.count,obj.geometry.drawRange.start+obj.geometry.drawRange.count)
          for(let i=obj.geometry.drawRange.start;i<end-1;i+=obj instanceof T.LineSegments?2:1){
            const a=project(vector.fromBufferAttribute(pos,i).applyMatrix4(obj.matrixWorld),camera)
            const b=project(vector.fromBufferAttribute(pos,i+1).applyMatrix4(obj.matrixWorld),camera)
            strokes.push({points:[a,b],color:mat.color.getStyle(),alpha:mat.opacity,width:.8,z:(a.z+b.z)/2})
          }
        }else if(obj instanceof T.Points){
          const mat=obj.material as Three.PointsMaterial,pos=obj.geometry.attributes.position
          for(let i=0;i<pos.count;i++){
            const p=project(vector.fromBufferAttribute(pos,i).applyMatrix4(obj.matrixWorld),camera)
            dots.push({...p,color:mat.color.getStyle(),alpha:mat.opacity,r:Math.max(1,mat.size*width*.12)})
          }
        }else if(obj instanceof T.Sprite){
          const p=project(new T.Vector3().setFromMatrixPosition(obj.matrixWorld),camera)
          dots.push({...p,color:'#e5a325',alpha:1,r:Math.max(5,obj.scale.x*width*.15),glow:true})
        }else if(obj instanceof T.Mesh){
          const mat=obj.material as Three.MeshStandardMaterial
          if(obj.userData.brainShell){
            // Fill the projected silhouette so the software fallback also reads as one solid form.
            const pos=obj.geometry.attributes.position
            const points=[]
            for(let i=0;i<pos.count;i+=3)points.push(project(vector.fromBufferAttribute(pos,i).applyMatrix4(obj.matrixWorld),camera))
            points.sort((a,b)=>a.x-b.x||a.y-b.y)
            type Point=typeof points[number]
            const cross=(a:Point,b:Point,c:Point)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x)
            const half=(list:Point[])=>{const hull:Point[]=[];for(const p of list){while(hull.length>=2&&cross(hull[hull.length-2],hull[hull.length-1],p)<=0)hull.pop();hull.push(p)}return hull.slice(0,-1)}
            const hull=[...half(points),...half([...points].reverse())]
            if(hull.length){
              const top=Math.min(...hull.map(p=>p.y)),bottom=Math.max(...hull.map(p=>p.y))
              const gradient=ctx!.createLinearGradient(0,top,0,bottom)
              gradient.addColorStop(0,'#fcfaf3');gradient.addColorStop(.55,'#eee7d5');gradient.addColorStop(1,'#c9bea2')
              ctx!.save();ctx!.beginPath();hull.forEach((p,i)=>i?ctx!.lineTo(p.x,p.y):ctx!.moveTo(p.x,p.y));ctx!.closePath()
              ctx!.globalAlpha=.8;ctx!.fillStyle=gradient;ctx!.shadowColor='#74624325';ctx!.shadowBlur=18;ctx!.shadowOffsetY=9;ctx!.fill();ctx!.restore()
            }
          }
          const curve=obj.userData.curve as Three.CatmullRomCurve3|undefined
          if(curve){
            const points=curve.getPoints(90).map(p=>project(p.applyMatrix4(obj.matrixWorld),camera))
            strokes.push({points,color:mat.color.getStyle(),alpha:mat.opacity,width:obj.userData.stem?9:1.35,z:points.reduce((s,p)=>s+p.z,0)/points.length})
          }else if(obj.geometry.type==='SphereGeometry'&&obj.geometry.parameters.radius<.1){
            const p=project(new T.Vector3().setFromMatrixPosition(obj.matrixWorld),camera)
            dots.push({...p,color:mat.color.getStyle(),alpha:1,r:2.2})
          }
        }
      })
      strokes.sort((a,b)=>b.z-a.z).forEach(s=>{ctx!.beginPath();s.points.forEach((p,i)=>i?ctx!.lineTo(p.x,p.y):ctx!.moveTo(p.x,p.y));ctx!.strokeStyle=s.color;ctx!.globalAlpha=s.alpha;ctx!.lineWidth=s.width;ctx!.stroke()})
      dots.sort((a,b)=>b.z-a.z).forEach(p=>{if(p.glow){const g=ctx!.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,'#fff9dc');g.addColorStop(.2,'#ffd36a');g.addColorStop(.5,'#e5a32588');g.addColorStop(1,'#e5a32500');ctx!.fillStyle=g;ctx!.globalAlpha=p.alpha;ctx!.beginPath();ctx!.arc(p.x,p.y,p.r,0,Math.PI*2);ctx!.fill();return}ctx!.beginPath();ctx!.arc(p.x,p.y,p.r,0,Math.PI*2);ctx!.fillStyle=p.color;ctx!.globalAlpha=p.alpha;ctx!.fill()})
      ctx!.globalAlpha=1
    },
    dispose(){cancelAnimationFrame(frame);callback=null}
  }
}

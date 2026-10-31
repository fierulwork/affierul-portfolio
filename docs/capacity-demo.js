(()=>{'use strict';
 // Synthetic workload model. No company data or operational API calls.
 function scenario(day,requestedShift=0){
  const loads=day==='steady'?[110,90,90]:[140,60,90];
  const shift=Math.min(60,Math.max(0,Number(requestedShift)||0));
  const capacities=[100+shift,100-shift,100];
  const areas=loads.map((demand,i)=>({id:'ABC'[i],demand,capacity:capacities[i],pressure:Math.round(demand/capacities[i]*100),gap:Math.max(0,demand-capacities[i])}));
  return {shift,areas,demand:loads.reduce((a,b)=>a+b,0),capacity:capacities.reduce((a,b)=>a+b,0),gap:areas.reduce((n,a)=>n+a.gap,0),suggestedShift:loads[0]-100};
 }
 if(typeof module==='object'&&module.exports)module.exports={scenario};
 if(typeof document==='undefined')return;
 const root=document.getElementById('capacity-demo');if(!root)return;
 const q=id=>document.getElementById(id),steps=[...root.querySelectorAll('[data-cap-step]')];let step=0;
 const narrative=[
  ['The total looks fine.','Demand fits the station’s total capacity. Local gaps are hidden inside the aggregate.','Station overview','One total. Different workloads.'],
  ['Area A needs attention.','Area A is short of capacity while Area B has room. The station total alone cannot show the deployment decision.','Focus on Area A','Local pressure becomes visible.'],
  ['Test the allocation first.','Move 40 illustrative capacity units from B to A. Both areas now fit, with no increase in total capacity.','Reallocation scenario','Same capacity. Better balance.']
 ];
 function draw(){const data=scenario('peak',step===2?40:0);root.dataset.step=String(step);
  steps.forEach((b,i)=>{if(i===step)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  q('capacity-step-title').textContent=narrative[step][0];q('capacity-step-copy').textContent=narrative[step][1];q('capacity-scope').textContent=narrative[step][2];q('capacity-map-key').textContent=narrative[step][3];
  q('capacity-metric-one-label').textContent=step===0?'Station demand / capacity':'Area A demand / capacity';q('station-capacity').textContent=step===0?`${data.demand} / ${data.capacity} units`:`${data.areas[0].demand} / ${data.areas[0].capacity} units`;
  q('area-metric-label').textContent=step===0?'Visibility':'Area B demand / capacity';q('area-capacity').textContent=step===0?'Station level':`${data.areas[1].demand} / ${data.areas[1].capacity} units`;
  q('capacity-status').textContent=['Look closer before deciding.','Area A: 40 units short. Area B: 40 units available.','Candidate allocation. Validate service constraints before deployment.'][step];
  root.querySelectorAll('[data-map-area]').forEach((g,i)=>{g.classList.toggle('selected',g.dataset.mapArea==='A'&&step===1);g.classList.toggle('overloaded',data.areas[i].gap>0&&step>0);q('map-status-'+g.dataset.mapArea.toLowerCase()).textContent=step===0?'':(data.areas[i].gap?'Capacity gap':'Within capacity');});
  root.querySelector('.capacity-transfer').classList.toggle('active',step===2);q('capacity-prev').disabled=step===0;q('capacity-next').textContent=['Focus area →','Test allocation →','Replay ↺'][step];q('capacity-step-count').textContent=`${step+1} / 3`;
 }
 steps.forEach(b=>b.addEventListener('click',()=>{step=Number(b.dataset.capStep);draw();}));q('capacity-prev').addEventListener('click',()=>{step=Math.max(0,step-1);draw();});q('capacity-next').addEventListener('click',()=>{step=(step+1)%3;draw();});draw();
 let scheduled=false;function progress(){scheduled=false;const max=document.documentElement.scrollHeight-innerHeight;q('reading-progress').style.transform=`scaleX(${max>0?Math.max(0,Math.min(1,scrollY/max)):0})`;}
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(progress);}},{passive:true});addEventListener('resize',progress);progress();
})();

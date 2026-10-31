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
 const q=id=>document.getElementById(id),steps=[...root.querySelectorAll('[data-cap-step]')],areaButtons=[...root.querySelectorAll('[data-area]')];
 let step=0,area='A';
 const narrative=[
  ['01 / Diagnose','An aggregate can hide a local constraint.','The station total fits within available capacity. That does not mean every area has enough coverage. Inspect the local distribution before deciding.'],
  ['02 / Focus','Look where the decision actually sits.','Select an area to compare its demand with assigned capacity. An overloaded area can sit beside spare capacity even when the station total looks healthy.'],
  ['03 / Test','Change the allocation. See the trade-off.','Move capacity from Area B to A. Watch both areas: shifting too much simply moves the problem. Change the scenario day to see why the same allocation should not be applied blindly.'],
  ['04 / Review','Compare the scenario before committing.','Check every area, not just the one you improved. A balanced workload is a starting point; real decisions still need cutoff, travel, staffing and customer-service feasibility checks.']
 ];
 const pressure=a=>a.pressure>100?`${a.gap} units above capacity`:`${a.pressure}% utilisation`;
 function draw(){
  const data=scenario(q('capacity-day').value,q('capacity-shift').value),selected=data.areas.find(a=>a.id===area),before=scenario(q('capacity-day').value);
  root.dataset.step=String(step);steps.forEach((b,i)=>{if(i===step)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  [q('capacity-step-label').textContent,q('capacity-step-title').textContent,q('capacity-step-copy').textContent]=narrative[step];
  q('capacity-step-count').textContent=`${step+1} / 4`;q('capacity-prev').disabled=step===0;q('capacity-next').disabled=step===3;
  q('capacity-scope').textContent=step===0?'Station overview':`Focus area ${area}`;
  q('station-capacity').textContent=`${data.demand} / ${data.capacity} units`;
  q('area-metric-label').textContent=`Area ${area} demand / capacity`;q('area-capacity').textContent=`${selected.demand} / ${selected.capacity} units`;
  q('capacity-load-fill').style.width=Math.min(100,selected.pressure)+'%';q('capacity-load-fill').classList.toggle('overloaded',selected.gap>0);
  q('capacity-status').textContent=`Area ${area}: ${pressure(selected)}. ${data.gap?'Local capacity gaps remain.':'All areas fit within assigned capacity.'}`;
  q('capacity-shift-value').textContent=`${data.shift} units`;q('capacity-adjustment').hidden=step<2;q('capacity-comparison').hidden=step!==3;
  areaButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.area===area)));
  root.querySelectorAll('[data-map-area]').forEach((g,i)=>{g.classList.toggle('selected',g.dataset.mapArea===area&&step>0);g.classList.toggle('overloaded',data.areas[i].gap>0);q('map-status-'+g.dataset.mapArea.toLowerCase()).textContent=data.areas[i].gap?'Capacity gap':'Within capacity';});
  const transfer=root.querySelector('.capacity-transfer');transfer.classList.toggle('active',data.shift>0&&step>=2);
  q('capacity-comparison-body').replaceChildren(...data.areas.map((a,i)=>{const row=document.createElement('tr');[a.id,pressure(before.areas[i]),pressure(a)].forEach(value=>{const cell=document.createElement('td');cell.textContent=value;row.appendChild(cell);});return row;}));
  q('capacity-verdict').textContent=data.gap?'Revise the allocation: the scenario still leaves a local capacity gap.':'Candidate scenario: the workload fits within the same total capacity. Validate operating constraints before deployment.';
 }
 function setStep(n){step=n;if(step<2)q('capacity-shift').value='0';draw();}
 steps.forEach(b=>b.addEventListener('click',()=>setStep(Number(b.dataset.capStep))));
 areaButtons.forEach(b=>b.addEventListener('click',()=>{area=b.dataset.area;if(step===0)step=1;draw();}));
 q('capacity-day').addEventListener('change',()=>{q('capacity-shift').value='0';draw();});q('capacity-shift').addEventListener('input',draw);
 q('capacity-balance').addEventListener('click',()=>{q('capacity-shift').value=String(scenario(q('capacity-day').value).suggestedShift);draw();});q('capacity-reset').addEventListener('click',()=>{q('capacity-shift').value='0';draw();});
 q('capacity-prev').addEventListener('click',()=>setStep(Math.max(0,step-1)));q('capacity-next').addEventListener('click',()=>setStep(Math.min(3,step+1)));draw();
 let scheduled=false;function progress(){scheduled=false;const max=document.documentElement.scrollHeight-innerHeight;q('reading-progress').style.transform=`scaleX(${max>0?Math.max(0,Math.min(1,scrollY/max)):0})`;}
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(progress);}},{passive:true});addEventListener('resize',progress);progress();
})();

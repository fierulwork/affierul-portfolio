(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGSAP=!!(window.gsap&&window.ScrollTrigger);
if(hasGSAP)gsap.registerPlugin(ScrollTrigger);
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
let C={};function readColors(){['--fg3','--tint','--good','--bad'].forEach(k=>C[k.slice(2)]=css(k));}readColors();
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,lerp=(a,b,t)=>a+(b-a)*t;
function rnd(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646;};}

/* ---------- Matrix ---------- */
const ICON={
 think:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z"/></svg>',
 do:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/></svg>',
 measure:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>',
 build:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/></svg>'};
const LABEL={think:'Think',do:'Do',measure:'Measure',build:'Build'};
const P=[
 {name:'Case recovery redesign',role:'CX Manager · ORBIIT · 2022–23',hook:'Shared case visibility',
  l:{think:'Diagnosed fragmented case ownership, inconsistent standardised work and non-value-added administration. Senior Tier 2 capacity was absorbed by routine updates instead of complex service recovery.',
     do:'Led change adoption through a phased rollout and practical quick wins, helping experienced agents move from private logs to a shared way of working. Reallocated senior Tier 2 capacity from routine updates to value-added service recovery.',
     measure:'Tracked benefit realisation through case closure, quality and turnaround measures. Team-to-case reporting supported performance coaching, root-cause analysis and targeted corrective action.',
     build:'Built ORBIIT with SharePoint List, Power Automate and Power BI: a single source of truth for the case queue, standardised communication templates, workflow automation and performance dashboards.'},
  r:['Improved case closure','Stronger quality outcomes','Capacity released for recovery','AMEA + SEA recognition']},
 {name:'Service-failure backlog',role:'CX Manager · Singapore market',hook:'Service recovery',
  l:{think:'Framed the service failure in terms of customer impact and cost of poor quality: recurring shipment delays, customer disruption and money-back-guarantee exposure. The priority was containment followed by a structural network fix.',
     do:'Led service-recovery prioritisation and escalation governance. Managed customer recovery decisions within delegated authority and escalated exceptions to senior leadership.',
     measure:'Quantified the service and commercial exposure to build an evidence-based business case for network intervention.',
     build:'Aligned stakeholders around the business case, leading to flight-network changes that addressed the recurring cause of the delays.'},
  r:['Backlog reduced','Network intervention approved','Customer recovery authority']},
 {name:'Vendor & cost',role:'Ops Manager · Singapore',hook:'Commercial impact',
  l:{think:'Connected commercial evaluation with route design and cost-to-serve, treating supplier renewal and network optimisation as related operating decisions.',
     do:'Co-led the RFQ and commercial negotiations across courier vendors. Managed supplier transitions and service-continuity risks when replacing underperforming partners.',
     measure:'Owned courier budget performance through unit-cost control, supplier SLA governance, billing assurance and capacity reviews. Used corrective actions to address performance gaps.',
     build:'Co-led route optimisation, and redesigned the courier payout into a performance-based incentive model tied to productivity, cost and delivery performance.'},
  r:['Recurring annual savings','Supplier accountability','Service continuity through transition']},
 {name:'Station leadership',role:'Ops Manager · Duty Manager',hook:'Performance & capacity ownership',
  l:{think:'Owned the operating trade-offs behind monthly performance: service reliability, workforce productivity, capacity utilisation and cost-to-serve. Challenged route capacity against actual demand, rather than carrying the existing footprint forward.',
     do:'Delivered a major capacity adjustment, consolidating the route footprint through demand-led sector planning and a rebalanced pickup, delivery and vendor mix. Led deployment briefings and service reviews to resolve customer-impact issues during the transition.',
     measure:'Owned monthly operational performance reviews, connecting service outcomes, productivity, capacity utilisation and unit cost. Turned gaps into corrective actions with clear owners, and reviewed whether capacity changes translated into sustainable cost and service performance.',
     build:'Redesigned route sectors and the courier incentive model to align capacity, productivity and service priorities. Embedded cross-functional feedback into operating reviews and prepared on-road processes, compliance documents and evidence for ISO 9001:2015 audits.'},
  r:['Monthly performance ownership','Route consolidation','Demand-led capacity planning','Cost-to-serve management','Station-wide duty responsibility']},
 {name:'Focus-area capacity planning',role:'Ops Manager · Decision support',hook:'Local decisions, better evidence',
  l:{think:'Station-wide reporting was too broad for daily decisions in selected focus areas. With no ready-to-use tool available, I needed a way to connect geographic coverage, local demand and operating constraints before changing deployment.',
     do:'Defined the planning questions and built a focused scenario planner. Selected areas and day/date subsets, reviewed workload distribution, and compared coverage and capacity options before deciding what needed attention.',
     measure:'Used before-and-after scenarios and feasibility checks to review workload, cutoff exposure and return-time implications. The planner supports operational judgement; it is not presented as proof that a simulated outcome was realised.',
     build:'Developed geographic mapping and scenario views combining shipment/location inputs, route coverage, sequencing and operating assumptions. Built decision support around the granularity the daily operation needed.'},
  r:['Focus-area visibility','Day / date filtering','Capacity scenarios','Feasibility checks']},
 {name:'Recovery centre',role:'CX Manager · Singapore market',hook:'Team development',
  l:{think:'Reviewed the operating model against changing customer demand. Modernised roles and SOPs through incremental change, balancing service continuity with capability development.',
     do:'Led Tier 2 case resolution and Tier 1 customer support, with accountability for recovery-centre performance and people development. Rewrote SOPs around how customers contact us today.',
     measure:'Reviewed secondary-escalation responsiveness, individual case workloads and closure against target. Used quality reviews and coaching to strengthen capability and accountability.',
     build:'Integrated practical tools with workforce capacity planning, building on the WFM function I had established as a Specialist to align staffing with demand.'},
  r:['Cross-functional recovery leadership','Team members progressed into management','Coaching and performance governance']},
 {name:'Escalation intake',role:'CX Manager · PPA',hook:'1 first contact',
  l:{think:'Identified defects at intake, unclear ownership and avoidable rework in cross-functional handoffs. The requirement was one structured intake with clear escalation routing, without duplicating each team’s backend system.',
     do:'Scoped it to first contact only. Backend work stays in each team’s own system. Tier 2 received a Teams alert with a defined customer callback requirement.',
     measure:'Created an intake audit trail with timestamps and accountable owners. The coordination team could review follow-up history and Tier 2 callback compliance against the required service window.',
     build:'Built quality-at-source controls into SharePoint intake: required fields by request type, Power Automate routing to the accountable team, and Teams alerts for Tier 2.'},
  r:['One structured intake','Callback accountability','Complete info at first contact']}
];
const bar=document.getElementById('projbar'),lensBox=document.getElementById('lenses');
P.forEach((p,i)=>{const b=document.createElement('button');b.className='proj';b.type='button';b.setAttribute('aria-pressed',i===0);b.dataset.i=i;
  b.innerHTML=`<small>${p.role.split(' · ')[0]}</small><strong>${p.name}</strong><span>${p.hook}</span>`;bar.appendChild(b);});
['think','do','measure','build'].forEach(k=>{const d=document.createElement('div');d.className='lens';d.dataset.l=k;d.id='lens-'+k;d.setAttribute('role','tabpanel');d.setAttribute('aria-labelledby','tab-'+k);d.hidden=k!=='think';d.innerHTML=`<div class="lens-h"><i>${ICON[k]}</i>${LABEL[k]}</div><p></p>`;lensBox.appendChild(d);});
let cur=-1;
function showProj(i,anim){if(i===cur)return;cur=i;const p=P[i];
  document.getElementById('selected-project-label').textContent=p.name;
  bar.querySelectorAll('.proj').forEach(b=>b.setAttribute('aria-pressed',b.dataset.i==i));
  const fill=()=>{document.getElementById('mName').textContent=p.name;document.getElementById('mRole').textContent=p.role;
    lensBox.querySelectorAll('.lens').forEach(l=>l.querySelector('p').textContent=p.l[l.dataset.l]);
    document.getElementById('mResults').innerHTML=p.r.map(x=>`<span>${x}</span>`).join('');};
  if(!anim||!hasGSAP||reduce){fill();return;}
  const items=['#mName','#mRole',...lensBox.children,'#mResults'];
  gsap.to(items,{opacity:0,y:-8,filter:'blur(6px)',duration:.18,stagger:.02,ease:'power2.in',onComplete:()=>{fill();
    gsap.fromTo(items,{opacity:0,y:14,filter:'blur(6px)',scale:.98},{opacity:1,y:0,filter:'blur(0px)',scale:1,duration:.6,stagger:.05,ease:'expo.out',clearProps:'filter,transform'});}});}
bar.addEventListener('click',e=>{const b=e.target.closest('.proj');if(b){showProj(+b.dataset.i,false);document.getElementById('project-picker').close();document.getElementById('choose-project').focus();}});
showProj(0,false);
document.getElementById('choose-project').onclick=()=>document.getElementById('project-picker').showModal();
document.getElementById('close-picker').onclick=()=>document.getElementById('project-picker').close();
document.getElementById('project-picker').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close();});
const lensTabs=[...document.querySelectorAll('[data-lens]')];
function chooseLens(k){lensTabs.forEach(b=>{const on=b.dataset.lens===k;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;});lensBox.querySelectorAll('.lens').forEach(l=>l.hidden=l.dataset.l!==k);}
lensTabs.forEach((b,i)=>{b.onclick=()=>chooseLens(b.dataset.lens);b.onkeydown=e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%4;else if(e.key==='ArrowLeft')n=(i+3)%4;else if(e.key==='Home')n=0;else if(e.key==='End')n=3;else return;e.preventDefault();chooseLens(lensTabs[n].dataset.lens);lensTabs[n].focus();};});

/* ---------- Story engine ---------- */
const PAIN_STORIES={
 orbiit:{replace:1,steps:[
  {h:'Private worksheets. No shared way to handle a case.',p:'Zoom into Agent A’s worksheet. Each Tier 2 specialist kept their own log, with different fields and handling steps. A team lead could not easily see the next action or compare cases across the team.',tools:[],b:1},
  {h:'Different emails. An unclear promise to the customer.',p:'Agent B uses a personal email template. The detail varies between agents, and the message may leave out what is needed or when the customer should expect the next update.',tools:[],b:1},
  {h:'An agent is away. Urgent follow-ups stay out of sight.',p:'Agent D is on leave, but their urgent cases are still in a private worksheet and inbox. The team cannot readily see which customer needs a follow-up or what the last action was.',tools:[],b:1},
  {h:'Zoom out: rebuilding the story takes detective work.',p:'A post-incident review means piecing together worksheets, emails and notes. A fragmented audit trail makes root-cause analysis, corrective action and evidence-based coaching difficult.',tools:[],b:1}
 ],panels:[
  ['AGENT A / PRIVATE WORKSHEET','No clear shared steps.','<div class="mini-sheet"><div>Case <b>Status</b><b>Next action</b></div><div>Clearance <b>Open</b><b class="missing">?</b></div><div>Delivery <b>Notes</b><b class="missing">?</b></div><div>Address <b>Pending</b><b class="missing">?</b></div></div><p class="pain-note">Own fields. Own handling steps.</p>'],
  ['AGENT B / OWN EMAIL','Different agent, different promise.','<div class="mini-email"><small>To: Customer</small><p>We are checking your shipment.<br>We will update you later.</p><div class="missing">Required detail? Next update?</div></div><p class="pain-note">No consistent template or timeline.</p>'],
  ['CASE REVIEW / SCATTERED RECORDS','Where is the full history?','<div class="evidence-fragments"><span>Worksheet</span><span>Email</span><span>Notes</span><span>Last action?</span></div><p class="pain-note">Rebuild the case before reviewing it.</p>'],
  ['AGENT D / ON LEAVE','Urgent cases, out of sight.','<div class="mini-case"><b>Transit delay</b><strong>5 days</strong></div><div class="mini-case"><b>Wrongly delivered</b><strong>6 days</strong></div><div class="missing handoff-gap">Who is following up?</div><p class="pain-note">Private log. No clear shared view.</p>']
 ]},
 ppa:{replace:2,steps:[
  {h:'The request is sent. The detail is incomplete.',p:'A Tier 1 agent emails for help, but the tracking number, request type or supporting detail is missing. The receiving team must ask again before it can act. Quality at source requires mandatory information matched to the request type.',tools:[],b:1},
  {h:'The agent has to guess the right inbox.',p:'Requests are forwarded between teams while the customer waits. A complete message still helps little if it reaches the wrong owner. The solution needs clear ownership and escalation routing.',tools:[],b:1},
  {h:'A callback is needed. Its timing is hard to see.',p:'For a Tier 2 escalation, the frontline needs to know who has been notified and whether the customer was called back. Inbox traffic alone does not give the coordination team a clear view of the defined callback requirement.',tools:[],b:1},
  {h:'Zoom out: more chasing, without a shared record.',p:'Repeated emails make it difficult to see what was requested, when it was chased and who owns the next action. The solution needs a shared intake audit trail, while each team continues its backend work in its own system.',tools:[],b:1}
 ],panels:[
  ['TIER 1 / SUPPORT REQUEST','An email is not a complete intake.','<div class="mini-email"><small>Subject: Please help customer</small><p>Customer called again.<br>Can someone check?</p><div class="missing">Tracking number? Request details?</div></div><p class="pain-note">Sent back for clarification.</p>'],
  ['HANDOFF / WRONG INBOX','Who should own this?','<div class="inbox-route"><span>Tier 1</span><i>→</i><span>Wrong team</span><i>↩</i><span>Forward again</span></div><p class="pain-note">The customer waits through handoffs.</p>'],
  ['FOLLOW-UP / INBOX THREADS','Any update? Again.','<div class="duplicate-mail"><span>Any update?</span><span>Following up…</span><span>Customer called again.</span></div><p class="pain-note">No shared request and chase history.</p>'],
  ['TIER 2 / CALLBACK','Has the customer been called?','<div class="callback-clock">Defined SLA<small>Callback requirement</small></div><div class="missing handoff-gap">Owner notified? Callback made?</div><p class="pain-note">The coordination team needs visibility.</p>']
 ]}
};
function Story(root,cfg){
 const stage=root.querySelector('.stage'),world=root.querySelector('.world'),rail=root.querySelector('.rail'),pager=root.querySelector('.pager'),flag=root.querySelector('.flag');
 const pain=PAIN_STORIES[root.id],baseSteps=cfg.steps,shift=pain.steps.length-pain.replace,steps=[...pain.steps,...baseSteps.slice(pain.replace)],n=steps.length;
 const tools=[...root.querySelectorAll('.tool')],layers=[...world.querySelectorAll('.L')],vis=layers.map(L=>L.dataset.vis.split(',').map(Number));
 const workflow=document.createElement('div');workflow.className='workflow-content';
 while(world.firstChild)workflow.appendChild(world.firstChild);world.appendChild(workflow);
 const painView=document.createElement('div');painView.className='pain-view';
 painView.innerHTML='<div class="pain-camera">'+pain.panels.map(([label,title,body],i)=>`<article class="pain-panel pain-panel-${i}"><small class="pain-agent">${label}</small><h3>${title}</h3>${body}</article>`).join('')+'</div><div class="pain-overview-label">'+(root.id==='orbiit'?'One team. Four disconnected views.':'One customer. Disconnected handoffs.')+'</div>';
 painView.insertAdjacentHTML('beforeend','<span class="privacy-sample">Illustrative example</span>');world.appendChild(painView);const camera=painView.querySelector('.pain-camera'),panels=[...painView.querySelectorAll('.pain-panel')],overview=painView.querySelector('.pain-overview-label');
 stage.parentNode.insertBefore(flag,stage);const privateLink=document.createElement('button');privateLink.type='button';privateLink.className='request-link';privateLink.dataset.requestResume='';privateLink.textContent='Request the full case scope ↗';stage.parentNode.appendChild(privateLink);
 const fit=()=>{world.style.transform=`scale(${stage.clientWidth/440})`;};fit();addEventListener('resize',fit);if(window.ResizeObserver)new ResizeObserver(fit).observe(stage);
 steps.forEach((s,i)=>{const li=document.createElement('li');if(s.b)li.classList.add('before');li.innerHTML=`<button type="button"><span class="n">${i+1}</span><span class="h">${s.h}</span><span class="x"><p>${s.p}</p></span></button>`;rail.appendChild(li);pager.appendChild(document.createElement('i'));});
 const lis=[...rail.children],dots=[...pager.children];let cur=-1,st=null;
 const controls=document.createElement('div');controls.className='story-controls';controls.innerHTML='<button type="button" data-story-prev aria-label="Previous story step">← Back</button><span class="story-position" aria-live="polite"></span><button type="button" data-story-next aria-label="Next story step">Next →</button>';root.querySelector('.story-grid').after(controls);
 const prev=controls.querySelector('[data-story-prev]'),next=controls.querySelector('[data-story-next]'),position=controls.querySelector('.story-position');
 function setStep(i){if(i===cur)return;cur=i;world.dataset.step=String(Math.max(0,i-shift));world.dataset.narrativeStep=i;
  lis.forEach((l,j)=>{l.classList.toggle('on',j===i);l.classList.toggle('done',j<i);l.querySelector('button').setAttribute('aria-current',j===i?'step':'false');});dots.forEach((d,j)=>d.classList.toggle('on',j===i));
  tools.forEach(t=>t.classList.toggle('on',steps[i].tools.includes(t.dataset.t)));
  flag.textContent=steps[i].b?'BEFORE · THE FRICTION':i===n-1?'RESULT':'AFTER · THE CHANGE';flag.className='flag '+(steps[i].b?'b':'a');prev.disabled=i===0;next.disabled=i===n-1;position.textContent=`${i+1} / ${n}`;
  root.querySelector('.story-head .kicker').textContent=`Case study · ${root.id==='orbiit'?'ORBIIT':'PPA'} · ${i+1} / ${n} · ${steps[i].b?'The problem':'The solution'}`;
 }
 const targets=[{x:0,y:0,scale:2},{x:-440,y:0,scale:2},{x:-440,y:-420,scale:2},{x:0,y:0,scale:1}];
 if(!hasGSAP){
  function place(i){setStep(i);const before=i<4;painView.hidden=!before;workflow.hidden=before;
   const t=targets[Math.min(i,3)];camera.style.transform=`translate(${t.x}px,${t.y}px) scale(${t.scale})`;overview.style.opacity=i===3?1:0;
   if(!before){const k=i-shift;layers.forEach((L,j)=>{L.style.opacity=vis[j].includes(k)?1:0;L.style.visibility=vis[j].includes(k)?'visible':'hidden';});cfg.place?.(k,true);}
  }place(0);lis.forEach((l,i)=>l.querySelector('button').onclick=()=>place(i));prev.onclick=()=>place(Math.max(0,cur-1));next.onclick=()=>place(Math.min(n-1,cur+1));return;
 }
 const original=gsap.timeline({defaults:{ease:'power3.inOut'}});
 layers.forEach((L,j)=>gsap.set(L,{autoAlpha:vis[j].includes(0)?1:0}));
 for(let i=1;i<baseSteps.length;i++)layers.forEach((L,j)=>{const a=vis[j].includes(i-1),b=vis[j].includes(i);if(a!==b)original.to(L,{autoAlpha:b?1:0,duration:.45},i-1+(b?.45:.05));});
 cfg.build(original,world);
 const tl=gsap.timeline({paused:true,defaults:{ease:'power3.inOut'}});tl.add(original,shift);
 gsap.set(workflow,{autoAlpha:0});gsap.set(camera,{...targets[0],transformOrigin:'0 0'});gsap.set(overview,{autoAlpha:0});
 for(let i=1;i<4;i++){
  if(i<3){tl.to(camera,{x:0,y:0,scale:1,duration:.2},i-.55);tl.to(camera,{...targets[i],duration:.35},i-.35);}
  else{tl.to(camera,{...targets[3],duration:.75},2.25);tl.to(overview,{autoAlpha:1,duration:.3},2.7);}
 }
 tl.to(painView,{autoAlpha:0,duration:.45},3.25);tl.to(workflow,{autoAlpha:1,duration:.45},3.35);
 for(let i=0;i<n;i++)tl.addLabel('s'+i,i);tl.set({},{},n-1);setStep(0);
 if(!reduce&&innerHeight>680)st=ScrollTrigger.create({trigger:root,start:'top top',end:()=>'+='+Math.round(innerHeight*.65*(n-1)),pin:root.querySelector('.story-in'),onToggle:s=>document.body.classList.toggle('story-reading',s.isActive),anticipatePin:1,animation:tl,scrub:.65,snap:{snapTo:1/(n-1),inertia:false,duration:{min:.2,max:.55},delay:.1,ease:'power2.inOut'},onUpdate:s=>setStep(Math.round(s.progress*(n-1)))});
 function go(i){i=Math.max(0,Math.min(n-1,i));if(st)window.scrollTo({top:st.start+(st.end-st.start)*i/(n-1)+1,behavior:'smooth'});else{tl.time(i);setStep(i);}}
 lis.forEach((l,i)=>l.querySelector('button').onclick=()=>go(i));prev.onclick=()=>go(cur-1);next.onclick=()=>go(cur+1);
}


/* ---------- ORBIIT config ---------- */
(function(){
  const root=document.getElementById('orbiit'),cs=[...root.querySelectorAll('.cs')];
  const sheets=[[8,8],[224,8],[8,216],[224,216]],inSheet=[[0,5,9],[1,6,8],[2,7],[3,4]];
  const P0=[];inSheet.forEach((list,p)=>list.forEach((c,k)=>P0[c]={x:sheets[p][0]+10,y:sheets[p][1]+40+k*42,w:188}));
  const P1=cs.map((_,c)=>({x:18,y:44+c*36.2,w:404})), P2=cs.map((_,c)=>({x:18,y:44+c*36.2,w:270}));
  const P3=cs.map((_,c)=>c<5?{x:18,y:40+c*37,w:404}:{x:18+((c-5)%3)*136,y:280+Math.floor((c-5)/3)*40,w:128});
  const STEPS=[P0,P1,P2,P3,P3,P3];
  Story(root,{
    steps:[
      {h:'Before: every Tier 2 specialist had a private sheet',p:'Cases sat in personal spreadsheets, and scan updates were checked by hand. When someone went on leave (Agent D), their cases went quiet and aged. Seniors spent their day on routine updates.',tools:[]},
      {h:'One shared queue',p:'Established a single source of truth for case ownership, age, status and next action. Shared visibility supports standardised work, absence coverage and prioritisation of overdue cases.',tools:['SharePoint']},
      {h:'Updates send themselves',p:'Power Automate checks scans and sends the right email template for each case type: delay update, customs document request, damage claim form, proof of delivery. Routine updates no longer depend on each agent composing an email.',tools:['Power Automate']},
      {h:'Seniors on the cases that matter',p:'Routine updates run on automation and routine support. Senior Tier 2 specialists now spend their time on high-impact service recovery: customs clearance, damage, missing, transit delay and wrongly delivered.',tools:['SharePoint','Power Automate']},
      {h:'Performance you can drill into',p:'Power BI reports go from team to agent to single case. Team leads use them for coaching and case reviews, and a predictive view flags drops in resolution or clearance before they escalate.',tools:['Power BI']},
      {h:'Result',p:'Improved case closure, turnaround and quality outcomes. Automation released capacity for complex service recovery, with shared ownership and a clearer performance-review cadence. Detailed measures are available in a private discussion.',tools:['SharePoint','Power Automate','Power BI']}
    ],
    place(i){cs.forEach((el,c)=>{const p=STEPS[i][c];window.gsap?gsap.set(el,{x:p.x,y:p.y,width:p.w,opacity:i>=4?0:1}):(el.style.transform=`translate(${p.x}px,${p.y}px)`,el.style.width=p.w+'px',el.style.opacity=i>=4?0:1);});},
    build(tl){
      cs.forEach((el,c)=>gsap.set(el,{x:P0[c].x,y:P0[c].y,width:P0[c].w}));
      cs.forEach((el,c)=>tl.to(el,{x:P1[c].x,y:P1[c].y,width:P1[c].w,duration:.75},.1+c*.02));
      tl.to('#o-list',{width:290,duration:.7},1.1);
      cs.forEach((el,c)=>tl.to(el,{width:P2[c].w,duration:.7},1.1));
      cs.forEach((el,c)=>tl.to(el,{x:P3[c].x,y:P3[c].y,width:P3[c].w,duration:.75},2.1+(c%5)*.03));
      cs.forEach((el,c)=>tl.to(el,{opacity:0,scale:.92,duration:.35},3.05+c*.01));
      const line=document.getElementById('o-line'),len=line.getTotalLength?line.getTotalLength():600;
      gsap.set(line,{strokeDasharray:len,strokeDashoffset:len});gsap.set('#o-end',{scale:0,transformOrigin:'50% 50%'});
      tl.to(line,{strokeDashoffset:0,duration:.55,ease:'power2.out'},3.4);
      tl.to('#o-end',{scale:1,duration:.2},3.9);
      const pops=root.querySelectorAll('#o-bi [data-pop]');gsap.set(pops,{opacity:0,y:8});
      tl.to(pops,{opacity:1,y:0,duration:.3,stagger:.04,ease:'power2.out'},3.5);
      const res=root.querySelectorAll('[data-vis="5"] .res');gsap.set(res,{opacity:0,y:14,scale:.96});
      tl.to(res,{opacity:1,y:0,scale:1,duration:.35,stagger:.06,ease:'back.out(1.6)'},4.45);
    }
  });
})();

/* ---------- PPA config ---------- */
(function(){
  const root=document.getElementById('ppa'),tks=[...root.querySelectorAll('.tk')];
  const ownY=[12,94,176,258,340],srcY=[14,82,150,218,286,354];
  const right=[0,0,1,2,3,4],wrong=[1,2,0,4,2,3];
  const P0=tks.map((_,k)=>({x:116,y:srcY[k]+9}));
  tks.forEach((el,k)=>{const inner=el.firstElementChild;inner.style.setProperty('--dx','116px');inner.style.setProperty('--dy',(ownY[right[k]]+17-(srcY[k]+9)+(k===0?-15:k===1?15:0))+'px');inner.style.setProperty('--d',(k*.35)+'s');});
  const P2=tks.map((_,k)=>({x:12,y:44+k*58}));
  const seen={};const P3=tks.map((_,k)=>{const o=right[k];const j=seen[o]=(seen[o]===undefined?0:seen[o]+1);return{x:232,y:ownY[o]+2+j*29};});
  const P4=tks.map((_,k)=>({x:18,y:46+k*56}));
  Story(root,{
    steps:[
      {h:'Before: follow-ups went by email',b:1,p:'When a customer chased, the Tier 1 agent emailed the team they thought owned it: Delivery Operations, Operations Admin, Tier 2, Billing or a Team Lead. The request arrived, and the coordination team lost sight of it.',tools:[]},
      {h:'Bounced for missing info, invisible otherwise',b:1,p:'Follow-ups without the tracking number, address or invoice number came back to the agent. The rest sat in inboxes with no record of which team had been contacted or when, so requests were repeatedly followed up.',tools:[]},
      {h:'One first point of contact',p:'Introduced a standardised intake with quality-at-source controls. Required fields vary by request type, reducing clarification loops and avoidable rework before the receiving team acts.',tools:['SharePoint']},
      {h:'Routed to the owning team',p:'Power Automate notifies the team that owns each follow-up type. For Tier 2, it sends a Teams alert to call the customer back within the defined service window.',tools:['SharePoint','Power Automate','Teams']},
      {h:'Follow-ups you can see',p:'The coordination team sees every follow-up with time and owner, and whether Tier 2 called back within the required callback window. PPA covers the first contact only; each team carries on in its own backend system, so nobody has to update twice.',tools:['SharePoint','Teams']},
      {h:'Result',p:'One first point of contact for every Tier 1 agent. Complete follow-ups, sent to the right team, with a tracked Tier 2 callback requirement and no extra admin for teams with their own systems.',tools:['SharePoint','Power Automate','Teams']}
    ],
    place(i){const S=[P0,P0,P2,P3,P4,P4][i];tks.forEach((el,k)=>{el.style.transform=`translate(${S[k].x}px,${S[k].y}px)`;el.style.opacity=i===5?0:1;});},
    build(tl){
      const pills=[...root.querySelectorAll('.pillst')];
      const tone=t=>/New/.test(t)?0:/Chased/.test(t)?1:/due/.test(t)?2:3;
      pills.forEach(p=>{p.dataset.i=0;p.dataset.s=tone(p.textContent);});
      setInterval(()=>{if(root.querySelector('.world').dataset.step!=='4')return;const c=pills.filter(p=>p.dataset.seq.includes('|'));const p=c[Math.floor(Math.random()*c.length)];
        const seq=p.dataset.seq.split('|');const i=(+p.dataset.i+1)%seq.length;p.dataset.i=i;p.textContent=seq[i];p.dataset.s=tone(seq[i]);},1100);
      tks.forEach((el,k)=>gsap.set(el,{x:P0[k].x,y:P0[k].y}));
      tks.forEach((el,k)=>tl.to(el,{x:P2[k].x,y:P2[k].y,duration:.75},1.1+k*.03));
      const typed=[...root.querySelectorAll('[data-type]')];
      typed.forEach((d,j)=>{const o={n:0},txt=d.dataset.type;tl.to(o,{n:txt.length,duration:.3,ease:'none',onUpdate:()=>{d.textContent=txt.slice(0,Math.round(o.n))||' ';}},1.5+j*.12);});
      tl.set('#p-submit',{attr:{'data-on':'1'}},1.9);
      tks.forEach((el,k)=>tl.to(el,{x:P3[k].x,y:P3[k].y,duration:.75},2.15+k*.04));
      tks.forEach((el,k)=>tl.to(el,{x:P4[k].x,y:P4[k].y,duration:.75},3.1+k*.03));
      const rows=root.querySelectorAll('.lv,[data-vis="4"] .bubble,[data-vis="4"] .kpi');gsap.set(rows,{opacity:0,x:-8});
      tl.to(rows,{opacity:1,x:0,duration:.3,stagger:.04},3.45);
      tks.forEach(el=>tl.to(el,{opacity:0,scale:.92,duration:.3},4.05));
      const res=root.querySelectorAll('[data-vis="5"] .res');gsap.set(res,{opacity:0,y:14,scale:.96});
      tl.to(res,{opacity:1,y:0,scale:1,duration:.35,stagger:.06,ease:'back.out(1.6)'},4.45);
    }
  });
})();

/* ---------- Hero scroll + reveals ---------- */
if(hasGSAP&&!reduce){

  gsap.from('.hero-in > *',{opacity:0,y:24,filter:'blur(8px)',duration:1.1,stagger:.08,ease:'expo.out',clearProps:'filter,transform,opacity'});
  const below=[...document.querySelectorAll('.reveal')].filter(el=>el.getBoundingClientRect().top>innerHeight);
  below.forEach(el=>el.classList.add('pre'));
  ScrollTrigger.batch(below,{start:'top 90%',once:true,onEnter:els=>gsap.to(els,{opacity:1,y:0,duration:.8,stagger:.06,ease:'expo.out',onComplete:()=>els.forEach(e=>{e.classList.remove('pre');e.style.cssText='';})})});
}

/* ---------- Nav ---------- */
const nav=document.getElementById('nav');
new IntersectionObserver(([e])=>nav.classList.toggle('scrolled',!e.isIntersecting),{rootMargin:'-60px 0px 0px 0px'}).observe(document.getElementById('bigTitle'));
const links=[...document.querySelectorAll('.chips a')];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id));}),{rootMargin:'-45% 0px -50% 0px'});
['bring','lead','orbiit','ppa','career','contact'].forEach(id=>{const el=document.getElementById(id);el&&io.observe(el);});

/* ---------- Theme ---------- */
const recol=()=>{readColors();window.__heroCols&&window.__heroCols();};
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',recol);
new MutationObserver(recol).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

/* ---------- Copy ---------- */
const toast=document.getElementById('toast');let tt;
function show(m){toast.textContent=m;toast.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('on'),1800);}
function fallback(){const m=document.getElementById('mail'),r=document.createRange();r.selectNodeContents(m);const s=getSelection();s.removeAllRanges();s.addRange(r);m.scrollIntoView({block:'center'});show('Email selected');}
document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',()=>{try{navigator.clipboard.writeText('affierul@gmail.com').then(()=>show('Email copied'),fallback);}catch(e){fallback();}}));
addEventListener('load',()=>hasGSAP&&ScrollTrigger.refresh());
})();
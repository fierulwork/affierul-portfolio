(()=>{'use strict';
 const section=document.querySelector('.cinema'),scene=section.querySelector('.cinema-sticky'),reduce=matchMedia('(prefers-reduced-motion:reduce)'),clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
 let frame=0,video=null,target=0,ready=false;
 const filmProgress=p=>clamp((p-.23)/.6);
 function draw(){frame=0;const p=reduce.matches?0:clamp(-section.getBoundingClientRect().top/Math.max(1,section.offsetHeight-innerHeight));target=p;scene.style.setProperty('--opening-scale',1+p*.12);scene.style.setProperty('--hero-opacity',1-clamp((p-.06)/.2));scene.style.setProperty('--hero-y',`${-p*60}px`);scene.style.setProperty('--planner-opacity',clamp((p-.18)/.16));scene.style.setProperty('--planner-scale',1.06-clamp((p-.35)/.4)*.06);scene.style.setProperty('--planner-labels',clamp((p-.56)/.12)*(1-clamp((p-.82)/.15)));scene.style.setProperty('--wash',clamp((p-.9)/.1));scene.style.setProperty('--pin-lift',clamp((p-.53)/.18));scene.style.setProperty('--pin-opacity',clamp((p-.49)/.06)*(1-clamp((p-.8)/.1)));scene.style.setProperty('--assembly-progress',clamp((p-.65)/.18));scene.style.setProperty('--assembly-opacity',clamp((p-.62)/.1)*(1-clamp((p-.92)/.08)));scene.querySelector('.hero-in').inert=p>.3;
  scene.style.setProperty('--camera-progress',clamp(p/.35));const burst=clamp((p-.40)/.26);scene.style.setProperty('--explode-progress',burst);scene.style.setProperty('--explode-opacity',clamp((p-.38)/.05)*(1-clamp((p-.92)/.08)));scene.style.setProperty('--press-progress',clamp((p-.37)/.09));
  if(ready&&!reduce.matches&&!video.seeking){const t=filmProgress(p)*Math.max(0,video.duration-.04);if(Math.abs(video.currentTime-t)>.055)video.currentTime=t;}
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(draw);}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduce.addEventListener('change',schedule);draw();
 // The approved still remains the opening. The hand film enters after the camera moves toward the desk.
 const film=section.dataset.film;
 if(film&&!reduce.matches&&!navigator.connection?.saveData){video=document.createElement('video');video.className='cinema-video';video.muted=true;video.playsInline=true;video.preload='auto';video.setAttribute('aria-hidden','true');video.poster='assets/hands-poster.jpg';video.src=matchMedia('(max-width:760px)').matches?(section.dataset.filmMobile||film):film;scene.querySelector('.opening-photo').after(video);video.addEventListener('loadeddata',()=>{ready=Number.isFinite(video.duration)&&video.duration>0;section.classList.toggle('has-film',ready);draw();});video.addEventListener('seeked',()=>{if(Math.abs(video.currentTime-filmProgress(target)*(video.duration-.04))>.1)schedule();});video.addEventListener('error',()=>{ready=false;section.classList.remove('has-film');});}
 const fab=document.getElementById('fab-toggle'),actions=document.getElementById('contact-actions');
 function setFab(open){fab.setAttribute('aria-expanded',String(open));actions.hidden=!open;}
 fab.addEventListener('click',()=>setFab(actions.hidden));actions.addEventListener('click',e=>{if(e.target.closest('a'))setFab(false);});
 document.addEventListener('click',e=>{if(!e.target.closest('.contact-fab'))setFab(false);});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!actions.hidden){setFab(false);fab.focus();}});
 // Keyboard users can bypass the long scroll stories through the main section links.
 const skip=document.querySelector('.skip-link');skip.addEventListener('click',()=>{const summary=document.getElementById('summary');summary.tabIndex=-1;summary.focus({preventScroll:true});});
})();

(()=>{'use strict';
 const dialog=document.getElementById('resume-request'),form=document.getElementById('resume-request-form'),email=document.getElementById('request-email'),context=document.getElementById('request-context'),result=document.getElementById('request-result');
 let previousFocus=null;
 const pattern=/SGD\s+XXXK(?:\/yr)?|\b(?:1XXXX|XXXXX|XXXX|XXXK|XXX|XX|X)(?:[–-](?:XXXX|XX|X))?(?:\+|%)?(?![A-Za-z])/g;
 const containsMask=s=>{pattern.lastIndex=0;return pattern.test(s);};
 const sectionNames={summary:'Leadership scope',lead:'Leadership approach and project outcomes',orbiit:'ORBIIT case recovery',ppa:'Purple Promise Action',bring:'Leadership experience',career:'Career scope',contact:'Résumé request'};
 function labelFor(el){const section=el.closest('section');return sectionNames[section?.id]||'Portfolio scope and outcomes';}
 function scan(root){
  if(root.nodeType===3)root=root.parentElement;if(!root||root.closest?.('script,style,dialog,button,a,[data-private-context]'))return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];let node;
  while((node=walker.nextNode()))if(containsMask(node.nodeValue)&&!node.parentElement.closest('script,style,dialog,button,a,[data-private-context]'))nodes.push(node);
  nodes.forEach(text=>{const parent=text.parentElement;if(!parent)return;const label=labelFor(parent);
   if(parent.namespaceURI==='http://www.w3.org/2000/svg'){const svgText=parent.closest('text');if(svgText){svgText.dataset.privateContext=label;svgText.setAttribute('role','button');svgText.setAttribute('tabindex','0');svgText.setAttribute('aria-label','Request résumé and private details');svgText.classList.add('locked-metric-svg');}return;}
   const value=text.nodeValue,fragment=document.createDocumentFragment();let last=0;pattern.lastIndex=0;let match;
   while((match=pattern.exec(value))){fragment.append(document.createTextNode(value.slice(last,match.index)));const button=document.createElement('button');button.type='button';button.className='locked-metric';button.dataset.privateContext=label;button.setAttribute('aria-label','Request résumé and privately shared figures');button.title='Request private details';button.textContent=match[0];fragment.append(button);last=match.index+match[0].length;}
   fragment.append(document.createTextNode(value.slice(last)));text.replaceWith(fragment);
  });
 }
 function open(label){previousFocus=document.activeElement;context.value=label||'Full résumé and portfolio details';document.getElementById('request-topic').textContent=context.value;result.hidden=true;result.replaceChildren();dialog.showModal();email.focus();}
 document.addEventListener('click',e=>{const target=e.target.closest('[data-private-context],[data-request-resume]');if(!target)return;e.preventDefault();open(target.dataset.privateContext||'Full résumé and portfolio details');});
 document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.locked-metric-svg')){e.preventDefault();open(e.target.dataset.privateContext);}});
 document.getElementById('close-resume-request').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>previousFocus?.focus({preventScroll:true}));
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;
  const data=new FormData(form),address=String(data.get('email')||'').trim(),name=String(data.get('name')||'').trim();
  const subject='Résumé and portfolio details request';
  const body=`Hi Affierul,\n\nI explored your portfolio and would like to request your résumé and discuss the fuller scope of your work.\n\nArea of interest: ${context.value}\nMy email: ${address}\n\n${name?'Regards,\n'+name:'Thank you.'}`;
  const mailto=`mailto:affierul@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  result.hidden=false;result.replaceChildren();const heading=document.createElement('p');heading.textContent='Your request is ready. Review and send it from your email app.';const link=document.createElement('a');link.className='request-send';link.href=mailto;link.textContent='Open email draft ↗';const copy=document.createElement('button');copy.type='button';copy.className='request-copy';copy.textContent='Copy request';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('To: affierul@gmail.com\nSubject: '+subject+'\n\n'+body);copy.textContent='Copied';}catch{const text=document.createElement('pre');text.textContent=body;result.append(text);copy.textContent='Request shown below';}});result.append(heading,link,copy);link.focus();window.location.href=mailto;
 });
 scan(document.body);new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)scan(node);}).observe(document.body,{subtree:true,childList:true});
})();

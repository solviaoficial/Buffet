/* ===== Google Analytics 4 (opcional) =====
   Cole aqui o ID de medição do GA4 (ex.: "G-ABC123XYZ"). Vazio = desativado. */
const GA_ID = 'G-KNP5DWRW3Z';
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
if (GA_ID) {
  const s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  gtag('js', new Date()); gtag('config', GA_ID);
}
function track(name, params){ try { if (GA_ID) gtag('event', name, params || {}); } catch(e){} }
// cliques no WhatsApp viram conversão (generate_lead)
document.addEventListener('click', e => {
  const a = e.target.closest('.wa-link');
  if (a) track('generate_lead', { method: 'whatsapp', intent: a.dataset.intent || 'visita', location: (a.closest('section')||{}).id || 'flutuante' });
  const c = e.target.closest('.chip');
  if (c) track('select_content', { content_type: (c.closest('.q')||{}).dataset ? c.closest('.q').dataset.key : 'chip', item_id: c.textContent.trim() });
  const ig = e.target.closest('a[href*="instagram.com"]');
  if (ig) track('click_instagram');
  const mp = e.target.closest('a[href*="google.com/maps"]');
  if (mp) track('click_map');
});

/* ---------- WhatsApp: pedido montado pelas respostas ---------- */
const WA = '5511943758345';
const answers = {};
function buildMsg(intent){
  const l = ['Olá, Fabi! Vim pelo site e quero fazer o meu pedido 🎂', ''];
  if(answers.tipo) l.push('🎉 Celebração: ' + answers.tipo);
  if(answers.onde) l.push('📍 Local: ' + answers.onde);
  if(answers.convidados) l.push('👥 Convidados: ' + answers.convidados);
  if(answers.quando) l.push('📅 Quando: ' + answers.quando);
  if(Object.keys(answers).length) l.push('');
  l.push(intent === 'orcamento' ? 'Quero receber um orçamento e fechar minha festa!' : 'Gostaria de agendar uma visita para conhecer o buffet.');
  return l.join('\n');
}
function refreshLinks(){
  document.querySelectorAll('.wa-link').forEach(a=>{
    a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(buildMsg(a.dataset.intent));
  });
}
refreshLinks();
document.querySelectorAll('.q').forEach(q=>{
  const key = q.dataset.key;
  q.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{
    q.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));
    c.classList.add('on');
    answers[key] = c.textContent.trim();
    const out = document.querySelector('[data-out="'+key+'"]');
    out.textContent = answers[key]; out.classList.remove('empty','pop'); void out.offsetWidth; out.classList.add('pop');
    document.getElementById('meter').style.width = (Object.keys(answers).length/4*100)+'%';
    refreshLinks();
  }));
});

/* ---------- Soprar velas + confete ---------- */
const cv = document.getElementById('confetti'), cx = cv.getContext('2d');
let parts=[], raf=null;
function sizeCv(){cv.width=innerWidth*devicePixelRatio;cv.height=innerHeight*devicePixelRatio;}
sizeCv(); addEventListener('resize',sizeCv);
function confetti(){
  const cols=['#E36CC0','#F6DE5C','#9CCB4A','#6AAEE0','#8A62B3','#E09042'];
  for(let i=0;i<160;i++) parts.push({x:cv.width/2,y:cv.height*.62,vx:(Math.random()-.5)*26*devicePixelRatio,vy:(-Math.random()*22-8)*devicePixelRatio,
    r:(Math.random()*6+4)*devicePixelRatio,c:cols[i%cols.length],a:Math.random()*6,va:(Math.random()-.5)*.3,life:0});
  if(!raf) tick();
}
function tick(){
  cx.clearRect(0,0,cv.width,cv.height);
  parts.forEach(p=>{p.vy+=.55*devicePixelRatio;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;p.life++;
    cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.fillStyle=p.c;cx.fillRect(-p.r/2,-p.r/4,p.r,p.r/2);cx.restore();});
  parts=parts.filter(p=>p.y<cv.height+50&&p.life<260);
  raf = parts.length ? requestAnimationFrame(tick) : (cx.clearRect(0,0,cv.width,cv.height), null);
}
document.querySelectorAll('.blow').forEach(b=>b.addEventListener('click',()=>{
  document.getElementById('cake').classList.add('out');
  confetti();
  setTimeout(()=>document.getElementById('cake').classList.remove('out'),7000);
}));

/* ---------- Scroll storytelling ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.getElementById('nav'), fab = document.getElementById('fab');

// rainbow paths
(function(){
  const svg=document.getElementById('rainbow');
  const cols=['#D65DB1','#7A55A0','#6AAEE0','#8BBF55','#E9C64A','#D98A3D','#C9505A'];
  const ns='http://www.w3.org/2000/svg';
  cols.forEach((c,i)=>{
    const p=document.createElementNS(ns,'path');
    const o=i*34;
    p.setAttribute('d',`M-60,${470+o} C200,${250+o} 470,${300+o} 720,${400+o} S1150,${520+o} 1480,${260+o}`);
    p.setAttribute('stroke',c);p.setAttribute('stroke-width','35');p.setAttribute('pathLength','1');
    p.style.strokeDasharray='1';p.style.strokeDashoffset='1';
    svg.appendChild(p);
  });
})();

if(window.gsap && window.ScrollTrigger && !reduce){
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ignoreMobileResize:true});

  // progresso
  gsap.to('#progress',{scaleX:1,ease:'none',scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:.3}});

  // intro
  gsap.from('#hc1 .kicker',{y:20,opacity:0,duration:1,delay:.2});
  gsap.from('#hc1 h1',{y:40,opacity:0,duration:1.2,delay:.35,ease:'power3.out'});
  gsap.from('#candle',{scale:1.15,opacity:0,duration:2,delay:.1,ease:'power2.out'});

  // HERO pinado: pedido -> fechar olhos -> luz -> arco-íris
  const tl = gsap.timeline({scrollTrigger:{trigger:'#hero',start:'top top',end:'+=170%',scrub:.8,pin:true,anticipatePin:1,invalidateOnRefresh:true}});
  tl.to('#hint',{opacity:0,duration:.2},0)
    .to('#hc1',{opacity:0,y:-60,duration:1},0)
    .to('#hc2',{opacity:1,duration:1},.6)
    .fromTo('#hc2 h2',{y:40},{y:0,duration:1},.6)
    .to('#glow',{scale:1.8,duration:2},.6)
    .to('#candle',{scale:1.6,duration:2},.6)
    .to('#hc2',{opacity:0,y:-40,duration:.8},2.2)
    .to('#glow',{scale:6,opacity:.9,duration:1.4},2.4)
    .to('#daylight',{opacity:1,duration:1},2.9)
    .to('#candle',{scale:5,duration:1.4},2.2).to('#candle',{opacity:0,duration:.6},2.9)
    .to('#rainbow path',{strokeDashoffset:0,duration:2,stagger:.08,ease:'power2.out'},3.3)
    .to('#b1',{y:'-120vh',x:30,rotation:-8,duration:3.2,ease:'none'},3.3)
    .to('#b2',{y:'-125vh',x:-20,rotation:6,duration:3,ease:'none'},3.5)
    .to('#b3',{y:'-118vh',x:-40,rotation:10,duration:3.4,ease:'none'},3.7)
    .to('#hc3',{opacity:1,duration:.9},4.1)
    .fromTo('#hc3 h2',{y:50},{y:0,duration:.9},4.1)
    .to({}, {duration:.8});

  // nav claro/escuro
  ScrollTrigger.create({trigger:'#hero',start:'bottom-=1 top',end:'bottom top',onEnter:()=>{},onLeave:()=>{}});
  const lightSecs=['#fabi','#dia','#realizados','#avaliacoes'];
  lightSecs.forEach(s=>ScrollTrigger.create({trigger:s,start:'top 60',end:'bottom 60',toggleClass:{targets:nav,className:'light'}}));
  ScrollTrigger.create({trigger:'#hero',start:'60% top',onEnter:()=>nav.classList.add('light'),onLeaveBack:()=>nav.classList.remove('light')});
  ScrollTrigger.create({trigger:'#fabi',start:'top 80%',onEnter:()=>fab.classList.add('show'),onLeaveBack:()=>fab.classList.remove('show')});

  // títulos: revelar por palavra
  document.querySelectorAll('.split').forEach(el=>{
    const html = el.innerHTML;
    el.innerHTML = html.replace(/(<[^>]+>)|([^<\s]+)/g,(m,tag,word)=> tag ? tag : `<span class="line-reveal" style="display:inline-block;vertical-align:top"><span style="display:inline-block">${word}</span></span>`);
    gsap.from(el.querySelectorAll('.line-reveal>span'),{yPercent:110,duration:1,ease:'power4.out',stagger:.045,
      scrollTrigger:{trigger:el,start:'top 85%'}});
  });
  gsap.utils.toArray('.fade').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));

  // Fabi parallax
  gsap.from('#fabiImg',{yPercent:18,opacity:0,duration:1.4,ease:'power3.out',scrollTrigger:{trigger:'#fabi',start:'top 70%'}});
  gsap.to('#fabiImg',{yPercent:-8,ease:'none',scrollTrigger:{trigger:'#fabi',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.to('#blob',{rotation:25,scale:1.06,ease:'none',scrollTrigger:{trigger:'#fabi',start:'top bottom',end:'bottom top',scrub:true}});

  // contadores
  document.querySelectorAll('.count').forEach(el=>{
    const to=parseFloat(el.dataset.to), dec=+(el.dataset.dec||0), o={v:0};
    gsap.to(o,{v:to,duration:2,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%'},
      onUpdate:()=>{el.textContent = o.v.toLocaleString('pt-BR',{minimumFractionDigits:dec,maximumFractionDigits:dec});}});
  });
  gsap.to('#starfill',{width:'96%',duration:2,ease:'power2.out',scrollTrigger:{trigger:'#starfill',start:'top 90%'}});

  // grande dia: horizontal no desktop, cartões empilhando na vertical no celular
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', ()=>{
    const track=document.getElementById('track');
    const dist=()=>track.scrollWidth - innerWidth;
    gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'.track-wrap',start:'top top',end:()=>'+='+dist(),pin:true,scrub:1,invalidateOnRefresh:true}});
  });
  mm.add('(max-width: 900px)', ()=>{
    const cards=gsap.utils.toArray('#track .card');
    cards.forEach((c,i)=>{
      gsap.from(c.querySelectorAll('h3,p,ul,.art,.btn'),{y:30,opacity:0,duration:.8,stagger:.08,ease:'power3.out',scrollTrigger:{trigger:c,start:'top 70%'}});
      const next=cards[i+1]; if(!next) return;
      const shade=document.createElement('span'); shade.className='shade'; c.appendChild(shade);
      const st={trigger:next,start:'top 92%',end:'top 14%',scrub:.6};
      gsap.fromTo(c,{scale:1},{scale:.9,ease:'none',scrollTrigger:st});
      gsap.fromTo(shade,{opacity:0},{opacity:.55,ease:'none',scrollTrigger:{...st}});
    });
  });

  // pedidos realizados: moldura abre + zoom da foto
  gsap.utils.toArray('.story').forEach(st=>{
    const fr=st.querySelector('.frame'), im=fr.querySelector('img');
    gsap.to(fr,{clipPath:'inset(0% 0% 0% 0% round 28px)',ease:'none',scrollTrigger:{trigger:st,start:'top 90%',end:'top 30%',scrub:true}});
    gsap.to(im,{scale:1,ease:'none',scrollTrigger:{trigger:st,start:'top bottom',end:'bottom top',scrub:true}});
    gsap.from(st.querySelectorAll('.num,.tag,h3,p'),{y:36,opacity:0,duration:1,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:st,start:'top 65%'}});
    const mini=st.querySelector('.mini');
    if(mini) gsap.from(mini,{y:120,rotation:6,opacity:0,ease:'none',scrollTrigger:{trigger:st,start:'top 80%',end:'top 20%',scrub:true}});
  });

  // reviews
  gsap.from('.review',{y:70,opacity:0,rotation:(i)=>[-3,2][i],duration:1.1,stagger:.15,ease:'power3.out',scrollTrigger:{trigger:'.reviews',start:'top 85%'}});

  // final: bolo surge e brilho cresce
  gsap.from('#cake',{y:90,scale:.9,opacity:0,duration:1.4,ease:'power3.out',scrollTrigger:{trigger:'#cake',start:'top 90%'}});
  gsap.fromTo('#cake img',{scale:1.15},{scale:1,ease:'none',scrollTrigger:{trigger:'#cake',start:'top bottom',end:'bottom 60%',scrub:true}});
  gsap.fromTo('#glow2',{scale:.3,opacity:0},{scale:1,opacity:1,ease:'none',scrollTrigger:{trigger:'#final',start:'top bottom',end:'center center',scrub:true}});
} else {
  document.querySelectorAll('.count').forEach(el=>{const d=+(el.dataset.dec||0);el.textContent=parseFloat(el.dataset.to).toLocaleString('pt-BR',{minimumFractionDigits:d});});
  document.getElementById('starfill').style.width='96%';
  document.getElementById('hc1').style.position='absolute';
  document.querySelectorAll('#rainbow path').forEach(p=>p.style.strokeDashoffset='0');
  fab.classList.add('show');
  document.querySelectorAll('.frame').forEach(f=>{f.style.clipPath='none';f.querySelector('img').style.transform='none';});
}

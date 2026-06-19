/* ===== Moussa Salman — shared site behaviour ===== */

/* Artwork catalogue (title + year live in JS; images in /art) */
window.ARTWORKS = [
  {n:'01', t:'Look at Me',        y:2024},
  {n:'02', t:'Nature Call',       y:2023},
  {n:'03', t:'No Comment',        y:2024},
  {n:'04', t:'Sea of Love',       y:2020},
  {n:'05', t:'Magic of Nature',   y:2020},
  {n:'06', t:'Shadows',           y:2020},
  {n:'07', t:'Talk to Me',        y:2019},
  {n:'08', t:'Horse Power',       y:2019},
  {n:'09', t:'Refugees',          y:2019},
  {n:'10', t:'Climate Change, We Are Not', y:2021},
  {n:'11', t:'Snail',             y:2019},
  {n:'12', t:'African Way',       y:2020},
  {n:'13', t:'Free Like a Bird',  y:2021},
  {n:'14', t:'Poverty',           y:2020},
  {n:'15', t:'Psycho',            y:2019},
  {n:'16', t:'Ant Queen',         y:2021},
  {n:'17', t:'Just Confused',     y:2021},
  {n:'18', t:'Lion Hunting',      y:2020},
  {n:'19', t:'Magic Hair',        y:2019},
  {n:'20', t:'The Clash',         y:2019},
  {n:'21', t:'The Struggle',      y:2017},
  {n:'22', t:'The Hurricane',     y:2020},
  {n:'23', t:'The Fisherman',     y:2017},
  {n:'24', t:'Stressed',          y:2018},
  {n:'25', t:'A Sad Look',        y:2000},
];

(function(){
  /* ---- mobile menu ---- */
  function initMenu(){
    var burger=document.querySelector('.burger');
    if(!burger)return;
    var body=document.body;
    function toggle(){body.classList.toggle('menu-open');}
    burger.addEventListener('click',toggle);
    var scrim=document.querySelector('.nav-scrim');
    if(scrim)scrim.addEventListener('click',function(){body.classList.remove('menu-open');});
    document.querySelectorAll('.nav a').forEach(function(a){
      a.addEventListener('click',function(){body.classList.remove('menu-open');});
    });
  }

  /* ---- reveal on scroll ---- */
  function initReveal(){
    var els=document.querySelectorAll('.reveal');
    if(!('IntersectionObserver'in window)||!els.length){els.forEach(function(e){e.classList.add('in');});return;}
    var io=new IntersectionObserver(function(en){
      en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){io.observe(e);});
  }

  /* ---- render full gallery grid (Limited Edition Prints) ---- */
  function renderGallery(){
    var grid=document.getElementById('gallery');
    if(!grid)return;
    var html='';
    window.ARTWORKS.forEach(function(a,i){
      html+='<div class="item" data-i="'+i+'">'+
        '<img loading="lazy" src="art/'+a.n+'.jpg" alt="'+a.t+', '+a.y+' — Moussa Salman">'+
        '<div class="cap"><span class="t">'+a.t+'</span><span>'+a.y+'</span></div>'+
        '</div>';
    });
    grid.innerHTML=html;
  }

  /* ---- lightbox ---- */
  function initLightbox(){
    var lb=document.querySelector('.lb');
    if(!lb)return;
    var img=lb.querySelector('img'),
        capT=lb.querySelector('.lb-cap .t'),
        capY=lb.querySelector('.lb-cap .y'),
        order=[],cur=0;

    function build(){
      order=[];
      document.querySelectorAll('[data-i]').forEach(function(el){
        order.push(parseInt(el.getAttribute('data-i'),10));
      });
    }
    function show(idx){
      cur=(idx+window.ARTWORKS.length)%window.ARTWORKS.length;
      var a=window.ARTWORKS[cur];
      img.src='art/'+a.n+'.jpg';
      img.alt=a.t+', '+a.y;
      if(capT)capT.textContent=a.t;
      if(capY)capY.textContent='— '+a.y;
    }
    function open(idx){build();show(idx);lb.classList.add('open');document.body.style.overflow='hidden';}
    function close(){lb.classList.remove('open');document.body.style.overflow='';}

    document.addEventListener('click',function(e){
      var it=e.target.closest('[data-i]');
      if(it){open(parseInt(it.getAttribute('data-i'),10));}
    });
    lb.querySelector('.lb-close').addEventListener('click',close);
    lb.querySelector('.lb-next').addEventListener('click',function(){show(cur+1);});
    lb.querySelector('.lb-prev').addEventListener('click',function(){show(cur-1);});
    lb.addEventListener('click',function(e){if(e.target===lb)close();});
    document.addEventListener('keydown',function(e){
      if(!lb.classList.contains('open'))return;
      if(e.key==='Escape')close();
      if(e.key==='ArrowRight')show(cur+1);
      if(e.key==='ArrowLeft')show(cur-1);
    });
  }

  document.addEventListener('DOMContentLoaded',function(){
    initMenu();renderGallery();initLightbox();initReveal();
    /* contact form: graceful no-backend handler */
    var f=document.getElementById('contactForm');
    if(f)f.addEventListener('submit',function(e){
      e.preventDefault();
      var note=document.getElementById('formNote');
      if(note)note.classList.add('show');
      f.reset();
    });
  });
})();

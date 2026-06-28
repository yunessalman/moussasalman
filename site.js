/* ===== Moussa Salman — shared site behaviour ===== */

/* Artwork catalogue (title + year live in JS; images in /art) */
/* ar = long side / short side, derived from each source image's pixels */
window.ARTWORKS = [
  {n:'01', t:'Look at Me',        y:2024, ar:1.000},
  {n:'02', t:'Nature Call',       y:2023, ar:1.500},
  {n:'03', t:'No Comment',        y:2024, ar:1.000},
  {n:'04', t:'Sea of Love',       y:2020, ar:1.500},
  {n:'05', t:'Magic of Nature',   y:2020, ar:1.333},
  {n:'06', t:'Shadows',           y:2020, ar:1.333},
  {n:'07', t:'Talk to Me',        y:2019, ar:1.333},
  {n:'08', t:'Horse Power',       y:2019, ar:1.671},
  {n:'09', t:'Refugees',          y:2019, ar:1.507},
  {n:'10', t:'Climate Change, We Are Not', y:2021, ar:1.500},
  {n:'11', t:'Snail',             y:2019, ar:1.499},
  {n:'12', t:'African Way',       y:2020, ar:1.250},
  {n:'13', t:'Free Like a Bird',  y:2021, ar:1.500},
  {n:'14', t:'Poverty',           y:2020, ar:1.328},
  {n:'15', t:'Psycho',            y:2019, ar:1.333},
  {n:'16', t:'Ant Queen',         y:2021, ar:1.417},
  {n:'17', t:'Just Confused',     y:2021, ar:1.417},
  {n:'18', t:'Lion Hunting',      y:2020, ar:1.500},
  {n:'19', t:'Magic Hair',        y:2019, ar:1.500},
  {n:'20', t:'The Clash',         y:2019, ar:1.231},
  {n:'21', t:'The Struggle',      y:2017, ar:1.207},
  {n:'22', t:'The Hurricane',     y:2020, ar:1.500},
  {n:'23', t:'The Fisherman',     y:2017, ar:1.238},
  {n:'24', t:'Stressed',          y:2018, ar:1.000},
  {n:'25', t:'A Sad Look',        y:2000, ar:2.171},
  {n:'26', t:'The Birds',             y:2021, ar:1.250},
  {n:'27', t:'Together All the Way',  y:2021, ar:1.333},
  {n:'28', t:'The Last Kiss',         y:2021, ar:1.250},
  {n:'29', t:'The Silent',            y:2023, ar:1.333},
  {n:'30', t:'The Little Girl',       y:2021, ar:1.500},
  {n:'31', t:'Worries',               y:2021, ar:1.231},
  {n:'32', t:'It Is War',             y:2022, ar:1.328},
  {n:'33', t:'Nature Attacks Back',   y:2020, ar:1.509},
  {n:'34', t:'Sitting with Myself',   y:2019, ar:1.333},
  {n:'35', t:'Stay Safe',             y:2020, ar:1.333},
  {n:'36', t:'Alien Refugee',         y:2019, ar:1.333},
  {n:'37', t:'Struggle',              y:2019, ar:1.333},
];

/* 6 limited editions — fixed size ladder + price ladder, shared by every work.
   Short side (cm) is the base; long side = round(base * aspect ratio). */
window.EDITION_BASES  = [40, 60, 80, 100, 120, 140];
window.EDITION_PRICES = [4300, 6300, 9300, 12300, 14850, 18500];
window.editionsFor = function(a){
  return window.EDITION_BASES.map(function(b,i){
    var short=b, long=Math.round(b*a.ar);
    return {
      i:i+1,
      size:short+' \u00d7 '+long+' cm',
      price:window.EDITION_PRICES[i]
    };
  });
};
window.fmtUSD = function(n){ return '$'+n.toLocaleString('en-US'); };

(function(){
  /* ---- mobile menu ---- */
  function initMenu(){
    var burger=document.querySelector('.burger');
    if(!burger)return;
    var body=document.body;
    function setOpen(open){body.classList.toggle('menu-open',open);body.style.overflow=open?'hidden':'';}
    function toggle(){setOpen(!body.classList.contains('menu-open'));}
    burger.addEventListener('click',toggle);
    var scrim=document.querySelector('.nav-scrim');
    if(scrim)scrim.addEventListener('click',function(){setOpen(false);});
    document.querySelectorAll('.nav a').forEach(function(a){
      a.addEventListener('click',function(){setOpen(false);});
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

  /* ---- render full gallery grid (Limited Editions) ---- */
  function renderGallery(){
    var grid=document.getElementById('gallery');
    if(!grid)return;
    var html='';
    window.ARTWORKS.forEach(function(a,i){
      var eds=window.editionsFor(a);
      /* deterministic pick of one of the 6 editions, stable per painting */
      var pick=eds[(parseInt(a.n,10)*7+3)%6];
      html+='<div class="item" data-i="'+i+'">'+
        '<img loading="lazy" src="art/'+a.n+'.jpg" alt="'+a.t+', '+a.y+' — Moussa Salman">'+
        '<div class="cap"><span class="t">'+a.t+'</span><span>'+a.y+'</span></div>'+
        '<div class="price-tag"><span class="ed">Edition '+pick.i+'/6 · '+pick.size+'</span><span class="pr">'+window.fmtUSD(pick.price)+'</span></div>'+
        '</div>';
    });
    grid.innerHTML=html;
  }

  /* ---- lightbox ---- */
  function initLightbox(){
    var lb=document.querySelector('.lb');
    if(!lb)return;
    var img=lb.querySelector('img'),
        capT=lb.querySelector('.lb-cap .t, .lb-title .t'),
        capY=lb.querySelector('.lb-cap .y, .lb-title .y'),
        edBox=lb.querySelector('.lb-editions'),
        enquire=lb.querySelector('.lb-enquire'),
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
      if(edBox){
        edBox.innerHTML=window.editionsFor(a).map(function(e){
          var q='contact.html?work='+encodeURIComponent(a.t)+
                '&edition='+encodeURIComponent(e.i+'/6')+
                '&size='+encodeURIComponent(e.size)+
                '&price='+encodeURIComponent(window.fmtUSD(e.price));
          return '<div class="lb-ed"><span class="n">'+e.i+'/6</span>'+
            '<span class="sz">'+e.size+'</span>'+
            '<span class="pr">'+window.fmtUSD(e.price)+'</span>'+
            '<a class="ed-inq" href="'+q+'">Enquire to buy</a></div>';
        }).join('');
      }
      if(enquire)enquire.href='contact.html?work='+encodeURIComponent(a.t);
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

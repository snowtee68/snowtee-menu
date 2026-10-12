(() => {
  'use strict';
  const orderUrl='https://xn--12ca0dlkcdj5coe8c9fxa0hzg3bzd0a.com/?shop=a320a425-8c1d-44b0-89c0-75acd94ced45';
  const button=document.getElementById('navToggle');
  const nav=document.getElementById('mobileNav');
  button?.addEventListener('click',()=>{
    const open=button.getAttribute('aria-expanded')==='true';
    button.setAttribute('aria-expanded',String(!open));
    button.setAttribute('aria-label',open?'เปิดเมนูนำทาง':'ปิดเมนูนำทาง');
    nav.hidden=open;
  });
  nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.hidden=true;button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','เปิดเมนูนำทาง')}));
  const sources={
    'ice-cream':['assets/originals/ice-cream.png','ไอศกรีมโคนซิกเนเจอร์'],
    'fruit-tea':['assets/originals/fruit-tea.png','ซีรีส์ชาผลไม้สด'],
    'milk-tea':['assets/originals/milk-tea.png','ชานมหอมหวาน'],
    'smoothie':['assets/originals/smoothie.png','ซีรีส์สมูทตี้'],
    'sundae':['assets/originals/sundae.png','เมนูซันเดย์'],
    'bakery':['assets/originals/bakery.png','เมนูเบเกอรี่'],
    'pizza':['assets/originals/pizza.png','พิซซ่าฮาวายเอี้ยน'],
    'matcha':['assets/originals/matcha.png','เมนูมัทฉะ'],
    'okinawa':['assets/originals/okinawa.jpg','เกลือหิมะโอกินาวะ']
  };
  const dialog=document.getElementById('imageDialog');
  const dialogImage=document.getElementById('dialogImage');
  const title=document.getElementById('dialogTitle');
  let previousFocus=null;
  function openPhoto(source,heading,alt){
    if(!dialog || !dialogImage)return;
    previousFocus=document.activeElement;
    dialogImage.src=source; dialogImage.alt=alt||heading||'แผ่นเมนู SNOWTEE';
    title.textContent=heading||'เมนู SNOWTEE';
    dialog.showModal();
  }
  document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{
    const item=sources[button.dataset.image];
    if(item)openPhoto(item[0],item[1],button.querySelector('img')?.alt);
  }));
  document.querySelectorAll('img[data-full]').forEach(img=>{
    const trigger=()=>{
      const name=img.alt.replace(/^แผ่นเมนู/,'');
      openPhoto(img.dataset.full,name,img.alt);
    };
    img.addEventListener('click',trigger);
    img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();trigger()}});
  });
  document.getElementById('dialogClose')?.addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  dialog?.addEventListener('close',()=>{dialogImage.removeAttribute('src');previousFocus?.focus?.()});
  document.querySelectorAll('a[href*="shop=a320a425-8c1d-44b0-89c0-75acd94ced45"]').forEach(a=>a.href=orderUrl);
})();

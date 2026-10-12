(()=>{
 'use strict';
 const products=window.SNOWTEE_MENU||[];
 const cats=[['all','ทั้งหมด'],['fruit','ชาผลไม้'],['milk','ชานม'],['ice','ไอศกรีม'],['smoothie','สมูทตี้'],['matcha','มัทฉะ'],['bakery','เบเกอรี่'],['savory','พิซซ่า']];
 const catLabels=Object.fromEntries(cats);
 const grid=document.querySelector('#menu-grid');
 const catCtrl=document.querySelector('#category-controls');
 const search=document.querySelector('#menu-search');
 const sort=document.querySelector('#price-sort');
 const results=document.querySelector('#result-count');
 const empty=document.querySelector('#empty-state');
 const dialog=document.querySelector('#image-dialog');
 const dialogContent=document.querySelector('#dialog-content');
 const bakery=document.querySelector('#bakery-grid');
 const posters=document.querySelector('#poster-gallery');
 let activeCat='all';let q='';let sortValue='default';
 const clean=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const price=p=>p===null?'สอบถามราคา':`${Number(p).toLocaleString('th-TH')} บาท`;
 const preview=p=>p.preview||p.image;
 const categoryName=c=>catLabels[c]||'SNOWTEE';
 catCtrl.innerHTML=cats.map(([id,name])=>`<button type="button" class="cat-button ${id==='all'?'active':''}" data-cat="${id}" aria-pressed="${id==='all'}">${clean(name)}</button>`).join('');
 function render(){
  let items=products.filter(p=>(activeCat==='all'||p.category===activeCat)&&(!q||`${p.name} ${p.en||''} ${categoryName(p.category)}`.toLocaleLowerCase().includes(q)));
  if(sortValue==='asc')items.sort((a,b)=>(a.price??99999)-(b.price??99999));
  if(sortValue==='desc')items.sort((a,b)=>(b.price??-1)-(a.price??-1));
  if(sortValue==='alpha')items.sort((a,b)=>a.name.localeCompare(b.name,'th'));
  results.textContent=`${activeCat==='all'?'เมนูทั้งหมด':categoryName(activeCat)} · ${items.length} รายการ`;
  empty.hidden=items.length!==0;
  grid.innerHTML=items.map(p=>`<button type="button" class="menu-item" data-product="${p.id}" aria-label="ดูภาพเต็ม ${clean(p.name)}"><div class="menu-image"><img src="${clean(preview(p))}" loading="lazy" alt="${clean(p.name)}">${p.badge?`<span class="menu-badge">${clean(p.badge)}</span>`:''}</div><div class="menu-caption"><p>SNOWTEE · ${clean(categoryName(p.category))}</p><h3>${clean(p.name)}</h3><span class="en">${clean(p.en||'')}</span><div class="menu-end"><span class="menu-price ${p.price===null?'unknown':''}">${p.price===null?'สอบถามราคา':`${Number(p.price)} <span>บาท</span>`}</span><span class="menu-arrow" aria-hidden="true">↗</span></div></div></button>`).join('');
 }
 function pick(cat){activeCat=cat;catCtrl.querySelectorAll('button').forEach(btn=>{const yes=btn.dataset.cat===cat;btn.classList.toggle('active',yes);btn.setAttribute('aria-pressed',String(yes));});render();}
 catCtrl.addEventListener('click',ev=>{const b=ev.target.closest('[data-cat]');if(b)pick(b.dataset.cat);});
 document.querySelectorAll('[data-go-cat]').forEach(a=>a.addEventListener('click',()=>{pick(a.dataset.goCat);}));
 search.addEventListener('input',e=>{q=e.target.value.trim().toLocaleLowerCase();render();});
 sort.addEventListener('change',e=>{sortValue=e.target.value;render();});
 const escapeModal=()=>dialog.close();
 document.querySelector('#dialog-close').addEventListener('click',escapeModal);
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 function openProduct(p){
  dialogContent.innerHTML=`<img class="modal-img" src="${clean(p.image)}" alt="${clean(p.name)}"><div class="modal-copy"><p class="micro-label">SNOWTEE · ${clean(categoryName(p.category))}</p><h3>${clean(p.name)}</h3><small>${clean(p.en||'')}</small><div class="dialog-price">${p.price===null?'สอบถามราคา':`${p.price} <span>บาท</span>`}</div><p>ภาพแสดงสินค้าต้นฉบับของร้าน ไม่มีการดัดแปลงรูปทรงของสินค้า<br>กรุณายืนยันราคาและสินค้าที่มีจำหน่ายกับสาขาตลาดกระทุ่มแบน</p></div>`;
  dialog.showModal();
 }
 grid.addEventListener('click',ev=>{const b=ev.target.closest('[data-product]');if(!b)return;const p=products.find(x=>x.id===Number(b.dataset.product));if(p)openProduct(p);});
 // Bakery uses the original product files; full image is always displayed with contain.
 const chosenBakery=[32,36,37,34,33];
 bakery.innerHTML=chosenBakery.map(id=>products.find(p=>p.id===id)).filter(Boolean).map(p=>`<button type="button" class="bakery-card" data-bakery="${p.id}" aria-label="ดูภาพเต็ม ${clean(p.name)}"><img loading="lazy" src="${clean(preview(p))}" alt="${clean(p.name)}"><div class="bakery-meta"><div><small>SNOWTEE BAKERY</small><h3>${clean(p.name)}</h3></div><b>${p.price===null?'สอบถามราคา':p.price+'฿'}</b></div></button>`).join('');
 bakery.addEventListener('click',e=>{const b=e.target.closest('[data-bakery]');if(!b)return;const p=products.find(x=>x.id===Number(b.dataset.bakery));if(p)openProduct(p);});
 const posterData=[
  ['fruit','ชาผลไม้สด','assets/poster-fruit.png','assets/thumbs/poster-fruit.webp'],
  ['milk','ชานมหอมหวาน','assets/poster-milk.png','assets/thumbs/poster-milk.webp'],
  ['sundae','เมนูซันเดย์','assets/poster-sundae.png','assets/thumbs/poster-sundae.webp'],
  ['smoothie','ซีรีส์สมูทตี้','assets/poster-smoothie.png','assets/thumbs/poster-smoothie.webp']
 ];
 posters.innerHTML=posterData.map(([key,title,,thumb])=>`<button type="button" class="poster-card" data-poster="${key}" aria-label="ดูภาพเต็ม ${title}"><img src="${thumb}" alt="ภาพแผ่นเมนู ${title}" loading="lazy"><span class="post-text"><strong>${title}</strong><span>↗</span></span></button>`).join('');
 posters.addEventListener('click',e=>{const b=e.target.closest('[data-poster]');if(!b)return;const p=posterData.find(x=>x[0]===b.dataset.poster);if(!p)return;dialogContent.innerHTML=`<div class="modal-poster-head">${clean(p[1])}</div><div class="modal-poster"><img src="${clean(p[2])}" alt="แผ่นเมนู ${clean(p[1])}"></div>`;dialog.showModal();});
 render();
})();

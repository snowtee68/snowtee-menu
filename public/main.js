(() => {
  'use strict';
  const items = window.SNOWTEE_MENU || [];
  const categories = [
    ['all','✦','ทั้งหมด'], ['fruit','🍋','ชาผลไม้'], ['milk','🧋','ชานม'],
    ['matcha','🍵','มัทฉะ'], ['smoothie','🥤','สมูทตี้'], ['ice','🍦','ไอศกรีม'],
    ['bakery','🥐','เบเกอรี่'], ['savory','🍕','ของอร่อย']
  ];
  const catNames = Object.fromEntries(categories.map(([id,,label]) => [id,label]));
  let current = 'all';
  let keyword = '';
  let sort = 'default';
  const categoryList = document.getElementById('category-list');
  const grid = document.getElementById('menu-grid');
  const search = document.getElementById('menu-search');
  const clear = document.getElementById('search-clear');
  const sortSelect = document.getElementById('sort-select');
  const total = document.getElementById('total-count');
  const result = document.getElementById('result-label');
  const empty = document.getElementById('empty-state');
  const productDialog = document.getElementById('product-dialog');
  const boardDialog = document.getElementById('board-dialog');
  const escape = s => String(s ?? '').replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  total.textContent = `ทั้งหมด ${items.length} รายการ`;
  categoryList.innerHTML = categories.map(([id,emoji,label]) => `<button type="button" class="cat-pill${id==='all'?' active':''}" data-cat="${id}" aria-pressed="${id==='all'}"><span aria-hidden="true">${emoji}</span>${label}</button>`).join('');
  const price = p => p === null ? '<span class="price-unknown">สอบถามราคา</span>' : `${Number(p).toLocaleString('th-TH')}<small> ฿</small>`;
  function fallback(p){return `<div class="card-placeholder ${p.category==='savory'?'placeholder-pizza':''}" aria-hidden="true">${p.category==='savory'?'🍕':'🥤'}</div>`;}
  function list(){
    let shown = items.filter(p => (current === 'all' || p.category === current) && (!keyword || `${p.name} ${p.en} ${catNames[p.category]||''}`.toLocaleLowerCase().includes(keyword)));
    const cmp = (a,b) => (a.price??99999)-(b.price??99999);
    if(sort==='low') shown.sort(cmp);
    if(sort==='high') shown.sort((a,b) => (b.price??-1)-(a.price??-1));
    if(sort==='az') shown.sort((a,b) => a.name.localeCompare(b.name,'th'));
    result.textContent = `${current==='all'?'ทุกหมวดหมู่':catNames[current]} · ${shown.length} รายการ`;
    empty.classList.toggle('hidden',!!shown.length);
    grid.innerHTML = shown.map(p => `
      <button type="button" class="product-card" data-id="${p.id}" aria-label="ดูรายละเอียด ${escape(p.name)}">
        <div class="card-img${p.image?.startsWith('assets/photo-')?' has-full-photo':''}">
          ${p.image?`<img src="${escape(p.image)}" loading="lazy" alt="${escape(p.name)}"/>`:fallback(p)}
          ${p.badge?`<span class="card-tag">${escape(p.badge)}</span>`:''}
        </div>
        <div class="card-details"><h3>${escape(p.name)}</h3><div class="card-en">${escape(p.en||'SNOWTEE MENU')}</div>
          <div class="card-bottom"><div class="card-price">${price(p.price)}</div><span class="card-go" aria-hidden="true">↗</span></div>
        </div>
      </button>`).join('');
  }
  function chooseCategory(id){current=id; categoryList.querySelectorAll('[data-cat]').forEach(el=>{const is=el.dataset.cat===id;el.classList.toggle('active',is);el.setAttribute('aria-pressed',String(is));});list();}
  categoryList.addEventListener('click',e=>{const btn=e.target.closest('[data-cat]');if(btn)chooseCategory(btn.dataset.cat);});
  search.addEventListener('input',e=>{keyword=e.target.value.trim().toLocaleLowerCase();clear.style.display=keyword?'inline':'none';list();});
  function resetSearch(){search.value='';keyword='';clear.style.display='none';chooseCategory('all');}
  clear.addEventListener('click',resetSearch);
  clear.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();resetSearch();}});
  document.getElementById('reset-filter').addEventListener('click',resetSearch);
  sortSelect.addEventListener('change',e=>{sort=e.target.value;list();});
  grid.addEventListener('click',e=>{
    const card=e.target.closest('.product-card');if(!card)return;
    const p=items.find(x=>x.id===Number(card.dataset.id));if(!p)return;
    document.getElementById('product-modal-body').innerHTML=`
      ${p.image?`<img class="modal-img" src="${escape(p.image)}" alt="${escape(p.name)}" />`:`<div class="card-placeholder" style="height:250px">${p.category==='savory'?'🍕':'🥤'}</div>`}
      <div class="modal-body-copy"><div class="section-kicker">${escape(catNames[p.category]||'SNOWTEE')}</div>
        <h2>${escape(p.name)}</h2><div class="modal-en">${escape(p.en)}</div>
        <div class="modal-price">${price(p.price)}</div>
        <p class="modal-note">${p.price===null?'เมนูนี้ยังไม่มีราคาที่ตรวจสอบแล้ว กรุณาสอบถามราคาปัจจุบันกับทางร้าน':'ราคาในภาพเมนูอ้างอิง กรุณาตรวจสอบราคาปัจจุบันกับทางร้านอีกครั้ง'}<br/>ดูรายละเอียดสินค้าและความพร้อมจำหน่ายได้ที่ SNOWTEE สาขาตลาดกระทุ่มแบน</p></div>`;
    productDialog.showModal();
  });
  const boardTitles={fruit:'ซีรีส์ชาผลไม้',milk:'ซีรีส์ชานม',ice:'ไอศกรีมและซันเดย์',bakery:'เบเกอรี่','fruit-poster':'ซีรีส์ชาผลไม้สด','ice-poster':'เมนูซันเดย์','milk-poster':'ชานมหอมหวาน','smoothie-poster':'ซีรีส์สมูทตี้'};
  const boardImages={fruit:'assets/board-fruit.webp',milk:'assets/board-milk.webp',ice:'assets/board-ice.webp',bakery:'assets/board-bakery.webp','fruit-poster':'assets/board-fruit-poster.png','ice-poster':'assets/board-ice-poster.png','milk-poster':'assets/board-milk-poster.png','smoothie-poster':'assets/board-smoothie-poster.png'};
  document.getElementById('board-grid').addEventListener('click',e=>{
    const card=e.target.closest('[data-board]');if(!card)return;
    const slug=card.dataset.board;
    document.getElementById('board-modal-body').innerHTML=`<div class="board-modal-header">${escape(boardTitles[slug])} <small style="color:#8c7777;font:400 12px Prompt">— ภาพเมนูจากร้าน</small></div><img src="${escape(boardImages[slug]||('assets/board-'+slug+'.webp'))}" alt="${escape(boardTitles[slug])}"/>`;
    boardDialog.showModal();
  });
  document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',()=>el.closest('dialog').close()));
  [productDialog,boardDialog].forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close();}));
  list();
})();

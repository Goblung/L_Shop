(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();const C="http://localhost:4000/api",R=C.replace(/\/api\/?$/,"");async function p(e,a){const t=await fetch(`${C}${e}`,{...a,credentials:"include",headers:{"Content-Type":"application/json",...(a==null?void 0:a.headers)??{}}});if(!t.ok){let s="Ошибка запроса";try{const n=await t.json();s=n.error??n.message??s}catch{}throw new Error(s)}return await t.json()}const h={register:e=>p("/auth/register",{method:"POST",body:JSON.stringify(e)}),login:e=>p("/auth/login",{method:"POST",body:JSON.stringify(e)}),me:()=>p("/auth/me"),logout:()=>p("/auth/logout",{method:"POST"}),basket:()=>p("/basket/active"),addToBasket:(e,a)=>p("/basket/items",{method:"POST",body:JSON.stringify({productId:e,quantity:a})}),products:async()=>(await p("/products")).map(a=>{var o;const t=a,s=typeof((o=t.images)==null?void 0:o.preview)=="string"?t.images.preview:void 0,n=t.images&&typeof t.images=="object"?{...t.images,preview:s&&s.startsWith("/img/")?`${R}${s}`:s??t.images.preview}:t.images;return{...t,id:t.id,images:n,delivery:t.delivery?{...t.delivery,earlyDate:new Date(t.delivery.earlyDate)}:void 0}}),deliveries:()=>p("/delivery/active"),createDelivery:e=>p("/delivery",{method:"POST",body:JSON.stringify(e)})},S=new Map;function E(e,a){S.set(e,a)}async function u(e){window.history.pushState({},"",e),await $()}async function $(){const e=S.get(window.location.pathname)??S.get("/404");e&&await e()}function Y(){document.querySelectorAll("[data-link]").forEach(e=>{e.addEventListener("click",a=>{a.preventDefault();const t=e.getAttribute("href");t&&u(t)})})}const l={user:null};let L=null,H=!1;async function q(){if(!l.user)return;const e=document.getElementById("user-menu-basket");if(e)try{const t=(await h.basket()).items.reduce((s,n)=>s+n.quantity,0);e.textContent=`Корзина (${t})`}catch{}}function J(){H||(H=!0,window.addEventListener("basket:updated",()=>{q()}))}function G(e){return`
    <header class="topbar">
      <div class="topbar-left">
        <div class="brand">Shop</div>
        <nav class="menu">
          <a href="/" data-link>Главная</a>
        </nav>
      </div>
      <div class="topbar-right">
        ${l.user?`
          <div class="user-menu" id="user-menu">
            <button type="button" class="user-badge user-menu-trigger" id="user-menu-trigger">
              ${l.user.name}
            </button>
            <div class="user-menu-popover" id="user-menu-popover" hidden>
              <button type="button" class="user-menu-item" id="user-menu-basket">Корзина</button>
            </div>
          </div>
        `:'<button type="button" class="auth-button" id="auth-button">Вход / Регистрация</button>'}
      </div>
    </header>
    <main>${e}</main>
  `}function k(e,a){e.innerHTML=G(a),Y(),z(),J(),q()}function z(){const e=document.getElementById("auth-button"),a=document.getElementById("user-menu"),t=document.getElementById("user-menu-trigger"),s=document.getElementById("user-menu-popover"),n=document.getElementById("user-menu-basket");if(!l.user){e instanceof HTMLButtonElement&&e.addEventListener("click",()=>{u("/auth")});return}if(!a||!t||!s||!n)return;const o=()=>{s.hidden=!s.hidden};t.addEventListener("click",d=>{d.stopPropagation(),o()}),n.addEventListener("click",d=>{d.stopPropagation(),s.hidden=!0,u("/basket")}),L&&document.removeEventListener("click",L),L=d=>{const y=d.target;if(!y){s.hidden=!0;return}a.contains(y)||(s.hidden=!0)},document.addEventListener("click",L)}async function U(e){try{const a=await h.basket(),t=a.items.reduce((s,n)=>s+n.price*n.quantity,0);k(e,`
        <section class="card">
          <h2>Корзина</h2>
          ${a.items.length===0?"<p>Корзина пуста</p>":`
              <ul class="basket-list">
                ${a.items.map(s=>`<li><span data-title="basket">${s.name}</span> — <span data-price="basket">${s.price} BYN</span> x ${s.quantity}</li>`).join("")}
              </ul>
              <p><strong>Итого: ${t} BYN</strong></p>
            `}
        </section>
      `)}catch{await u("/auth")}}const _={cpu:"Процессоры",gpu:"Видеокарты",ram:"Оперативная память",ssd:"SSD",hdd:"Жесткие диски",motherboard:"Материнские платы",psu:"Блоки питания",case:"Корпуса",cooler:"Системы охлаждения"},K=e=>_[e]??e;function W(e,a){const t=typeof e.discount=="number"&&e.discount>0,s=t?e.price*(1-e.discount/100):e.price;return`
    <article class="product-card" data-product-card="${String(e.id)}">
      <img class="product-image" src="${e.images.preview}" alt="${e.title}" />
      <h3 class="product-title">${e.title}</h3>
      <div class="product-price">
        ${t?`
          <span class="old-price">${e.price} BYN</span>
          <span class="new-price">${s.toFixed(2)} BYN</span>
        `:`<span class="current-price">${e.price} BYN</span>`}
      </div>
      <p class="product-availability">
        Наличие: ${e.isAvailable?"В наличии":"Под заказ"}
      </p>
      <p class="product-categories">
        Категории: ${e.categories.map(K).join(", ")}
      </p>

      ${a?`
        <div class="product-actions">
          <label class="product-quantity">
            Кол-во
            <input type="number" min="1" value="1" data-quantity />
          </label>
          <button type="button" class="btn" data-add-to-basket="${String(e.id)}">
            В корзину
          </button>
        </div>
      `:""}
    </article>
  `}async function Q(e){k(e,`
      <section class="catalog-page" id="catalog-root">
        <h2 class="catalog-title">Каталог компьютерных запчастей</h2>

        <div class="filters-panel" id="filters-panel">
          <input
            id="catalog-search"
            type="text"
            placeholder="Поиск по названию или описанию (CPU, GPU, RAM, SSD...)"
            value=""
          />

          <select id="catalog-sort">
            <option value="asc">Цена: по возрастанию</option>
            <option value="desc">Цена: по убыванию</option>
          </select>

          <div class="category-filters">
            <h4>Типы запчастей</h4>
            <div id="catalog-categories" class="category-options"></div>
          </div>

          <label class="availability-filter">
            <input id="catalog-available" type="checkbox" />
            Только в наличии
          </label>
        </div>

        <div class="products-grid" id="products-grid">
          <p class="muted">Загрузка товаров...</p>
        </div>
      </section>
    `);const a=document.getElementById("catalog-root"),t=document.getElementById("products-grid"),s=document.getElementById("catalog-search"),n=document.getElementById("catalog-sort"),o=document.getElementById("catalog-available"),d=document.getElementById("catalog-categories");if(!(a instanceof HTMLElement)||!(t instanceof HTMLElement)||!(s instanceof HTMLInputElement)||!(n instanceof HTMLSelectElement)||!(o instanceof HTMLInputElement)||!(d instanceof HTMLElement))return;let y=[],M="",T="asc",f=[],I=!1;const D=!!l.user,P=r=>typeof r.discount=="number"&&r.discount>0?r.price*(1-r.discount/100):r.price,N={cpu:"Процессоры",gpu:"Видеокарты",ram:"Оперативная память",ssd:"SSD",hdd:"Жесткие диски",motherboard:"Материнские платы",psu:"Блоки питания",case:"Корпуса",cooler:"Системы охлаждения"},F=r=>N[r]??r,j=()=>{const r=M.trim().toLowerCase(),i=new Set(f);return y.filter(c=>{const m=r.length===0||c.title.toLowerCase().includes(r)||c.description.toLowerCase().includes(r),g=i.size===0||c.categories.some(B=>i.has(B)),w=!I||c.isAvailable;return m&&g&&w}).sort((c,m)=>{const g=P(c)-P(m);return T==="asc"?g:-g})},b=()=>{const r=j();t.innerHTML=r.length>0?r.map(i=>W(i,D)).join(""):'<p class="muted">Товары не найдены</p>'},x=r=>{d.innerHTML=r.map(i=>{const c=f.includes(i);return`
          <label class="category-option">
            <input type="checkbox" data-category="${i}" ${c?"checked":""} />
            ${F(i)}
          </label>
        `}).join("")};s.addEventListener("input",()=>{M=s.value,b()}),n.addEventListener("change",()=>{T=n.value==="desc"?"desc":"asc",b()}),o.addEventListener("change",()=>{I=o.checked,b()}),a.addEventListener("change",r=>{const i=r.target;if(!(i instanceof HTMLInputElement))return;const c=i.dataset.category;c&&(i.checked?f.includes(c)||(f=[...f,c]):f=f.filter(m=>m!==c),b())}),a.addEventListener("click",async r=>{const i=r.target;if(!(i instanceof HTMLElement))return;const c=i.closest("button[data-add-to-basket]");if(!c)return;if(!l.user){await u("/auth");return}const m=String(c.dataset.addToBasket??"");if(!m)return;const g=c.closest("[data-product-card]"),w=g==null?void 0:g.querySelector("input[data-quantity]"),B=w?Math.max(1,parseInt(w.value||"1",10)||1):1;await h.addToBasket(m,B),window.dispatchEvent(new Event("basket:updated"))});try{y=await h.products();const r=Array.from(new Set(y.flatMap(i=>i.categories))).sort();x(r),b()}catch{t.innerHTML='<p class="error">Ошибка загрузки каталога</p>'}}function O(e,a){k(e,`
      <section class="auth-page">
        <article class="card">
          <h2>Авторизация</h2>
          ${a?`<p class="error">${a}</p>`:""}

          <form id="login-form">
            <input name="identifier" placeholder="Имя / email / логин / телефон" required />
            <input name="password" type="password" placeholder="Пароль" required />
            <button type="submit">Войти</button>
          </form>

          <div class="auth-actions">
            <button type="button" id="to-register">Нет аккаунта? Перейти на регистрацию</button>
            <button type="button" id="to-home">На главную</button>
          </div>
        </article>
      </section>
    `);const t=document.getElementById("login-form"),s=document.getElementById("to-register"),n=document.getElementById("to-home");t instanceof HTMLFormElement&&(t.addEventListener("submit",o=>{o.preventDefault(),V(t,e)}),s instanceof HTMLButtonElement&&s.addEventListener("click",()=>{u("/register")}),n instanceof HTMLButtonElement&&n.addEventListener("click",()=>{u("/")}))}async function V(e,a){const t=new FormData(e),s={identifier:String(t.get("identifier")??""),password:String(t.get("password")??"")};try{const n=await h.login(s);l.user=n.user,await u("/")}catch(n){O(a,n instanceof Error?n.message:"Ошибка авторизации")}}function A(e,a){k(e,`
      <section class="auth-page">
        <article class="card">
          <h2>Регистрация</h2>
          ${a?`<p class="error">${a}</p>`:""}
          <form id="register-form" data-registration>
            <input name="name" placeholder="Имя" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="login" placeholder="Логин" required />
            <input name="phone" placeholder="Телефон" required />
            <input name="password" type="password" placeholder="Пароль" required />
            <button type="submit">Зарегистрироваться</button>
          </form>
          
          <div class="auth-actions">
            <button type="button" id="to-auth">Уже есть аккаунт? Перейти на авторизацию</button>
            <button type="button" id="to-home">На главную</button>
          </div>
        </article>
      </section>
    `);const t=document.getElementById("register-form"),s=document.getElementById("to-auth"),n=document.getElementById("to-home");t instanceof HTMLFormElement&&(t.addEventListener("submit",o=>{o.preventDefault(),X(t,e)}),s instanceof HTMLButtonElement&&s.addEventListener("click",()=>{u("/auth")}),n instanceof HTMLButtonElement&&n.addEventListener("click",()=>{u("/")}))}async function X(e,a){const t=new FormData(e),s={name:String(t.get("name")??""),email:String(t.get("email")??""),login:String(t.get("login")??""),phone:String(t.get("phone")??""),password:String(t.get("password")??"")};try{const n=await h.register(s);l.user=n.user,await u("/")}catch(n){A(a,n instanceof Error?n.message:"Ошибка регистрации")}}const v=document.getElementById("app");if(!(v instanceof HTMLElement))throw new Error("Container #app not found");E("/",()=>Q(v));E("/auth",()=>O(v));E("/register",()=>A(v));E("/basket",()=>U(v));E("/404",()=>{v.innerHTML='<div class="card"><h2>404</h2><p>Страница не найдена</p></div>'});window.addEventListener("popstate",()=>{$()});Z();async function Z(){try{l.user=await h.me()}catch{l.user=null}await $()}

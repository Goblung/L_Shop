(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const N="http://localhost:4000/api",z=N.replace(/\/api\/?$/,"");async function g(e,n){const t=await fetch(`${N}${e}`,{...n,credentials:"include",headers:{"Content-Type":"application/json",...(n==null?void 0:n.headers)??{}}});if(!t.ok){let s="Ошибка запроса";try{const a=await t.json();s=a.error??a.message??s}catch{}throw new Error(s)}return await t.json()}const p={register:e=>g("/auth/register",{method:"POST",body:JSON.stringify(e)}),login:e=>g("/auth/login",{method:"POST",body:JSON.stringify(e)}),me:()=>g("/auth/me"),logout:()=>g("/auth/logout",{method:"POST"}),basket:()=>g("/basket/active"),addToBasket:(e,n)=>g("/basket/items",{method:"POST",body:JSON.stringify({productId:e,quantity:n})}),updateBasketItem:(e,n)=>g(`/basket/items/${encodeURIComponent(e)}`,{method:"PATCH",body:JSON.stringify({quantity:n})}),removeBasketItem:e=>g(`/basket/items/${encodeURIComponent(e)}`,{method:"DELETE"}),clearBasket:()=>g("/basket/clear",{method:"DELETE"}),products:async()=>(await g("/products")).map(n=>{var r;const t=n,s=typeof((r=t.images)==null?void 0:r.preview)=="string"?t.images.preview:void 0,a=t.images&&typeof t.images=="object"?{...t.images,preview:s&&s.startsWith("/img/")?`${z}${s}`:s??t.images.preview}:t.images;return{...t,id:t.id,images:a,delivery:t.delivery?{...t.delivery,earlyDate:new Date(t.delivery.earlyDate)}:void 0}}),deliveries:()=>g("/delivery/active"),createDelivery:e=>g("/delivery",{method:"POST",body:JSON.stringify(e)})},C=new Map;function w(e,n){C.set(e,n)}async function m(e){window.history.pushState({},"",e),await A()}async function A(){const e=C.get(window.location.pathname)??C.get("/404");e&&await e()}function G(){document.querySelectorAll("[data-link]").forEach(e=>{e.addEventListener("click",n=>{n.preventDefault();const t=e.getAttribute("href");t&&m(t)})})}const y={user:null};let M=null,O=!1;async function F(){if(!y.user)return;const e=document.getElementById("user-menu-basket");if(e)try{const t=(await p.basket()).items.reduce((s,a)=>s+a.quantity,0);e.textContent=`Корзина (${t})`}catch{return}}function U(){O||(O=!0,window.addEventListener("basket:updated",()=>{F()}))}function _(e){return`
    <header class="topbar">
      <div class="topbar-left">
        <div class="brand" lang="en">L-Shop</div>
        <span class="brand-tagline">Комплектующие</span>
        <nav class="menu">
          <a href="/" data-link>Главная</a>
          ${y.user?`
            <a href="/basket" data-link class="nav-link-cart">Корзина</a>
            <a href="/delivery" data-link>Доставка</a>
          `:""}
        </nav>
      </div>
      <div class="topbar-right">
        ${y.user?`
          <div class="user-menu" id="user-menu">
            <button type="button" class="user-badge user-menu-trigger" id="user-menu-trigger">
              ${y.user.name}
            </button>
            <div class="user-menu-popover" id="user-menu-popover" hidden>
              <button type="button" class="user-menu-item" id="user-menu-basket">Корзина</button>
            </div>
          </div>
        `:'<button type="button" class="auth-button" id="auth-button">Вход / Регистрация</button>'}
      </div>
    </header>
    <main>${e}</main>
  `}function $(e,n){e.innerHTML=_(n),G(),K(),U(),F()}function K(){const e=document.getElementById("auth-button"),n=document.getElementById("user-menu"),t=document.getElementById("user-menu-trigger"),s=document.getElementById("user-menu-popover"),a=document.getElementById("user-menu-basket");if(!y.user){e instanceof HTMLButtonElement&&e.addEventListener("click",()=>{m("/auth")});return}if(!n||!t||!s||!a)return;const r=()=>{s.hidden=!s.hidden};t.addEventListener("click",o=>{o.stopPropagation(),r()}),a.addEventListener("click",o=>{o.stopPropagation(),s.hidden=!0,m("/basket")}),M&&document.removeEventListener("click",M),M=o=>{const d=o.target;if(!d){s.hidden=!0;return}n.contains(d)||(s.hidden=!0)},document.addEventListener("click",M)}function P(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function H(e){return`${e.toFixed(2)} BYN`}function Q(e){const n=e.items.reduce((t,s)=>t+s.price*s.quantity,0);return e.items.length===0?`
      <div class="basket-empty">
        <p class="muted">В корзине пока ничего нет.</p>
        <a href="/" data-link class="btn btn-secondary">Перейти в каталог</a>
      </div>
    `:`
    <div class="basket-toolbar">
      <button type="button" class="btn btn-ghost" id="basket-clear">Очистить корзину</button>
    </div>
    <ul class="basket-lines" id="basket-lines">
      ${e.items.map(t=>`
        <li class="basket-line" data-product-id="${P(t.productId)}">
          <div class="basket-line-main">
            <span class="basket-line-name">${P(t.name)}</span>
            <span class="basket-line-unit">${H(t.price)} за шт.</span>
          </div>
          <div class="basket-line-qty" role="group" aria-label="Количество">
            <button type="button" class="qty-btn" data-qty-dec aria-label="Уменьшить">−</button>
            <input type="number" min="1" step="1" class="qty-input" value="${t.quantity}" data-qty-input />
            <button type="button" class="qty-btn" data-qty-inc aria-label="Увеличить">+</button>
          </div>
          <div class="basket-line-sum">${H(t.price*t.quantity)}</div>
          <button type="button" class="btn btn-icon btn-remove" data-remove aria-label="Удалить">×</button>
        </li>
      `).join("")}
    </ul>
    <footer class="basket-summary">
      <p class="basket-total">Итого: <strong>${H(n)}</strong></p>
      <div class="basket-actions">
        <a href="/" data-link class="btn btn-secondary">Продолжить покупки</a>
        <button type="button" class="btn" id="basket-checkout">Оформить доставку</button>
      </div>
    </footer>
  `}async function W(e){try{$(e,`
      <section class="card basket-page">
        <h2 class="basket-title">Корзина</h2>
        <div id="basket-root"></div>
      </section>
    `);const n=document.getElementById("basket-root");if(!(n instanceof HTMLElement))return;const t=a=>{var r;(r=n.querySelector(".basket-inline-error"))==null||r.remove(),n.insertAdjacentHTML("afterbegin",`<p class="error basket-inline-error">${P(a)}</p>`)},s=async()=>{const a=await p.basket();n.innerHTML=Q(a),window.dispatchEvent(new Event("basket:updated")),X(n,s,t)};await s()}catch{await m("/auth")}}function X(e,n,t){var s,a;(s=e.querySelector("#basket-clear"))==null||s.addEventListener("click",async()=>{if(window.confirm("Удалить все товары из корзины?"))try{await p.clearBasket(),await n()}catch(r){t(r instanceof Error?r.message:"Не удалось очистить корзину")}}),(a=e.querySelector("#basket-checkout"))==null||a.addEventListener("click",()=>{m("/delivery")}),e.querySelectorAll(".basket-line").forEach(r=>{var L,f,B;const o=r.dataset.productId;if(!o)return;const d=r.querySelector("[data-qty-input]"),h=async u=>{const k=Math.max(1,Math.floor(u));try{await p.updateBasketItem(o,k),await n()}catch(I){t(I instanceof Error?I.message:"Ошибка обновления корзины")}};(L=r.querySelector("[data-qty-dec]"))==null||L.addEventListener("click",()=>{const u=d&&parseInt(d.value,10)||1;if(u<=1){(async()=>{try{await p.removeBasketItem(o),await n()}catch(k){t(k instanceof Error?k.message:"Ошибка удаления")}})();return}h(u-1)}),(f=r.querySelector("[data-qty-inc]"))==null||f.addEventListener("click",()=>{const u=d&&parseInt(d.value,10)||1;h(u+1)}),(B=r.querySelector("[data-remove]"))==null||B.addEventListener("click",()=>{(async()=>{try{await p.removeBasketItem(o),await n()}catch(u){t(u instanceof Error?u.message:"Ошибка удаления")}})()}),d==null||d.addEventListener("change",()=>{const u=parseInt(d.value,10);if(!Number.isFinite(u)||u<1){d.value="1",h(1);return}h(u)})})}async function D(e,n=""){try{const t=await p.basket(),s=t.items.reduce((r,o)=>r+o.price*o.quantity,0);$(e,`
        <section class="card delivery-page">
          <h2>Оформление доставки</h2>
          ${n?`<p class="delivery-intro" role="status">${n}</p>`:t.items.length>0?'<p class="delivery-intro">Укажите контакты и адрес — подтвердим заказ и сроки доставки.</p>':""}
          ${t.items.length===0?'<p class="muted">Корзина пуста. Добавьте товары в каталоге.</p>':`
              <ul class="basket-list">
                ${t.items.map(r=>`<li><span data-title="basket">${r.name}</span> — <span data-price="basket">${r.price} BYN</span> × ${r.quantity}</li>`).join("")}
              </ul>
              <p class="delivery-total">Итого: <strong>${s} BYN</strong></p>
              <form id="delivery-form" class="delivery-form" data-delivery="main">
                <input name="address" placeholder="Адрес доставки" data-delivery="address" required />
                <input name="phone" placeholder="Телефон" data-delivery="phone" required />
                <input name="email" type="email" placeholder="Email" data-delivery="email" required />
                <label><input type="radio" name="paymentMethod" value="card" data-delivery="payment-card" checked /> Картой</label>
                <label><input type="radio" name="paymentMethod" value="cash" data-delivery="payment-cash" /> Наличными</label>
                <button type="submit" data-delivery="submit">Подтвердить доставку</button>
              </form>
            `}
        </section>
      `);const a=document.getElementById("delivery-form");a instanceof HTMLFormElement&&a.addEventListener("submit",r=>{r.preventDefault(),V(a,e)})}catch{await m("/auth")}}async function V(e,n){const t=new FormData(e),s={address:String(t.get("address")??""),phone:String(t.get("phone")??""),email:String(t.get("email")??""),paymentMethod:String(t.get("paymentMethod")??"card")==="cash"?"cash":"card"};try{await p.createDelivery(s),window.dispatchEvent(new Event("basket:updated")),await D(n,"Доставка создана")}catch(a){await D(n,a instanceof Error?a.message:"Ошибка оформления доставки")}}const Z={cpu:"Процессоры",gpu:"Видеокарты",ram:"Оперативная память",ssd:"SSD",hdd:"Жесткие диски",motherboard:"Материнские платы",psu:"Блоки питания",case:"Корпуса",cooler:"Системы охлаждения"},ee=e=>Z[e]??e;function te(e,n){const t=typeof e.discount=="number"&&e.discount>0,s=t?e.price*(1-e.discount/100):e.price,a=e.isAvailable?"product-stock product-stock--in":"product-stock product-stock--out",r=e.isAvailable?"В наличии":"Под заказ";return`
    <article class="product-card" data-product-card="${String(e.id)}">
      <div class="product-card-media">
        ${t?`<span class="product-discount-badge">−${String(e.discount)}%</span>`:""}
        <img class="product-image" src="${e.images.preview}" alt="${e.title}" />
      </div>
      <div class="product-card-body">
        <h3 class="product-title">${e.title}</h3>
        <div class="product-price">
          ${t?`
            <span class="old-price">${e.price} BYN</span>
            <span class="new-price">${s.toFixed(2)} BYN</span>
          `:`<span class="current-price">${e.price} BYN</span>`}
        </div>
        <div class="product-meta">
          <span class="${a}">${r}</span>
          <p class="product-categories">
            <span class="product-cat-label">Категории</span>${e.categories.map(ee).join(", ")}
          </p>
        </div>
        ${n?`
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
      </div>
    </article>
  `}async function ae(e){$(e,`
      <section class="catalog-page" id="catalog-root">
        <header class="catalog-hero">
          <p class="catalog-hero-kicker">Каталог</p>
          <h1 class="catalog-title">Компьютерные комплектующие</h1>
          <p class="catalog-lead">
            Процессоры, видеокарты, память, накопители и периферия — подберите детали под сборку и бюджет.
          </p>
        </header>

        <aside class="filters-panel" id="filters-panel" aria-label="Фильтры каталога">
          <div class="filters-panel-head">
            <h3 class="filters-heading">Фильтры</h3>
            <p class="filters-hint">Уточните каталог по названию, категории и наличию</p>
          </div>

          <div class="filters-row">
            <div class="filter-field filter-field-grow">
              <label class="filter-label" for="catalog-search">Поиск</label>
              <input
                id="catalog-search"
                class="filter-input"
                type="search"
                autocomplete="off"
                placeholder="Например: Ryzen, RTX, DDR4, SSD…"
                value=""
              />
            </div>
            <div class="filter-field">
              <label class="filter-label" for="catalog-sort">Сортировка</label>
              <select id="catalog-sort" class="filter-select">
                <option value="asc">Цена: сначала дешевле</option>
                <option value="desc">Цена: сначала дороже</option>
              </select>
            </div>
          </div>

          <div class="filter-field filter-field-categories">
            <span class="filter-label">Категории</span>
            <div id="catalog-categories" class="category-chips" role="group" aria-label="Типы запчастей"></div>
          </div>

          <label class="filter-toggle">
            <input id="catalog-available" class="filter-toggle-input" type="checkbox" />
            <span class="filter-toggle-ui" aria-hidden="true"></span>
            <span class="filter-toggle-text">Только товары в наличии</span>
          </label>
        </aside>

        <div class="products-grid" id="products-grid">
          <p class="muted">Загрузка товаров...</p>
        </div>
      </section>
    `);const n=document.getElementById("catalog-root"),t=document.getElementById("products-grid"),s=document.getElementById("catalog-search"),a=document.getElementById("catalog-sort"),r=document.getElementById("catalog-available"),o=document.getElementById("catalog-categories");if(!(n instanceof HTMLElement)||!(t instanceof HTMLElement)||!(s instanceof HTMLInputElement)||!(a instanceof HTMLSelectElement)||!(r instanceof HTMLInputElement)||!(o instanceof HTMLElement))return;let d=[],h="",L="asc",f=[],B=!1;const u=!!y.user,k=i=>typeof i.discount=="number"&&i.discount>0?i.price*(1-i.discount/100):i.price,I={cpu:"Процессоры",gpu:"Видеокарты",ram:"Оперативная память",ssd:"SSD",hdd:"Жесткие диски",motherboard:"Материнские платы",psu:"Блоки питания",case:"Корпуса",cooler:"Системы охлаждения"},j=i=>I[i]??i,Y=()=>{const i=h.trim().toLowerCase(),c=new Set(f);return d.filter(l=>{const b=i.length===0||l.title.toLowerCase().includes(i)||l.description.toLowerCase().includes(i),v=c.size===0||l.categories.some(T=>c.has(T)),q=!B||l.isAvailable;return b&&v&&q}).sort((l,b)=>{const v=k(l)-k(b);return L==="asc"?v:-v})},S=()=>{const i=Y();t.innerHTML=i.length>0?i.map(c=>te(c,u)).join(""):'<p class="muted">Товары не найдены</p>'},J=i=>{o.innerHTML=i.map(c=>{const l=f.includes(c);return`
          <label class="category-chip">
            <input type="checkbox" class="category-chip-input" data-category="${c}" ${l?"checked":""} />
            <span class="category-chip-text">${j(c)}</span>
          </label>
        `}).join("")};s.addEventListener("input",()=>{h=s.value,S()}),a.addEventListener("change",()=>{L=a.value==="desc"?"desc":"asc",S()}),r.addEventListener("change",()=>{B=r.checked,S()}),n.addEventListener("change",i=>{const c=i.target;if(!(c instanceof HTMLInputElement))return;const l=c.dataset.category;l&&(c.checked?f.includes(l)||(f=[...f,l]):f=f.filter(b=>b!==l),S())}),n.addEventListener("click",async i=>{const c=i.target;if(!(c instanceof HTMLElement))return;const l=c.closest("button[data-add-to-basket]");if(!l)return;if(!y.user){await m("/auth");return}const b=String(l.dataset.addToBasket??"");if(!b)return;const v=l.closest("[data-product-card]"),q=v==null?void 0:v.querySelector("input[data-quantity]"),T=q?Math.max(1,parseInt(q.value||"1",10)||1):1;await p.addToBasket(b,T),window.dispatchEvent(new Event("basket:updated"))});try{d=await p.products();const i=Array.from(new Set(d.flatMap(c=>c.categories))).sort();J(i),S()}catch{t.innerHTML='<p class="error">Ошибка загрузки каталога</p>'}}function x(e,n){$(e,`
      <section class="auth-page">
        <article class="card">
          <h2>Авторизация</h2>
          ${n?`<p class="error">${n}</p>`:""}

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
    `);const t=document.getElementById("login-form"),s=document.getElementById("to-register"),a=document.getElementById("to-home");t instanceof HTMLFormElement&&(t.addEventListener("submit",r=>{r.preventDefault(),ne(t,e)}),s instanceof HTMLButtonElement&&s.addEventListener("click",()=>{m("/register")}),a instanceof HTMLButtonElement&&a.addEventListener("click",()=>{m("/")}))}async function ne(e,n){const t=new FormData(e),s={identifier:String(t.get("identifier")??""),password:String(t.get("password")??"")};try{const a=await p.login(s);y.user=a.user,await m("/")}catch(a){x(n,a instanceof Error?a.message:"Ошибка авторизации")}}function R(e,n){$(e,`
      <section class="auth-page">
        <article class="card">
          <h2>Регистрация</h2>
          ${n?`<p class="error">${n}</p>`:""}
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
    `);const t=document.getElementById("register-form"),s=document.getElementById("to-auth"),a=document.getElementById("to-home");t instanceof HTMLFormElement&&(t.addEventListener("submit",r=>{r.preventDefault(),se(t,e)}),s instanceof HTMLButtonElement&&s.addEventListener("click",()=>{m("/auth")}),a instanceof HTMLButtonElement&&a.addEventListener("click",()=>{m("/")}))}async function se(e,n){const t=new FormData(e),s={name:String(t.get("name")??""),email:String(t.get("email")??""),login:String(t.get("login")??""),phone:String(t.get("phone")??""),password:String(t.get("password")??"")};try{const a=await p.register(s);y.user=a.user,await m("/")}catch(a){R(n,a instanceof Error?a.message:"Ошибка регистрации")}}const E=document.getElementById("app");if(!(E instanceof HTMLElement))throw new Error("Container #app not found");w("/",()=>ae(E));w("/auth",()=>x(E));w("/register",()=>R(E));w("/basket",()=>W(E));w("/delivery",()=>D(E));w("/404",()=>{E.innerHTML='<div class="card"><h2>404</h2><p>Страница не найдена</p></div>'});window.addEventListener("popstate",()=>{A()});re();async function re(){try{y.user=await p.me()}catch{y.user=null}await A()}

(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function r(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(e){if(e.ep)return;e.ep=!0;const i=r(e);fetch(e.href,i)}})();const w="http://localhost:4000/api";async function o(t,a){const r=await fetch(`${w}${t}`,{...a,credentials:"include",headers:{"Content-Type":"application/json",...(a==null?void 0:a.headers)??{}}});if(!r.ok){let n="Ошибка запроса";try{const e=await r.json();n=e.error??e.message??n}catch{}throw new Error(n)}return await r.json()}const s={register:t=>o("/auth/register",{method:"POST",body:JSON.stringify(t)}),login:t=>o("/auth/login",{method:"POST",body:JSON.stringify(t)}),me:()=>o("/auth/me"),logout:()=>o("/auth/logout",{method:"POST"}),products:t=>o(`/products${t==="all"?"":`?category=${encodeURIComponent(t)}`}`),basket:()=>o("/basket/active"),addToBasket:t=>o("/basket/items",{method:"POST",body:JSON.stringify({productId:t,quantity:1})}),deliveries:()=>o("/delivery/active"),createDelivery:t=>o("/delivery",{method:"POST",body:JSON.stringify(t)})},f=new Map;function p(t,a){f.set(t,a)}async function d(t){window.history.pushState({},"",t),await h()}async function h(){const t=f.get(window.location.pathname)??f.get("/404");t&&await t()}function b(){document.querySelectorAll("[data-link]").forEach(t=>{t.addEventListener("click",a=>{a.preventDefault();const r=t.getAttribute("href");r&&d(r)})})}const c={user:null};function $(t){return`
    <header class="topbar">
      <div class="brand">Shop</div>
      <nav class="menu">
        <a href="/" data-link>Главная</a>
        <a href="/basket" data-link>Корзина</a>
        <a href="/delivery" data-link>Доставка</a>
        ${c.user?`<span class="user-badge">${c.user.name}</span>`:'<a href="/register" data-link>Вход / Регистрация</a>'}
      </nav>
    </header>
    <main>${t}</main>
  `}function m(t,a){t.innerHTML=$(a),b()}async function E(t){try{const a=await s.basket(),r=a.items.reduce((e,i)=>e+i.price*i.quantity,0);m(t,`
        <section class="card">
          <h2>Корзина</h2>
          ${a.items.length===0?"<p>Корзина пуста</p>":`
              <ul class="basket-list">
                ${a.items.map(e=>`<li><span data-title="basket">${e.name}</span> — <span data-price="basket">${e.price} ₽</span> x ${e.quantity}</li>`).join("")}
              </ul>
              <p><strong>Итого: ${r} ₽</strong></p>
              <button id="go-delivery">Открыть доставку</button>
            `}
        </section>
      `);const n=document.getElementById("go-delivery");n instanceof HTMLButtonElement&&n.addEventListener("click",()=>{d("/delivery")})}catch{await d("/register")}}async function y(t,a=""){try{const r=await s.basket(),n=r.items.reduce((i,l)=>i+l.price*l.quantity,0);m(t,`
        <section class="card">
          <h2>Оформление доставки</h2>
          ${a?`<p>${a}</p>`:""}
          ${r.items.length===0?"<p>Корзина пуста. Добавьте товары на главной.</p>":`
              <ul class="basket-list">
                ${r.items.map(i=>`<li><span data-title="basket">${i.name}</span> — <span data-price="basket">${i.price} ₽</span> x ${i.quantity}</li>`).join("")}
              </ul>
              <p><strong>Итого: ${n} ₽</strong></p>
              <form id="delivery-form" data-delivery="main">
                <input name="address" placeholder="Адрес доставки" data-delivery="address" required />
                <input name="phone" placeholder="Телефон" data-delivery="phone" required />
                <input name="email" type="email" placeholder="Email" data-delivery="email" required />
                <label><input type="radio" name="paymentMethod" value="card" data-delivery="payment-card" checked /> Картой</label>
                <label><input type="radio" name="paymentMethod" value="cash" data-delivery="payment-cash" /> Наличными</label>
                <button type="submit" data-delivery="submit">Подтвердить доставку</button>
              </form>
            `}
        </section>
      `);const e=document.getElementById("delivery-form");e instanceof HTMLFormElement&&e.addEventListener("submit",i=>{i.preventDefault(),k(e,t)})}catch{await d("/register")}}async function k(t,a){const r=new FormData(t),n={address:String(r.get("address")??""),phone:String(r.get("phone")??""),email:String(r.get("email")??""),paymentMethod:String(r.get("paymentMethod")??"card")==="cash"?"cash":"card"};try{await s.createDelivery(n),await y(a,"Доставка создана")}catch(e){await y(a,e instanceof Error?e.message:"Ошибка оформления доставки")}}function S(t){return`
    <article class="product-card">
      <h3 data-title>${t.name}</h3>
      <p data-price>${t.price} ₽</p>
      <button data-add-product="${t.id}">В корзину</button>
    </article>
  `}const L=[{value:"all",label:"Все"},{value:"milk",label:"Молочка"},{value:"bakery",label:"Выпечка"},{value:"fruits",label:"Фрукты"}];async function q(t){await g(t,"all","")}async function g(t,a,r){const n=await s.products(a);m(t,`
      <section class="catalog-layout">
        <aside class="filters card">
          <h3>Фильтры</h3>
          <div class="filter-list">
            ${L.map(e=>`<button data-filter="${e.value}" class="${e.value===a?"active-filter":""}">${e.label}</button>`).join("")}
          </div>
          <p class="muted">Открыть: <a href="/basket" data-link>Корзину</a> / <a href="/delivery" data-link>Доставку</a></p>
        </aside>
        <section class="products">
          ${r?`<p>${r}</p>`:""}
          <div class="product-grid">
            ${n.map(e=>S(e)).join("")}
          </div>
        </section>
      </section>
    `),O(t,n,a),b()}function O(t,a,r){document.querySelectorAll("[data-filter]").forEach(n=>{n.addEventListener("click",()=>{const e=n.dataset.filter;e&&g(t,e,"")})}),a.forEach(n=>{const e=document.querySelector(`[data-add-product="${n.id}"]`);e&&e.addEventListener("click",()=>{T(n.id,t,r)})})}async function T(t,a,r){try{await s.addToBasket(t),await g(a,r,"Товар добавлен в корзину")}catch{await d("/register")}}function v(t,a){m(t,`
      <section class="auth-grid">
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
        </article>
        <article class="card">
          <h2>Авторизация</h2>
          <form id="login-form">
            <input name="identifier" placeholder="Имя / email / логин / телефон" required />
            <input name="password" type="password" placeholder="Пароль" required />
            <button type="submit">Войти</button>
          </form>
        </article>
      </section>
    `);const r=document.getElementById("register-form"),n=document.getElementById("login-form");!(r instanceof HTMLFormElement)||!(n instanceof HTMLFormElement)||(r.addEventListener("submit",e=>{e.preventDefault(),P(r,t)}),n.addEventListener("submit",e=>{e.preventDefault(),M(n,t)}))}async function P(t,a){const r=new FormData(t),n={name:String(r.get("name")??""),email:String(r.get("email")??""),login:String(r.get("login")??""),phone:String(r.get("phone")??""),password:String(r.get("password")??"")};try{const e=await s.register(n);c.user=e.user,await d("/")}catch(e){v(a,e instanceof Error?e.message:"Ошибка регистрации")}}async function M(t,a){const r=new FormData(t),n={identifier:String(r.get("identifier")??""),password:String(r.get("password")??"")};try{const e=await s.login(n);c.user=e.user,await d("/")}catch(e){v(a,e instanceof Error?e.message:"Ошибка авторизации")}}const u=document.getElementById("app");if(!(u instanceof HTMLElement))throw new Error("Container #app not found");p("/",()=>q(u));p("/register",()=>v(u));p("/basket",()=>E(u));p("/delivery",()=>y(u));p("/404",()=>{u.innerHTML='<div class="card"><h2>404</h2><p>Страница не найдена</p></div>'});window.addEventListener("popstate",()=>{h()});B();async function B(){try{c.user=await s.me()}catch{c.user=null}await h()}

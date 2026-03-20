(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function o(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(t){if(t.ep)return;t.ep=!0;const i=o(t);fetch(t.href,i)}})();const E="http://localhost:4000/api";async function u(e,n){const o=await fetch(`${E}${e}`,{...n,credentials:"include",headers:{"Content-Type":"application/json",...(n==null?void 0:n.headers)??{}}});if(!o.ok){let r="Ошибка запроса";try{const t=await o.json();r=t.error??t.message??r}catch{}throw new Error(r)}return await o.json()}const p={register:e=>u("/auth/register",{method:"POST",body:JSON.stringify(e)}),login:e=>u("/auth/login",{method:"POST",body:JSON.stringify(e)}),me:()=>u("/auth/me"),logout:()=>u("/auth/logout",{method:"POST"}),basket:()=>u("/basket/active"),addToBasket:e=>u("/basket/items",{method:"POST",body:JSON.stringify({productId:e,quantity:1})}),deliveries:()=>u("/delivery/active"),createDelivery:e=>u("/delivery",{method:"POST",body:JSON.stringify(e)})},f=new Map;function l(e,n){f.set(e,n)}async function s(e){window.history.pushState({},"",e),await h()}async function h(){const e=f.get(window.location.pathname)??f.get("/404");e&&await e()}function w(){document.querySelectorAll("[data-link]").forEach(e=>{e.addEventListener("click",n=>{n.preventDefault();const o=e.getAttribute("href");o&&s(o)})})}const c={user:null};let m=null;function L(e){return`
    <header class="topbar">
      <div class="topbar-left">
        <div class="brand">Shop</div>
        <nav class="menu">
          <a href="/" data-link>Главная</a>
        </nav>
      </div>
      <div class="topbar-right">
        ${c.user?`
          <div class="user-menu" id="user-menu">
            <button type="button" class="user-badge user-menu-trigger" id="user-menu-trigger">
              ${c.user.name}
            </button>
            <div class="user-menu-popover" id="user-menu-popover" hidden>
              <button type="button" class="user-menu-item" id="user-menu-basket">Корзина</button>
            </div>
          </div>
        `:'<button type="button" class="auth-button" id="auth-button">Вход / Регистрация</button>'}
      </div>
    </header>
    <main>${e}</main>
  `}function g(e,n){e.innerHTML=L(n),w(),B()}function B(){const e=document.getElementById("auth-button"),n=document.getElementById("user-menu"),o=document.getElementById("user-menu-trigger"),r=document.getElementById("user-menu-popover"),t=document.getElementById("user-menu-basket");if(!c.user){e instanceof HTMLButtonElement&&e.addEventListener("click",()=>{s("/auth")});return}if(!n||!o||!r||!t)return;const i=()=>{r.hidden=!r.hidden};o.addEventListener("click",a=>{a.stopPropagation(),i()}),t.addEventListener("click",a=>{a.stopPropagation(),r.hidden=!0,s("/basket")}),m&&document.removeEventListener("click",m),m=a=>{const y=a.target;if(!y){r.hidden=!0;return}n.contains(y)||(r.hidden=!0)},document.addEventListener("click",m)}async function k(e){try{const n=await p.basket(),o=n.items.reduce((r,t)=>r+t.price*t.quantity,0);g(e,`
        <section class="card">
          <h2>Корзина</h2>
          ${n.items.length===0?"<p>Корзина пуста</p>":`
              <ul class="basket-list">
                ${n.items.map(r=>`<li><span data-title="basket">${r.name}</span> — <span data-price="basket">${r.price} ₽</span> x ${r.quantity}</li>`).join("")}
              </ul>
              <p><strong>Итого: ${o} ₽</strong></p>
            `}
        </section>
      `)}catch{await s("/auth")}}async function S(e){g(e,`
      <section class="card auth-page">
        <h2>Каталог</h2>
        <p>Каталог временно отключен для дальнейшей переработки.</p>
      </section>
    `)}function b(e,n){g(e,`
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
    `);const o=document.getElementById("login-form"),r=document.getElementById("to-register"),t=document.getElementById("to-home");o instanceof HTMLFormElement&&(o.addEventListener("submit",i=>{i.preventDefault(),M(o,e)}),r instanceof HTMLButtonElement&&r.addEventListener("click",()=>{s("/register")}),t instanceof HTMLButtonElement&&t.addEventListener("click",()=>{s("/")}))}async function M(e,n){const o=new FormData(e),r={identifier:String(o.get("identifier")??""),password:String(o.get("password")??"")};try{const t=await p.login(r);c.user=t.user,await s("/")}catch(t){b(n,t instanceof Error?t.message:"Ошибка авторизации")}}function v(e,n){g(e,`
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
    `);const o=document.getElementById("register-form"),r=document.getElementById("to-auth"),t=document.getElementById("to-home");o instanceof HTMLFormElement&&(o.addEventListener("submit",i=>{i.preventDefault(),T(o,e)}),r instanceof HTMLButtonElement&&r.addEventListener("click",()=>{s("/auth")}),t instanceof HTMLButtonElement&&t.addEventListener("click",()=>{s("/")}))}async function T(e,n){const o=new FormData(e),r={name:String(o.get("name")??""),email:String(o.get("email")??""),login:String(o.get("login")??""),phone:String(o.get("phone")??""),password:String(o.get("password")??"")};try{const t=await p.register(r);c.user=t.user,await s("/")}catch(t){v(n,t instanceof Error?t.message:"Ошибка регистрации")}}const d=document.getElementById("app");if(!(d instanceof HTMLElement))throw new Error("Container #app not found");l("/",()=>S(d));l("/auth",()=>b(d));l("/register",()=>v(d));l("/basket",()=>k(d));l("/404",()=>{d.innerHTML='<div class="card"><h2>404</h2><p>Страница не найдена</p></div>'});window.addEventListener("popstate",()=>{h()});P();async function P(){try{c.user=await p.me()}catch{c.user=null}await h()}

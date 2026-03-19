import { bindRouterLinks } from "../router";
import { state } from "../state";
export function renderLayout(content) {
    return `
    <header class="topbar">
      <div class="brand">Shop</div>
      <nav class="menu">
        <a href="/" data-link>Главная</a>
        <a href="/basket" data-link>Корзина</a>
        <a href="/delivery" data-link>Доставка</a>
        ${state.user ? `<span class="user-badge">${state.user.name}</span>` : `<a href="/register" data-link>Вход / Регистрация</a>`}
      </nav>
    </header>
    <main>${content}</main>
  `;
}
export function mountLayout(container, content) {
    container.innerHTML = renderLayout(content);
    bindRouterLinks();
}

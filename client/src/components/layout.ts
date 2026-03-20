import { bindRouterLinks, navigate } from "../router";
import { state } from "../state";

let userMenuOutsideClickHandler: ((event: MouseEvent) => void) | null = null;

export function renderLayout(content: string): string {
  return `
    <header class="topbar">
      <div class="topbar-left">
        <div class="brand">Shop</div>
        <nav class="menu">
          <a href="/" data-link>Главная</a>
        </nav>
      </div>
      <div class="topbar-right">
        ${
          state.user
            ? `
          <div class="user-menu" id="user-menu">
            <button type="button" class="user-badge user-menu-trigger" id="user-menu-trigger">
              ${state.user.name}
            </button>
            <div class="user-menu-popover" id="user-menu-popover" hidden>
              <button type="button" class="user-menu-item" id="user-menu-basket">Корзина</button>
            </div>
          </div>
        `
            : `<button type="button" class="auth-button" id="auth-button">Вход / Регистрация</button>`
        }
      </div>
    </header>
    <main>${content}</main>
  `;
}

export function mountLayout(container: HTMLElement, content: string): void {
  container.innerHTML = renderLayout(content);
  bindRouterLinks();
  bindAuthControls();
}

function bindAuthControls(): void {
  const authButton = document.getElementById("auth-button");
  const userMenu = document.getElementById("user-menu");
  const userMenuTrigger = document.getElementById("user-menu-trigger") as HTMLButtonElement | null;
  const userMenuPopover = document.getElementById("user-menu-popover") as HTMLDivElement | null;
  const userMenuBasketBtn = document.getElementById("user-menu-basket") as HTMLButtonElement | null;

  if (!state.user) {
    if (authButton instanceof HTMLButtonElement) {
      authButton.addEventListener("click", () => {
        void navigate("/auth");
      });
    }
    return;
  }

  if (!userMenu || !userMenuTrigger || !userMenuPopover || !userMenuBasketBtn) {
    return;
  }

  const toggleMenu = (): void => {
    userMenuPopover.hidden = !userMenuPopover.hidden;
  };

  userMenuTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  userMenuBasketBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    userMenuPopover.hidden = true;
    void navigate("/basket");
  });

  if (userMenuOutsideClickHandler) {
    document.removeEventListener("click", userMenuOutsideClickHandler);
  }

  userMenuOutsideClickHandler = (event: MouseEvent) => {
    const target = event.target as Node | null;
    if (!target) {
      userMenuPopover.hidden = true;
      return;
    }

    if (!userMenu.contains(target)) {
      userMenuPopover.hidden = true;
    }
  };

  document.addEventListener("click", userMenuOutsideClickHandler);
}

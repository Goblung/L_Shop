import { api } from "../api";
import { mountLayout } from "../components/layout";
import { navigate } from "../router";
import type { Basket } from "../types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMoney(n: number): string {
  return `${n.toFixed(2)} BYN`;
}

function basketMarkup(basket: Basket): string {
  const total = basket.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (basket.items.length === 0) {
    return `
      <div class="basket-empty">
        <p class="muted">В корзине пока ничего нет.</p>
        <a href="/" data-link class="btn btn-secondary">Перейти в каталог</a>
      </div>
    `;
  }

  return `
    <div class="basket-toolbar">
      <button type="button" class="btn btn-ghost" id="basket-clear">Очистить корзину</button>
    </div>
    <ul class="basket-lines" id="basket-lines">
      ${basket.items
        .map(
          (item) => `
        <li class="basket-line" data-product-id="${escapeHtml(item.productId)}">
          <div class="basket-line-main">
            <span class="basket-line-name">${escapeHtml(item.name)}</span>
            <span class="basket-line-unit">${formatMoney(item.price)} за шт.</span>
          </div>
          <div class="basket-line-qty" role="group" aria-label="Количество">
            <button type="button" class="qty-btn" data-qty-dec aria-label="Уменьшить">−</button>
            <input type="number" min="1" step="1" class="qty-input" value="${item.quantity}" data-qty-input />
            <button type="button" class="qty-btn" data-qty-inc aria-label="Увеличить">+</button>
          </div>
          <div class="basket-line-sum">${formatMoney(item.price * item.quantity)}</div>
          <button type="button" class="btn btn-icon btn-remove" data-remove aria-label="Удалить">×</button>
        </li>
      `
        )
        .join("")}
    </ul>
    <footer class="basket-summary">
      <p class="basket-total">Итого: <strong>${formatMoney(total)}</strong></p>
      <div class="basket-actions">
        <a href="/" data-link class="btn btn-secondary">Продолжить покупки</a>
        <button type="button" class="btn" id="basket-checkout">Оформить доставку</button>
      </div>
    </footer>
  `;
}

export async function basketPage(container: HTMLElement): Promise<void> {
  try {
    mountLayout(
      container,
      `
      <section class="card basket-page">
        <h2 class="basket-title">Корзина</h2>
        <div id="basket-root"></div>
      </section>
    `
    );

    const root = document.getElementById("basket-root");
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const setError = (message: string): void => {
      root.querySelector(".basket-inline-error")?.remove();
      root.insertAdjacentHTML(
        "afterbegin",
        `<p class="error basket-inline-error">${escapeHtml(message)}</p>`
      );
    };

    const refresh = async (): Promise<void> => {
      const basket = await api.basket();
      root.innerHTML = basketMarkup(basket);
      window.dispatchEvent(new Event("basket:updated"));
      bindBasketControls(root, refresh, setError);
    };

    await refresh();
  } catch {
    await navigate("/auth");
  }
}

function bindBasketControls(
  root: HTMLElement,
  refresh: () => Promise<void>,
  setError: (message: string) => void
): void {
  root.querySelector("#basket-clear")?.addEventListener("click", async () => {
    if (!window.confirm("Удалить все товары из корзины?")) {
      return;
    }
    try {
      await api.clearBasket();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось очистить корзину");
    }
  });

  root.querySelector("#basket-checkout")?.addEventListener("click", () => {
    void navigate("/delivery");
  });

  root.querySelectorAll<HTMLElement>(".basket-line").forEach((line) => {
    const productId = line.dataset.productId;
    if (!productId) {
      return;
    }

    const input = line.querySelector<HTMLInputElement>("[data-qty-input]");

    const applyQuantity = async (next: number): Promise<void> => {
      const q = Math.max(1, Math.floor(next));
      try {
        await api.updateBasketItem(productId, q);
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ошибка обновления корзины");
      }
    };

    line.querySelector("[data-qty-dec]")?.addEventListener("click", () => {
      const current = input ? parseInt(input.value, 10) || 1 : 1;
      if (current <= 1) {
        void (async () => {
          try {
            await api.removeBasketItem(productId);
            await refresh();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Ошибка удаления");
          }
        })();
        return;
      }
      void applyQuantity(current - 1);
    });

    line.querySelector("[data-qty-inc]")?.addEventListener("click", () => {
      const current = input ? parseInt(input.value, 10) || 1 : 1;
      void applyQuantity(current + 1);
    });

    line.querySelector("[data-remove]")?.addEventListener("click", () => {
      void (async () => {
        try {
          await api.removeBasketItem(productId);
          await refresh();
        } catch (e) {
          setError(e instanceof Error ? e.message : "Ошибка удаления");
        }
      })();
    });

    input?.addEventListener("change", () => {
      const raw = parseInt(input.value, 10);
      if (!Number.isFinite(raw) || raw < 1) {
        input.value = "1";
        void applyQuantity(1);
        return;
      }
      void applyQuantity(raw);
    });
  });
}

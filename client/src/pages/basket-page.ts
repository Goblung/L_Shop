import { api } from "../api";
import { mountLayout } from "../components/layout";
import { navigate } from "../router";

export async function basketPage(container: HTMLElement): Promise<void> {
  try {
    const basket = await api.basket();
    const total = basket.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    mountLayout(
      container,
      `
        <section class="card">
          <h2>Корзина</h2>
          ${
            basket.items.length === 0
              ? "<p>Корзина пуста</p>"
              : `
              <ul class="basket-list">
                ${basket.items
                  .map(
                    (item) =>
                      `<li><span data-title="basket">${item.name}</span> — <span data-price="basket">${item.price} ₽</span> x ${item.quantity}</li>`
                  )
                  .join("")}
              </ul>
              <p><strong>Итого: ${total} ₽</strong></p>
              <button id="go-delivery">Открыть доставку</button>
            `
          }
        </section>
      `
    );

    const deliveryBtn = document.getElementById("go-delivery");
    if (deliveryBtn instanceof HTMLButtonElement) {
      deliveryBtn.addEventListener("click", () => {
        void navigate("/delivery");
      });
    }
  } catch {
    await navigate("/register");
  }
}

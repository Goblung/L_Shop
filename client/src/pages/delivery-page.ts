import { api, type DeliveryPayload } from "../api";
import { mountLayout } from "../components/layout";
import { navigate } from "../router";

export async function deliveryPage(container: HTMLElement, message = ""): Promise<void> {
  try {
    const basket = await api.basket();
    const total = basket.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    mountLayout(
      container,
      `
        <section class="card">
          <h2>Оформление доставки</h2>
          ${message ? `<p>${message}</p>` : ""}
          ${
            basket.items.length === 0
              ? "<p>Корзина пуста. Добавьте товары на главной.</p>"
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
              <form id="delivery-form" data-delivery="main">
                <input name="address" placeholder="Адрес доставки" data-delivery="address" required />
                <input name="phone" placeholder="Телефон" data-delivery="phone" required />
                <input name="email" type="email" placeholder="Email" data-delivery="email" required />
                <label><input type="radio" name="paymentMethod" value="card" data-delivery="payment-card" checked /> Картой</label>
                <label><input type="radio" name="paymentMethod" value="cash" data-delivery="payment-cash" /> Наличными</label>
                <button type="submit" data-delivery="submit">Подтвердить доставку</button>
              </form>
            `
          }
        </section>
      `
    );

    const form = document.getElementById("delivery-form");
    if (form instanceof HTMLFormElement) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        void submitDelivery(form, container);
      });
    }
  } catch {
    await navigate("/register");
  }
}

async function submitDelivery(form: HTMLFormElement, container: HTMLElement): Promise<void> {
  const data = new FormData(form);
  const payload: DeliveryPayload = {
    address: String(data.get("address") ?? ""),
    phone: String(data.get("phone") ?? ""),
    email: String(data.get("email") ?? ""),
    paymentMethod:
      String(data.get("paymentMethod") ?? "card") === "cash" ? "cash" : "card"
  };

  try {
    await api.createDelivery(payload);
    await deliveryPage(container, "Доставка создана");
  } catch (error: unknown) {
    await deliveryPage(
      container,
      error instanceof Error ? error.message : "Ошибка оформления доставки"
    );
  }
}

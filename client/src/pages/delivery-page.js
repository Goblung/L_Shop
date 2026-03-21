import { api } from "../api";
import { mountLayout } from "../components/layout";
import { navigate } from "../router";
export async function deliveryPage(container, message = "") {
    try {
        const basket = await api.basket();
        const total = basket.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        mountLayout(container, `
        <section class="card delivery-page">
          <h2>Оформление доставки</h2>
          ${message
            ? `<p class="delivery-intro" role="status">${message}</p>`
            : basket.items.length > 0
                ? `<p class="delivery-intro">Укажите контакты и адрес — подтвердим заказ и сроки доставки.</p>`
                : ""}
          ${basket.items.length === 0
            ? "<p class=\"muted\">Корзина пуста. Добавьте товары в каталоге.</p>"
            : `
              <ul class="basket-list">
                ${basket.items
                .map((item) => `<li><span data-title="basket">${item.name}</span> — <span data-price="basket">${item.price} BYN</span> × ${item.quantity}</li>`)
                .join("")}
              </ul>
              <p class="delivery-total">Итого: <strong>${total} BYN</strong></p>
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
      `);
        const form = document.getElementById("delivery-form");
        if (form instanceof HTMLFormElement) {
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                void submitDelivery(form, container);
            });
        }
    }
    catch {
        await navigate("/auth");
    }
}
async function submitDelivery(form, container) {
    const data = new FormData(form);
    const payload = {
        address: String(data.get("address") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        paymentMethod: String(data.get("paymentMethod") ?? "card") === "cash" ? "cash" : "card"
    };
    try {
        await api.createDelivery(payload);
        window.dispatchEvent(new Event("basket:updated"));
        await deliveryPage(container, "Доставка создана");
    }
    catch (error) {
        await deliveryPage(container, error instanceof Error ? error.message : "Ошибка оформления доставки");
    }
}

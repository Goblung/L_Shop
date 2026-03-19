import { api } from "../api";
import { mountLayout } from "../components/layout";
import { productCard } from "../components/product-card";
import { bindRouterLinks, navigate } from "../router";
import type { Product } from "../types";

const CATEGORIES = [
  { value: "all", label: "Все" },
  { value: "milk", label: "Молочка" },
  { value: "bakery", label: "Выпечка" },
  { value: "fruits", label: "Фрукты" }
];

export async function homePage(container: HTMLElement): Promise<void> {
  await renderWithCategory(container, "all", "");
}

async function renderWithCategory(
  container: HTMLElement,
  category: string,
  message: string
): Promise<void> {
  const products = await api.products(category);
  mountLayout(
    container,
    `
      <section class="catalog-layout">
        <aside class="filters card">
          <h3>Фильтры</h3>
          <div class="filter-list">
            ${CATEGORIES.map(
              (item) =>
                `<button data-filter="${item.value}" class="${item.value === category ? "active-filter" : ""}">${item.label}</button>`
            ).join("")}
          </div>
          <p class="muted">Открыть: <a href="/basket" data-link>Корзину</a> / <a href="/delivery" data-link>Доставку</a></p>
        </aside>
        <section class="products">
          ${message ? `<p>${message}</p>` : ""}
          <div class="product-grid">
            ${products.map((product) => productCard(product)).join("")}
          </div>
        </section>
      </section>
    `
  );

  bindFilterHandlers(container, products, category);
  bindRouterLinks();
}

function bindFilterHandlers(container: HTMLElement, products: Product[], category: string): void {
  document.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.filter;
      if (!next) {
        return;
      }
      void renderWithCategory(container, next, "");
    });
  });

  products.forEach((product) => {
    const addBtn = document.querySelector<HTMLButtonElement>(
      `[data-add-product="${product.id}"]`
    );
    if (!addBtn) {
      return;
    }
    addBtn.addEventListener("click", () => {
      void onAddProduct(product.id, container, category);
    });
  });
}

async function onAddProduct(
  productId: string,
  container: HTMLElement,
  category: string
): Promise<void> {
  try {
    await api.addToBasket(productId);
    await renderWithCategory(container, category, "Товар добавлен в корзину");
  } catch {
    await navigate("/register");
  }
}

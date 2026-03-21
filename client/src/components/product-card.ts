import type { Product } from "../types/product";

const categoryLabels: Record<string, string> = {
  cpu: "Процессоры",
  gpu: "Видеокарты",
  ram: "Оперативная память",
  ssd: "SSD",
  hdd: "Жесткие диски",
  motherboard: "Материнские платы",
  psu: "Блоки питания",
  case: "Корпуса",
  cooler: "Системы охлаждения"
};

const formatCategory = (code: string): string => categoryLabels[code] ?? code;

export function productCard(product: Product, isAuthenticated: boolean): string {
  const hasDiscount = typeof product.discount === "number" && product.discount > 0;
  const finalPrice = hasDiscount ? product.price * (1 - product.discount! / 100) : product.price;

  const stockClass = product.isAvailable ? "product-stock product-stock--in" : "product-stock product-stock--out";
  const stockText = product.isAvailable ? "В наличии" : "Под заказ";

  return `
    <article class="product-card" data-product-card="${String(product.id)}">
      <div class="product-card-media">
        ${
          hasDiscount
            ? `<span class="product-discount-badge">−${String(product.discount)}%</span>`
            : ""
        }
        <img class="product-image" src="${product.images.preview}" alt="${product.title}" />
      </div>
      <div class="product-card-body">
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price">
          ${
            hasDiscount
              ? `
            <span class="old-price">${product.price} BYN</span>
            <span class="new-price">${finalPrice.toFixed(2)} BYN</span>
          `
              : `<span class="current-price">${product.price} BYN</span>`
          }
        </div>
        <div class="product-meta">
          <span class="${stockClass}">${stockText}</span>
          <p class="product-categories">
            <span class="product-cat-label">Категории</span>${product.categories.map(formatCategory).join(", ")}
          </p>
        </div>
        ${
          isAuthenticated
            ? `
          <div class="product-actions">
            <label class="product-quantity">
              Кол-во
              <input type="number" min="1" value="1" data-quantity />
            </label>
            <button type="button" class="btn" data-add-to-basket="${String(product.id)}">
              В корзину
            </button>
          </div>
        `
            : ""
        }
      </div>
    </article>
  `;
}

import type { Product } from "../types";

export function productCard(product: Product): string {
  return `
    <article class="product-card">
      <h3 data-title>${product.name}</h3>
      <p data-price>${product.price} ₽</p>
      <button data-add-product="${product.id}">В корзину</button>
    </article>
  `;
}

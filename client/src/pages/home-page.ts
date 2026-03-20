import { mountLayout } from "../components/layout";
import { api } from "../api";
import { navigate } from "../router";
import { state } from "../state";
import { productCard } from "../components/product-card";
import type { Product } from "../types/product";

export async function homePage(container: HTMLElement): Promise<void> {
  mountLayout(
    container,
    `
      <section class="catalog-page" id="catalog-root">
        <h2 class="catalog-title">Каталог компьютерных запчастей</h2>

        <div class="filters-panel" id="filters-panel">
          <input
            id="catalog-search"
            type="text"
            placeholder="Поиск по названию или описанию (CPU, GPU, RAM, SSD...)"
            value=""
          />

          <select id="catalog-sort">
            <option value="asc">Цена: по возрастанию</option>
            <option value="desc">Цена: по убыванию</option>
          </select>

          <div class="category-filters">
            <h4>Типы запчастей</h4>
            <div id="catalog-categories" class="category-options"></div>
          </div>

          <label class="availability-filter">
            <input id="catalog-available" type="checkbox" />
            Только в наличии
          </label>
        </div>

        <div class="products-grid" id="products-grid">
          <p class="muted">Загрузка товаров...</p>
        </div>
      </section>
    `
  );

  const catalogRoot = document.getElementById("catalog-root");
  const productsGrid = document.getElementById("products-grid");
  const searchInput = document.getElementById("catalog-search") as HTMLInputElement | null;
  const sortSelect = document.getElementById("catalog-sort") as HTMLSelectElement | null;
  const availableCheckbox = document.getElementById("catalog-available") as HTMLInputElement | null;
  const categoriesContainer = document.getElementById("catalog-categories");

  if (
    !(catalogRoot instanceof HTMLElement) ||
    !(productsGrid instanceof HTMLElement) ||
    !(searchInput instanceof HTMLInputElement) ||
    !(sortSelect instanceof HTMLSelectElement) ||
    !(availableCheckbox instanceof HTMLInputElement) ||
    !(categoriesContainer instanceof HTMLElement)
  ) {
    return;
  }

  let products: Product[] = [];
  let searchTerm = "";
  let sortOrder: "asc" | "desc" = "asc";
  let selectedCategories: string[] = [];
  let showAvailableOnly = false;

  const isAuthenticated = Boolean(state.user);

  const getFinalPrice = (p: Product): number =>
    typeof p.discount === "number" && p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;

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

  const getFilteredProducts = (): Product[] => {
    const search = searchTerm.trim().toLowerCase();
    const selectedSet = new Set(selectedCategories);

    return products
      .filter((p) => {
        const matchesSearch =
          search.length === 0 ||
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search);

        const matchesCategories =
          selectedSet.size === 0 || p.categories.some((c) => selectedSet.has(c));

        const matchesAvailability = !showAvailableOnly || p.isAvailable;

        return matchesSearch && matchesCategories && matchesAvailability;
      })
      .sort((a, b) => {
        const diff = getFinalPrice(a) - getFinalPrice(b);
        return sortOrder === "asc" ? diff : -diff;
      });
  };

  const renderProducts = (): void => {
    const filtered = getFilteredProducts();

    productsGrid.innerHTML =
      filtered.length > 0
        ? filtered.map((p) => productCard(p, isAuthenticated)).join("")
        : `<p class="muted">Товары не найдены</p>`;
  };

  const renderCategories = (cats: string[]): void => {
    categoriesContainer.innerHTML = cats
      .map((cat) => {
        const checked = selectedCategories.includes(cat);
        return `
          <label class="category-option">
            <input type="checkbox" data-category="${cat}" ${checked ? "checked" : ""} />
            ${formatCategory(cat)}
          </label>
        `;
      })
      .join("");
  };

  // Фильтры
  searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value;
    renderProducts();
  });

  sortSelect.addEventListener("change", () => {
    sortOrder = sortSelect.value === "desc" ? "desc" : "asc";
    renderProducts();
  });

  availableCheckbox.addEventListener("change", () => {
    showAvailableOnly = availableCheckbox.checked;
    renderProducts();
  });

  catalogRoot.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const cat = target.dataset.category;
    if (!cat) return;

    if (target.checked) {
      if (!selectedCategories.includes(cat)) selectedCategories = [...selectedCategories, cat];
    } else {
      selectedCategories = selectedCategories.filter((c) => c !== cat);
    }

    renderProducts();
  });

  // Добавление в корзину (делегирование событий)
  catalogRoot.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const btn = target.closest<HTMLButtonElement>('button[data-add-to-basket]');
    if (!btn) return;

    if (!state.user) {
      await navigate("/auth");
      return;
    }

    const productId = String(btn.dataset.addToBasket ?? "");
    if (!productId) return;

    const card = btn.closest<HTMLElement>("[data-product-card]");
    const qtyInput = card?.querySelector<HTMLInputElement>('input[data-quantity]');
    const quantity = qtyInput
      ? Math.max(1, parseInt(qtyInput.value || "1", 10) || 1)
      : 1;

    await api.addToBasket(productId, quantity);
    window.dispatchEvent(new Event("basket:updated"));
  });

  // Загрузка товаров
  try {
    products = await api.products();

    const allCategories = Array.from(new Set(products.flatMap((p) => p.categories))).sort();
    renderCategories(allCategories);

    renderProducts();
  } catch {
    productsGrid.innerHTML = `<p class="error">Ошибка загрузки каталога</p>`;
  }
}






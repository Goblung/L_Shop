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

        <aside class="filters-panel" id="filters-panel" aria-label="Фильтры каталога">
          <div class="filters-panel-head">
            <h3 class="filters-heading">Фильтры</h3>
            <p class="filters-hint">Уточните каталог по названию, категории и наличию</p>
          </div>

          <div class="filters-row">
            <div class="filter-field filter-field-grow">
              <label class="filter-label" for="catalog-search">Поиск</label>
              <input
                id="catalog-search"
                class="filter-input"
                type="search"
                autocomplete="off"
                placeholder="Например: Ryzen, RTX, DDR4, SSD…"
                value=""
              />
            </div>
            <div class="filter-field">
              <label class="filter-label" for="catalog-sort">Сортировка</label>
              <select id="catalog-sort" class="filter-select">
                <option value="asc">Цена: сначала дешевле</option>
                <option value="desc">Цена: сначала дороже</option>
              </select>
            </div>
          </div>

          <div class="filter-field filter-field-categories">
            <span class="filter-label">Категории</span>
            <div id="catalog-categories" class="category-chips" role="group" aria-label="Типы запчастей"></div>
          </div>

          <label class="filter-toggle">
            <input id="catalog-available" class="filter-toggle-input" type="checkbox" />
            <span class="filter-toggle-ui" aria-hidden="true"></span>
            <span class="filter-toggle-text">Только товары в наличии</span>
          </label>
        </aside>

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
          <label class="category-chip">
            <input type="checkbox" class="category-chip-input" data-category="${cat}" ${
              checked ? "checked" : ""
            } />
            <span class="category-chip-text">${formatCategory(cat)}</span>
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






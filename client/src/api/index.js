const API_BASE = "http://localhost:4000/api";
const IMAGES_BASE = API_BASE.replace(/\/api\/?$/, "");
async function request(path, init) {
    const response = await fetch(`${API_BASE}${path}`, {
        ...init,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {})
        }
    });
    if (!response.ok) {
        let message = "Ошибка запроса";
        try {
            const payload = (await response.json());
            message = payload.error ?? payload.message ?? message;
        }
        catch {
            // noop
        }
        throw new Error(message);
    }
    return (await response.json());
}
export const api = {
    register: (payload) => request("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
    }),
    login: (payload) => request("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
    }),
    me: () => request("/auth/me"),
    logout: () => request("/auth/logout", { method: "POST" }),
    basket: () => request("/basket/active"),
    addToBasket: (productId, quantity) => request("/basket/items", {
        method: "POST",
        body: JSON.stringify({ productId, quantity })
    }),
    updateBasketItem: (productId, quantity) => request(`/basket/items/${encodeURIComponent(productId)}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity })
    }),
    removeBasketItem: (productId) => request(`/basket/items/${encodeURIComponent(productId)}`, {
        method: "DELETE"
    }),
    clearBasket: () => request("/basket/clear", { method: "DELETE" }),
    products: async () => {
        const rawProducts = await request("/products");
        return rawProducts.map((raw) => {
            const p = raw;
            const preview = typeof p.images?.preview === "string" ? p.images.preview : undefined;
            const normalizedImages = p.images && typeof p.images === "object"
                ? {
                    ...p.images,
                    preview: preview && preview.startsWith("/img/")
                        ? `${IMAGES_BASE}${preview}`
                        : preview ?? p.images.preview
                }
                : p.images;
            return {
                ...p,
                id: p.id,
                images: normalizedImages,
                delivery: p.delivery
                    ? {
                        ...p.delivery,
                        earlyDate: new Date(p.delivery.earlyDate)
                    }
                    : undefined
            };
        });
    },
    deliveries: () => request("/delivery/active"),
    createDelivery: (payload) => request("/delivery", {
        method: "POST",
        body: JSON.stringify(payload)
    })
};

const API_BASE = "http://localhost:4000/api";
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
    addToBasket: (productId) => request("/basket/items", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: 1 })
    }),
    deliveries: () => request("/delivery/active"),
    createDelivery: (payload) => request("/delivery", {
        method: "POST",
        body: JSON.stringify(payload)
    })
};

const routes = new Map();
export function registerRoute(path, handler) {
    routes.set(path, handler);
}
export async function navigate(path) {
    window.history.pushState({}, "", path);
    await renderCurrentRoute();
}
export async function renderCurrentRoute() {
    const handler = routes.get(window.location.pathname) ?? routes.get("/404");
    if (!handler) {
        return;
    }
    await handler();
}
export function bindRouterLinks() {
    document.querySelectorAll("[data-link]").forEach((node) => {
        node.addEventListener("click", (event) => {
            event.preventDefault();
            const path = node.getAttribute("href");
            if (!path) {
                return;
            }
            void navigate(path);
        });
    });
}

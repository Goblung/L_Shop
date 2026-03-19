type RouteHandler = () => Promise<void> | void;

const routes = new Map<string, RouteHandler>();

export function registerRoute(path: string, handler: RouteHandler): void {
  routes.set(path, handler);
}

export async function navigate(path: string): Promise<void> {
  window.history.pushState({}, "", path);
  await renderCurrentRoute();
}

export async function renderCurrentRoute(): Promise<void> {
  const handler = routes.get(window.location.pathname) ?? routes.get("/404");
  if (!handler) {
    return;
  }
  await handler();
}

export function bindRouterLinks(): void {
  document.querySelectorAll<HTMLElement>("[data-link]").forEach((node) => {
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

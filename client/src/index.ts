import { api } from "./api";
import { basketPage } from "./pages/basket-page";
import { homePage } from "./pages/home-page";
import { authPage } from "./pages/auth-page";
import { registerPage } from "./pages/register-page";
import { registerRoute, renderCurrentRoute } from "./router";
import { state } from "./state";
import "./style.css";

const app = document.getElementById("app");
if (!(app instanceof HTMLElement)) {
  throw new Error("Container #app not found");
}

registerRoute("/", () => homePage(app));
registerRoute("/auth", () => authPage(app));
registerRoute("/register", () => registerPage(app));
registerRoute("/basket", () => basketPage(app));
registerRoute("/404", () => {
  app.innerHTML = `<div class="card"><h2>404</h2><p>Страница не найдена</p></div>`;
});

window.addEventListener("popstate", () => {
  void renderCurrentRoute();
});

void bootstrap();

async function bootstrap(): Promise<void> {
  try {
    state.user = await api.me();
  } catch {
    state.user = null;
  }

  await renderCurrentRoute();
}

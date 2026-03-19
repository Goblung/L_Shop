import { api } from "./api";
import { basketPage } from "./pages/basket-page";
import { deliveryPage } from "./pages/delivery-page";
import { homePage } from "./pages/home-page";
import { registerPage } from "./pages/register-page";
import { registerRoute, renderCurrentRoute } from "./router";
import { state } from "./state";
import "./style.css";
const app = document.getElementById("app");
if (!(app instanceof HTMLElement)) {
    throw new Error("Container #app not found");
}
registerRoute("/", () => homePage(app));
registerRoute("/register", () => registerPage(app));
registerRoute("/basket", () => basketPage(app));
registerRoute("/delivery", () => deliveryPage(app));
registerRoute("/404", () => {
    app.innerHTML = `<div class="card"><h2>404</h2><p>Страница не найдена</p></div>`;
});
window.addEventListener("popstate", () => {
    void renderCurrentRoute();
});
void bootstrap();
async function bootstrap() {
    try {
        state.user = await api.me();
    }
    catch {
        state.user = null;
    }
    await renderCurrentRoute();
}

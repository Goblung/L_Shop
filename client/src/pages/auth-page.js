import { api } from "../api";
import { mountLayout } from "../components/layout";
import { navigate } from "../router";
import { state } from "../state";
export function authPage(container, message) {
    mountLayout(container, `
      <section class="auth-page">
        <article class="card">
          <h2>Авторизация</h2>
          ${message ? `<p class="error">${message}</p>` : ""}

          <form id="login-form">
            <input name="identifier" placeholder="Имя / email / логин / телефон" required />
            <input name="password" type="password" placeholder="Пароль" required />
            <button type="submit">Войти</button>
          </form>

          <div class="auth-actions">
            <button type="button" id="to-register">Нет аккаунта? Перейти на регистрацию</button>
            <button type="button" id="to-home">На главную</button>
          </div>
        </article>
      </section>
    `);
    const loginForm = document.getElementById("login-form");
    const toRegisterBtn = document.getElementById("to-register");
    const toHomeBtn = document.getElementById("to-home");
    if (!(loginForm instanceof HTMLFormElement)) {
        return;
    }
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        void onLogin(loginForm, container);
    });
    if (toRegisterBtn instanceof HTMLButtonElement) {
        toRegisterBtn.addEventListener("click", () => {
            void navigate("/register");
        });
    }
    if (toHomeBtn instanceof HTMLButtonElement) {
        toHomeBtn.addEventListener("click", () => {
            void navigate("/");
        });
    }
}
async function onLogin(form, container) {
    const data = new FormData(form);
    const payload = {
        identifier: String(data.get("identifier") ?? ""),
        password: String(data.get("password") ?? "")
    };
    try {
        const response = await api.login(payload);
        state.user = response.user;
        await navigate("/");
    }
    catch (error) {
        authPage(container, error instanceof Error ? error.message : "Ошибка авторизации");
    }
}

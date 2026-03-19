import { api } from "../api";
import { mountLayout } from "../components/layout";
import { navigate } from "../router";
import { state } from "../state";
export function registerPage(container, message) {
    mountLayout(container, `
      <section class="auth-grid">
        <article class="card">
          <h2>Регистрация</h2>
          ${message ? `<p class="error">${message}</p>` : ""}
          <form id="register-form" data-registration>
            <input name="name" placeholder="Имя" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="login" placeholder="Логин" required />
            <input name="phone" placeholder="Телефон" required />
            <input name="password" type="password" placeholder="Пароль" required />
            <button type="submit">Зарегистрироваться</button>
          </form>
        </article>
        <article class="card">
          <h2>Авторизация</h2>
          <form id="login-form">
            <input name="identifier" placeholder="Имя / email / логин / телефон" required />
            <input name="password" type="password" placeholder="Пароль" required />
            <button type="submit">Войти</button>
          </form>
        </article>
      </section>
    `);
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
    if (!(registerForm instanceof HTMLFormElement) || !(loginForm instanceof HTMLFormElement)) {
        return;
    }
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        void onRegister(registerForm, container);
    });
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        void onLogin(loginForm, container);
    });
}
async function onRegister(form, container) {
    const data = new FormData(form);
    const payload = {
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        login: String(data.get("login") ?? ""),
        phone: String(data.get("phone") ?? ""),
        password: String(data.get("password") ?? "")
    };
    try {
        const response = await api.register(payload);
        state.user = response.user;
        await navigate("/");
    }
    catch (error) {
        registerPage(container, error instanceof Error ? error.message : "Ошибка регистрации");
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
        registerPage(container, error instanceof Error ? error.message : "Ошибка авторизации");
    }
}

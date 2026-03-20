import { api } from "../api";
import { mountLayout } from "../components/layout";
import { navigate } from "../router";
import { state } from "../state";
export function registerPage(container, message) {
    mountLayout(container, `
      <section class="auth-page">
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
          
          <div class="auth-actions">
            <button type="button" id="to-auth">Уже есть аккаунт? Перейти на авторизацию</button>
            <button type="button" id="to-home">На главную</button>
          </div>
        </article>
      </section>
    `);
    const registerForm = document.getElementById("register-form");
    const toAuthBtn = document.getElementById("to-auth");
    const toHomeBtn = document.getElementById("to-home");
    if (!(registerForm instanceof HTMLFormElement)) {
        return;
    }
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        void onRegister(registerForm, container);
    });
    if (toAuthBtn instanceof HTMLButtonElement) {
        toAuthBtn.addEventListener("click", () => {
            void navigate("/auth");
        });
    }
    if (toHomeBtn instanceof HTMLButtonElement) {
        toHomeBtn.addEventListener("click", () => {
            void navigate("/");
        });
    }
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

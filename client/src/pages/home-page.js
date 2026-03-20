import { mountLayout } from "../components/layout";
export async function homePage(container) {
    mountLayout(container, `
      <section class="card auth-page">
        <h2>Каталог</h2>
      </section>
    `);
}

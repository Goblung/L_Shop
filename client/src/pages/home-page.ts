import { mountLayout } from "../components/layout";

export async function homePage(container: HTMLElement): Promise<void> {
  mountLayout(
    container,
    `
      <section class="card auth-page">
        <h2>Каталог</h2>
      </section>
    `
  );
}






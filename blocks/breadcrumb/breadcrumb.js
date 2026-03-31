export default async function decorate(block) {
  const breadcrumbsItems = [...block.querySelectorAll('li')];

  const breadcrums = breadcrumbsItems.map((el) => {
    const { href } = el.querySelector('a');
    const text = el.querySelector('a').innerHTML;

    return document.createRange().createContextualFragment(`
      <li>
        <a href="${href}">
          <span>${text}</span>
        </a>
      </li>
    `).children[0].outerHTML;
  }).join('');

  const breadcrumbFragment = document.createRange().createContextualFragment(`
    <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
      <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
        <ul>
          ${breadcrums}
        </ul>
      </nav>
    </nav>
  `);

  block.innerHTML = '';
  block.append(breadcrumbFragment.children[0]);
}

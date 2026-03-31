import { getMetadata } from '../../scripts/aem.js';
import { getTextLabel } from '../../scripts/commons.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';

  // load footer fragment
  const footerPath = footerMeta.footer || '/footer';
  const fragment = await loadFragment(footerPath);
  const [firstColumn, links] = fragment.querySelectorAll(':scope > .section');

  const logoIcon = firstColumn.querySelector('picture').parentElement;
  logoIcon.classList.add('image', 'is-48x48');
  logoIcon.querySelector('img')?.setAttribute('alt', getTextLabel('Puresight logo'));
  logoIcon.parentElement.remove();

  const firstColumnParagraphsHTML = [...firstColumn.querySelectorAll('p')].map((p) => {
    const strongEl = p.querySelector('strong');
    const linkEl = p.querySelector('a');

    p.className = '';

    if (linkEl) {
      linkEl.className = '';
    }

    if (strongEl && linkEl && strongEl.firstChild === linkEl && strongEl.children.length === 1) {
      // changing <strong><a href...></a></strong> to <a href...><strong></strong</a>
      // for styling purpose

      strongEl.replaceWith(linkEl);
      strongEl.append(...linkEl.childNodes);
      linkEl.append(strongEl);
    }

    return p.outerHTML;
  }).join('');

  const linksHTML = [...links.querySelectorAll('ul')].map((column) => {
    const columnsLinks = [...column.querySelectorAll('li a')].map((link) => {
      const linkFragment = document.createRange().createContextualFragment(`
        <div class="container">
          <a href="${link.href}" class="link is-medium is-light">
            <span>${link.innerHTML}</span>
          </a>
        </div>
      `);

      return linkFragment.children[0].outerHTML;
    }).join('');

    const columnFragment = document.createRange().createContextualFragment(`
      <div class="column">
        ${columnsLinks}
      </div>
    `);

    return columnFragment.children[0].outerHTML;
  }).join('');

  const footerFragment = document.createRange().createContextualFragment(`
    <footer class="footer">
      <div class="container">
        <div class="columns is-multiline is-tablet">
            <div class="column is-full-tablet is-half-desktop ">
              <div class="container  ">
                ${logoIcon.outerHTML}
                <div class="content is-normal has-text-weight-medium has-text-white">
                  ${firstColumnParagraphsHTML}
                </div>
              </div>
            </div>
            ${linksHTML}
        </div>
      </div>
    </footer>
  `);

  // replacing footer-wrapper with footer fragment
  block.parentElement.replaceWith(footerFragment.children[0]);
}

import { getMetadata } from '../../scripts/aem.js';
import { getTextLabel } from '../../scripts/commons.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const [logoWrapper, menuItemsWrapper] = fragment.querySelectorAll(':scope > div');

  const logoLink = logoWrapper.querySelector('a').href;
  const logoImg = logoWrapper.querySelector('img').src;
  const menuItmes = menuItemsWrapper.querySelectorAll('li');

  const navbarItemsHTML = [...menuItmes].map((item) => {
    const link = item.querySelector('a');

    link.classList.add('navbar-item');

    return link.outerHTML;
  }).join('');

  const headerFragment = document.createRange().createContextualFragment(`
    <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="container is-widescreen">
        <div class="navbar-brand">
          <a class="navbar-item" href="${logoLink}" alt="PureSight">
            <img class="header-logo"
              alt="${getTextLabel('PureSight')}"
              src="${logoImg}"
              width="164"
              height="66"
            />
          </a>

          <a
            role="button"
            class="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navMenu"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div class="navbar-menu" id="navMenu">
          <div class="navbar-end">
            ${navbarItemsHTML}

            <div class="navbar-item">
              <div id="autocomplete">
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `);

  block.replaceWith(headerFragment.children[0]);
}

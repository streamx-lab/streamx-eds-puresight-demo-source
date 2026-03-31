import {
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  getMetadata,
} from './aem.js';
import { loadTemplate } from './commons.js';

const PURESIGHT_DEMO_LOAD_EVENT = 'puresight-demo--loaded';

const loadDependenciesLibs = async () => {
  window.KYANITE_ON_LOAD = PURESIGHT_DEMO_LOAD_EVENT;
  window.KYANITE_ON_DOM_CONTENT_LOAD = PURESIGHT_DEMO_LOAD_EVENT;

  // dynamic import because the KYANITE_ON_LOAD_CUSTOM_EVENT must be set first
  await import('../libs/kyanite/main.published.js');
  await import('../libs/kyanite/main.js');
};

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

const customDecorateIcons = (element) => {
  const iconsList = element.querySelectorAll('span.icon');
  const svgIcons = [];

  iconsList.forEach((icon) => {
    const mdiClass = [...icon.classList].find((el) => el.startsWith('icon-mdi-'));
    if (mdiClass) {
      const iconName = mdiClass.split('icon-')[1];
      const iconFragment = document.createRange().createContextualFragment(`
        <span class="icon">
          <i class="mdi ${iconName}" aria-hidden="false"></i>
        </span>
      `);

      icon.replaceWith(iconFragment);
    } else {
      svgIcons.push(svgIcons);
      decorateIcons(icon);
    }
  });
};

const handleDefaultContent = (main) => {
  const defaultContentElements = [...main.querySelectorAll('.default-content-wrapper')];

  defaultContentElements.forEach((dc) => {
    [...dc.querySelectorAll('h1, h2, h3, h4, h5, h6')].forEach((heading) => {
      heading.classList.add('title', `is-${heading.tagName.substring(1)}`, 'has-text-grey-900');
    });
  });
};

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  customDecorateIcons(main);
  decorateSections(main);
  decorateBlocks(main);
  handleDefaultContent(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    const templateName = getMetadata('template');
    if (templateName) await loadTemplate(doc, templateName);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);
  await loadDependenciesLibs();

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  await loadHeader(doc.querySelector('header'));
  await loadFooter(doc.querySelector('footer'));

  // dispatching event for window 'load' and document 'DOMContentLoaded`
  window.dispatchEvent(new CustomEvent(PURESIGHT_DEMO_LOAD_EVENT));
  document.dispatchEvent(new CustomEvent(PURESIGHT_DEMO_LOAD_EVENT));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

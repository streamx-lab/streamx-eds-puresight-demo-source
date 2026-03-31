const HERO_THEMES = new Set(['teak', 'oxford-blue']);

const THEMES_STYLES = {
  teak: {
    block: 'teak',
    button: 'is-primary',
    heading: 'has-text-grey-900',
    text: 'has-text-grey-700',
  },
  'oxford-blue': {
    block: 'oxford-blue',
    button: 'is-white',
    heading: 'has-text-white',
    text: 'has-text-white',
  },
};

export default function decorate(block) {
  const themeName = [...block.classList].find((el) => HERO_THEMES.has(el)) || 'teak';
  const currentTheme = THEMES_STYLES[themeName];
  const image = block.querySelector('picture');
  const ctaButton = block.querySelector('.button-container > a');

  if (!image) {
    // eslint-disable-next-line no-console
    console.warn('Hero block requires an image!');

    return;
  }

  image.parentElement.remove();
  image.classList.add('image', 'is-square');
  image.querySelector('img').setAttribute('fetchpriority', 'high');
  image.removeAttribute('loading');

  if (ctaButton) {
    ctaButton.parentElement.remove();
    ctaButton.classList.add('is-normal', currentTheme.button);

    // wrapping text nodes with span
    [...ctaButton.childNodes]
      .filter((el) => el.nodeType === Node.TEXT_NODE && el.textContent.trim())
      .forEach((el) => {
        const elWrapper = document.createElement('span');

        elWrapper.textContent = el.textContent;
        el.replaceWith(elWrapper);
      });
  }

  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const descriptions = block.querySelectorAll('p');

  const descriptionFragment = document.createRange().createContextualFragment(`
    <div class="content is-medium ${currentTheme.text}">
      ${[...descriptions].map((desc) => desc.outerHTML).join('')}
    </div>
  `);

  const heroFragment = document.createRange().createContextualFragment(`
    <div class="hero-body">
      <div class="container  ">
        <div class="columns is-multiline is-tablet">
          <div class="column is-6-desktop is-12-mobile ">
            <section class="section is-normal">
              <h3 class="title is-3 ${currentTheme.heading}">
                <span>${heading.innerHTML}</span>
              </h3>
              ${descriptionFragment.children[0].outerHTML}
              ${ctaButton.outerHTML}
            </section>
          </div>
          <div class="column ">
            ${image.outerHTML}
          </div>
        </div>
      </div>
    </div>
  `);

  block.innerHTML = '';
  block.append(heroFragment.children[0]);

  if (themeName === 'teak') {
    block.classList.add('is-small');
  }
}

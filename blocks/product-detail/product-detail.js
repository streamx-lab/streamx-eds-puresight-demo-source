import { getMetadata } from '../../scripts/aem.js';
import { getTextLabel } from '../../scripts/commons.js';

const renderImagesTiles = (images, name) => {
  const imagesTiles = images.map((img, index) => `
    <div class="column">
      <figure class="image">
        <img
          src="${img}"
          alt="${name} ${index}"
        />
      </figure>
    </div>
  `).join(' ');

  return imagesTiles;
};

const renderBulletPoints = (bulletPoints) => bulletPoints.join('. ');

const renderKeywords = (keywords) => keywords.join(', ');

const renderModal = (heading, tableHeadings, vendors) => {
  const renderRow = ({ image, deliveryTime, price }) => `
      <div class="columns is-multiline is-vcentered is-mobile">
        <div class="column is-3-tablet is-3-desktop is-4-mobile">
          <figure class="image">
            <img
              src="${image}"
              alt="${getTextLabel('Shop logo')}"
            />
          </figure>
        </div>

        <div class="column is-4-tablet is-5-desktop is-6-mobile">
          <div class="content is-small has-text-black">
            <p>${deliveryTime}</p>
          </div>
        </div>

        <div class="column is-2-tablet is-1-desktop is-2-mobile">
          <div class="content is-small has-text-black">
            <p><strong>${price}</strong></p>
          </div>
        </div>

        <div class="column is-3-tablet is-3-desktop is-12-mobile">
          <button class="button is-normal is-secondary is-fullwidth">
            <span>${getTextLabel('Buy now')}</span>

            <span class="icon">
              <i class="mdi fa-lg mdi-cart-outline" aria-hidden="false"></i>
            </span>
          </button>
        </div>
      </div>
    `;

  const modalFragment = document.createRange().createContextualFragment(`
    <div class="container vendors-list-modal">
      <div id="modal_vendors_template" class="modal">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">${heading.innerHTML}</p>
            <button class="delete" aria-label="close"></button>
          </header>

          <section class="modal-card-body">
            <div class="container">
              <div class="columns is-multiline is-vcentered is-mobile">
                <div class="column is-3-tablet is-3-desktop is-4-mobile">
                  <div class="content is-small has-text-black">
                    <p><strong>${tableHeadings[0].textContent}</strong></p>
                  </div>
                </div>

                <div class="column is-4-tablet is-5-desktop is-6-mobile">
                  <div class="content is-small has-text-black">
                    <p><strong>${tableHeadings[1].textContent}</strong></p>
                  </div>
                </div>

                <div class="column is-2-tablet is-1-desktop is-2-mobile">
                  <div class="content is-small has-text-black">
                    <p><strong>${tableHeadings[2].textContent}</strong></p>
                  </div>
                </div>
              </div>

              ${vendors.map((v) => renderRow(v)).join('')}
            </div>
          </section>
        </div>
      </div>
    </div>
  `);

  return modalFragment.children[0];
};

export default async function decorate(block) {
  const modalHeading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const modalTableHeading = block.querySelectorAll('li');

  let productData;

  try {
    productData = await (await fetch(`/data/products/${getMetadata('product-id')}.json`)).json();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);

    return;
  }

  const {
    name, mainImage, images, id, type, width, height, length, dimensionUnit, weight, weightUnit,
    bulletPoints, keywords, vendors,
  } = productData;
  const imagesTiles = renderImagesTiles(images, name);

  const productDeatilFragment = document.createRange().createContextualFragment(`
    <div>
      <div class="container product-container">
        <h5 class="title is-5 has-text-grey-900">
          ${name}
        </h5>

        <div class="columns is-tablet">
          <div class="column is-three-fifths-desktop">
            <div class="tile is-ancestor">
              <div class="tile is-vertical is-parent">
                <div class="tile is-child container">
                  <figure class="image">
                    <img
                      src="${mainImage}"
                      loading="eager"
                      class="main-image"
                      alt="${name}"
                    />
                  </figure>
                </div>

                <div class="tile is-child container">
                  <div class="columns is-tablet">
                    ${imagesTiles}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="column">
            <div class="container">
              <div class="content is-medium has-text-grey-700">
                <p>Pure Sight co.</p>
              </div>

              <div class="content is-medium has-text-grey-100">
                <p><span class="has-text-light">${id}</span></p>
              </div>
              <div class="separator">
                <hr class=" " />
              </div>

              <div class="container">
                <div class="container">
                  <a class="link is-medium is-dark">
                    <span class="icon">
                      <i class="mdi mdi-18px mdi-shape" aria-hidden="false"></i>
                    </span>

                    <span>${type}</span>
                  </a>
                </div>

                <div class="container">
                  <a class="link is-medium is-dark">
                    <span class="icon">
                      <i class="mdi mdi-18px mdi-axis-arrow" aria-hidden="false"></i>
                    </span>

                    <span>${width}x${length}x${height} ${dimensionUnit}</span>
                  </a>
                </div>

                <div class="container">
                  <a class="link is-medium is-dark">
                    <span class="icon">
                      <i class="mdi mdi-18px mdi-weight" aria-hidden="false"></i>
                    </span>

                    <span>${weight} ${weightUnit}</span>
                  </a>
                </div>
              </div>
            </div>

            <div class="separator">
              <hr class=" " />
            </div>

            <div class="content is-small has-text-grey-700">
              <p>
                ${renderBulletPoints(bulletPoints)}
              </p>
            </div>

            <div class="separator">
              <hr class=" " />
            </div>

            <div class="container">
              <div class="level level-with-gaps is-align-items-center">
                <div
                  class="level-item is-justify-content-flex-start has-text-left is-align-items-center"
                >
                  <div class="content is-medium has-text-grey-700">
                    <p><strong>from</strong></p>
                  </div>
                </div>

                <div
                  class="level-item is-justify-content-flex-start has-text-left is-align-items-flex-start"
                >
                  <h5 class="title is-5 has-text-grey-900">
                    <span class="has-text-primary">450€</span>
                  </h5>
                </div>
              </div>
            </div>

            <button
              class="button js-modal-trigger is-normal is-dark is-fullwidth"
              data-target="modal_vendors_template"
            >
              <span>${getTextLabel('Buy now')}</span>

              <span class="icon">
                <i class="mdi fa-lg mdi-cart-outline" aria-hidden="false"></i>
              </span>
            </button>

            <div class="content is-small has-text-grey-700">
              <p>
                <span class="has-text-light">
                  ${renderKeywords(keywords)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);

  const modalContent = renderModal(modalHeading, [...modalTableHeading], vendors);

  block.innerHTML = '';
  block.append(productDeatilFragment.children[0], modalContent);
}

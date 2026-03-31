import { getMetadata } from '../../scripts/aem.js';
import { getTextLabel } from '../../scripts/commons.js';

const renderRatings = (rating) => {
  const renderIcon = (iconValue) => `
      <span class="icon">
        <i class="mdi mdi-18px mdi-star${iconValue > rating ? '-outline' : ''}" aria-hidden="true"></i>
      </span>
    `;

  const ratingHTML = document.createRange().createContextualFragment(`
    <div class="container">
      ${[1, 2, 3, 4, 5].map((val) => renderIcon(val)).join('')}
    </div>
  `);

  return ratingHTML.children[0].outerHTML;
};

const renderReviewBox = (reviewData) => {
  const {
    stars, author, date, content, title,
  } = reviewData;

  const reviewBox = `
    <div class="tile is-child box">
      <div class="container">
        <div class="columns is-tablet">
          <div class="column">
            ${renderRatings(stars)}
            <div class="content is-small has-text-grey-700">
              <p><strong>${title}</strong></p>
            </div>
          </div>

          <div class="column">
            <div class="content is-small has-text-grey-700">
              <p style="text-align: right">${author}</p>
              <p style="text-align: right">${date}</p>
            </div>
          </div>
        </div>

        <div class="content is-small has-text-grey-700">
          <p>
            ${content}
          </p>
        </div>
      </div>
    </div>
  `;

  return document.createRange().createContextualFragment(reviewBox).children[0].outerHTML;
};

export default async function decorate(block) {
  let productData;

  try {
    productData = await (await fetch(`/data/products/${getMetadata('product-id')}.json`)).json();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);

    return;
  }

  const { reviews } = productData;

  const reviewsFragment = document.createRange().createContextualFragment(`
    <div class="column">
      <div class="columns is-tablet">
        <div class="column">
          <h6 class="title is-6 has-text-grey-900">${getTextLabel('Reviews')}</h6>
        </div>

        <div class="column">
          <div class="buttons is-right">
            <button class="button is-normal is-secondary is-inverted">
              <span>${getTextLabel('Rate product')}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="tile is-ancestor">
          <div class="tile is-vertical">
            ${reviews.map((r) => renderReviewBox(r)).join('')}
          </div>
        </div>
      </div>
    </div>
  `);

  block.innerHTML = '';
  block.append(reviewsFragment.children[0]);
}

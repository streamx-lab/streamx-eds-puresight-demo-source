import { getTextLabel } from '../../scripts/commons.js';

const rednerArticle = ({
  img, heading, description, link, author, date, readTime,
}) => {
  const readMoreLable = `Read more about: ${heading}`;
  const articleFragment = document.createRange().createContextualFragment(`
    <div class="column">
      <div class="container">
        <a href="${link}" aria-label="${getTextLabel(readMoreLable)}">
          <figure class="image is-2by3 ">
            <img src="${img}" alt="">
          </figure>
        </a>
        <div class="content is-medium  has-text-grey-700">
          <p><strong>${heading}</strong></p>
        </div>
        <div class="content is-small  has-text-grey-700">
          <p>${description}</p>
        </div>
        <div class="content is-small  has-text-grey-700">
          <p>${author} ${date} ${readTime}</p>
        </div>
        <a href="${link}" class="button is-normal is-dark" aria-label="${getTextLabel(readMoreLable)}">
          <span class="icon  ">
            <i class="mdi fa-lg mdi-arrow-right" aria-hidden="false"></i>
          </span>
        </a>
      </div>
    </div>
  `);

  return articleFragment.children[0].outerHTML;
};

export default async function decorate(block) {
  const heading = block.children[0].querySelector('h1, h2, h3, h4, h5, h6').innerHTML;
  const paragraphs = [...block.children[0].querySelectorAll('p')].filter((el) => !el.classList.contains('button-container'));
  const linkEl = block.children[0].querySelector('a.button');
  const articlesListContent = block.children[1].textContent.trim();
  let articlesList;

  try {
    articlesList = await (await fetch(articlesListContent)).json();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);

    return;
  }

  const renderLink = (link) => `
      <a href="${link.href}" class="button is-normal is-white is-outlined is-inverted">
        <span>${link.innerHTML}</span>
      </a>
    `;

  const ArticlesListFragment = document.createRange().createContextualFragment(`
    <div class="container is-widescreen articles-list">
      <div class="columns is-tablet">
        <div class="column">
          <section class="section is-normal articles-list-text">
            <h6 class="title is-6 has-text-grey-900">
              ${heading}
            </h6>
            <div class="content is-medium  has-text-grey-700">
              ${paragraphs.length ? paragraphs.map((p) => p.outerHTML).join('') : ''}
            </div>
            ${linkEl ? renderLink(linkEl) : ''}
          </section>
        </div>
        <div class="column">
          <div class="columns is-tablet articles-list-article-section">
            ${articlesList.data.slice(0, 2).map((el) => rednerArticle(el)).join('')}
          </div>
        </div>
      </div>
    </div>
  `);

  block.innerHTML = '';
  block.append(ArticlesListFragment.children[0]);
}

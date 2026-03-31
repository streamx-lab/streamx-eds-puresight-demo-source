import { createOptimizedPicture, getMetadata } from '../../scripts/aem.js';
import { getTextLabel } from '../../scripts/commons.js';

const renderGoToAllBlockArticles = (allPostsLink) => {
  const goToAllBlockArticlesFragment = document.createRange().createContextualFragment(`
    <a href="${allPostsLink}" class="blog-back-button">
      <span class="mdi mdi-arrow-left"></span>
      <span>${getTextLabel('All blog articles')}</span>
    </a>
  `);

  return goToAllBlockArticlesFragment.children[0].outerHTML;
};

const renderArticleHeader = ({
  headingText, avatarLink, author, date, readTime, image,
}) => {
  const articleHeader = document.createRange().createContextualFragment(`
    <div class="container blog-article-header">
      <div class="tags are-normal">
      </div>
      <h1 class="title is-4">${headingText}</h1>
      <article class="media">
        <figure class="media-left">
            <p class="image is-48x48">
              <img class="is-rounded" src="${avatarLink}" alt="${author}">
            </p>
        </figure>
        <div class="media-content">
            <div class="content has-text-weight-normal">
              <p>
                  <strong>${author}</strong>
                  <br>
                  <small>${date}</small>
                  <small>${readTime}</small>
              </p>
            </div>
        </div>
      </article>
      <figure class="image">
        ${image.outerHTML}
      </figure>
    </div>
  `);

  return articleHeader.children[0].outerHTML;
};

const renderTableOfContents = (headings) => {
  const tableOfContents = document.createRange().createContextualFragment(`
    <div class="blog-table-of-content">
      <label class="table-label">${getTextLabel('Table of contents')}</label>
      <ul class="table-content-list">
        ${headings.map((h) => `
          <li class="button is-ghost table-content-list__item--h5">
            <a href="#${h.id}">
              ${h.textContent}
            </a>
          </li>
        `).join('')}
      </ul>
      <a class="table-content-button" href="#">
        <span class="table-content-button__label">
          <span class="mdi mdi-arrow-up"></span>
          <span>${getTextLabel('Back to top')}</span>
        </span>
      </a>
    </div>
  `);

  return tableOfContents.children[0].outerHTML;
};

const renderAuthorBio = ({
  avatarLink, author, position, authorDescription,
}) => {
  const authorBio = document.createRange().createContextualFragment(`
    <template>
      <article class="id media">
        <figure class="photo media-left">
            <p class="image is-96x96">
              <img src="${avatarLink}" class="is-rounded" alt="${author}">
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
              <p class="name">
                ${author}
              </p>
              <p class="role">
                ${position}
              </p>
            </div>
        </div>
      </article>
      <div class="description content">
        <p>
          ${authorDescription}
        </p>
      </div>
    </template>
  `);

  return authorBio.children[0].innerHTML;
};

const renderArticleContent = (articleContent) => {
  const defaultContentEls = [...articleContent.querySelectorAll('.section .default-content-wrapper')];

  defaultContentEls.forEach((el) => {
    [...el.querySelectorAll('p')].forEach((paragraph) => {
      const paragraphWrapper = document.createElement('div');
      paragraphWrapper.classList.add('content', 'is-medium', 'has-text-grey-700');

      paragraph.replaceWith(paragraphWrapper);
      paragraphWrapper.append(paragraph);
    });

    [...el.querySelectorAll('h1, h2, h3, h4, h5, h6')].forEach((heading) => {
      heading.classList.remove('has-text-grey-900');
    });
  });

  const sectionsContent = [...articleContent.querySelectorAll('.section')]
    .flatMap((section) => [...section.children])
    .map((el) => el.innerHTML).join('');

  const authorBio = document.createRange().createContextualFragment(`
    <template>
      ${sectionsContent}
    </template>
  `);

  return authorBio.children[0].innerHTML;
};

const buildArticle = (main) => {
  const author = getMetadata('author');
  const authorDescription = getMetadata('author-description');
  const position = getMetadata('position');
  const date = getMetadata('date');
  const readTime = getMetadata('read-time');
  const avatarSource = getMetadata('avatar');
  const allPostsLink = getMetadata('all-posts-link');

  const avatarImg = createOptimizedPicture(avatarSource, author, false, [{ width: '192' }]);
  const avatarLink = avatarImg.querySelector('img').src;
  const authorBio = {
    avatarLink, author, position, authorDescription,
  };

  // first heading is the article heading
  const firstHeading = main.querySelector('h1, h2, h3, h4, h5, h6');
  const headingText = firstHeading?.textContent;
  firstHeading.remove();

  const image = main.querySelector('picture');
  const headingData = {
    headingText, avatarLink, author, date, readTime, image,
  };

  if (image.parentElement.tagName === 'P') {
    image.parentElement.remove();
  }

  const tableOfContentsHeaders = [...main.querySelectorAll('h1, h2, h3, h4, h5, h6')];

  const articleFragment = document.createRange().createContextualFragment(`
    <section class="section ">
      <div class="container  ">
        <div class="columns is-multiline is-desktop">
            <div class="column is-2-desktop sticky-container">
              ${renderGoToAllBlockArticles(allPostsLink)}
            </div>
            <div class="column is-8-desktop ">
              ${renderArticleHeader(headingData)}
            </div>
            <div class="column sticky-container">
              ${renderTableOfContents(tableOfContentsHeaders)}
            </div>
            <div class="column is-8-desktop is-offset-2-desktop ">
              ${renderArticleContent(main)}
              <div class="container blog-article-author-bio">
                ${renderAuthorBio(authorBio)}
              </div>
            </div>
        </div>
      </div>
    </section>
  `);

  main.innerHTML = articleFragment.children[0].outerHTML;
};

export default async function decorate(doc) {
  buildArticle(doc.querySelector('main'), doc);
}

const renderMainArticle = ({
  path, img, heading, avatar, author, date, readTime, description,
}) => {
  const articleFragment = document.createRange().createContextualFragment(`
    <a
      href="${path}"
      class="article-featured"
    >
      <div class="columns is-desktop">
        <div class="column">
          <figure class="image-hero">
            <img
              alt="${heading}"
              src="${img}"
            />
          </figure>
        </div>
        <div class="column">
          <div class="content">
            <div class="content-info">
              <h4 class="title is-4">
                ${heading}
              </h4>
              <p class="article-description">${description}</p>
              <div class="content-info-details">
                <span class="image is-32x32">
                  <img
                    alt="${author}"
                    class="is-rounded"
                    width="32"
                    height="32"
                    src="${avatar}"
                  />
                </span>
                <span class="author-content">${author}</span>
                <span class="date-content">${date}</span>
                <span class="time-content">${readTime}</span>
              </div>
            </div>
            <span class="mdi mdi-arrow-up"></span>
          </div>
        </div>
      </div>
    </a>
  `);

  return articleFragment.children[0].outerHTML;
};

const renderArticle = ({
  path, img, heading, author, date, readTime,
}) => {
  const articleFragment = document.createRange().createContextualFragment(`
    <a
      href="${path}"
      class="column is-4-desktop article-thumbnail"
    >
      <div class="has-text-centered image-hero">
        <img
          alt="${heading}"
          src="${img}"
        />
      </div>
      <div class="content">
        <div class="content-info">
          <h5 class="title is-6">${heading}</h5>
          <div class="content-info-details">
            <p>
              <span class="author-content">${author}</span>
              <span class="date-content">${date}</span>
              <span class="time-content">${readTime}</span>
            </p>
          </div>
        </div>
        <span class="mdi mdi-arrow-up"></span>
      </div>
    </a>
  `);

  return articleFragment.children[0].outerHTML;
};

export default async function decorate(block) {
  const blogLink = block.textContent.trim();
  let blog;

  try {
    blog = await (await fetch(blogLink)).json();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);

    return;
  }

  const blogFragment = document.createRange().createContextualFragment(`
    <div class="container">
      ${renderMainArticle(blog.data[0])}
      <div class="columns is-multiline is-desktop">
        ${blog.data.slice(1).map((el) => renderArticle(el)).join('')}
      </div>
    </div>
  `);

  block.innerHTML = '';
  block.append(blogFragment.children[0]);
}

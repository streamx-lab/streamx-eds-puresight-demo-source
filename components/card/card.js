const createCard = (item, index) => {
  const itemData = {
    img: item.primaryImage.url,
    text: item.name?.split(' ').slice(0, 2).join(' ') || '',
    rating: 5,
    price: item.price?.value === undefined ? null : `${item.price.value}€`,
    link: `/products/${item.slug}.html`,
  };
  const {
    img, text, rating, price, link,
  } = itemData;

  const ratingIconFull = '<i class="mdi mdi-star" aria-hidden="true"></i>';
  const ratingIconEmpty = '<i class="mdi mdi-star-outline" aria-hidden="true"></i>';
  const ratingHTML = document.createRange().createContextualFragment(`
    <div class="rating">
      ${ratingIconFull.repeat(rating)}
      ${ratingIconEmpty.repeat(5 - rating)}
    </div>
  `);

  const cardFragmet = document.createRange().createContextualFragment(`
    <div class="card">
      <div class="card-image">
        <figure class="image">
            <img src="${img}" loading="${index < 2 ? 'eager' : 'lazy'}" alt="">
        </figure>
      </div>
      <div class="card-content">
        <div class="container">
            <div class="content is-medium  has-text-grey-700">
              <p>${text}</p>
            </div>
            ${ratingHTML.children[0].outerHTML}
            <div class="content is-medium  has-text-primary-700">
              <p class="${price === null ? 'is-hidden' : ''}">${price}</p>
            </div>
            <a href="${link}" class="button is-normal is-dark">
            ${item.buttonText ? `<span>${item.buttonText}</span>` : ''}
            <span class="icon">
            <i class="mdi mdi-24px mdi-cart-outline" aria-hidden="false"></i>
            </span>
            </a>
        </div>
      </div>
    </div>
  `);

  return cardFragmet.children[0];
};

export default createCard;

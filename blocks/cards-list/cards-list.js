import createCard from '../../components/card/card.js';

export default async function decorate(block) {
  const carouselSourceLink = block.textContent.trim();

  let carousel;

  try {
    carousel = await (await fetch(carouselSourceLink)).json();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);

    return;
  }

  const carouselFragment = document.createRange().createContextualFragment(`
    <div class="product-tiles">
      ${carousel.values.map((cell) => createCard(cell).outerHTML).join('')}
    </div>
  `);

  block.innerHTML = '';
  block.append(carouselFragment.children[0]);
}

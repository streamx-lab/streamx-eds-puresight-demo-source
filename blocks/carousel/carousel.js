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

  const carouselItems = carousel.values.map((data, index) => {
    const carouselListItemFragment = document.createRange().createContextualFragment(`
      <li class="glide__slide--active" style="width: 560px; margin-right: 16px;">
        ${createCard({ ...data, buttonText: 'Buy now' }, index).outerHTML}
      </li>
    `);

    return carouselListItemFragment.children[0].outerHTML;
  }).join('');

  const carouselFragment = document.createRange().createContextualFragment(`
    <div class="carousel glide glide--ltr glide--slider glide--swipeable" data-items-per-row-sm="1" data-items-per-row-md="2" data-items-per-row-lg="2">
      <div data-glide-el="controls" class="buttons is-right">
          <button data-glide-dir="<" class="button glide__arrow--disabled">
            <span class="icon">
              <i class="mdi mdi-arrow-left"></i>
            </span>
          </button>
          <button data-glide-dir=">" class="button">
            <span class="icon">
              <i class="mdi mdi-arrow-right"></i>
            </span>
          </button>
      </div>
      <div class="glide__track" data-glide-el="track" tabindex="0">
          <ul class="glide__slides" style="transition: transform 800ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s; width: 4736px; transform: translate3d(0px, 0px, 0px);">
            ${carouselItems}
          </ul>
      </div>
    </div>
  `);

  block.innerHTML = '';
  block.append(carouselFragment.children[0]);
}

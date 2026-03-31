export default async function decorate(block) {
  const picture = block.querySelector('img').currentSrc;
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6').innerHTML;
  const description = [...block.querySelectorAll('p')].filter((el) => !el.querySelector('picture') && !el.classList.contains('button-container'));
  const link = block.querySelector('.button-container a');

  description.forEach((el) => el.querySelectorAll('a').forEach((linkEl) => {
    const { innerHTML } = linkEl;
    const wrapper = document.createElement('span');

    wrapper.classList.add('has-text-white');
    wrapper.innerHTML = innerHTML;
    linkEl.innerHTML = '';
    linkEl.append(wrapper);
  }));

  const promoBannerFragment = document.createRange().createContextualFragment(`
    <div class="hero is-small is-banner hero-background-image" style="background-image: url('${picture}');">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-tablet">
            <div class="column">
              <h6 class="title is-6 has-text-black">
                <span class="has-text-white">${heading}</span>
              </h6>
              <div class="content   ">
                <p><span class="has-text-white">
                  ${description.map((el) => el.innerHTML).join('')}
                </p>
              </div>
              <a href="${link.href}" class="button is-dark">
                <span>${link.innerHTML}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);

  block.innerHTML = '';
  block.append(promoBannerFragment.children[0]);
}

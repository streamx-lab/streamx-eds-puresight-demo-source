const renderLevel = ({ icon, heading, description }) => {
  const iconString = `mdi mdi-36px ${icon}`;

  const levelFragment = document.createRange().createContextualFragment(`
    <div class="level-item has-text-centered is-align-items-center">
      <div class="container">
        <span class="icon is-medium has-text-primary">
          <i class="${iconString}" aria-hidden="true"></i>
        </span>
        <div class="content is-medium  has-text-grey-700">
          <p><strong>${heading}</strong></p>
        </div>
        <div class="content is-small has-text-weight-light has-text-grey-700">
          <p>${description}</p>
        </div>
      </div>
    </div>
  `);

  return levelFragment.children[0];
};

export default async function decorate(block) {
  const levels = [...block.querySelectorAll(':scope > div > div')];
  const levelsData = levels.map((level) => {
    const iconClass = [...level.querySelector('.icon i').classList].find((el) => el.startsWith('mdi-'));

    return {
      icon: iconClass,
      heading: level.querySelector('p:nth-of-type(2) strong').innerHTML,
      description: level.querySelector('p:nth-of-type(3)').innerHTML,
    };
  });

  const promoBannerFragment = document.createRange().createContextualFragment(`
    <div class="container">
      <div class="level level-with-gaps is-align-items-center">
        ${levelsData.map((level) => renderLevel(level).outerHTML).join('')}
      </div>
    </div>
  `);

  block.innerHTML = '';
  block.append(promoBannerFragment.children[0]);
}

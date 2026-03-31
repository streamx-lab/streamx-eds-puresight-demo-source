export default function decorate(block) {
  const headingText = block.querySelector('h1, h2, h3, h4, h5, h6');
  const text = block.querySelector('p');

  const newsletterFormFragment = document.createRange().createContextualFragment(`
    <div class="hero  is-small is-primary ">
      <div class="hero-body">
        <div class="container  newsletter">
          <div class="columns is-tablet">
            <div class="column ">
              <h5 class="title is-5 has-text-black">
                <span class="has-text-white">
                  ${headingText.innerHTML}
                </span>
              </h5>
            </div>
          </div>
          <div class="columns is-tablet">
            <div class="column">
              <div class="content">
                ${text.outerHTML}
              </div>
            </div>
            <div class="column ">
              <form action="/bin/newsletter" method="post">
                <div class="field is-grouped">
                  <p class="control is-expanded">
                    <input class="input" type="email" name="email" placeholder="Type your e-mail...">
                  </p>
                  <p class="control">
                    <button class="button is-dark" type="submit">Sign in</button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);

  block.innerHTML = '';
  block.append(newsletterFormFragment.children[0]);
}

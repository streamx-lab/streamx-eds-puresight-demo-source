import { loadCSS } from './aem.js';

export async function loadTemplate(doc, templateName) {
  try {
    const cssLoaded = loadCSS(`${window.hlx.codeBasePath}/templates/${templateName}/${templateName}.css`);
    const decorationComplete = new Promise((resolve) => {
      (async () => {
        try {
          const mod = await import(`../templates/${templateName}/${templateName}.js`);
          if (mod.default) {
            await mod.default(doc);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(`failed to load module for ${templateName}`, error);
        }
        resolve();
      })();
    });

    await Promise.all([cssLoaded, decorationComplete]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`failed to load block ${templateName}`, error);
  }
}

let placeholders = '';

async function getPlaceholders() {
  const url = '/placeholders.json';

  placeholders = await fetch(url).then((resp) => resp.json());
}

await getPlaceholders();

export function getTextLabel(key) {
  return placeholders?.data.find((el) => el.Key === key)?.Text || key;
}

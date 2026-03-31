# PureSight demo with Edge Delivery Services

This repo is part of StreamX demo. See https://teamds.atlassian.net/wiki/spaces/StreamX/pages/1192722453/StreamX+demo+next+-+environment+setup

## Environments

- Preview (https://main--{repo}--{owner}.aem.page/):
  https://main--demo-puresight-eds-next--streamx-dev.aem.page/
- Live (https://main--{repo}--{owner}.aem.live/):
  https://main--demo-puresight-eds-next--streamx-dev.aem.live/

## Docs with content

Google Drive with docs: https://drive.google.com/drive/folders/1W8cTrBFYy6NyNmh3BrURjZj1-DAG_xG6

## Editing docs and publishing content:

Install browser plugin as described here: https://www.aem.live/developer/tutorial#preview-and-publish-your-content

Configure the plugin:
- Go to the Google Drive from the `Docs with content` chapter
- Right-click on the AEM Sidekick plugin to display its context menu
- Click `Add this project`
- You should see a confirmation message such as: `websight-rnd/puresight-demo successfully added`
- Go to the main page of your chosen environment (out of those listed in the `Environments` chapter)
- The browser may display `404 Not Found` as the page content, but continue with next steps
- Click `Add this project` in the AEM Sidekick plugin
- You should see a confirmation message such as: `streamx-dev/demo-puresight-eds-next successfully added`
- Go back to the Google Drive folder
- In the `Pick a project` area, pick the demo-puresight-eds environment you've just added to AEM Sidekick 
- Edit and publish a blog file to validate the connection is working
- Go to https://github.com/streamx-dev/demo-puresight-eds-next/actions and verify the `Publish to StreamX` action is triggered and passes

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Install the [AEM CLI](https://github.com/adobe/aem-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

## Pages list with documents and blocks lists:

The [index](https://main--demo-puresight-eds-next--streamx-dev.aem.page) page.

---

### Homepage

Preview
link: [Homepage](https://main--demo-puresight-eds-next--streamx-dev.aem.page/pages/homepage) \
Document with content: [Hompage doc](https://docs.google.com/document/d/1djq9N8aBBwRju_D9QQqrP0DHuA77_Jw3xgpxmFAE1o0/edit)

Homepage blocks list:
* Hero
* Carousel
* Cards list
* Articles list
* Promo banner
* Levels
* Newsletter form

---

### Blog

Preview link: [Blog](https://main--demo-puresight-eds-next--streamx-dev.aem.page/pages/blog) \
Document with content: [Blog doc](https://docs.google.com/document/d/1YurrOa8SQfUMInQ1kBB6INLEGxrsjJO8MzZKfavQimY/edit) \
Articles list data: [Google sheets](https://docs.google.com/spreadsheets/d/1BlG-jJboqjobXv5Ob-rjTrSWsxywWK6ofj7FZA-vhTo/edit#gid=0)

Blog blocks list:
* Blog

---

### Article

Preview link: [Article](https://main--demo-puresight-eds-next--streamx-dev.aem.page/pages/article) \
Document with content: [Blog doc](https://docs.google.com/document/d/1CQb0G7dBjPdVBJG5OP6RJUXTUwDyKPYM_QuRWKOlZlk/edit)

Articles blocks list:
* Metadata

---

### Products

Preview
link: [Products](https://main--demo-puresight-eds-next--streamx-dev.aem.page/pages/product) \
Document with content: [Products doc](https://docs.google.com/document/d/12-rAJ178xUedsNPfyG66I7yuTZ9G9O769FB_qTqntNg/edit)
Products list data: [Google sheets](https://docs.google.com/spreadsheets/d/1SEIydwRrtQHA2gOwk5w72KuiHPDSyYGWCez4HaG-JNo/edit#gid=0)

Products blocks list:
* Breadcrumb
* Product detail
* Product Reviews
* Articles list
* Section Metadata
* Cards list
* Levels
* Newsletter form
* Metadata

The products page take product id from metadata block (Product Id) and then fetch the JSON with procut ID. Example JSON file is [here](./data/products/B075X4VWF9.json)

---

### All JSON files

* [./data/products/B075X4VWF9.json](./data/products/B075X4VWF9.json)

---

### Spreadsheets

Spreadsheets with [articles](https://docs.google.com/spreadsheets/d/1BlG-jJboqjobXv5Ob-rjTrSWsxywWK6ofj7FZA-vhTo/edit#gid=0) and [products](https://docs.google.com/spreadsheets/d/1SEIydwRrtQHA2gOwk5w72KuiHPDSyYGWCez4HaG-JNo/edit#gid=0) are converted to `json` and used as a source of data inside each component's block. Path to `json` is set inside document, example: [blog page](https://docs.google.com/document/d/1YurrOa8SQfUMInQ1kBB6INLEGxrsjJO8MzZKfavQimY/edit).

## Publication to StreamX

StreamX currently supports two types of content sources, each with its own set of GitHub workflows.
Depending on the content source and the action performed, the appropriate workflow is triggered
automatically to publish or unpublish content.

### 1. EDS Workflows

These workflows handle publishing and unpublishing pages via Edge Delivery Services (EDS):

- [publish-to-streamx.yaml](.github/workflows/publish-to-streamx.yaml)
- [unpublish-from-streamx.yaml](.github/workflows/unpublish-from-streamx.yaml)

When a page is published or unpublished, the corresponding workflow is triggered automatically
and sends a request to the StreamX instance.

### 2. Application Workflows

This workflow handles publishing of web resources via GitHub repository:

- [webresource-publish-to-streamx.yaml](.github/workflows/webresource-publish-to-streamx.yaml)

When a pull request is merged into the `main` branch, the web resource synchronization workflow is triggered.
This workflow handles the publishing and unpublishing of web resources that are part of a merged pull request.
Only resources that match a configurable pattern are accepted and processed.
The pattern is defined in the configuration variable STREAMX_INGESTION_WEBRESOURCE_INCLUDES.
> **Warn:** Pattern list should include ONLY files that are actually a web-resource like css, js
> or some common img like favicon, but not assets, pages or data.

In addition triggering this workflow manually we will start full import procedure.
All files from given branch that pass pattern verification will get published into
the StreamX platform.

Following variables or secrets need to be configured:
* STREAMX_INGESTION_URL (variable)
* STREAMX_INGESTION_TOKEN (secret)

### Configuration Requirements
The workflows require several configuration options, defined as variables and secrets:

- Variable `EDS_DOMAIN_URL`: a URL to Edge Delivery Services domain,
  e.g.: `https://main--streamx-eds-puresight-demo-source--streamx-lab.aem.live`.
- Variable `STREAMX_INGESTION_URL`: a base URL to StreamX publication API,
  e.g.: `https://ingestion.streamx.tech`.
- Variable `STREAMX_INGESTION_WEBRESOURCE_INCLUDES`: a path patterns list of accepted webresources,
  e.g.: `["/blocks/*", "/components/*", "/fonts/*", "/libs/*", "scripts/*.js", "styles/*.css", "/templates/*"]`.
- Secret `STREAMX_TOKEN`: JWT value required by StreamX publication API.

Workflows can be
[enabled and disabled manually in GitHub](https://docs.github.com/en/actions/using-workflows/disabling-and-enabling-a-workflow).

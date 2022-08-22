# 🚀 Astro CSS Bundle

Currently, there is a [bug](https://github.com/withastro/astro/issues/4413) with Astro (or Vite?) that does not inject a link to the stylesheet when `vite.build.cssCodeSplit` is set to `false`. So, this integration does that and also allows you to customise how to preload the stylesheet.

## Installation

```bash
npm i --save-dev @ernxst/astro-bundlecss
```

```bash
yarn add -D @ernxst/astro-bundlecss
```

```bash
pnpm i -D @ernxst/astro-bundlecss
```

## Usage

 ```js
import { defineConfig } from "astro/config";
import bundle from "astro-cssbundle";

export default defineConfig({
  integrations: [bundle()],
  vite: {
    build: {
      // Must be set to false if `disableSplitting` is set to false
      cssCodeSplit: false,
    }
  }
})
```

## Configuration

- `disableSplitting` - Whether the integration should automatically override the Astro config and set `vite.build.cssCodeSplit` to `false`.
  - If this is set to `false`, you are responsible for doing so. If CSS code
 splitting is not disabled, this integration will only inject a link to
 the first `.css` file found.
  - default: `true`
- `preload` -  The mechanism to use for lazy-loading the stylesheet. Can improve page
   performance.
  - Inspired entirely by [Google Critters' preload strategy](https://github.com/GoogleChromeLabs/critters#preloadstrategy)
    - `"default"`: Move stylesheet links to the end of the document and insert preload meta tags in their place.
    - `"body"`: Move all external stylesheet links to the end of the document.
    - `"swap"`: Convert stylesheet links to preloads that swap to rel="stylesheet" once loaded.
    - `"swap-high"`: Use `<link rel="alternate stylesheet preload">` and swap to `rel="stylesheet"` once loaded.
    - `false`: Disables adding preload tags.
  - default: `default`

## Contributing

To get started with development, you will need an editor (VS Code is recommended), a browser that runs JavaScript and some extra prerequisites:

- [Node.js (>= 16)](https://nodejs.org)
- [pnpm 7.5.2](https://pnpm.io/installation#using-corepack)

To get started with contributing to this project, first fork this git repository:

```sh
git clone https://github.com/Ernxst/astro-cssbundle.git
```

Then, install dependencies and start coding.

### Submitting Improvements

If you have a suggestion that would make this app better, please fork the repo and create a pull request. You can also
simply open an issue with the tag "`enhancement`".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

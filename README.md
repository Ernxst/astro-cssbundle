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
  integrations: [bundle({ codeSplitting: false })],
  vite: {
    build: {
      // Can optionally be set to false (if `codeSplitting` is omitted)
      cssCodeSplit: false,
    }
  }
})
```

## Configuration

- `codeSplitting` - Whether the integration should glob the output directory for a CSS
   stylesheet to inject into each HTML page.
  
  - If set to `false`, this option overrides the Astro config to set
   `vite.build.cssCodeSplit` to `false` and will inject a link to the first
   stylesheet found in the output directory into each HTML page.
  
  - If this is set to `true` and you manually set `vite.build.cssCodeSplit`
   to false, code splitting will be disabled and the above occurs. The `vite`
   option takes priority.
  
  - i.e., set this option to `false` (or `vite.build.cssCodeSplit` to
   `false`) if you want to disable CSS code splitting
  
  - default `true`

- `override` - Whether this integration will replace `<link />` tags that are already
   present in the built page with custom preload links.
  
  - Enabling this option allows for a way of customising how _all_ links are
   preloaded - not just for CSS code splitting.
  
  - Note that if this option is set to `true` but `preload` is set to `false`,
   links will not be overridden.
  
  - default `false`
  
- `preload` -  The mechanism to use for lazy-loading the stylesheet. Can improve page
   performance.

  - Inspired entirely by [Google Critters' preload strategy](https://github.com/GoogleChromeLabs/critters#preloadstrategy)
    - `"default"`: Move stylesheet links to the end of the document and insert preload meta tags in their place.

    - `"body"`: Move all external stylesheet links to the end of the document.

    - `"swap"`: Convert stylesheet links to preloads that swap to rel="stylesheet" once loaded.

    - `"swap-high"`: Use `<link rel="alternate stylesheet preload">` and swap to `rel="stylesheet"` once loaded.

    - `false`: Disables adding preload tags.
  - default: `default`

- `exclude` - Glob pattern (or an array of glob patterns) of pages not to inject links
   into (or to replace links in).
  
  - Including the `.html` extension in the pattern is entirely optional.
  
  - By default, all pages are included. Negative patterns are also supported.

  - default: `[]`

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

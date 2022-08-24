/**
 * Inspired entirely by Google Critters' preload strategy
 * https://github.com/GoogleChromeLabs/critters#preloadstrategy
 */
export type PreloadStrategy = "default" | "swap" | "swap-high" | "body" | false;

export interface AstroCSSBundleOptions {
	/**
	 * The mechanism to use for lazy-loading the stylesheet. Can improve page
	 * performance.
	 *
	 * Inspired entirely by Google Critters' preload strategy:
	 * https://github.com/GoogleChromeLabs/critters#preloadstrategy
	 *
	 * - `"default"`: Move stylesheet links to the end of the document and insert preload meta tags in their place.
	 * - `"body"`: Move all external stylesheet links to the end of the document.
	 * - `"swap"`: Convert stylesheet links to preloads that swap to rel="stylesheet" once loaded.
	 * - `"swap-high"`: Use `<link rel="alternate stylesheet preload">` and swap to `rel="stylesheet"` once loaded.
	 * - `false`: Disables adding preload tags.
	 *
	 * @default `default`
	 */
	preload?: PreloadStrategy;
	/**
	 * Whether the integration should glob the output directory for a CSS
	 * stylesheet to inject into each HTML page.
	 *
	 * If set to `false`, this option overrides the Astro config to set
	 * `vite.build.cssCodeSplit` to `false` and will inject a link to the first
	 * stylesheet found in the output directory into each HTML page.
	 *
	 * If this is set to `true` and you manually set `vite.build.cssCodeSplit`
	 * to false, code splitting will be disabled and the above occurs. The `vite`
	 * option takes priority.
	 *
	 * i.e., **set this option to `false` (or `vite.build.cssCodeSplit` to
	 * `false`) if you want to disable CSS code splitting**
	 *
	 * @default true
	 */
	codeSplitting?: boolean;
	/**
	 * Whether this integration will replace `<link />` tags that are already
	 * present in the built page with custom preload links.
	 *
	 * Enabling this option allows for a way of customising how _all_ links are
	 * preloaded - not just for CSS code splitting.
	 *
	 * Note that if this option is set to `true` but `preload` is set to `false`,
	 * links will not be overridden.
	 *
	 * @default false
	 */
	override?: boolean;
	/**
	 * Glob pattern (or an array of glob patterns) of pages not to inject links
	 * into (or to replace links in).
	 *
	 * Including the `.html` extension in the pattern is entirely optional.
	 *
	 * By default, all pages are included. Negative patterns are also supported.
	 *
	 * @default []
	 */
	exclude?: string | string[];
}

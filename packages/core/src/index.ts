import { getCSSFilePath, injectLink } from "@/util";
import type { AstroIntegration, AstroConfig } from "astro";
import path from "node:path";
import { globby } from "globby";

// TODO: Preload strategy "onload" | "defer" in `preload` key below

export interface AstroCSSBundleOptions {
	/**
	 * Whether to generate a `<link />` tag with `rel="preload"` and then another
	 * to actually load the stylesheet. Can improve page performance.
	 *
	 * @default true
	 */
	preload?: boolean;
	/**
	 * Whether the plugin should automatically override the Astro config and
	 * set `vite.build.cssCodeSplit` to `false`.
	 *
	 * If this is set to `false`, you are responsible for doing so. If CSS code
	 * splitting is not disabled, this plugin will only inject a link to
	 * the first `.css` file found.
	 *
	 * @default true
	 */
	disableSplitting?: boolean;
}

const PLUGIN_NAME = "astro-css-bundle";

/**
 * Currently, when disabling CSS code splitting via `vite`'s
 * `build.cssCodeSplit`, the `<link />` tag to the resulting CSS file
 * (`style.css`) is not injected.
 *
 * This plugin reads the output directory for a single `.css` file and
 * injects a `<link />` tag to it. If this file does not contain all
 * your styles, you will need to review your build setup.
 *
 * Note: _this plugin will not merge your styles into a single stylesheet._
 * To do so, simply set `vite.build.cssCodeSplit` to `false` in your
 * Astro config.
 *
 * If no CSS files are found, this plugin does nothing. If more than one
 * stylesheet is found, only the first one is injected. However, if the
 * HTML page already contains a `<link />` to this stylesheet, an extra
 * link will not be injected.
 *
 * Usage:
 *
 * ```
 * import { defineConfig } from "astro/config";
 * import bundle from "astro-cssbundle";
 *
 * export default defineConfig({
 *   integrations: [bundle()],
 *   vite: {
 *     build: {
 *       // Must be set to false if `disableSplitting` is set to false
 *       cssCodeSplit: false,
 *     }
 *   }
 * })
 * ```
 */
export default function bundle(
	options?: AstroCSSBundleOptions
): AstroIntegration {
	const { preload = true, disableSplitting = true } = options ?? {};
	let astroConfig: AstroConfig;
	return {
		name: PLUGIN_NAME,
		hooks: {
			// Update config
			"astro:config:setup": ({ config }) => {
				if (disableSplitting) {
					if (!config.vite.build) {
						config.vite.build = {
							cssCodeSplit: false,
						};
					} else {
						config.vite.build.cssCodeSplit = false;
					}
				} else {
					/**
					 * If the user has disabled automatically overriding the
					 * config, but has not set the required vite option to
					 * false, show a warning.
					 */
					if (config.vite.build?.cssCodeSplit !== false) {
						console.warn(
							`[warning] you have set disableSplitting to "false" but have not set vite.build.cssCodeSplit to false`
						);
					}
				}
			},
			// Store final config for use in "astro:build:done" hook
			"astro:config:done": ({ config }) => {
				astroConfig = config;
			},
			"astro:build:done": async ({ dir }) => {
				const { base } = path.parse(dir.pathname);

				const filePath = await getCSSFilePath(
					base,
					disableSplitting,
					astroConfig
				);

				if (filePath) {
					const htmlPages = await globby(`${base}/**/*.html`);
					await Promise.all(
						htmlPages.map((s) => injectLink(s, filePath, preload))
					);
				}
			},
		},
	};
}

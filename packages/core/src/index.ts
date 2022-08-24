import { getStylesheetPath } from "@/get-stylesheet-path";
import { preloadStylesheets } from "@/preload-stylesheet";
import { AstroCSSBundleOptions } from "@/types";
import type { AstroIntegration } from "astro";
import { globby } from "globby";
import path from "node:path";

const PLUGIN_NAME = "astro-css-bundle";

export type { AstroCSSBundleOptions, PreloadStrategy } from "@/types";

/**
 * Currently, when disabling CSS code splitting via `vite`'s
 * `build.cssCodeSplit`, the `<link />` tag to the resulting CSS file
 * (`style.[hash].css`) is not injected.
 *
 * This plugin reads the output directory for a single `.css` file and
 * injects a `<link />` tag to it. If this file does not contain all
 * your styles, you will need to review your build setup.
 *
 * Additionally, this plugin can replace the `<link />` tags in the built
 * HTML page with preload links to improve page load performance.
 *
 * Note: _this plugin will not merge your styles into a single stylesheet._
 * To do so, simply set `vite.build.cssCodeSplit` to `false` in your
 * Astro config.
 *
 * If no CSS files are found (and overriding is disabled), this plugin does
 * nothing. If (code splitting is disabled and) more than one stylesheet is
 * found, only the first one is injected. However, if the
 * HTML page already contains a `<link />` to this stylesheet, an extra
 * link will not be injected (unless explicitly configured to do so).
 *
 * Usage:
 *
 * ```
 * import { defineConfig } from "astro/config";
 * import bundle from "astro-cssbundle";
 *
 * export default defineConfig({
 *   integrations: [bundle({ codeSplitting: false })],
 *   vite: {
 *     build: {
 *       // Can optionally be set to false (if `codeSplitting` is omitted)
 *       cssCodeSplit: false,
 *     }
 *   }
 * })
 * ```
 */
export default function bundle(
	options?: AstroCSSBundleOptions
): AstroIntegration {
	const {
		preload = "default",
		codeSplitting = true,
		override = false,
		exclude = [],
	} = options ?? {};
	let viteCodeSplit: boolean;

	return {
		name: PLUGIN_NAME,
		hooks: {
			// Update config
			"astro:config:setup": ({ config }) => {
				if (codeSplitting === false) {
					if (!config.vite.build) {
						config.vite.build = {
							cssCodeSplit: false,
						};
					} else {
						config.vite.build.cssCodeSplit = false;
					}
				}
			},
			// Store final config for use in "astro:build:done" hook
			"astro:config:done": ({ config }) => {
				/**
				 * Whether the user manually enabled/disabled CSS code splitting
				 */
				viteCodeSplit = config.vite.build?.cssCodeSplit !== false;
			},
			"astro:build:done": async ({ dir }) => {
				const { base } = path.parse(dir.pathname);
				/**
				 * If code splitting is enabled, we do not want to glob the output
				 * directory for a CSS stylesheet
				 */
				const filePath =
					viteCodeSplit === true || codeSplitting === true
						? undefined
						: await getStylesheetPath(base);

				const ignore = getIgnorePatterns(exclude, base);
				const htmlPages = await globby([`${base}/**/*.html`, ...ignore]);
				await Promise.all(
					htmlPages.map((s) =>
						preloadStylesheets({
							htmlPath: s,
							stylesheetPath: filePath,
							preload,
							override,
						})
					)
				);
			},
		},
	};
}

function getIgnorePatterns(
	exclude: Required<AstroCSSBundleOptions>["exclude"],
	base: string
) {
	const ignoreBase = typeof exclude === "string" ? [exclude] : exclude;
	return ignoreBase.map((s) => {
		if (s.startsWith("!")) {
			s = s.slice(1);
			if (!s.startsWith(base)) s = `${base}/${s}`;
		} else {
			if (!s.startsWith(base)) s = `${base}/${s}`;
			s = `!${s}`;
		}
		if (!s.endsWith(".html")) s = `${s}.html`;
		return s;
	});
}

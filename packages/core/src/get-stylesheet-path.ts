import { globby } from "globby";

/**
 * Return the file path to the first stylesheet found in the build output
 * directory (or null if no stylesheets).
 *
 * This path is relative to the output directory `dir`.
 *
 * @param dir
 * @returns
 */
export async function getStylesheetPath(dir: string) {
	const files = (await globby(`./${dir}/**/*.css`)).map((s) =>
		s.replace(`./${dir}`, "")
	);

	switch (files.length) {
		case 0:
			console.warn(
				`[warning] No stylesheets were found in the output directory - no links will be injected. You may need to review your build setup.`
			);
			return;
		case 1:
			return files[0];
		default:
			console.warn(
				`[warning] ${files.length} stylesheets found in output directory - will inject the first one: "${files[0]}"`
			);
			return files[0];
	}
}

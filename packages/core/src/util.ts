import type { AstroConfig } from "astro";
import { globby } from "globby";
import fs from "fs";
import HTML from "html-parse-stringify";

export async function getCSSFilePath(
	dir: string,
	disableSplitting: boolean,
	config: AstroConfig
) {
	const files = (await globby(`./${dir}/**/*.css`)).map((s) =>
		s.replace(`./${dir}`, "")
	);

	switch (files.length) {
		case 0:
			console.warn(
				`[warning] No stylesheets were found in the output directory - no links will be injected. You may need to review your build setup.`
			);
			return null;
		case 1:
			return files[0];
		default:
			console.warn(
				`[warning] ${files.length} stylesheets found in output directory - will inject the first one: "${files[0]}"`
			);

			if (
				disableSplitting === false &&
				config.vite.build?.cssCodeSplit !== false
			) {
				console.warn(`  - Plugin option "disableSplitting" is set to "false", but vite.build.cssCodeSplit is not set to "false" in your Astro config. 
  -  Please either set "disableSplitting" to "true" or explicitly set vite.build.cssCodeSplit to "false"`);
			}
			return files[0];
	}
}

export async function injectLink(
	htmlFilePath: string,
	cssFilePath: string,
	preload: boolean
) {
	const htmlContent = await fs.promises.readFile(htmlFilePath, "utf-8");

	const [doctype] = HTML.parse(htmlContent) as [TagAstElement];
	const htmlTag = getTag("html", doctype);
	const head = getTag("head", htmlTag);

	if (hasLink(head, cssFilePath)) {
		console.info(
			`[info] a link to "${cssFilePath}" already exists in "${htmlFilePath}" - will not inject`
		);
		return;
	}

	const link = createLinkTag(cssFilePath, preload);
	head.children.push(link);
	const content = `<!DOCTYPE html>\n${HTML.stringify([htmlTag])}`;
	await fs.promises.writeFile(htmlFilePath, content);
}

function getTag(tagName: string, ast: AstElement) {
	if ("children" in ast) {
		const [item] = ast.children.filter(
			(t) => t.type === "tag" && t.name === tagName
		);
		return item as TagAstElement;
	}

	throw new Error(`This ast is not a tag element`);
}

function createLinkTag(cssFilePath: string, preload: boolean): TagAstElement {
	const attrs = preload
		? {
				rel: "preload",
				as: "style",
				onload: "this.onload=null;this.rel='stylesheet'",
		  }
		: {
				rel: "stylesheet",
		  };

	return {
		type: "tag",
		name: "link",
		// @ts-ignore
		attrs: {
			href: cssFilePath,
			...attrs,
		},
		// Self closing
		voidElement: true,
		children: [],
	};
}

function hasLink(head: TagAstElement, stylesheet: string) {
	return head.children.some(
		(s) => s.type === "tag" && s.name === "link" && s.attrs.href === stylesheet
	);
}

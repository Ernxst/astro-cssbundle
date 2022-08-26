import { getTag, hasLink } from "@/ast-helpers";
import { createLinkTag } from "@/create-link";
import { AstroCSSBundleOptions, PreloadStrategy } from "@/types";
import fs from "fs";
import HTML from "html-parse-stringify";

/**
 *
 * @param options
 */
export async function preloadStylesheets(
	options: {
		htmlPath: string;
		stylesheetPath?: string;
	} & Pick<Required<AstroCSSBundleOptions>, "override" | "preload">
) {
	const { htmlPath, stylesheetPath, override, preload } = options;
	const htmlContent = await fs.promises.readFile(htmlPath, "utf-8");

	/**
	 * Boolean to avoid unnecessary file writes
	 */
	let replaced = false;

	// Built AST of HTML page
	const [doctype] = HTML.parse(htmlContent) as [TagAstElement];
	const htmlTag = getTag("html", doctype);
	const head = getTag("head", htmlTag);
	const body = getTag("body", htmlTag);

	/**
	 * If preloading is disabled, there's no point in overriding links
	 */
	if (override && preload) replaced = overrideLinks({ head, body, preload });

	/**
	 * If it does have the link (and overriding is enabled), it will be handled
	 * by `overrideLinks()`
	 */
	if (stylesheetPath && !hasLink(head, stylesheetPath)) {
		const { headTag, bodyTag } = createLinkTag(stylesheetPath, preload);
		if (headTag) head.children.push(headTag);
		if (bodyTag) body.children.push(bodyTag);
		replaced = true;
	}

	if (replaced) {
		/**
		 * Can't use the `doctype` AST node since it contains { attrs: { html: '' } }
		 * which is stringified into <!DOCTYPE html=""> (instead of
		 * <!DOCTYPE html>) which is invalid HTML.
		 */
		const content = `<!DOCTYPE html>\n${HTML.stringify([htmlTag])}`;
		await fs.promises.writeFile(htmlPath, content);
	}
}

/**
 * Replace the links in the `<head />` tag with custom preload links
 * @param options
 */
function overrideLinks(options: {
	head: TagAstElement;
	body: TagAstElement;
	preload: PreloadStrategy;
}) {
	let replaced = false;
	const { head, body, preload } = options;
	const length = head.children.length;

	// TODO: Could do the same for `<body />` tag
	for (let i = 0; i < length; i++) {
		const node = head.children[i];
		if (node.type === "tag" && node.name === "link") {
			const href = node.attrs.href as string;
			if (href.endsWith(".css")) {
				const { headTag, bodyTag } = createLinkTag(href, preload);
				if (headTag) head.children[i] = headTag;
				if (bodyTag) body.children.push(bodyTag);
				replaced = true;
			}
		}
	}

	return replaced;
}

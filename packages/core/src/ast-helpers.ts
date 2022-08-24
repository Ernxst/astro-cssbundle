/**
 * Retrieve a `TagAstElement` node from an `ast` by its `name` property.
 * @param tagName tag to search for
 * @param ast the AST to search
 * @param filter optional extra filter to apply
 * @returns the `TagAstElement` node
 */
export function getTag(
	tagName: string,
	ast: AstElement,
	filter?: (node: TagAstElement) => boolean
) {
	if (ast.type === "tag") {
		const items = ast.children
			.filter((t) => t.type === "tag" && t.name === tagName)
			.filter((s) => (filter ? filter(s as TagAstElement) : true));
		return items[0] as TagAstElement;
	}

	throw new Error(`This ast is not a tag element`);
}

/**
 * Returns whether the `head` tag contains a `<link />` with a given href
 * @param head
 * @param href
 * @returns
 */
export function hasLink(head: TagAstElement, href: string) {
	return head.children.some(
		(s) => s.type === "tag" && s.name === "link" && s.attrs.href === href
	);
}

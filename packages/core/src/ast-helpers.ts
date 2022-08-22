export function getTag(tagName: string, ast: AstElement) {
	if (ast.type === "tag") {
		const [item] = ast.children.filter(
			(t) => t.type === "tag" && t.name === tagName
		);
		return item as TagAstElement;
	}

	throw new Error(`This ast is not a tag element`);
}

export function hasLink(head: TagAstElement, stylesheet: string) {
	return head.children.some(
		(s) => s.type === "tag" && s.name === "link" && s.attrs.href === stylesheet
	);
}

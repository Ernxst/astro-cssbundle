import { PreloadStrategy } from "@/types";

const LINK_PROPS = {
	type: "tag",
	name: "link",
	// Self closing
	voidElement: true,
} as const;

export function createLinkTag(
	cssFilePath: string,
	preload: PreloadStrategy
): {
	headTag?: TagAstElement;
	bodyTag?: TagAstElement;
} {
	const { head, body } = getBaseAttrs(preload);
	return {
		headTag: head
			? {
					...LINK_PROPS,
					children: [],
					attrs: {
						href: cssFilePath,
						...head,
					},
			  }
			: undefined,
		bodyTag: body
			? {
					...LINK_PROPS,
					children: [],
					attrs: {
						href: cssFilePath,
						...body,
					},
			  }
			: undefined,
	};
}

function getBaseAttrs(strategy: PreloadStrategy) {
	switch (strategy) {
		case "default":
			return {
				head: {
					rel: "preload",
					as: "style",
				},
				body: {
					rel: "stylesheet",
				},
			};
		case "body":
			return {
				body: {
					rel: "stylesheet",
				},
			};
		case "swap":
			return {
				head: {
					rel: "stylesheet",
					media: "print",
					onload: "this.media='all'",
				},
			};
		case "swap-high":
			return {
				head: {
					rel: "alternate stylesheet preload",
					as: "style",
					onload: "this.rel='stylesheet'",
				},
			};
		case false:
			return {
				head: {
					rel: "stylesheet",
				},
			};
	}
}

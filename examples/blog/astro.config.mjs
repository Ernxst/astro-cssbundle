import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import bundle from "@ernxst/astro-cssbundle";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [mdx(), sitemap(), bundle()],
});

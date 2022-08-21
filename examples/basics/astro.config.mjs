import { defineConfig } from "astro/config";
import bundle from "astro-cssbundle";

// https://astro.build/config
export default defineConfig({
	integrations: [bundle()],
});

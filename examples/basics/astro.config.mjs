import { defineConfig } from "astro/config";
import bundle from "@ernest/astro-cssbundle";

// https://astro.build/config
export default defineConfig({
	integrations: [bundle()],
});

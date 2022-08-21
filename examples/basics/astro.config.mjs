import bundle from "@ernxst/astro-cssbundle";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [bundle()],
});
